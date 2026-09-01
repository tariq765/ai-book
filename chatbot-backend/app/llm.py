from groq import Groq
from app.config import settings

_groq_client = None


def get_groq_client() -> Groq:
    """Lazy-load the Groq client (singleton)."""
    global _groq_client
    if _groq_client is None:
        _groq_client = Groq(api_key=settings.GROQ_API_KEY)
    return _groq_client


SYSTEM_PROMPT = """You are an expert AI Engineering assistant for "The AI Engineering Handbook". 
You answer questions based on the book's content provided as context below.

Rules:
- Answer ONLY based on the provided context. If the context doesn't contain relevant information, say so honestly.
- Be concise, clear, and technically accurate.
- Use markdown formatting for code blocks, lists, and emphasis.
- When referencing specific topics, mention which part/chapter they belong to if that info is available.
- If the user greets you, respond warmly and tell them you can help with questions about the AI Engineering Handbook.

Context from the book:
---
{context}
---"""


def generate_answer(query: str, contexts: list[dict]) -> str:
    """Generate an answer using Groq LLM with retrieved context."""
    context_text = "\n\n".join(
        f"[Chunk {i+1} | Score: {ctx['score']:.3f}]\n{ctx['text']}"
        for i, ctx in enumerate(contexts)
        if ctx.get("text")
    )

    if not context_text:
        context_text = "No relevant context found in the book."

    client = get_groq_client()

    response = client.chat.completions.create(
        model=settings.LLM_MODEL,
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT.format(context=context_text)},
            {"role": "user", "content": query},
        ],
        temperature=0.3,
        max_tokens=1024,
    )

    return response.choices[0].message.content


def generate_answer_stream(query: str, contexts: list[dict]):
    """Generate a streaming answer using Groq LLM with retrieved context."""
    context_text = "\n\n".join(
        f"[Chunk {i+1} | Score: {ctx['score']:.3f}]\n{ctx['text']}"
        for i, ctx in enumerate(contexts)
        if ctx.get("text")
    )

    if not context_text:
        context_text = "No relevant context found in the book."

    client = get_groq_client()

    stream = client.chat.completions.create(
        model=settings.LLM_MODEL,
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT.format(context=context_text)},
            {"role": "user", "content": query},
        ],
        temperature=0.3,
        max_tokens=1024,
        stream=True,
    )

    for chunk in stream:
        if chunk.choices[0].delta.content:
            yield chunk.choices[0].delta.content
