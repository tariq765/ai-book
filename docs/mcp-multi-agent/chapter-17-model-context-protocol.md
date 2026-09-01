---
title: Model Context Protocol (MCP)
sidebar_position: 2
---

# Model Context Protocol: The Universal Plug for AI

## Overview
As AI models become more powerful, we want them to interact with the real world—reading our files, searching the web, or even checking the weather. But every tool and service has a different way of "talking." **Model Context Protocol (MCP)** is a new standard that makes it easy for any AI to connect to any tool.

## The Analogy: The USB Port for AI
Imagine if every time you bought a new mouse, keyboard, or printer, you had to open up your computer and solder wires to the motherboard. That would be a nightmare! 

Instead, we have **USB**. It's a "Universal" plug. You just plug it in, and it works. **MCP** is like a USB port for AI. It allows developers to build a tool once (like a Google Drive connector) and have it work instantly with any AI model that supports MCP.

## Simple Python Example
In MCP, we usually have a "Server" that provides tools and a "Client" (the AI) that uses them. Here is a conceptual look at how an MCP-like tool might be defined:

```python
# A conceptual example of an MCP Tool definition
def get_weather(city: str):
    """A tool that returns the current weather."""
    # In a real MCP server, this would be registered
    # so the AI knows it can call it.
    return f"The weather in {city} is sunny, 75°F."

# The AI (Client) can now 'see' this tool and call it
city_input = "San Francisco"
print(f"AI is calling tool: get_weather('{city_input}')")
print(f"Result: {get_weather(city_input)}")
```

## Key Takeaways
- **Standardization:** MCP creates a common language for AI and tools.
- **Interoperability:** Build a tool once, use it with many different AIs.
- **Context:** It helps models get the right information (context) at the right time.

[Next Chapter: Multi-Agent Systems](./chapter-18-multi-agent-systems.md)
