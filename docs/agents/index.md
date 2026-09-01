---
sidebar_position: 1
slug: /agents
---

# Part IV: AI Agents

**Chapters 13–16**

---

## Overview

AI agents are autonomous systems that can plan, reason, use tools, and execute tasks. This part covers agent architecture, agentic AI, tool calling, and memory systems.

## Chapters

| Chapter | Title | Key Concepts |
|---------|-------|--------------|
| 13 | [AI Agents](/agents/chapter-13-ai-agents) | Agent loop, model, instructions, tools, planning, autonomy |
| 14 | [Agentic AI](/agents/chapter-14-agentic-ai) | Autonomous workflows, reasoning, decision-making, human-in-the-loop |
| 15 | [Tool Calling](/agents/chapter-15-tool-calling) | Function schemas, tool selection, execution, error handling |
| 16 | [AI Memory](/agents/chapter-16-ai-memory) | Short-term, long-term, episodic, semantic memory, retrieval |

## Learning Objectives

By the end of this part, you will:

- Understand the agent loop and autonomous execution
- Distinguish between agents and agentic AI systems
- Implement tool/function calling with proper schemas
- Design memory architectures for AI agents

## Prerequisites

- Part I-III (LLMs, RAG, embeddings)
- Python programming
- Understanding of APIs and function calling

## Visual Overview

```
┌─────────────────────────────────────────────────────────────┐
│                      AGENT LOOP                              │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│   ┌─────────┐    ┌─────────┐    ┌─────────┐    ┌─────────┐  │
│   │ Observe │───▶│  Think  │───▶│  Act    │───▶│  Learn  │  │
│   └─────────┘    └─────────┘    └─────────┘    └─────────┘  │
│        ▲                                            │       │
│        │                                            ▼       │
│        └────────────────────────────────────────────┘       │
│                      Memory                                  │
└─────────────────────────────────────────────────────────────┘
```

## Next Steps

Start with **[Chapter 13: AI Agents →](/agents/chapter-13-ai-agents)**