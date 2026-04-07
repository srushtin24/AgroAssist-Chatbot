import os
from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional
from dotenv import load_dotenv
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_community.vectorstores import Chroma
from langchain_groq import ChatGroq
from langchain_core.messages import HumanMessage, SystemMessage

load_dotenv()

router = APIRouter()

CHROMA_DIR = "chroma_db"

embeddings = HuggingFaceEmbeddings(
    model_name="sentence-transformers/all-MiniLM-L6-v2"
)
vectorstore = Chroma(
    persist_directory=CHROMA_DIR,
    embedding_function=embeddings
)
llm = ChatGroq(
    groq_api_key=os.getenv("GROQ_API_KEY"),
    model_name="llama-3.3-70b-versatile",
    temperature=0.2,
    max_tokens=512
)

session_store: dict = {}

class ChatRequest(BaseModel):
    session_id: str
    message: str

class ChatResponse(BaseModel):
    reply: str
    sources: list

SYSTEM_PROMPT = """You are AgroAssist, a smart farming assistant for Indian farmers.
Answer questions about plant diseases, remedies, fertilizers, and farming practices
using only the provided context from the knowledge base.
If the context does not contain enough information, say so honestly.
Be concise, practical, and easy to understand."""

@router.post("/chat", response_model=ChatResponse)
async def chat(req: ChatRequest):
    relevant_docs = vectorstore.similarity_search(req.message, k=4)

    context = "\n\n".join([doc.page_content for doc in relevant_docs])
    sources = list({doc.metadata.get("source_file", "") for doc in relevant_docs})

    history = session_store.get(req.session_id, [])
    messages = [SystemMessage(content=SYSTEM_PROMPT)]
    messages.extend(history[-10:])

    user_msg = f"""Context from plant knowledge base:
{context}

User question: {req.message}"""

    messages.append(HumanMessage(content=user_msg))

    response = llm.invoke(messages)
    reply = response.content

    if req.session_id not in session_store:
        session_store[req.session_id] = []
    session_store[req.session_id].append(HumanMessage(content=req.message))
    session_store[req.session_id].append(response)

    return ChatResponse(reply=reply, sources=[s for s in sources if s])