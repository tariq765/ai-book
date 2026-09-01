---
sidebar_position: 1
slug: /ai-engineering
---

# Part III: AI Application Engineering

**Chapters 9–12**

---

## Overview

This part covers the engineering building blocks for AI applications: embeddings, vector databases, RAG, and advanced RAG techniques.

## Chapters

| Chapter | Title | Key Concepts |
|---------|-------|--------------|
| 9 | [Embeddings](/ai-engineering/chapter-9-embeddings) | Vector representations, semantic similarity, embedding models |
| 10 | [Vector Databases](/ai-engineering/chapter-10-vector-databases) | Qdrant, indexing, similarity search, metadata filtering |
| 11 | [RAG](/ai-engineering/chapter-11-rag) | Retrieval-augmented generation, chunking, retrieval, generation |
| 12 | [Advanced RAG](/ai-engineering/chapter-12-advanced-rag) | Hybrid search, reranking, query rewriting, evaluation |

## Learning Objectives

By the end of this part, you will:

- Understand how embeddings represent semantic meaning
- Work with vector databases for similarity search
- Build complete RAG pipelines
- Implement advanced RAG techniques for production quality

## Prerequisites

- Part I & II (Generative AI fundamentals)
- Python programming
- Basic understanding of APIs and databases

## Visual Overview

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  Documents  │────▶│  Chunking   │────▶│  Embedding  │────▶│ Vector DB   │
└─────────────┘     └─────────────┘     └─────────────┘     └─────────────┘
                                                                        │
┌─────────────┐     ┌─────────────┐     ┌─────────────┐                │
│   Answer    │◀────│ Generation  │◀────│   Context   │◀──── Retrieval │
└─────────────┘     └─────────────┘     └─────────────┘                │
                                                                        │
                                      ┌─────────────┐                  │
                                      │   Query     │──────────────────┘
                                      └─────────────┘
```

## Next Steps

Start with **[Chapter 9: Embeddings →](/ai-engineering/chapter-9-embeddings)**