# Legal Query AI 🏛️

A comprehensive legal intelligence system that leverages RAG (Retrieval-Augmented Generation) technology to provide dual-perspective legal analysis, document processing, and intelligent query handling.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [Project Structure](#project-structure)
- [Troubleshooting](#troubleshooting)

## ✨ Features

- **Dual-Perspective Legal Analysis**: Get insights from both offender and victim perspectives
- **RAG-Powered System**: Retrieves relevant legal information from documents using FAISS vector store
- **LLM-Based Query Classification**: Intelligent semantic classification of legal vs non-legal queries
- **Document Analysis**: Upload and analyze legal documents (PDF, DOCX, TXT)
- **Indian Legal Framework**: Specialized knowledge of Indian Penal Code (IPC) and CrPC
- **Real-time Processing**: Fast response times with Groq LLM integration
- **Professional UI**: Modern, responsive interface with Tailwind CSS

## 🛠️ Tech Stack

### Frontend
- **React 19** - UI library
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **Lucide React** - Icon library

### Backend
- **FastAPI** - Modern Python web framework
- **LangChain** - LLM orchestration framework
- **FAISS** - Vector database for semantic search
- **Groq** - Fast LLM inference
- **HuggingFace Embeddings** - Text embeddings for RAG
- **PyPDF2 & python-docx** - Document processing

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **Python** (v3.8 or higher) - [Download](https://www.python.org/downloads/)
- **npm** or **yarn** - Comes with Node.js
- **Git** - [Download](https://git-scm.com/)
- **Groq API Key** - [Get your API key](https://console.groq.com/)

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/Nithish-1622/Legal_Querry_AI_1.git
cd Legal_Querry_AI_1
```

### 2. Backend Setup

#### Step 1: Navigate to Backend Directory

```bash
cd Legal_Query_AI/backend
```

#### Step 2: Create Virtual Environment

**Windows (PowerShell):**
```powershell
python -m venv venv
.\venv\Scripts\Activate.ps1
```

**macOS/Linux:**
```bash
python3 -m venv venv
source venv/bin/activate
```

#### Step 3: Install Python Dependencies

```bash
pip install --upgrade pip
pip install -r requirements.txt
```

**Required packages include:**
- fastapi==0.104.1
- uvicorn[standard]==0.24.0
- langchain-community
- langchain-groq
- langchain-huggingface
- python-dotenv==1.0.0
- faiss-cpu
- sentence-transformers
- PyPDF2
- python-docx

#### Step 4: Create Environment Variables

Create a `.env` file in the `backend` directory:

```bash
# Create .env file
touch .env  # macOS/Linux
# OR
New-Item .env  # Windows PowerShell
```

Add the following content to `.env`:

```env
# Groq API Configuration
GROQ_API_KEY=your_groq_api_key_here

# Server Configuration
HOST=0.0.0.0
PORT=8003
```

**⚠️ Important:** Replace `your_groq_api_key_here` with your actual Groq API key.

#### Step 5: Verify Backend Installation

```bash
python main1.py
```

You should see output like:
```
INFO:     Started server process
INFO:     Waiting for application startup.
INFO:     Application startup complete.
INFO:     Uvicorn running on http://0.0.0.0:8003
```

Stop the server with `Ctrl+C`.

### 3. Frontend Setup

#### Step 1: Navigate to Root Directory

```bash
cd ../..  # Go back to project root
```

#### Step 2: Install Node Dependencies

```bash
npm install
```

This will install all required dependencies including:
- React 19
- React Router DOM
- Tailwind CSS
- Lucide React icons
- HTML2Canvas & jsPDF for document generation

#### Step 3: Verify Frontend Installation

```bash
npm run dev
```

You should see:
```
VITE v5.x.x  ready in xxx ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

## ⚙️ Configuration

### Backend Configuration

The backend uses `.env` file for configuration. Key settings:

- **GROQ_API_KEY**: Your Groq API key for LLM access
- **PORT**: Backend server port (default: 8003)

### Frontend Configuration

Update API endpoint in `src/config/api.js`:

```javascript
const API_BASE_URL = 'http://localhost:8003';
```

## 🏃 Running the Application

### Development Mode

#### 1. Start Backend Server

Open a terminal and run:

```bash
cd Legal_Query_AI/backend
# Activate virtual environment
.\venv\Scripts\Activate.ps1  # Windows
# OR
source venv/bin/activate      # macOS/Linux

# Start server
python main1.py
```

Backend will run on: `http://localhost:8003`

#### 2. Start Frontend Development Server

Open a **new terminal** and run:

```bash
# From project root
npm run dev
```

Frontend will run on: `http://localhost:5173`

#### 3. Access the Application

Open your browser and navigate to:
```
http://localhost:5173
```

### Production Build

#### Build Frontend

```bash
npm run build
```

This creates an optimized production build in the `dist` folder.

#### Preview Production Build

```bash
npm run preview
```

## 📁 Project Structure

```
Legal_Querry_AI_1/
├── Legal_Query_AI/
│   └── backend/
│       ├── Data/
│       │   └── crpc.pdf           # Legal documents for RAG
│       ├── vector_store/          # FAISS vector database
│       ├── main1.py               # Main backend application
│       ├── requirements.txt       # Python dependencies
│       ├── .env                   # Environment variables (create this)
│       └── README.md
│
├── src/
│   ├── assets/                    # Images and static files
│   ├── config/
│   │   └── api.js                 # API configuration
│   ├── pages/
│   │   ├── ChatBot.jsx            # Main chat interface
│   │   ├── IBMBot.jsx             # Document analyzer
│   │   ├── DashBoard.jsx          # Dashboard
│   │   └── ...
│   ├── Routes/
│   │   └── AllRoutes.jsx          # React Router configuration
│   ├── App.jsx                    # Main App component
│   ├── main.jsx                   # Entry point
│   └── index.css                  # Global styles
│
├── ClauseWise/
│   └── main.py                    # Document analyzer backend
│
├── package.json                   # Node dependencies
├── vite.config.js                 # Vite configuration
├── tailwind.config.js             # Tailwind configuration
└── README.md                      # This file
```

## 🔧 Troubleshooting

### Common Issues

#### 1. Backend Port Already in Use

**Error:** `[Errno 10048] Address already in use`

**Solution:**
```bash
# Windows - Find and kill process on port 8003
netstat -ano | findstr :8003
taskkill /PID <PID> /F

# macOS/Linux
lsof -ti:8003 | xargs kill -9
```

Or change the port in `main1.py`:
```python
uvicorn.run(app, host="0.0.0.0", port=8004)  # Use different port
```

#### 2. Module Not Found Errors

**Solution:**
```bash
# Ensure virtual environment is activated
# Windows
.\venv\Scripts\Activate.ps1

# macOS/Linux
source venv/bin/activate

# Reinstall dependencies
pip install -r requirements.txt
```

#### 3. Groq API Key Invalid

**Error:** `Authentication failed`

**Solution:**
- Verify your API key in `.env` file
- Get a new key from [Groq Console](https://console.groq.com/)
- Ensure no extra spaces in the `.env` file

#### 4. CORS Errors

**Solution:** Backend already configured for CORS. If issues persist, check that:
- Backend is running on port 8003
- Frontend is accessing correct API URL
- No browser extensions blocking requests

#### 5. Vector Store Not Loading

**Solution:**
```bash
cd Legal_Query_AI/backend
# Delete existing vector store
rm -rf vector_store  # macOS/Linux
Remove-Item -Recurse vector_store  # Windows

# Restart backend - it will recreate the vector store
python main1.py
```

### Getting Help

If you encounter issues:

1. Check the browser console (F12) for frontend errors
2. Check terminal output for backend errors
3. Ensure all dependencies are installed
4. Verify API keys and environment variables
5. Check that both servers are running

## 📝 License

This project is part of an academic/research initiative for legal technology advancement.

## 👥 Contributors

- Nithish S - [GitHub](https://github.com/Nithish-1622)

## 🌟 Acknowledgments

- Groq for fast LLM inference
- LangChain for RAG framework
- FastAPI for backend framework
- React and Vite communities

---

**⚖️ Legal Disclaimer:** This system is for informational purposes only and should not be considered as legal advice. Always consult with a qualified legal professional for specific legal matters.