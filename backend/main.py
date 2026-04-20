from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from groq import Groq
from dotenv import load_dotenv
import os
import tempfile
import chromadb
from chromadb.utils import embedding_functions
import fitz  # PyMuPDF

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Groq client ──────────────────────────────────────────────────────
client = Groq(api_key=os.getenv("GROQ_API_KEY"))

# ── ChromaDB setup (saves locally in backend/chroma_db folder) ───────
chroma_client = chromadb.PersistentClient(path="./chroma_db")
embedding_fn = embedding_functions.SentenceTransformerEmbeddingFunction(
    model_name="all-MiniLM-L6-v2"
)

# ── Request models ───────────────────────────────────────────────────
class ChatRequest(BaseModel):
    doc_id: str
    question: str
    chat_history: list = []

class DeleteRequest(BaseModel):
    doc_id: str

# ── Helper: chunk text into smaller pieces ───────────────────────────
def chunk_text(text: str, chunk_size: int = 500, overlap: int = 50):
    """
    Split text into overlapping chunks.
    chunk_size = how many characters per chunk
    overlap = how many characters shared between chunks
    This is the core of RAG — smaller chunks = more precise retrieval
    """
    chunks = []
    start = 0
    while start < len(text):
        end = start + chunk_size
        chunk = text[start:end]
        if chunk.strip():
            chunks.append(chunk)
        start = end - overlap
    return chunks

# ── Helper: extract text from PDF ────────────────────────────────────
def extract_pdf_text(file_path: str) -> str:
    doc = fitz.open(file_path)
    text = ""
    for page in doc:
        text += page.get_text()
    doc.close()
    return text

# ─── ROUTE 1: Upload document ────────────────────────────────────────
@app.post("/upload")
async def upload_document(file: UploadFile = File(...)):
    # Only accept PDFs and text files
    if not file.filename.endswith((".pdf", ".txt")):
        raise HTTPException(status_code=400, detail="Only PDF and TXT files allowed")

    # Save uploaded file temporarily
    with tempfile.NamedTemporaryFile(delete=False, suffix=os.path.splitext(file.filename)[1]) as tmp:
        content = await file.read()
        tmp.write(content)
        tmp_path = tmp.name

    try:
        # Extract text based on file type
        if file.filename.endswith(".pdf"):
            text = extract_pdf_text(tmp_path)
        else:
            with open(tmp_path, "r", encoding="utf-8") as f:
                text = f.read()

        if not text.strip():
            raise HTTPException(status_code=400, detail="Could not extract text from file")

        # Create doc_id from filename (remove spaces)
        import re
        doc_id = file.filename.replace(" ", "_").replace(".", "_")
        doc_id = re.sub(r'[^a-zA-Z0-9_-]', '', doc_id)
        if not doc_id[0].isalnum():
          doc_id = "doc_" + doc_id
        # Delete existing collection if same doc uploaded again
        try:
            chroma_client.delete_collection(doc_id)
        except:
            pass

        # Create a new ChromaDB collection for this document
        collection = chroma_client.create_collection(
            name=doc_id,
            embedding_function=embedding_fn
        )

        # Chunk the text and store in ChromaDB
        chunks = chunk_text(text)
        collection.add(
            documents=chunks,
            ids=[f"{doc_id}_chunk_{i}" for i in range(len(chunks))]
        )

        return {
            "doc_id": doc_id,
            "filename": file.filename,
            "chunks": len(chunks),
            "message": f"Successfully processed {len(chunks)} chunks"
        }

    finally:
        os.unlink(tmp_path)  # Delete temp file


# ─── ROUTE 2: Chat with document ────────────────────────────────────
@app.post("/chat")
async def chat_with_doc(body: ChatRequest):
    try:
        collection = chroma_client.get_collection(
            name=body.doc_id,
            embedding_function=embedding_fn
        )
    except:
        raise HTTPException(status_code=404, detail="Document not found. Please upload first.")

    # Semantic search — find top 3 most relevant chunks
    results = collection.query(
        query_texts=[body.question],
        n_results=min(3, collection.count())
    )

    # Get the relevant chunks
    relevant_chunks = results["documents"][0]
    distances = results["distances"][0]

    # Calculate confidence (lower distance = higher confidence)
    avg_distance = sum(distances) / len(distances)
    confidence = max(0, min(100, int((1 - avg_distance) * 100)))

    # Build context from chunks
    context = "\n\n---\n\n".join(relevant_chunks)

    # Build chat history for multi-turn conversation
    messages = [
        {
            "role": "system",
            "content": f"""You are a helpful document assistant. Answer questions based ONLY on the document context provided below.
If the answer is not in the context, say "I couldn't find that in the document."
Always be concise and accurate.

DOCUMENT CONTEXT:
{context}"""
        }
    ]

    # Add previous chat history
    for msg in body.chat_history[-6:]:  # last 6 messages for context
        messages.append(msg)

    # Add current question
    messages.append({"role": "user", "content": body.question})

    # Call Groq
    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=messages,
        temperature=0.3,  # lower = more factual
        max_tokens=600
    )

    answer = response.choices[0].message.content

    return {
        "answer": answer,
        "confidence": confidence,
        "sources": relevant_chunks,
        "doc_id": body.doc_id
    }


# ─── ROUTE 3: List all uploaded documents ───────────────────────────
@app.get("/documents")
async def list_documents():
    collections = chroma_client.list_collections()
    docs = []
    for col in collections:
        docs.append({
            "doc_id": col.name,
            "filename": col.name.replace("_", " "),
            "chunks": col.count() if hasattr(col, 'count') else 0
        })
    return {"documents": docs}


# ─── ROUTE 4: Delete a document ─────────────────────────────────────
@app.delete("/document")
async def delete_document(body: DeleteRequest):
    try:
        chroma_client.delete_collection(body.doc_id)
        return {"message": "Document deleted successfully"}
    except:
        raise HTTPException(status_code=404, detail="Document not found")


# ─── Health check ────────────────────────────────────────────────────
@app.get("/")
async def root():
    return {"message": "DocuMind RAG API is running!"}