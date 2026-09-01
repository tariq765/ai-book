from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from app.config import settings
from app.retriever import retrieve_context
from app.llm import generate_answer, generate_answer_stream

app = FastAPI(
    title="AI Engineering Handbook - RAG Chatbot API",
    version="1.0.0",
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class ChatRequest(BaseModel):
    question: str
    top_k: int = 5


class ChatResponse(BaseModel):
    answer: str
    sources: list[dict]


@app.get("/health")
def health_check():
    return {"status": "ok", "service": "RAG Chatbot API"}


@app.post("/api/chat", response_model=ChatResponse)
def chat(request: ChatRequest):
    """Non-streaming chat endpoint."""
    if not request.question.strip():
        raise HTTPException(status_code=400, detail="Question cannot be empty")

    try:
        contexts = retrieve_context(request.question, top_k=request.top_k)
        answer = generate_answer(request.question, contexts)

        sources = [
            {
                "text": ctx["text"][:200] + "..." if len(ctx.get("text", "")) > 200 else ctx.get("text", ""),
                "score": round(ctx["score"], 3),
                "metadata": ctx.get("metadata", {}),
            }
            for ctx in contexts
        ]

        return ChatResponse(answer=answer, sources=sources)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/chat/stream")
def chat_stream(request: ChatRequest):
    """Streaming chat endpoint using Server-Sent Events."""
    if not request.question.strip():
        raise HTTPException(status_code=400, detail="Question cannot be empty")

    try:
        contexts = retrieve_context(request.question, top_k=request.top_k)

        def event_generator():
            for token in generate_answer_stream(request.question, contexts):
                yield f"data: {token}\n\n"
            yield "data: [DONE]\n\n"

        return StreamingResponse(
            event_generator(),
            media_type="text/event-stream",
            headers={
                "Cache-Control": "no-cache",
                "Connection": "keep-alive",
            },
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
