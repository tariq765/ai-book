---
title: Tool Calling and Function Calling
sidebar_position: 3
---

# Tool Calling: Giving LLMs Hands

## Overview

**Tool Calling (Function Calling)** is the mechanism that lets LLMs invoke external functions, APIs, and code. It transforms an LLM from a text generator into an **actor** that can search, calculate, query databases, send emails, and control systems.

Since OpenAI introduced it in 2023, tool calling has become the **universal standard** for agent-tool interaction, supported by Anthropic, Google, Mistral, Cohere, and open models (Llama 3.1, Qwen 2.5, Nemotron).

---

## The Analogy: The Universal Remote

An LLM without tools is like a brilliant consultant locked in a room with no phone, no computer, no library. They can only answer from memory.

**Tool calling gives them a universal remote** — each button (function) connects to a capability: search the web, query SQL, run Python, call an API. The LLM decides *which button to press* and *with what parameters*.

---

## How Tool Calling Works

### 1. Function Definition (JSON Schema)

```json
{
  "name": "search_web",
  "description": "Search the web for current information. Use for facts, news, prices, etc.",
  "parameters": {
    "type": "object",
    "properties": {
      "query": {
        "type": "string",
        "description": "Search query. Be specific and use keywords."
      },
      "num_results": {
        "type": "integer",
        "description": "Number of results to return",
        "default": 5,
        "minimum": 1,
        "maximum": 20
      },
      "recency_days": {
        "type": "integer",
        "description": "Limit results to last N days",
        "default": 365
      }
    },
    "required": ["query"]
  }
}
```

### 2. LLM Decides to Call

User: "What's the current price of Bitcoin?"

LLM Response:
```json
{
  "tool_calls": [
    {
      "id": "call_abc123",
      "type": "function",
      "function": {
        "name": "search_web",
        "arguments": "{\"query\": \"Bitcoin price USD today\", \"num_results\": 3, \"recency_days\": 1}"
      }
    }
  ]
}
```

### 3. Your Code Executes the Function

```python
def search_web(query: str, num_results: int = 5, recency_days: int = 365) -> dict:
    # Your implementation: call SerpAPI, Bing, Google, etc.
    results = serpapi.search(q=query, num=num_results, tbs=f"qdr:d{recency_days}")
    return {"results": results}

# Execute
tool_call = response.tool_calls[0]
args = json.loads(tool_call.function.arguments)
result = search_web(**args)
```

### 4. Return Result to LLM

```python
messages.append({
    "role": "tool",
    "content": json.dumps(result),
    "tool_call_id": tool_call.id
})

# LLM now generates final answer using the tool result
final_response = client.chat.completions.create(messages=messages, tools=tools)
```

---

## Complete Implementation

```python
from openai import OpenAI
import json
from typing import Callable, Dict, Any, List
from dataclasses import dataclass

@dataclass
class Function:
    name: str
    description: str
    parameters: Dict  # JSON Schema
    handler: Callable  # Python function
    
    def to_openai(self) -> dict:
        return {
            "type": "function",
            "function": {
                "name": self.name,
                "description": self.description,
                "parameters": self.parameters
            }
        }

class ToolCallingAgent:
    def __init__(self, model: str = "gpt-4o", functions: List[Function] = None):
        self.client = OpenAI()
        self.model = model
        self.functions = {f.name: f for f in (functions or [])}
    
    def add_function(self, func: Function):
        self.functions[func.name] = func
    
    def run(self, messages: List[Dict], max_turns: int = 5) -> Dict:
        """Run tool calling loop."""
        tools = [f.to_openai() for f in self.functions.values()]
        
        for turn in range(max_turns):
            response = self.client.chat.completions.create(
                model=self.model,
                messages=messages,
                tools=tools,
                tool_choice="auto",
                temperature=0.1
            )
            
            msg = response.choices[0].message
            messages.append(msg.model_dump())
            
            if not msg.tool_calls:
                # No tool calls = final answer
                return {"final": msg.content, "messages": messages}
            
            # Execute tool calls
            for tc in msg.tool_calls:
                result = self._execute_tool(tc)
                messages.append({
                    "role": "tool",
                    "content": json.dumps(result),
                    "tool_call_id": tc.id
                })
        
        return {"error": "Max turns reached", "messages": messages}
    
    def _execute_tool(self, tool_call) -> Dict:
        name = tool_call.function.name
        args = json.loads(tool_call.function.arguments)
        
        if name not in self.functions:
            return {"error": f"Unknown function: {name}"}
        
        try:
            result = self.functions[name].handler(**args)
            return {"result": result}
        except Exception as e:
            return {"error": f"Execution failed: {str(e)}"}
```

---

## Essential Tools for Agents

### 1. Web Search

```python
def search_web(query: str, num_results: int = 5, recency_days: int = 365) -> dict:
    """Search using SerpAPI / Bing / Google Custom Search."""
    import requests
    
    # SerpAPI example
    params = {
        "q": query,
        "num": num_results,
        "api_key": SERPAPI_KEY,
        "tbs": f"qdr:d{recency_days}" if recency_days < 365 else ""
    }
    resp = requests.get("https://serpapi.com/search", params=params)
    data = resp.json()
    
    return {
        "query": query,
        "results": [
            {"title": r.get("title"), "snippet": r.get("snippet"), "link": r.get("link")}
            for r in data.get("organic_results", [])[:num_results]
        ]
    }

search_web_tool = Function(
    name="search_web",
    description="Search the web for current information, facts, news, prices.",
    parameters={
        "type": "object",
        "properties": {
            "query": {"type": "string", "description": "Specific search query"},
            "num_results": {"type": "integer", "default": 5, "minimum": 1, "maximum": 10},
            "recency_days": {"type": "integer", "default": 365, "description": "Days back to search"}
        },
        "required": ["query"]
    },
    handler=search_web
)
```

### 2. Code Execution (Sandboxed)

```python
def execute_python(code: str, timeout: int = 30) -> dict:
    """Execute Python in isolated subprocess."""
    import subprocess, tempfile, os
    
    with tempfile.NamedTemporaryFile(mode='w', suffix='.py', delete=False) as f:
        f.write(code)
        path = f.name
    
    try:
        result = subprocess.run(
            ["python3", path],
            capture_output=True, text=True, timeout=timeout
        )
        return {
            "stdout": result.stdout,
            "stderr": result.stderr,
            "returncode": result.returncode,
            "success": result.returncode == 0
        }
    except subprocess.TimeoutExpired:
        return {"error": f"Timeout after {timeout}s", "success": False}
    finally:
        os.unlink(path)

execute_python_tool = Function(
    name="execute_python",
    description="Run Python code for calculations, data analysis, algorithms. Returns stdout/stderr.",
    parameters={
        "type": "object",
        "properties": {
            "code": {"type": "string", "description": "Python code to execute"}
        },
        "required": ["code"]
    },
    handler=execute_python
)
```

### 3. Database Query

```python
def query_database(sql: str, params: list = None) -> dict:
    """Execute read-only SQL query."""
    import psycopg2
    from psycopg2.extras import RealDictCursor
    
    # Safety: only allow SELECT
    sql_stripped = sql.strip().upper()
    if not sql_stripped.startswith("SELECT"):
        return {"error": "Only SELECT queries allowed"}
    
    conn = psycopg2.connect(DATABASE_URL)
    try:
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            cur.execute(sql, params or [])
            rows = cur.fetchall()
            return {"rows": rows, "row_count": len(rows)}
    finally:
        conn.close()

query_db_tool = Function(
    name="query_database",
    description="Execute read-only SQL queries on the database.",
    parameters={
        "type": "object",
        "properties": {
            "sql": {"type": "string", "description": "SELECT query only"},
            "params": {"type": "array", "items": {}, "description": "Query parameters"}
        },
        "required": ["sql"]
    },
    handler=query_database
)
```

### 4. File Operations

```python
def read_file(path: str) -> dict:
    """Read file contents."""
    try:
        with open(path, 'r') as f:
            return {"content": f.read(), "path": path}
    except Exception as e:
        return {"error": str(e)}

def write_file(path: str, content: str) -> dict:
    """Write file (with safety checks)."""
    # Safety: restrict to workspace
    if not path.startswith(WORKSPACE_DIR):
        return {"error": "Path outside workspace"}
    
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, 'w') as f:
        f.write(content)
    return {"success": True, "path": path}

read_file_tool = Function(
    name="read_file",
    description="Read a file from the workspace.",
    parameters={"type": "object", "properties": {"path": {"type": "string"}}, "required": ["path"]},
    handler=read_file
)

write_file_tool = Function(
    name="write_file",
    description="Write a file to the workspace.",
    parameters={"type": "object", "properties": {"path": {"type": "string"}, "content": {"type": "string"}}, "required": ["path", "content"]},
    handler=write_file
)
```

### 5. HTTP/API Calls

```python
def http_request(method: str, url: str, headers: dict = None, body: dict = None, timeout: int = 30) -> dict:
    """Make HTTP requests to APIs."""
    import requests
    
    # Safety: allowlist domains
    allowed_domains = ["api.github.com", "api.stripe.com", "api.openweathermap.org"]
    if not any(d in url for d in allowed_domains):
        return {"error": "Domain not in allowlist"}
    
    try:
        resp = requests.request(method, url, headers=headers, json=body, timeout=timeout)
        return {
            "status_code": resp.status_code,
            "headers": dict(resp.headers),
            "body": resp.json() if resp.headers.get("content-type", "").startswith("application/json") else resp.text
        }
    except Exception as e:
        return {"error": str(e)}

http_tool = Function(
    name="http_request",
    description="Make HTTP requests to allowed APIs.",
    parameters={
        "type": "object",
        "properties": {
            "method": {"type": "string", "enum": ["GET", "POST", "PUT", "DELETE", "PATCH"]},
            "url": {"type": "string", "description": "Full URL"},
            "headers": {"type": "object", "additionalProperties": {"type": "string"}},
            "body": {"type": "object"},
            "timeout": {"type": "integer", "default": 30}
        },
        "required": ["method", "url"]
    },
    handler=http_request
)
```

---

## Best Practices for Tool Design

### 1. Clear, Specific Descriptions

```python
# ✅ Good: Tells the LLM WHEN and HOW to use
Function(
    name="get_weather",
    description="Get current weather for a location. Use when user asks about weather, temperature, rain, etc. Requires city name or coordinates.",
    parameters={...}
)

# ❌ Bad: Vague
Function(
    name="weather",
    description="Weather tool",
    parameters={...}
)
```

### 2. Typed Parameters with Constraints

```python
parameters={
    "type": "object",
    "properties": {
        "city": {"type": "string", "description": "City name, e.g., 'San Francisco'"},
        "units": {"type": "string", "enum": ["celsius", "fahrenheit"], "default": "celsius"},
        "days": {"type": "integer", "minimum": 1, "maximum": 7, "default": 1, "description": "Forecast days"}
    },
    "required": ["city"]
}
```

### 3. Return Structured, Parseable Data

```python
def get_weather(city: str, units: str = "celsius", days: int = 1) -> dict:
    # ... fetch data ...
    return {
        "location": {"city": city, "country": "US"},
        "current": {"temp": 22, "condition": "sunny", "humidity": 45},
        "forecast": [
            {"date": "2024-01-15", "high": 24, "low": 18, "condition": "partly cloudy"},
            {"date": "2024-01-16", "high": 26, "low": 19, "condition": "sunny"}
        ],
        "units": units
    }
```

### 4. Handle Errors Gracefully

```python
def robust_tool_handler(func):
    """Decorator for consistent error handling."""
    def wrapper(*args, **kwargs):
        try:
            return func(*args, **kwargs)
        except ValidationError as e:
            return {"error": f"Invalid arguments: {e}"}
        except PermissionError:
            return {"error": "Permission denied"}
        except Exception as e:
            return {"error": f"Internal error: {type(e).__name__}: {str(e)[:200]}"}
    return wrapper
```

---

## Parallel Tool Calling

Modern models support **parallel tool calls** — multiple tools in one response.

```python
# User: "What's the weather in NYC and London?"
# LLM calls both in parallel:

tool_calls = [
    {"id": "call_1", "function": {"name": "get_weather", "arguments": '{"city": "New York"}'}},
    {"id": "call_2", "function": {"name": "get_weather", "arguments": '{"city": "London"}'}}
]

# Execute in parallel
import asyncio

async def execute_parallel(tool_calls):
    async def exec_one(tc):
        return tc.id, execute_tool(tc)
    
    results = await asyncio.gather(*[exec_one(tc) for tc in tool_calls])
    return {id: result for id, result in results}
```

---

## Tool Calling Across Providers

| Provider | Format | Notes |
|----------|--------|-------|
| **OpenAI** | `tools` + `tool_choice` | Native, parallel, structured output |
| **Anthropic** | `tools` + `tool_choice` | Similar, uses `tool_use` blocks |
| **Google (Gemini)** | `tools` + `tool_config` | Function calling API |
| **Mistral** | `tools` + `tool_choice` | OpenAI-compatible |
| **Cohere** | `tools` + `tool_choice` | Command R+ optimized |
| **Ollama (Local)** | `tools` in `chat` | Llama 3.1, Qwen 2.5, Nemotron |
| **vLLM / TGI** | OpenAI-compatible | Self-hosted OpenAI API |

### Unified Interface

```python
class UnifiedToolCaller:
    def __init__(self, provider: str, model: str, api_key: str = None):
        self.provider = provider
        if provider == "openai":
            self.client = OpenAI(api_key=api_key)
        elif provider == "anthropic":
            self.client = Anthropic(api_key=api_key)
        # ... others
    
    def call(self, messages: List[Dict], tools: List[Dict]) -> Dict:
        if self.provider == "openai":
            return self._openai_call(messages, tools)
        elif self.provider == "anthropic":
            return self._anthropic_call(messages, tools)
        # ...
    
    def _openai_call(self, messages, tools):
        resp = self.client.chat.completions.create(
            model=self.model, messages=messages, tools=tools, tool_choice="auto"
        )
        return self._normalize_openai(resp)
    
    def _anthropic_call(self, messages, tools):
        # Convert OpenAI format to Anthropic
        anthropic_tools = [{"name": t["function"]["name"], "description": t["function"]["description"], "input_schema": t["function"]["parameters"]} for t in tools]
        resp = self.client.messages.create(model=self.model, messages=messages, tools=anthropic_tools)
        return self._normalize_anthropic(resp)
    
    def _normalize_openai(self, resp):
        msg = resp.choices[0].message
        return {
            "content": msg.content,
            "tool_calls": [
                {"id": tc.id, "name": tc.function.name, "arguments": json.loads(tc.function.arguments)}
                for tc in (msg.tool_calls or [])
            ]
        }
    
    def _normalize_anthropic(self, resp):
        tool_calls = []
        for block in resp.content:
            if block.type == "tool_use":
                tool_calls.append({"id": block.id, "name": block.name, "arguments": block.input})
        return {"content": resp.content[0].text if resp.content else "", "tool_calls": tool_calls}
```

---

## Structured Output + Tool Calling

Combine tool calling with **structured output** for reliable JSON responses.

```python
from pydantic import BaseModel
from typing import List, Optional

class SearchResult(BaseModel):
    query: str
    results: List[dict]
    summary: str

class ToolResponse(BaseModel):
    action: str  # "search" | "answer"
    search: Optional[SearchResult] = None
    answer: Optional[str] = None

# Use with OpenAI structured output
response = client.beta.chat.completions.parse(
    model="gpt-4o-2024-08-06",
    messages=messages,
    tools=tools,
    tool_choice="auto",
    response_format=ToolResponse
)

parsed: ToolResponse = response.choices[0].message.parsed
```

---

## Security Considerations

| Risk | Mitigation |
|------|------------|
| **Arbitrary code execution** | Sandbox (gVisor, Firecracker, WASM), no shell access |
| **SSRF (Server-Side Request Forgery)** | Allowlist domains, block private IPs (10.x, 192.168.x, 169.254.x) |
| **SQL Injection** | Parameterized queries, read-only transactions, allowlist tables |
| **File system access** | Chroot/jail to workspace, path validation, no `..` |
| **Rate abuse** | Per-tool rate limits, quotas, monitoring |
| **Data exfiltration** | Output validation, no external network from tool sandbox |
| **Prompt injection** | Treat tool outputs as untrusted, sanitize before re-feeding to LLM |

---

## Key Takeaways

- **Tool calling = LLM decides, code executes** — Universal interface for LLM ↔ world interaction
- **JSON Schema defines the contract** — Clear names, descriptions, constraints are critical
- **Essential tools**: Search, code execution, database, files, HTTP
- **Parallel calls** reduce latency for independent operations
- **Structured output** ensures reliable parsing of tool results
- **Security first**: Sandbox, allowlists, rate limits, output validation

---

## Exercises

1. **Build a tool registry**: Create `@tool` decorator that auto-generates JSON schema from type hints.
2. **Implement parallel execution**: Handle 5 simultaneous tool calls with asyncio.
3. **Add observability**: Log every tool call (name, args, latency, success/error) to a dashboard.
4. **Security audit**: Write a tool that attempts SSRF, SQLi, path traversal — verify your mitigations block them.

---

## Further Reading

- [OpenAI Function Calling Guide](https://platform.openai.com/docs/guides/function-calling)
- [Anthropic Tool Use](https://docs.anthropic.com/en/docs/build-with-claude/tool-use)
- [“Function Calling with LLMs”](https://arxiv.org/abs/2310.08562) — Survey paper
- [Gorilla: LLM for API Calls](https://gorilla.cs.berkeley.edu/) — Benchmark & models
- [NexusRaven](https://github.com/NexusFlowAI/NexusRaven) — Open function calling model

---

[Next Chapter: AI Memory →](/agents/chapter-16-ai-memory)