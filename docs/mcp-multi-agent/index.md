---
sidebar_position: 1
slug: /mcp-multi-agent
---

# Part V: MCP & Multi-Agent Systems

**Chapters 17–19**

---

## Overview

This part covers the Model Context Protocol (MCP) for standardized tool integration, multi-agent architectures, and workflow patterns for complex AI systems.

## Chapters

| Chapter | Title | Key Concepts |
|---------|-------|--------------|
| 17 | [Model Context Protocol](/mcp-multi-agent/chapter-17-model-context-protocol) | MCP client/server, tools, resources, prompts, standardization |
| 18 | [Multi-Agent Systems](/mcp-multi-agent/chapter-18-multi-agent-systems) | Coordinator/specialist agents, delegation, collaboration |
| 19 | [AI Workflow Patterns](/mcp-multi-agent/chapter-19-ai-workflow-patterns) | Sequential, parallel, routing, evaluator-optimizer patterns |

## Learning Objectives

By the end of this part, you will:

- Understand MCP and how it standardizes AI-tool integration
- Design multi-agent systems with clear roles
- Implement common AI workflow patterns
- Orchestrate complex agent collaborations

## Prerequisites

- Part IV (AI Agents, Tool Calling, Memory)
- Understanding of APIs and protocols
- Python programming

## Visual Overview

```
┌──────────────┐         ┌──────────────┐         ┌──────────────┐
│  MCP Client  │◀───────▶│  MCP Server  │◀───────▶│  External    │
│  (Agent)     │  MCP    │  (Tools)     │  API    │  Services    │
└──────────────┘         └──────────────┘         └──────────────┘
        │
        ▼
┌──────────────────────────────────────────────────────────────┐
│                    MULTI-AGENT ORCHESTRATION                  │
├──────────────────────────────────────────────────────────────┤
│  ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌────────┐  │
│  │Coordinator│───▶│Specialist│───▶│Specialist│───▶│Aggregat│  │
│  │  Agent   │    │  Agent 1 │    │  Agent 2 │    │or Agent│  │
│  └──────────┘    └──────────┘    └──────────┘    └────────┘  │
└──────────────────────────────────────────────────────────────┘
```

## Next Steps

Start with **[Chapter 17: Model Context Protocol →](/mcp-multi-agent/chapter-17-model-context-protocol)**