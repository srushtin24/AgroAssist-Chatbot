# AgroAssist Chatbot : RAG-Based Smart Farming Assistant

An end-to-end **Retrieval-Augmented Generation (RAG)** conversational AI system designed to deliver **context-aware, reliable, and explainable agricultural assistance**.

The AgroAssist Chatbot enables users to ask questions about **plant diseases, remedies, fertilizers, and farming practices**, leveraging a domain-specific knowledge base and large language models.


## 🚀 Features

🔍 Semantic search over agricultural knowledge base  
🤖 Context-aware responses using LLaMA 3 (via Groq)  
📄 Source attribution for transparency  
🧠 Session-based conversational memory  
🎤 Voice input (Speech-to-Text)  
🔊 Voice output (Text-to-Speech)  
⚡ Low-latency inference pipeline  
🌐 Interactive web-based chatbot UI  


## 🏗️ Architecture
User (Web UI)<br>
↓<br>
Frontend (HTML/CSS/JS + Voice)<br>
↓<br>
FastAPI Backend<br>
↓<br>
RAG Pipeline<br>
├── Embeddings (MiniLM)<br>
├── Vector DB (ChromaDB)<br>
└── LLM (LLaMA 3 via Groq)<br>
↓<br>
Response + Sources<br>


## 🔄 Workflow

### 1. Knowledge Base Ingestion
- Load agricultural PDFs using PyMuPDF  
- Split text into chunks (RecursiveCharacterTextSplitter)  
- Generate embeddings using MiniLM  
- Store vectors in ChromaDB  

### 2. Query Processing
- User sends query via frontend  
- Backend receives request through FastAPI (`/api/chat`)  

### 3. Semantic Retrieval
- Query is embedded  
- Top-k relevant chunks retrieved from vector database  

### 4. Context-Grounded Generation
- Retrieved context injected into prompt  
- LLM generates response using:
  - Context  
  - User query  
  - Conversation history  

### 5. Response Delivery
- Returns answer + source documents  
- Displayed in UI (with optional voice output)  


## 🧰 Tech Stack

### AI / ML
- LangChain  
- Sentence Transformers (all-MiniLM-L6-v2)  
- LLaMA 3 (Groq API)  

### Backend
- FastAPI
- Pydantic

### Vector Database
- ChromaDB

### Frontend
- HTML, CSS, JavaScript

### Speech
- Web Speech API (STT + TTS)


## 💡 Design Decisions
- **RAG over Fine-Tuning** → Dynamic and cost-efficient  
- **Context Restriction Prompting** → Reduces hallucinations  
- **Lightweight Embeddings (MiniLM)** → Fast and efficient  
- **Source Attribution** → Improves trust  
- **Groq Inference** → Low-latency responses  

## 🔮 Future Improvements
- Hybrid search (semantic + keyword)  
- Persistent memory (Redis / DB)  
- Real-time data integration  
- Response streaming  
- Guardrails / moderation layer  
- Multilingual support  

## 📌 Use Case

Designed for farmers and agricultural stakeholders to:

- Diagnose plant diseases  
- Get actionable remedies  
- Access reliable farming knowledge  
- Interact via voice  
