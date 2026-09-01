import os
from dotenv import load_dotenv

load_dotenv()


class Settings:
    QDRANT_URL: str = os.getenv("QDRANT_URL", "")
    QDRANT_API_KEY: str = os.getenv("QDRANT_API_KEY", "")
    QDRANT_COLLECTION: str = os.getenv("QDRANT_COLLECTION", "physical_ai_book_v2")
    GROQ_API_KEY: str = os.getenv("GROQ_API_KEY", "")
    EMBEDDING_CACHE_DIR: str = os.getenv("EMBEDDING_CACHE_DIR", "./fastembed_cache")
    EMBEDDING_MODEL: str = "BAAI/bge-small-en-v1.5"
    LLM_MODEL: str = os.getenv("LLM_MODEL", "openai/gpt-oss-120b")
    TOP_K: int = 5
    CORS_ORIGINS: list = [
        "http://localhost:3000",
        "http://localhost:3001",
        "https://ai-engineering-handbook.com",
    ]


settings = Settings()
