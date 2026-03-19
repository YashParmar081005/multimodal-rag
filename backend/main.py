from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import shutil
import os
from rag_pipeline import extract_pdf, create_embeddings, query_rag_stream, clear_index
from fastapi.responses import StreamingResponse

app = FastAPI(title="Multimodal RAG API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@app.post("/upload")
async def upload_document(file: UploadFile = File(...)):
    if not file.filename.endswith('.pdf'):
        raise HTTPException(status_code=400, detail="Only PDF files are allowed")
        
    file_path = os.path.join(UPLOAD_DIR, file.filename)
    
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    try:
        clear_index()
        texts = extract_pdf(file_path)
        chunks_added = create_embeddings(texts)
        
        return {"message": "Document processed and embedded successfully", "chunks_processed": chunks_added}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
        
@app.get("/ask")
async def ask_question(query: str):
    if not query:
        raise HTTPException(status_code=400, detail="Query string is empty")
        
    return StreamingResponse(query_rag_stream(query), media_type="text/plain")

@app.delete("/clear")
async def clear_document():
    clear_index()
    return {"message": "Document cleared successfully"}
