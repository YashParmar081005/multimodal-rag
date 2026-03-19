# 🚀 Multimodal RAG System (PDF + AI Chat)

A **Multimodal Retrieval-Augmented Generation (RAG)** web application where users can upload PDFs and ask questions based on the document content using **OpenRouter (free LLMs like Mistral)**.

---

## 🎯 Features

* 📄 Upload PDF files
* 🧠 Extract text + basic image info
* 🔍 Generate embeddings using SentenceTransformers
* 🗂 Store vectors using FAISS
* 💬 Ask questions about the document
* 🤖 Get AI-generated answers using OpenRouter (free models)
* 🌐 Simple React frontend

---

## 🧠 Tech Stack

### 🔹 Backend

* FastAPI
* PyMuPDF (PDF processing)
* FAISS (Vector DB)
* SentenceTransformers (Embeddings)
* OpenRouter API (Mistral / free models)
* Python-dotenv

### 🔹 Frontend

* React (Vite)
* Axios

---

## 📁 Project Structure

```bash
multimodal-rag/
│
├── backend/
│   ├── main.py
│   ├── rag_pipeline.py
│   ├── config.py
│   ├── requirements.txt
│   ├── .env
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── Upload.jsx
│   │   ├── Chat.jsx
│   ├── package.json
│
└── README.md
```

---

## ⚙️ Backend Setup

### 1️⃣ Create Virtual Environment

```bash
cd backend
python -m venv venv
```

Activate:

**Windows**

```bash
venv\Scripts\activate
```

**Mac/Linux**

```bash
source venv/bin/activate
```

---

### 2️⃣ Install Dependencies

```bash
pip install -r requirements.txt
```

---

### 3️⃣ Setup Environment Variables

Create `.env` file in `backend/`:

```env
OPENROUTER_API_KEY=your_api_key_here
```

---

### 4️⃣ Run Backend Server

```bash
uvicorn main:app --reload
```

Server will run at:

👉 http://127.0.0.1:8000

---

## 🧪 API Testing

Open Swagger UI:

👉 http://127.0.0.1:8000/docs

### Endpoints:

* **POST /upload** → Upload PDF
* **GET /ask?query=...** → Ask question

---

## 🎨 Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at:

👉 http://localhost:5173

---

## 🔍 How It Works

1. User uploads a PDF
2. Backend extracts text + images
3. Text is converted into embeddings
4. Stored in FAISS vector database
5. User asks a question
6. Relevant chunks are retrieved
7. Sent to OpenRouter API
8. AI returns contextual answer

---

## 🧠 RAG Flow

```text
PDF → Text Extraction → Embeddings → FAISS
     → Query → Retrieval → OpenRouter → Answer
```

---

## 🤖 OpenRouter API Integration

Example usage:

```python
import requests
import os

API_KEY = os.getenv("OPENROUTER_API_KEY")

def query_llm(prompt):
    response = requests.post(
        "https://openrouter.ai/api/v1/chat/completions",
        headers={
            "Authorization": f"Bearer {API_KEY}",
            "Content-Type": "application/json"
        },
        json={
            "model": "mistralai/mistral-7b-instruct:free",
            "messages": [
                {"role": "user", "content": prompt}
            ]
        }
    )
    return response.json()["choices"][0]["message"]["content"]
```

---

## ⚠️ Notes

* Do NOT commit `.env` file
* Free models have rate limits (~50 requests/day)
* Some models may be slow or temporarily unavailable

---

## 🚀 Future Improvements

* 🔥 Chat history (memory)
* 📌 Highlight answers in PDF
* 🖼 Real image understanding
* ⚡ Streaming responses (ChatGPT-like)
* ☁️ Deployment (Vercel + Render)

---

## 🤝 Contributing

Pull requests are welcome!
For major changes, open an issue first.

---

## 📜 License

This project is open-source and free to use.

---

## 💡 Author

Built with ❤️ by Yash (yashu 🚀)
