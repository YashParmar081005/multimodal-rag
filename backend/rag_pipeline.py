import fitz  # PyMuPDF
from sentence_transformers import SentenceTransformer
import faiss
import numpy as np
from config import OPENROUTER_API_KEY
import os
from openai import OpenAI

print("Loading sentence-transformers model...")
embedder = SentenceTransformer('all-MiniLM-L6-v2')
embedding_dim = embedder.get_sentence_embedding_dimension()

index = faiss.IndexFlatL2(embedding_dim)
document_chunks = []

def extract_pdf(file_path: str):
    doc = fitz.open(file_path)
    extracted_texts = []
    
    for page_num in range(len(doc)):
        page = doc[page_num]
        
        text = page.get_text()
        if text.strip():
            # Combine page text and chunk it roughly by 1000 characters
            # This massively reduces processing time compared to tiny paragraphs
            page_text = text.replace('\n', ' ').strip()
            chunk_size = 1000
            chunks = [page_text[i:i+chunk_size] for i in range(0, len(page_text), chunk_size)]
            extracted_texts.extend(chunks)

        images = page.get_images(full=True)
        if images:
            for _ in images:
                extracted_texts.append("[Image detected]")
                
    doc.close()
    return extracted_texts

def create_embeddings(texts: list) -> int:
    global document_chunks
    if not texts:
        return 0
        
    # Increasing batch size speeds up the encoding massively for large sets of chunks
    embeddings = embedder.encode(texts, batch_size=64, show_progress_bar=False)
    document_chunks.extend(texts)
    index.add(np.array(embeddings).astype("float32"))
    
    return len(texts)

def query_rag_stream(query: str):
    if index.ntotal == 0:
        yield "Please upload a document before asking a question."
        return
        
    q_embedding = embedder.encode([query])
    k = min(3, index.ntotal)
    distances, indices = index.search(np.array(q_embedding).astype("float32"), k)
    
    retrieved_chunks = [document_chunks[idx] for idx in indices[0] if idx < len(document_chunks)]
    context = "\n---\n".join(retrieved_chunks)
    
    prompt = f"Answer ONLY using the provided context.\n\nContext:\n{context}\n\nQuestion:\n{query}"

    try:
        if not OPENROUTER_API_KEY or OPENROUTER_API_KEY == "your_openrouter_key_here":
            yield "Server Error: OpenRouter API Key is missing. Please configure backend/.env"
            return
            
        client = OpenAI(
            base_url="https://openrouter.ai/api/v1",
            api_key=OPENROUTER_API_KEY,
        )
        response = client.chat.completions.create(
            model="openrouter/free",
            messages=[
                {"role": "user", "content": prompt}
            ],
            stream=True
        )
        for chunk in response:
            if chunk.choices[0].delta.content is not None:
                yield chunk.choices[0].delta.content
    except Exception as e:
        yield f"\n\nError interacting with OpenRouter API: {str(e)}"

def clear_index():
    global index, document_chunks
    index = faiss.IndexFlatL2(embedding_dim)
    document_chunks = []
