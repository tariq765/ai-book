from qdrant_client import QdrantClient
from app.config import settings
from app.embeddings import embed_query

_qdrant_client = None


def get_qdrant_client() -> QdrantClient:
    """Lazy-load the Qdrant client (singleton)."""
    global _qdrant_client
    if _qdrant_client is None:
        _qdrant_client = QdrantClient(
            url=settings.QDRANT_URL,
            api_key=settings.QDRANT_API_KEY,
            timeout=60,
        )
    return _qdrant_client


def retrieve_context(query: str, top_k: int = None) -> list[dict]:
    """Search Qdrant for relevant chunks and return them."""
    if top_k is None:
        top_k = settings.TOP_K

    query_vector = embed_query(query)
    client = get_qdrant_client()

    response = client.query_points(
        collection_name=settings.QDRANT_COLLECTION,
        query=query_vector,
        limit=top_k,
    )

    contexts = []
    for point in response.points:
        payload = point.payload or {}
        contexts.append({
            "text": payload.get("text", payload.get("content", payload.get("chunk", ""))),
            "score": point.score,
            "metadata": {
                k: v for k, v in payload.items()
                if k not in ("text", "content", "chunk")
            },
        })

    return contexts
