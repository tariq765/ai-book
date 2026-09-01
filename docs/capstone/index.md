---
sidebar_position: 1
slug: /capstone
---

# Part IX: Capstone

**Chapter 30**

---

## Overview

The capstone brings everything together. You'll build a complete agentic AI application demonstrating all the concepts from this book.

## Chapter

| Chapter | Title | Key Concepts |
|---------|-------|--------------|
| 30 | [Build a Complete Agentic AI Application](/capstone/chapter-30-build-complete-agentic-ai-application) | Full-stack AI app, Next.js + FastAPI, RAG, MCP, memory, evaluation, observability, security |

## What You'll Build

```
┌─────────────────────────────────────────────────────────────────┐
│                      CAPSTONE ARCHITECTURE                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─────────┐    ┌─────────┐    ┌─────────────────────────┐     │
│  │ User    │───▶│Next.js  │───▶│FastAPI Backend          │     │
│  │ Browser │    │Frontend │    │                         │     │
│  └─────────┘    └─────────┘    │  ┌─────────────────┐   │     │
│                                │  │ AI Agent        │   │     │
│                                │  │  ┌───────────┐  │   │     │
│                                │  │  │  LLM      │  │   │     │
│                                │  │  │  ┌─────┐  │  │   │     │
│                                │  │  │  │RAG  │  │  │   │     │
│                                │  │  │  │MCP  │  │  │   │     │
│                                │  │  │  │Mem  │  │  │   │     │
│                                │  │  │  │Tools│  │  │   │     │
│                                │  │  └─────────┘  │   │     │
│                                │  └─────────────────┘   │     │
│                                └─────────────────────────┘     │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

## Technologies Used

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 14, React, TypeScript, Tailwind CSS |
| Backend | FastAPI, Python, Pydantic |
| LLM | OpenAI API / Local (Ollama) |
| Vector DB | Qdrant |
| Memory | Redis / PostgreSQL |
| Observability | Langfuse / LangSmith |
| Deployment | Docker, Docker Compose |

## Prerequisites

- **All previous parts** (this integrates everything)
- Docker and Docker Compose
- Node.js 18+ and Python 3.10+
- API keys (OpenAI, or local Ollama setup)

## Learning Objectives

By completing this capstone, you will:

- Architect a production-grade AI application
- Integrate RAG, agents, MCP, memory, and tools
- Implement evaluation and observability
- Deploy a complete system with Docker

## Next Steps

Start with **[Chapter 30: Build a Complete Agentic AI Application →](/capstone/chapter-30-build-complete-agentic-ai-application)**