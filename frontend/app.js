const API_URL = 'http://127.0.0.1:8000';
const documentsList = document.getElementById('documents-list');

const dropArea = document.getElementById('drop-area');
const fileInput = document.getElementById('pdf-upload');
const uploadStatus = document.getElementById('upload-status');
const queryInput = document.getElementById('query-input');
const askBtn = document.getElementById('ask-btn');
const loadingSpinner = document.getElementById('loading-spinner');
const responseContainer = document.getElementById('response-container');
const answerText = document.getElementById('answer-text');
const sourcesList = document.getElementById('sources-list');

// File Upload Handling
dropArea.addEventListener('click', () => fileInput.click());

dropArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropArea.style.backgroundColor = '#eff6ff';
});

dropArea.addEventListener('dragleave', () => {
    dropArea.style.backgroundColor = '';
});

dropArea.addEventListener('drop', (e) => {
    e.preventDefault();
    dropArea.style.backgroundColor = '';
    const files = e.dataTransfer.files;
    if (files.length) handleUpload(files[0]);
});

fileInput.addEventListener('change', () => {
    if (fileInput.files.length) handleUpload(fileInput.files[0]);
});

async function handleUpload(file) {
    if (file.type !== 'application/pdf') {
        showStatus('Please upload a valid PDF file.', 'error');
        return;
    }

    const formData = new FormData();
    formData.append('file', file);

    showStatus('Uploading and processing... This may take a while.', 'info');

    try {
        const response = await fetch(`${API_URL}/upload`, {
            method: 'POST',
            body: formData
        });

        if (!response.ok) throw new Error('Upload failed');

        const data = await response.json();
        showStatus(`Success! Processed ${data.chunks} chunks. You can now ask questions.`, 'success');
        enableChat();
        fetchDocuments(); // Refresh list
    } catch (error) {
        showStatus('Error uploading file: ' + error.message, 'error');
        console.error(error);
    }
}

function showStatus(msg, type) {
    uploadStatus.textContent = msg;
    uploadStatus.className = 'status-msg ' + type;
}

function enableChat() {
    queryInput.disabled = false;
    askBtn.disabled = false;
    queryInput.focus();
}

// Q&A Handling
// Q&A Handling
askBtn.addEventListener('click', handleQuery);
queryInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleQuery();
    }
});

async function handleQuery() {
    const question = queryInput.value.trim();
    if (!question) return;

    // Reset UI
    responseContainer.classList.add('hidden');
    loadingSpinner.classList.remove('hidden');
    askBtn.disabled = true;
    queryInput.disabled = true;

    try {
        const response = await fetch(`${API_URL}/query`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ question })
        });

        if (!response.ok) throw new Error('Query failed');

        const data = await response.json();
        const formattedAnswer = marked.parse(data.answer);
        displayResult(formattedAnswer, data.sources);
    } catch (error) {
        alert('Error getting answer: ' + error.message);
    } finally {
        loadingSpinner.classList.add('hidden');
        askBtn.disabled = false;
        queryInput.disabled = false;
        queryInput.focus();
    }
}

function displayResult(answer, sources) {
    answerText.innerHTML = answer;

    sourcesList.innerHTML = '';

    // Unique sources
    const uniqueSources = new Set();

    sources.forEach(src => {
        const key = `${src.source}_${src.page}`;
        if (!uniqueSources.has(key)) {
            uniqueSources.add(key);
            const li = document.createElement('li');
            li.textContent = `${src.source} (Page ${src.page})`;
            sourcesList.appendChild(li);
        }
    });

    responseContainer.classList.remove('hidden');
    responseContainer.classList.remove('hidden');
}

// Document Management
async function fetchDocuments() {
    try {
        const response = await fetch(`${API_URL}/documents`);
        if (!response.ok) return;
        const docs = await response.json();
        renderDocumentsList(docs);
    } catch (error) {
        console.error("Error fetching documents:", error);
    }
}

function renderDocumentsList(docs) {
    documentsList.innerHTML = '';
    if (docs.length === 0) {
        documentsList.innerHTML = '<li>No documents uploaded.</li>';
        return;
    }

    // Enable chat if documents exist
    enableChat();

    docs.forEach(doc => {
        const li = document.createElement('li');
        li.className = 'document-item';
        li.style.display = 'flex';
        li.style.justifyContent = 'space-between';
        li.style.alignItems = 'center';
        li.style.marginBottom = '0.5rem';

        const span = document.createElement('span');
        span.textContent = doc;

        const delBtn = document.createElement('button');
        delBtn.textContent = 'Delete';
        delBtn.style.marginLeft = '1rem';
        delBtn.style.padding = '0.2rem 0.5rem';
        delBtn.style.background = '#ff4d4f';
        delBtn.style.color = 'white';
        delBtn.style.border = 'none';
        delBtn.style.borderRadius = '4px';
        delBtn.style.cursor = 'pointer';
        delBtn.onclick = () => deleteDocument(doc);

        li.appendChild(span);
        li.appendChild(delBtn);
        documentsList.appendChild(li);
    });
}

async function deleteDocument(filename) {
    if (!confirm(`Are you sure you want to delete ${filename}?`)) return;

    try {
        const response = await fetch(`${API_URL}/documents/${filename}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            alert(`Deleted ${filename}`);
            fetchDocuments();
            // Clear result container if deleting (optional, but good UX)
            responseContainer.classList.add('hidden');
        } else {
            alert('Failed to delete document');
        }
    } catch (error) {
        console.error("Error deleting document:", error);
        alert("Error deleting document");
    }
}

// Initial Fetch
fetchDocuments();
