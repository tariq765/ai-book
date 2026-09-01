---
title: Local AI
sidebar_position: 2
---

# Local AI: Your Private Brain

## Overview
**Local AI** means running artificial intelligence models on your own computer instead of sending your data to a big company's server (the "cloud"). This gives you more privacy, works without an internet connection, and can even save you money.

## The Analogy: The Home Library
Think of Cloud AI (like ChatGPT) as a **Giant Public Library**. It has almost every book in the world, but you have to travel there, show your ID, and everyone can see what you are reading.

**Local AI** is like having a **Private Home Library**. 
- It’s right in your living room (your computer).
- You don’t need to leave the house (no internet needed).
- No one knows which books you are looking at (total privacy).
- While it might not have *every* book the giant library has, it has exactly what you need for your daily work.

## Simple Python Example
To run AI locally, many people use a tool called **Ollama**. Here is how you might talk to a local model using Python:

```python
import requests
import json

# This function talks to 'Ollama', a tool that runs AI on your machine
def ask_local_ai(prompt):
    url = "http://localhost:11434/api/generate"
    data = {
        "model": "llama3",  # The name of the local model
        "prompt": prompt,
        "stream": False
    }
    
    # Send the prompt to your local AI
    response = requests.post(url, json=data)
    
    # Get the answer back
    if response.status_code == 200:
        return response.json()['response']
    else:
        return "Error: Is Ollama running?"

# Let's try it out!
print(ask_local_ai("Why is the sky blue?"))
```

## Key Takeaways
- **Privacy:** Your data never leaves your computer.
- **Cost:** You don't have to pay for every message you send.
- **Speed:** No "internet lag" if your computer is fast enough.
- **Offline:** Works perfectly on an airplane or in a remote cabin.

[Next Chapter: AI Coding Agents →](/local-ai/chapter-26-ai-coding-agents)
