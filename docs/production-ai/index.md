---
sidebar_position: 1
slug: /production-ai
---

# Part VI: Production AI

**Chapters 20–24**

---

## Overview

Building AI that works in production requires evaluation, observability, security, and deployment expertise. This part covers the full production lifecycle.

## Chapters

| Chapter | Title | Key Concepts |
|---------|-------|--------------|
| 20 | [AI Evaluation](/production-ai/chapter-20-ai-evaluation) | Accuracy, relevance, faithfulness, hallucination detection, test datasets |
| 21 | [AI Observability](/production-ai/chapter-21-ai-observability) | Logs, traces, metrics, latency, token usage, cost, debugging |
| 22 | [AI Security](/production-ai/chapter-22-ai-security) | Prompt injection, jailbreaks, data leakage, secure tool calling |
| 23 | [Building Production AI Apps](/production-ai/chapter-23-building-production-ai-apps) | Frontend, backend, APIs, streaming, databases, authentication |
| 24 | [Deploying AI Applications](/production-ai/chapter-24-deploying-ai-applications) | Docker, GPU infrastructure, scaling, CI/CD, monitoring |

## Learning Objectives

By the end of this part, you will:

- Build evaluation pipelines for AI systems
- Implement observability and tracing
- Secure AI applications against threats
- Build and deploy production-ready AI applications

## Prerequisites

- Parts I-V (AI fundamentals through agents)
- Software engineering experience
- Understanding of cloud platforms, containers

## Visual Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                     PRODUCTION AI LIFECYCLE                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Build ──▶ Evaluate ──▶ Observe ──▶ Secure ──▶ Deploy ──▶ Monitor│
│    │         │           │          │         │        │        │
│    ▼         ▼           ▼          ▼         ▼        ▼        │
│  Code    Metrics     Traces    Guardrails  Containers  Alerts   │
│  Tests   Datasets    Logs     Auth/Z     Scaling    Cost        │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

## Next Steps

Start with **[Chapter 20: AI Evaluation →](/production-ai/chapter-20-ai-evaluation)**