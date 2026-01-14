# DocQuery - Large-Document PDF Question Answering System

DocQuery is a Retrieval-Augmented Generation (RAG) system that allows users to upload large PDF documents and ask natural language questions. It uses **Google Gemini** for embeddings and answer generation, and **FAISS** for efficient vector storage and retrieval.

## Features
- **PDF Ingestion**: Supports uploading single or multiple PDFs.
- **Semantic Chunking**: Intelligent splitting of text to preserve context.
- **Vector Search**: Fast similarity search using FAISS.
- **Citation-Backed Answers**: Answers include the specific source document and page number.
- **Simple UI**: Clean, single-page interface build with Vanilla JS.

## Tech Stack
- **Backend**: Python, FastAPI, Uvicorn
- **AI/ML**: LangChain, Google Gemini (Embeddings + LLM - gemini-flash-latest), FAISS
- **Frontend**: HTML5, CSS3, Vanilla JavaScript

## Project Structure
```
DocQuery/
├── backend/
│   ├── main.py             # FastAPI App & Endpoints
│   ├── config.py           # Configuration
│   ├── ingestion/          # PDF Loading
│   ├── splitting/          # Text Chunking
│   ├── vector_store/       # FAISS Index Management
│   ├── retrieval/          # Semantic Search
│   └── generation/         # LLM Integration
│   └── requirements.txt    # Dependencies
└── frontend/
    ├── index.html          # UI entry point
    ├── style.css           # Styling
    └── app.js              # Frontend Logic
```

## Setup Instructions

### Prerequisites
- Python 3.9+
- A Google Cloud API Key with access to Gemini API.

### 1. Clone/Navigate to Repo
```bash
cd DocQuery
```

### 2. Backend Setup
Create a virtual environment and install dependencies:

**macOS / Linux:**
```bash
python3 -m venv venv
source venv/bin/activate
pip install -r backend/requirements.txt
```

**Windows:**
```powershell
python -m venv venv
venv\Scripts\activate
pip install -r backend/requirements.txt
```

### 3. Environment Configuration
Create a `.env` file from the example and set your Google API Key:

**macOS / Linux / Windows:**
```bash
cp backend/.env.example backend/.env
# Edit backend/.env and paste your GOOGLE_API_KEY
```


### 4. Run the Backend
Start the FastAPI server:
```bash
uvicorn backend.main:app --reload
```
**Alternatively, use the helper script:**
```bash
./run.sh
```
The API will run at `http://127.0.0.1:8000`.

### 5. Run the Frontend
Simply open `frontend/index.html` in your web browser.
You can also serve it using a simple HTTP server:

**macOS / Linux / Windows:**
```bash
cd ../frontend
python3 -m http.server 3000
```
Then visit `http://localhost:3000`.

## Usage
1. Open the UI.
2. Drag & Drop a PDF file into the upload area.
3. Wait for the success message (processing embeddings).
4. Type your question in the text box and click "Ask".
5. View the answer and the cited sources.

## Limitations
- **Local FAISS Index**: The vector store is saved locally to disk (`faiss_index` folder). In a production environment, this should be a persisted database like PGVector or Pinecone.
- **Statelessness**: The chat history is not preserved in a session window; each question is treated independently (though context retrieval helps).

## Future Improvements
- Add support for Chat History (Contextual RAG).
- Implement streaming responses for lower latency perception.
- Add support for other file formats (DOCX, TXT).

## Usage Demo

### 1. Upload Interface
![Upload UI](assets/1_upload_ui.png)

### 2. Document Processing
![Upload Success](assets/2_upload_success.png)

### 3. Q&A Result
![QA Result](assets/3_qa_result.png)
