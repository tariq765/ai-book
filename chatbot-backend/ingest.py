import os
import re
import uuid
import time
from pathlib import Path
from qdrant_client import QdrantClient
from qdrant_client.models import Distance, VectorParams, PointStruct
from fastembed import TextEmbedding
from app.config import settings

DOCS_DIR = Path(__file__).resolve().parent.parent / "docs"

def clean_markdown(text: str) -> str:
    """Clean frontmatter and excessive empty lines from markdown."""
    text = re.sub(r"^---\n.*?\n---\n", "", text, flags=re.DOTALL)
    return text.strip()

def chunk_markdown(content: str, source_path: str, max_chunk_size: int = 800, overlap: int = 150) -> list[dict]:
    """Split markdown content into chunks preserving section headers."""
    cleaned = clean_markdown(content)
    if not cleaned:
        return []

    title_match = re.search(r"^#\s+(.+)$", cleaned, flags=re.MULTILINE)
    doc_title = title_match.group(1).strip() if title_match else Path(source_path).stem

    sections = re.split(r"(?=\n#{1,3}\s+)", cleaned)
    chunks = []

    for section in sections:
        sec_text = section.strip()
        if not sec_text:
            continue
        
        sec_heading_match = re.match(r"^#{1,3}\s+(.+)$", sec_text, flags=re.MULTILINE)
        section_title = sec_heading_match.group(1).strip() if sec_heading_match else doc_title

        if len(sec_text) <= max_chunk_size:
            chunks.append({
                "text": sec_text,
                "title": doc_title,
                "section": section_title,
                "source": str(Path(source_path).name),
                "path": str(Path(source_path).relative_to(DOCS_DIR.parent)),
            })
        else:
            words = sec_text.split()
            current_words = []
            current_len = 0

            for word in words:
                current_words.append(word)
                current_len += len(word) + 1
                if current_len >= max_chunk_size:
                    chunk_str = " ".join(current_words)
                    chunks.append({
                        "text": chunk_str,
                        "title": doc_title,
                        "section": section_title,
                        "source": str(Path(source_path).name),
                        "path": str(Path(source_path).relative_to(DOCS_DIR.parent)),
                    })
                    overlap_words = []
                    overlap_len = 0
                    for w in reversed(current_words):
                        if overlap_len + len(w) + 1 <= overlap:
                            overlap_words.insert(0, w)
                            overlap_len += len(w) + 1
                        else:
                            break
                    current_words = overlap_words
                    current_len = overlap_len

            if current_words:
                chunk_str = " ".join(current_words)
                chunks.append({
                    "text": chunk_str,
                    "title": doc_title,
                    "section": section_title,
                    "source": str(Path(source_path).name),
                    "path": str(Path(source_path).relative_to(DOCS_DIR.parent)),
                })

    return chunks

def load_all_docs() -> list[dict]:
    """Find and chunk all markdown files in docs/ directory."""
    all_chunks = []
    if not DOCS_DIR.exists():
        print(f"[!] Docs directory not found at: {DOCS_DIR}")
        return all_chunks

    doc_files = list(DOCS_DIR.rglob("*.md")) + list(DOCS_DIR.rglob("*.mdx"))
    print(f"[*] Found {len(doc_files)} markdown files in {DOCS_DIR}")

    for file_path in doc_files:
        try:
            with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
                content = f.read()
            file_chunks = chunk_markdown(content, str(file_path))
            all_chunks.extend(file_chunks)
        except Exception as e:
            print(f"[!] Error reading {file_path}: {e}")

    print(f"[*] Total chunks created: {len(all_chunks)}")
    return all_chunks

def index_to_qdrant():
    """Chunk docs, compute embeddings, and index into Qdrant Cloud."""
    print("=" * 60)
    print("Starting Qdrant Indexing Pipeline")
    print(f"Target Collection: {settings.QDRANT_COLLECTION}")
    print(f"Qdrant URL: {settings.QDRANT_URL}")
    print(f"Embedding Model: {settings.EMBEDDING_MODEL}")
    print("=" * 60)

    chunks = load_all_docs()
    if not chunks:
        print("[!] No chunks found to index.")
        return

    print("[*] Initializing FastEmbed model...")
    embed_model = TextEmbedding(
        model_name=settings.EMBEDDING_MODEL,
        cache_dir=settings.EMBEDDING_CACHE_DIR,
    )

    print("[*] Connecting to Qdrant Cloud (timeout=60s)...")
    client = QdrantClient(
        url=settings.QDRANT_URL,
        api_key=settings.QDRANT_API_KEY,
        timeout=60,
    )

    sample_emb = list(embed_model.embed(["test"]))[0]
    vector_size = len(sample_emb)
    print(f"[*] Vector Dimension: {vector_size}")

    collections = [c.name for c in client.get_collections().collections]
    if settings.QDRANT_COLLECTION in collections:
        print(f"[*] Collection '{settings.QDRANT_COLLECTION}' already exists. Recreating...")
        client.delete_collection(collection_name=settings.QDRANT_COLLECTION)

    client.create_collection(
        collection_name=settings.QDRANT_COLLECTION,
        vectors_config=VectorParams(size=vector_size, distance=Distance.COSINE),
    )
    print(f"[+] Created collection: {settings.QDRANT_COLLECTION}")

    batch_size = 32
    texts = [c["text"] for c in chunks]
    print(f"[*] Generating embeddings for {len(texts)} chunks...")

    embeddings = list(embed_model.embed(texts, batch_size=32))

    print("[*] Uploading points to Qdrant Cloud in batches of 32...")
    points = []
    for i, (chunk, vector) in enumerate(zip(chunks, embeddings)):
        point = PointStruct(
            id=str(uuid.uuid4()),
            vector=vector.tolist(),
            payload={
                "text": chunk["text"],
                "title": chunk["title"],
                "section": chunk["section"],
                "source": chunk["source"],
                "path": chunk["path"],
            },
        )
        points.append(point)

        if len(points) >= batch_size or i == len(chunks) - 1:
            for attempt in range(3):
                try:
                    client.upsert(
                        collection_name=settings.QDRANT_COLLECTION,
                        points=points,
                    )
                    print(f"    Uploaded {i + 1}/{len(chunks)} points...")
                    break
                except Exception as e:
                    print(f"    [Retry {attempt+1}/3] Upload error: {e}")
                    time.sleep(2)
            points = []

    print("[+] Successfully indexed all documents into Qdrant Cloud!")

    print("\n[*] Running test query to verify indexing...")
    test_query = "What is RAG in AI Engineering?"
    q_vec = list(embed_model.embed([test_query]))[0].tolist()
    response = client.query_points(
        collection_name=settings.QDRANT_COLLECTION,
        query=q_vec,
        limit=3,
    )
    print(f"[+] Test Query: '{test_query}'")
    for r in response.points:
        payload = r.payload or {}
        print(f"    - [{r.score:.3f}] {payload.get('title')} -> {payload.get('section')}: {payload.get('text')[:120]}...")

    print("\n[✓] Indexing & Vector Database setup completed successfully!")

if __name__ == "__main__":
    index_to_qdrant()
