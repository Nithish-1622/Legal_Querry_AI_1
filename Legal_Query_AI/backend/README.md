# Legal Query AI - Backend

This is the FastAPI backend for the Legal Query AI application.

## Setup Instructions

### 1. Navigate to Backend Directory
```bash
cd K:\grok\Legal_Query_AI\backend
```

### 2. Install Dependencies
```bash
pip install -r requirements.txt
```

### 3. Environment Variables
Edit the `.env` file and add your API keys:
- `TAVILY_API_KEY`: Your Tavily API key for news search
- `NEWS_API_KEY`: Your NewsAPI key (optional)

### 4. Start the Server

#### Option 1: Using the batch file (Windows)
```bash
start.bat
```

#### Option 2: Manual start
```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8002
```

## API Endpoints

### Legal Query
- **POST** `/query`
- Body: `{"question": "Your legal question"}`
- Returns structured legal advice with perspectives

### News Feed
- **GET** `/legal-news?count=5`
- Returns mock legal news articles
- **GET** `/news?count=5`
- Returns news from NewsAPI (if API key provided)

### Health Check
- **GET** `/`
- Returns server status

## Testing

Once the server is running, you can test it at:
- Backend API: http://localhost:8002
- API Documentation: http://localhost:8002/docs
- Alternative docs: http://localhost:8002/redoc

## File Structure

```
backend/
├── main.py           # Main FastAPI application
├── news_feed.py      # News API endpoints
├── requirements.txt  # Python dependencies
├── .env             # Environment variables
├── start.bat        # Windows startup script
└── README.md        # This file
```

## Notes

- The backend currently returns mock responses for legal queries
- Mock news data is provided if no API keys are configured
- CORS is enabled for all origins (configure for production)
- Server runs on port 8002 by default
