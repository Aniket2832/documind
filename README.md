# 🧠 DocuMind — Chat with Your Documents

A RAG-powered document intelligence app built with React, FastAPI, and ChromaDB.

## What it does
- Upload any PDF or TXT document
- Ask questions in plain English
- AI answers ONLY from your document — no hallucinations
- See source chunks and confidence score for every answer
- Multi-document support with persistent chat history

## Tech Stack
- **Frontend:** React + Vite
- **Backend:** Python + FastAPI
- **Vector DB:** ChromaDB (local)
- **Embeddings:** Sentence Transformers (all-MiniLM-L6-v2)
- **LLM:** Groq API (LLaMA 3.3 70B)
- **PDF Parsing:** PyMuPDF

## Getting Started

### Backend
```bash
cd backend
python -m venv venv
venv\Scripts\activate  # Windows
pip install fastapi uvicorn groq python-dotenv chromadb sentence-transformers pymupdf python-multipart
```
Create `.env` in `/backend`:
```
GROQ_API_KEY=your_groq_api_key
```
```bash
uvicorn main:app --reload
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173`

## Demo
![DocuMind Demo](assets/demo.gif)