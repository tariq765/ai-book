---
title: AI Memory
sidebar_position: 4
---

# AI Memory: Giving Agents a Past

## Overview

**Memory** is what transforms a stateless LLM call into a **continuously learning agent**. Without memory, every interaction starts from zero. With memory, agents remember user preferences, learn from past tasks, maintain context across sessions, and build expertise over time.

Memory in AI systems operates at multiple timescales — from the immediate conversation context to knowledge accumulated over months.

---

## The Analogy: The Employee Who Remembers

**Stateless LLM**: A new temp worker every day. You re-explain the project, your preferences, the codebase style, the client history — every single time.

**Agent with Memory**: A senior employee who's been with you for years. They remember:
- "You prefer TypeScript over JavaScript"
- "The API key is in the .env file, not config.json"
- "Last time we tried approach X, it failed because of Y"
- "Client Alice hates long emails — keep it to 3 bullets"

---

## Memory Taxonomy

| Type | Timescale | Capacity | Use Case | Implementation |
|------|-----------|----------|----------|----------------|
| **Working/Short-term** | Current conversation | ~128K tokens (context window) | Immediate context, recent tool results | Context window |
| **Episodic** | Session → Weeks | 100s-1000s episodes | Past trajectories, successes/failures | Vector DB + summarization |
| **Semantic** | Months → Years | Unlimited | Facts, preferences, skills, knowledge | Vector DB / Knowledge Graph |
| **Procedural** | Permanent | Unlimited | How-to knowledge, skills, prompts | Fine-tuning / Prompt library / Code |

---

## 1. Working Memory (Context Window)

The most basic memory — the conversation history + system prompt + recent tool results.

### Context Management Strategies

```python
class ContextManager:
    def __init__(self, max_tokens: int = 100000, model: str = "gpt-4o"):
        self.max_tokens = max_tokens
        self.tokenizer = tiktoken.encoding_for_model(model)
    
    def trim(self, messages: List[Dict], reserve_tokens: int = 4000) -> List[Dict]:
        """Keep system prompt + recent messages within token budget."""
        system_msgs = [m for m in messages if m["role"] == "system"]
        other_msgs = [m for m in messages if m["role"] != "system"]
        
        # Always keep system prompt
        kept = system_msgs[:]
        tokens_used = self._count_tokens(kept)
        
        # Add recent messages from end until budget
        for msg in reversed(other_msgs):
            msg_tokens = self._count_tokens([msg])
            if tokens_used + msg_tokens + reserve_tokens > self.max_tokens:
                break
            kept.insert(len(system_msgs), msg)
            tokens_used += msg_tokens
        
        return kept
    
    def _count_tokens(self, messages: List[Dict]) -> int:
        return sum(len(self.tokenizer.encode(m.get("content", ""))) for m in messages)
```

### Summarization for Long Conversations

```python
def summarize_conversation(messages: List[Dict], keep_last: int = 5) -> List[Dict]:
    """Summarize old messages, keep recent ones verbatim."""
    if len(messages) <= keep_last + 1:  # +1 for system
        return messages
    
    system = messages[0]
    recent = messages[-keep_last:]
    old = messages[1:-keep_last]
    
    # Summarize old messages
    summary_prompt = f"""Summarize this conversation for context preservation.
    Focus on: key decisions, facts learned, user preferences, unresolved tasks.
    
    Conversation:
    {format_messages(old)}
    
    Summary:"""
    
    summary = llm_call(summary_prompt, temperature=0)
    
    return [
        system,
        {"role": "system", "content": f"Previous conversation summary: {summary}"},
        *recent
    ]
```

---

## 2. Episodic Memory (Trajectory Storage)

Store full agent trajectories (goal → plan → actions → results) for retrieval and learning.

### Storage Schema

```python
@dataclass
class Episode:
    id: str
    goal: str
    trajectory: List[Dict]  # [{"thought": ..., "action": ..., "result": ...}]
    outcome: Literal["success", "partial", "failure"]
    duration_seconds: float
    tokens_used: int
    tools_used: List[str]
    created_at: float
    tags: List[str]  # "coding", "research", "debugging", etc.
    embedding: List[float]  # For similarity search

class EpisodicMemory:
    def __init__(self, vector_db, embedder):
        self.db = vector_db
        self.embedder = embedder
    
    def store(self, episode: Episode):
        # Embed goal + summary for retrieval
        summary = self._summarize(episode)
        text = f"Goal: {episode.goal}\nSummary: {summary}"
        episode.embedding = self.embedder.encode([text])[0].tolist()
        
        self.db.upsert(points=[PointStruct(
            id=episode.id,
            vector=episode.embedding,
            payload=asdict(episode)
        )])
    
    def retrieve_similar(self, goal: str, top_k: int = 5, min_success_rate: float = 0.7) -> List[Episode]:
        """Find similar successful episodes."""
        q_emb = self.embedder.encode([goal])[0]
        
        results = self.db.search(
            query_vector=q_emb,
            query_filter=Filter(
                must=[FieldCondition(key="outcome", match=MatchValue(value="success"))]
            ),
            limit=top_k * 2  # Fetch extra, filter by success rate
        )
        
        episodes = [Episode(**hit.payload) for hit in results]
        # Filter by actual success rate if we have multiple attempts
        return episodes[:top_k]
    
    def get_recent_failures(self, goal: str, top_k: int = 3) -> List[Episode]:
        """Retrieve recent failures for the same/similar goal (for Reflexion)."""
        q_emb = self.embedder.encode([goal])[0]
        results = self.db.search(
            query_vector=q_emb,
            query_filter=Filter(
                must=[FieldCondition(key="outcome", match=MatchValue(value="failure"))]
            ),
            limit=top_k
        )
        return [Episode(**hit.payload) for hit in results]
```

### Using Episodic Memory for Few-Shot Prompting

```python
def build_few_shot_prompt(episodes: List[Episode], current_goal: str) -> str:
    """Inject similar past trajectories as few-shot examples."""
    examples = []
    for ep in episodes:
        traj_summary = "\n".join(
            f"  Thought: {step.get('thought', '')}\n  Action: {step.get('action', '')}\n  Result: {step.get('result', '')[:200]}"
            for step in ep.trajectory[:5]  # First 5 steps
        )
        examples.append(f"""Example (Goal: {ep.goal}):
{traj_summary}
  Outcome: {ep.outcome}""")
    
    return f"""Here are similar past tasks and how they were solved:

{chr(10).join(examples)}

Now solve: {current_goal}"""
```

---

## 3. Semantic Memory (Long-term Knowledge)

Persistent facts, preferences, and learned knowledge.

### User Preferences & Profile

```python
class SemanticMemory:
    def __init__(self, vector_db, embedder):
        self.db = vector_db
        self.embedder = embedder
        self.collection = "semantic_memory"
    
    def store_fact(self, fact: str, category: str, confidence: float = 1.0, source: str = "user"):
        """Store a fact: 'User prefers dark mode', 'API v2 uses Bearer tokens'."""
        emb = self.embedder.encode([fact])[0]
        self.db.upsert(points=[PointStruct(
            id=str(uuid.uuid4()),
            vector=emb,
            payload={
                "fact": fact,
                "category": category,
                "confidence": confidence,
                "source": source,
                "created_at": time.time()
            }
        )])
    
    def retrieve_facts(self, query: str, category: str = None, top_k: int = 10) -> List[dict]:
        q_emb = self.embedder.encode([query])[0]
        filter_cond = None
        if category:
            filter_cond = Filter(must=[FieldCondition(key="category", match=MatchValue(value=category))])
        
        results = self.db.search(query_vector=q_emb, query_filter=filter_cond, limit=top_k)
        return [hit.payload for hit in results]
    
    def get_user_preferences(self, user_id: str) -> dict:
        """Get all preferences for a user."""
        facts = self.retrieve_facts(f"user {user_id} preference", category="preference", top_k=50)
        return {f["fact"]: f["confidence"] for f in facts}
```

### Knowledge Graph for Structured Semantic Memory

```python
# For structured facts: entities + relationships
class KnowledgeGraphMemory:
    def __init__(self, neo4j_driver):
        self.driver = neo4j_driver
    
    def add_fact(self, subject: str, predicate: str, object: str, confidence: float = 1.0):
        with self.driver.session() as session:
            session.run("""
                MERGE (s:Entity {name: $subject})
                MERGE (o:Entity {name: $object})
                MERGE (s)-[r:RELATION {type: $predicate}]->(o)
                SET r.confidence = $confidence, r.updated = timestamp()
            """, subject=subject, predicate=predicate, object=object, confidence=confidence)
    
    def query(self, cypher: str, params: dict = None) -> List[dict]:
        with self.driver.session() as session:
            result = session.run(cypher, params or {})
            return [dict(record) for record in result]
    
    def get_context_for_goal(self, goal: str) -> str:
        # Extract entities from goal, query graph
        entities = extract_entities(goal)  # NER or LLM-based
        facts = []
        for ent in entities:
            cypher = """
                MATCH (e:Entity {name: $ent})-[r]->(o)
                RETURN e.name, r.type, o.name, r.confidence
                LIMIT 20
            """
            facts.extend(self.query(cypher, {"ent": ent}))
        return format_facts(facts)
```

---

## 4. Procedural Memory (Skills & Procedures)

How-to knowledge that becomes automatic — prompts, code patterns, workflows.

### Prompt Library as Procedural Memory

```python
class ProceduralMemory:
    def __init__(self, storage_path: str = "procedures/"):
        self.path = Path(storage_path)
        self.path.mkdir(exist_ok=True)
        self.index = self._load_index()
    
    def save_procedure(self, name: str, description: str, prompt_template: str, 
                       tools: List[str] = None, examples: List[dict] = None):
        """Save a reusable procedure/skill."""
        proc = {
            "name": name,
            "description": description,
            "prompt_template": prompt_template,
            "tools": tools or [],
            "examples": examples or [],
            "created_at": time.time(),
            "use_count": 0
        }
        (self.path / f"{name}.json").write_text(json.dumps(proc, indent=2))
        self.index[name] = proc
    
    def retrieve_procedure(self, task_description: str) -> Optional[dict]:
        """Find relevant procedure for a task."""
        # Simple keyword matching - can use embeddings for better retrieval
        task_lower = task_description.lower()
        best_match = None
        best_score = 0
        
        for name, proc in self.index.items():
            score = sum(1 for kw in proc["description"].lower().split() if kw in task_lower)
            if score > best_score:
                best_score = score
                best_match = proc
        
        if best_match:
            best_match["use_count"] += 1
            self._save_index()
        return best_match
    
    def execute_procedure(self, name: str, variables: dict) -> str:
        """Render and execute a saved procedure."""
        proc = self.index[name]
        prompt = proc["prompt_template"].format(**variables)
        return llm_call(prompt, tools=proc["tools"])
```

### Skill Learning from Successful Episodes

```python
def distill_skill_from_episodes(episodes: List[Episode], skill_name: str) -> dict:
    """Analyze successful episodes to extract a reusable procedure."""
    if not episodes:
        return None
    
    # Collect common patterns
    all_steps = [step for ep in episodes for step in ep.trajectory]
    common_tools = Counter(step["action"] for step in all_steps if "action" in step).most_common(10)
    
    # Use LLM to synthesize
    prompt = f"""Analyze these successful trajectories and extract a reusable procedure.

Episodes:
{format_episodes(episodes)}

Create a procedure template with:
1. Name: {skill_name}
2. Description: When to use this procedure
3. Prompt template with {{variables}}
4. Required tools
5. Example invocation

Output JSON:"""
    
    return json.loads(llm_call(prompt, temperature=0.2, response_format="json"))
```

---

## Memory Consolidation Pipeline

```python
class MemoryConsolidator:
    """Background process that consolidates memories."""
    
    def __init__(self, episodic: EpisodicMemory, semantic: SemanticMemory, 
                 procedural: ProceduralMemory, llm):
        self.episodic = episodic
        self.semantic = semantic
        self.procedural = procedural
        self.llm = llm
    
    def consolidate(self, user_id: str, since: float = None):
        """Run consolidation cycle."""
        # 1. Extract facts from recent successful episodes
        recent_success = self.episodic.get_recent(user_id, outcome="success", since=since)
        for ep in recent_success:
            facts = self._extract_facts(ep)
            for fact, category, conf in facts:
                self.semantic.store_fact(fact, category, conf, source=f"episode_{ep.id}")
        
        # 2. Identify patterns for procedural memory
        if len(recent_success) >= 3:
            skill = distill_skill_from_episodes(recent_success, f"skill_{user_id}_{int(time.time())}")
            if skill:
                self.procedural.save_procedure(**skill)
        
        # 3. Summarize old episodes (reduce storage)
        self._summarize_old_episodes(user_id, older_than_days=30)
    
    def _extract_facts(self, episode: Episode) -> List[tuple]:
        prompt = f"""Extract durable facts from this episode.
        Goal: {episode.goal}
        Trajectory: {json.dumps(episode.trajectory)}
        
        Output facts as: [["fact", "category", confidence]]
        Categories: preference, technical_fact, process_knowledge, tool_usage, domain_knowledge"""
        
        return json.loads(self.llm(prompt, response_format="json"))
```

---

## Memory-Augmented Agent

```python
class MemoryAugmentedAgent(BaseAgent):
    def __init__(self, *args, 
                 episodic_memory: EpisodicMemory,
                 semantic_memory: SemanticMemory,
                 procedural_memory: ProceduralMemory,
                 **kwargs):
        super().__init__(*args, **kwargs)
        self.episodic = episodic_memory
        self.semantic = semantic_memory
        self.procedural = procedural_memory
    
    def run(self, goal: str, user_id: str = "default") -> Dict:
        # 1. Retrieve relevant memories
        similar_episodes = self.episodic.retrieve_similar(goal)
        relevant_facts = self.semantic.retrieve_facts(goal)
        procedure = self.procedural.retrieve_procedure(goal)
        user_prefs = self.semantic.get_user_preferences(user_id)
        
        # 2. Build enhanced system prompt
        memory_context = self._build_memory_context(
            similar_episodes, relevant_facts, procedure, user_prefs
        )
        
        enhanced_system = self.system_prompt + "\n\n" + memory_context
        
        # 3. Run with enhanced context
        state = AgentState(goal=goal, max_iterations=self.max_iterations)
        state.messages = [
            {"role": "system", "content": enhanced_system},
            {"role": "user", "content": f"Goal: {goal}"}
        ]
        
        result = super()._run_loop(state)
        
        # 4. Store episode
        episode = Episode(
            id=str(uuid.uuid4()),
            goal=goal,
            trajectory=state.completed_steps,
            outcome="success" if result["status"] == "completed" else "failure",
            duration_seconds=time.time() - state.start_time,
            tokens_used=state.total_tokens,
            tools_used=list(set(tc["name"] for step in state.completed_steps for tc in step.get("tool_calls", []))),
            created_at=time.time(),
            tags=self._infer_tags(goal)
        )
        self.episodic.store(episode)
        
        return result
    
    def _build_memory_context(self, episodes, facts, procedure, prefs) -> str:
        parts = []
        
        if prefs:
            parts.append("USER PREFERENCES:\n" + "\n".join(f"- {k}: {v}" for k, v in prefs.items()))
        
        if facts:
            parts.append("RELEVANT KNOWLEDGE:\n" + "\n".join(f"- {f['fact']}" for f in facts))
        
        if procedure:
            parts.append(f"SUGGESTED PROCEDURE: {procedure['name']}\n{procedure['description']}")
        
        if episodes:
            parts.append("SIMILAR PAST SUCCESSES:\n" + build_few_shot_prompt(episodes, ""))
        
        return "\n\n".join(parts)
```

---

## Memory Evaluation

```python
def evaluate_memory_system(agent: MemoryAugmentedAgent, test_cases: List[dict]) -> dict:
    """Evaluate memory effectiveness."""
    metrics = {
        "preference_recall": 0,
        "fact_recall": 0,
        "procedure_reuse": 0,
        "episodic_retrieval": 0,
        "task_success": 0
    }
    
    for case in test_cases:
        # Run with memory
        result = agent.run(case["goal"], user_id=case["user_id"])
        
        # Check if preferences were followed
        if "preferences" in case:
            metrics["preference_recall"] += check_preferences_followed(result, case["preferences"])
        
        # Check if known facts were used
        if "expected_facts" in case:
            metrics["fact_recall"] += check_facts_used(result, case["expected_facts"])
        
        # Check if procedure was reused
        if "expected_procedure" in case:
            metrics["procedure_reuse"] += check_procedure_used(result, case["expected_procedure"])
        
        metrics["task_success"] += 1 if result["status"] == "completed" else 0
    
    return {k: v / len(test_cases) for k, v in metrics.items()}
```

---

## Key Takeaways

- **Four memory types**: Working (context), Episodic (trajectories), Semantic (facts), Procedural (skills)
- **Working memory** = context window management (trimming, summarization)
- **Episodic memory** stores full trajectories for few-shot learning and Reflexion
- **Semantic memory** = persistent facts, preferences, knowledge (vector DB + KG)
- **Procedural memory** = learned skills, prompt templates, code patterns
- **Consolidation pipeline** moves insights from episodic → semantic → procedural
- **Memory-augmented agents** retrieve relevant context before each task

---

## Exercises

1. **Build context manager**: Implement trimming + summarization. Test on 50-turn conversation.
2. **Episodic memory**: Store 100 trajectories, implement similarity retrieval. Test on repeat tasks.
3. **Semantic memory**: Extract facts from conversations, store in vector DB. Query for user preferences.
4. **Procedural learning**: Run agent on 10 similar tasks, distill procedure, verify reuse on task 11.

---

## Further Reading

- [“Generative Agents: Interactive Simulacra of Human Behavior”](https://arxiv.org/abs/2304.03442) — Memory architecture
- [“MemGPT: Towards LLMs as Operating Systems”](https://arxiv.org/abs/2310.08560) — Virtual memory for LLMs
- [“Reflexion: Language Agents with Verbal Reinforcement Learning”](https://arxiv.org/abs/2303.11366) — Episodic memory for self-improvement
- [“Long-Term Memory for Language Models”](https://arxiv.org/abs/2402.11112) — Survey
- [LangChain Memory](https://python.langchain.com/docs/modules/memory/) — Practical implementations

---

[Next Part: Part V: MCP & Multi-Agent Systems →](/mcp-multi-agent/chapter-17-model-context-protocol)