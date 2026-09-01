---
sidebar_position: 1
slug: /local-ai
---

# Part VII: Local AI & AI Development

**Chapters 25–26**

---

## Overview

Running AI locally provides privacy, cost savings, and offline capability. This part covers local LLMs and AI-assisted development workflows.

## Chapters

| Chapter | Title | Key Concepts |
|---------|-------|--------------|
| 25 | [Local AI](/local-ai/chapter-25-local-ai) | Ollama, open-source models, quantization, CPU/GPU inference |
| 26 | [AI Coding Agents](/local-ai/chapter-26-ai-coding-agents) | Repository understanding, planning, code generation, testing, CLI workflows |

## Learning Objectives

By the end of this part, you will:

- Run LLMs locally on your hardware
- Understand quantization and model optimization
- Use AI coding agents effectively
- Integrate AI into your development workflow

## Prerequisites

- Parts I-VI (helpful but not required)
- Basic command line usage
- Hardware: 8GB+ RAM (16GB+ recommended for larger models)

## Visual Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    LOCAL AI STACK                            │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌─────────┐    ┌─────────┐    ┌─────────┐    ┌─────────┐  │
│  │  Model  │───▶│Runtime  │───▶│  API    │───▶│ Client  │  │
│  │ (.gguf) │    │(Ollama) │    │(OpenAI  │    │(CLI/UI) │  │
│  └─────────┘    └─────────┘    │ compat) │    └─────────┘  │
│                                └─────────┘                  │
│                                                              │
│  Quantization: 4-bit, 8-bit → Smaller, Faster, Less VRAM    │
└─────────────────────────────────────────────────────────────┘
```

## Next Steps

Start with **[Chapter 25: Local AI →](/local-ai/chapter-25-local-ai)**