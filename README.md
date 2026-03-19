# Multimodal RAG Application

A complete production-ready Multimodal RAG system allowing users to upload PDFs and ask questions using the Mistral AI API.

## Features
- Fully responsive and aesthetic React/Vite frontend (TailwindCSS)
- FastAPI backend router with endpoints for uploading and asking
- PyMuPDF wrapper for text extraction and image detection
- Local FAISS vector storage combined with `sentence-transformers`
- RAG generation empowered by Mistral AI (`mistral-small`)

## Quickstart

### 1. Setup Backend

1. Navigate to the backend directory and create a virtual environment:
   ```bash
   cd backend
   python -m venv venv
   
   # Activate on Windows:
   venv\Scripts\activate
   
   # Activate on Mac/Linux:
   # source venv/bin/activate
   ```

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Setup environment variables by creating a `.env` file in the `backend/` directory:
   ```
   OPENROUTER_API_KEY=your_openrouter_key_here
   ```

4. Run the FastAPI server:
   ```bash
   uvicorn main:app --reload
   ```

### 2. Setup Frontend

1. Navigate to the frontend directory and install dependencies:
   ```bash
   cd frontend
   npm install
   ```

2. Start the Vite React development server:
   ```bash
   npm run dev
   ```

3. Open your browser and navigate to the local URL provided in your terminal (usually `http://localhost:5173`).
