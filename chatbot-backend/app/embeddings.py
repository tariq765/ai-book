from fastembed import TextEmbedding
from app.config import settings

_embedding_model = None


def get_embedding_model() -> TextEmbedding:
    """Lazy-load the FastEmbed model (singleton)."""
    global _embedding_model
    if _embedding_model is None:
        _embedding_model = TextEmbedding(
            model_name=settings.EMBEDDING_MODEL,
            cache_dir=settings.EMBEDDING_CACHE_DIR,
        )
    return _embedding_model


def embed_query(query: str) -> list[float]:
    """Generate embedding for a single query string."""
    model = get_embedding_model()
    embeddings = list(model.embed([query]))
    return embeddings[0].tolist()
