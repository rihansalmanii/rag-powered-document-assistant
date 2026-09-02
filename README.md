# DocLens 📄

**DocLens** is an AI-powered PDF assistant that allows users to upload documents and ask questions about their content using natural language. 

The application uses **Retrieval-Augmented Generation (RAG)** to retrieve relevant information from uploaded PDFs and provide that context to an LLM for document-grounded response generation.

## ✨ Features

- Upload and interact with PDF documents
- AI-powered document question answering
- Semantic search using vector embeddings
- Retrieval-Augmented Generation (RAG)
- Persistent conversation history
- Follow-up question support
- JWT-based authentication with HTTP-only cookies
- User-specific document and conversation management

## 🧠 How It Works

```text
PDF Upload
    ↓
Text Extraction (PyPDF)
    ↓
Text Chunking
    ↓
BGE Embeddings
    ↓
Qdrant Vector Database
    ↑
    │
User Question
    ↓
Query Embedding
    ↓
Semantic Search
    ↓
Top-K Relevant Chunks
    ↓
Context Augmentation
    ↓
GPT-OSS-20B via Groq
    ↓
Generated Answer
```

### RAG Pipeline

1. **Extraction** — PyPDF extracts machine-readable text from the uploaded PDF.
2. **Chunking** — Text is divided into overlapping chunks for retrieval.
3. **Embedding** — `BAAI/bge-base-en-v1.5` converts chunks into 768-dimensional semantic embeddings.
4. **Vector Storage** — Embeddings are indexed in Qdrant with document/user metadata.
5. **Retrieval** — The user's question is embedded and Qdrant retrieves the most relevant document chunks.
6. **Generation** — Retrieved context and the question are supplied to `GPT-OSS-20B` through Groq to generate the final response.

Current retrieval configuration:

```text
Chunk Size       : 300 characters
Chunk Overlap    : 50 characters
Top-K            : 5
Score Threshold  : 0.46
```

## 🛠️ Tech Stack

**Frontend**
- React.js
- Tailwind CSS
- Axios

**Backend**
- Python
- FastAPI

**AI / RAG**
- BAAI/bge-base-en-v1.5
- Sentence Transformers
- Qdrant
- GPT-OSS-20B
- Groq API

**Database & Storage**
- MongoDB
- Supabase Storage

**Other**
- PyPDF
- JWT Authentication
- Postman
- Swagger UI
- Git & GitHub

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/rihansalmanii/rag-powered-document-assistant.git
cd rag-powered-document-assistant
```

### 2. Backend

```bash
cd backend

python -m venv venv
```

Activate the virtual environment:

**Windows**

```bash
.\venv\Scripts\activate
```

**Linux/macOS**

```bash
source venv/bin/activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Create a `.env` file and configure the required MongoDB, Supabase, Qdrant, Groq and JWT credentials.

Run the backend:

```bash
uvicorn main:app --reload
```

Backend:

```text
http://127.0.0.1:8000
```

Swagger:

```text
http://127.0.0.1:8000/docs
```

### 3. Frontend

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

The application will normally run at:

```text
http://localhost:5173
```

##  Current Limitations

- One PDF per conversation
- Limited support for scanned/image-only PDFs
- Limited interpretation of images, diagrams and complex tables
- Broad document summaries may miss sections when using Top-K retrieval

## 🔮 Future Scope

- Multi-PDF conversations
- OCR and multimodal PDF processing
- Hybrid search and retrieval reranking
- Page-level source citations
- Improved whole-document summarization
- Text-to-Speech responses

## 👥 Contributors

**Mohammad Rihan Salmani**  
Backend, database design, PDF processing, embeddings, vector integration, semantic retrieval, RAG/LLM integration, authentication and frontend-backend integration.

**Himanshu Singh**  
Frontend layout, PDF upload/chat interface, conversation-history UI and API/UI testing.

---

Built as an exploration of **Retrieval-Augmented Generation, semantic search, vector databases and full-stack AI application development.**
