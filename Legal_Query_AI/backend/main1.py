from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import logging
import os
from dotenv import load_dotenv
import uvicorn
from contextlib import asynccontextmanager
from langchain_community.vectorstores import FAISS
from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain.chains import RetrievalQA
from langchain_groq import ChatGroq
from langchain.schema import Document

try:
    from langchain_huggingface import HuggingFaceEmbeddings
    print("Using langchain_huggingface.HuggingFaceEmbeddings")
except ImportError as e:
    print(f"Failed to import from langchain_huggingface: {e}")
    from langchain_community.embeddings import HuggingFaceEmbeddings
    print("Falling back to langchain_community.embeddings.HuggingFaceEmbeddings")


load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Global variables
vector_store = None
llm = None
qa_chain = None

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Lifespan context manager for startup and shutdown events"""
    # Startup
    try:
        logger.info("Initializing Legal Query AI backend...")
        initialize_vector_store()
        logger.info("Vector store loaded successfully")
        
        initialize_llm()
        logger.info("LLM initialized successfully")
        
        initialize_qa_chain()
        logger.info("RAG system initialized successfully")
        
        logger.info("Legal Query AI backend startup complete!")
    except Exception as e:
        logger.error(f"Startup failed: {e}")
        raise e
    
    yield
    
    # Shutdown
    logger.info("Shutting down RAG system")

app = FastAPI(title="Legal Query AI", version="1.0.0", lifespan=lifespan)

# Configure CORS - Allow all origins in development, specific origins in production
# Set ALLOWED_ORIGINS in .env for production (comma-separated)
allowed_origins = os.getenv("ALLOWED_ORIGINS", "*")
if allowed_origins == "*":
    origins = ["*"]
else:
    origins = [origin.strip() for origin in allowed_origins.split(",")]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Enhanced system prompt WITHOUT markdown formatting
SYSTEM_PROMPT = """You are a legal AI assistant providing structured, concise analysis of legal scenarios. 

SCOPE RESTRICTION:
- ONLY answer questions related to the LEGAL sector (law, legal advice, legal procedures, court cases, legal rights, etc.)
- If the user asks anything unrelated to legal matters, respond EXACTLY with: "NON valid prompt"
- Do NOT provide the structured 2-perspective format for non-legal queries
- Do NOT provide any non-legal information or general knowledge
- For non-legal questions, return ONLY the single message "NON valid prompt" with no additional text

INFORMATION SOURCES:
- First, search the provided PDF context for relevant legal information
- If the requested information is NOT found in the PDF, use your general legal knowledge and current legal understanding
- For recent legal developments or specific cases not in the PDF, provide the most accurate legal information available
- Always prioritize accuracy and current legal standards

CRITICAL REQUIREMENTS FOR LEGAL QUERIES ONLY:
- Provide EXACTLY 5 lines of analysis for each perspective
- Each line must be EXACTLY 1 sentence (no more)
- Do NOT use markdown formatting or asterisks
- Be extremely concise and direct
- Use plain text only

FORMAT (EXACTLY 5 LINES PER PERSPECTIVE): 

Perspective 1: Offender
1. Legal Status: [Yes/No] — [Single sentence about legal liability]
2. Under Which Law: [Specific law/section in one sentence]
3. Punishment: [Brief punishment description in one sentence]
4. Reasoning: [Single sentence legal reasoning]
5. Next Steps:
 • [Exactly 4 bullet points with actionable legal steps]
 • [Each bullet point maximum 10-15 words]
 • [Focus on practical legal actions]
 • [Include filing complaints, seeking orders, etc.]

Perspective 2: Victim
1. Legal Protection: [Yes/No] — [Single sentence about available protection]
2. Under Which Law: [Specific law/section in one sentence]
3. Remedies Available: [Brief remedies description in one sentence]
4. Reasoning: [Single sentence legal reasoning]
5. Next Steps:
 • [Exactly 4 bullet points with actionable legal steps]
 • [Each bullet point maximum 10-15 words]
 • [Focus on practical legal actions]
 • [Include filing complaints, seeking orders, etc.]

IMPORTANT: Keep responses concise, practical, focused on actionable legal guidance, and use NO markdown formatting."""

class QueryRequest(BaseModel):
    question: str

class QueryResponse(BaseModel):
    question: str
    offender_perspective: str
    victim_perspective: str

def load_documents():
    """Load and process PDF documents"""
    try:
        documents = []
        # Use absolute path or path relative to the script location
        backend_dir = os.path.dirname(os.path.abspath(__file__))
        pdf_path = os.path.join(backend_dir, "Data", "crpc.pdf")
        
        if os.path.exists(pdf_path):
            logger.info(f"Loading PDF: {pdf_path}")
            loader = PyPDFLoader(pdf_path)
            docs = loader.load()
            documents.extend(docs)
            logger.info(f"Loaded {len(docs)} pages from {pdf_path}")
        else:
            logger.warning(f"PDF file not found: {pdf_path}")
            # Create a dummy document with basic legal information
            dummy_doc = Document(
                page_content="""
                Indian Penal Code and Criminal Procedure Code:
                
                Section 154 CrPC - Information in cognizable cases
                Section 173 CrPC - Report of police officer on completion of investigation
                Section 354C IPC - Voyeurism
                Section 228A IPC - Disclosure of identity of the victim of certain offences
                Section 66E IT Act - Violation of privacy
                Section 67 IT Act - Punishment for publishing or transmitting obscene material
                
                Basic Legal Procedures:
                1. Filing FIR for cognizable offences
                2. Seeking anticipatory bail
                3. Filing civil suit for damages
                4. Seeking restraining orders
                5. Approaching cybercrime cells for online offences
                """,
                metadata={"source": "legal_knowledge_base"}
            )
            documents.append(dummy_doc)
        
        # Split documents into chunks
        text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=1000,
            chunk_overlap=200
        )
        splits = text_splitter.split_documents(documents)
        logger.info(f"Created {len(splits)} text chunks")
        
        return splits
    except Exception as e:
        logger.error(f"Error loading documents: {e}")
        return []

def initialize_vector_store():
    """Initialize the vector store with embeddings"""
    global vector_store
    try:
        documents = load_documents()
        if not documents:
            raise Exception("No documents loaded")
        
        # Initialize embeddings with error handling
        try:
            embeddings = HuggingFaceEmbeddings(
                model_name="sentence-transformers/all-MiniLM-L6-v2"
            )
        except ImportError as e:
            logger.error(f"Failed to import sentence_transformers: {e}")
            logger.info("Please install sentence-transformers: pip install sentence-transformers")
            raise Exception("sentence_transformers package not installed")
        
        # Create vector store
        vector_store = FAISS.from_documents(documents, embeddings)
        logger.info("Vector store initialized successfully")
        
        # Save vector store
        backend_dir = os.path.dirname(os.path.abspath(__file__))
        vector_store_path = os.path.join(backend_dir, "vector_store")
        vector_store.save_local(vector_store_path)
        logger.info("Vector store saved locally")
        
    except Exception as e:
        logger.error(f"Error initializing vector store: {e}")
        # Try to load existing vector store
        try:
            embeddings = HuggingFaceEmbeddings(
                model_name="sentence-transformers/all-MiniLM-L6-v2"
            )
            backend_dir = os.path.dirname(os.path.abspath(__file__))
            vector_store_path = os.path.join(backend_dir, "vector_store")
            vector_store = FAISS.load_local(vector_store_path, embeddings, allow_dangerous_deserialization=True)
            logger.info("Loaded existing vector store")
        except Exception as load_error:
            logger.error(f"Failed to load existing vector store: {load_error}")
            raise e

def initialize_llm():
    """Initialize the language model"""
    global llm
    try:
        groq_api_key = os.getenv("GROQ_API_KEY")
        if not groq_api_key:
            raise ValueError("GROQ_API_KEY not found in environment variables")
        
        # Updated with currently active Groq models (January 2025)
        supported_models = [
            "llama-3.3-70b-versatile",    
            "llama-3.1-8b-instant",       
            "llama3-8b-8192",             
            "mixtral-8x7b-32768",         
            "gemma2-9b-it",               
            "llama3-groq-70b-8192-tool-use-preview"  
        ]
        
        for model in supported_models:
            try:
                llm = ChatGroq(
                    groq_api_key=groq_api_key,
                    model_name=model,
                    temperature=0.1,
                    max_tokens=2048
                )
                
                # Test the model with a simple query
                test_response = llm.invoke("Hello")
                logger.info(f"LLM initialized successfully with model: {model}")
                return  # Exit if successful
                
            except Exception as model_error:
                logger.warning(f"Failed to initialize with model {model}: {model_error}")
                continue
        
        # If all models fail, raise the last error
        raise Exception(f"Failed to initialize with any of the supported models: {supported_models}")
        
    except Exception as e:
        logger.error(f"Error initializing LLM: {e}")
        raise e

def initialize_qa_chain():
    """Initialize the QA chain"""
    global qa_chain
    try:
        if not vector_store or not llm:
            raise Exception("Vector store or LLM not initialized")
        
        # Create retriever
        retriever = vector_store.as_retriever(
            search_type="similarity",
            search_kwargs={"k": 3}
        )
        
        # Create QA chain
        qa_chain = RetrievalQA.from_chain_type(
            llm=llm,
            chain_type="stuff",
            retriever=retriever,
            return_source_documents=False
        )
        logger.info("QA chain initialized successfully")
    except Exception as e:
        logger.error(f"Error initializing QA chain: {e}")
        raise e

def clean_text(text: str) -> str:
    """Remove all markdown formatting from text"""
    if not text:
        return ""
    
    # Remove markdown formatting
    cleaned = text.replace("**", "")  # Remove bold markdown
    cleaned = cleaned.replace("*", "")   # Remove asterisks
    cleaned = cleaned.replace("###", "")  # Remove headers
    cleaned = cleaned.replace("##", "")   # Remove headers
    cleaned = cleaned.replace("#", "")    # Remove headers
    
    # Clean up extra whitespace and line breaks
    lines = [line.strip() for line in cleaned.split('\n') if line.strip()]
    cleaned = '\n'.join(lines)
    
    return cleaned.strip()

def parse_response(response_text: str) -> tuple:
    """Parse the response to extract offender and victim perspectives"""
    try:
        # Clean the response text first
        response_text = clean_text(response_text)
        
        # Split by perspective markers
        parts = response_text.split("Perspective")
        
        offender_perspective = ""
        victim_perspective = ""
        
        for part in parts:
            if "1: Offender" in part:
                # Extract offender perspective
                offender_start = part.find("1: Offender")
                if offender_start != -1:
                    offender_text = part[offender_start:]
                    # Find end of offender section (before Perspective 2)
                    offender_end = offender_text.find("Perspective 2:")
                    if offender_end != -1:
                        offender_perspective = "Perspective " + offender_text[:offender_end].strip()
                    else:
                        offender_perspective = "Perspective " + offender_text.strip()
            
            elif "2: Victim" in part:
                # Extract victim perspective
                victim_start = part.find("2: Victim")
                if victim_start != -1:
                    victim_perspective = "Perspective " + part[victim_start:].strip()
        
        # Fallback parsing if the above doesn't work
        if not offender_perspective or not victim_perspective:
            logger.warning("Primary parsing failed, using fallback method")
            lines = response_text.split('\n')
            current_section = None
            offender_lines = []
            victim_lines = []
            
            for line in lines:
                line = line.strip()
                if "Perspective 1: Offender" in line or "1: Offender" in line:
                    current_section = "offender"
                    offender_lines.append(line)
                elif "Perspective 2: Victim" in line or "2: Victim" in line:
                    current_section = "victim"
                    victim_lines.append(line)
                elif current_section == "offender" and line:
                    offender_lines.append(line)
                elif current_section == "victim" and line:
                    victim_lines.append(line)
            
            if not offender_perspective:
                offender_perspective = '\n'.join(offender_lines)
            if not victim_perspective:
                victim_perspective = '\n'.join(victim_lines)
        
        # Final cleaning of both perspectives
        offender_perspective = clean_text(offender_perspective)
        victim_perspective = clean_text(victim_perspective)
        
        logger.info(f"Parsed offender perspective: {offender_perspective[:100]}...")
        logger.info(f"Parsed victim perspective: {victim_perspective[:100]}...")
        
        return offender_perspective, victim_perspective
        
    except Exception as e:
        logger.error(f"Error parsing response: {e}")
        cleaned_response = clean_text(response_text)
        return cleaned_response, ""

@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "Legal Query AI Backend", 
        "version": "1.0.0",
        "status": "running",
        "features": [
            "RAG-based legal analysis",
            "Dual perspective responses",
            "Structured 5-line format",
            "Indian legal context",
            "Clean text output (no markdown)"
        ]
    }

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    global vector_store, llm, qa_chain
    
    status = {
        "vector_store": vector_store is not None,
        "llm": llm is not None,
        "qa_chain": qa_chain is not None
    }
    
    return {
        "status": "healthy" if all(status.values()) else "unhealthy",
        "components": status
    }

def is_legal_query(question: str) -> bool:
    """
    Use LLM-based semantic classification to determine if query is legal-related.
    This replaces the brittle keyword-matching approach with intelligent context understanding.
    """
    global llm
    
    try:
        if not llm:
            logger.warning("LLM not initialized, cannot classify query")
            return False
        
        # Quick sanity checks for obviously invalid queries
        if len(question.strip()) < 3 or not any(c.isalpha() for c in question):
            return False
        
        # Focused classification prompt for fast, accurate results
        classification_prompt = f"""You are a legal query classifier. Determine if the following question is related to LEGAL matters.

LEGAL topics include: law, legal rights, legal procedures, court cases, contracts, regulations, statutes, legal advice, criminal law, civil law, legal disputes, legal documentation, legal obligations, legal consequences, legal protections, legal remedies, legal processes, lawsuits, legal compliance, etc.

NON-LEGAL topics include: cooking, recipes, food, weather, sports, entertainment, movies, music, technology (non-legal aspects), general knowledge, health (non-malpractice), education (non-legal aspects), shopping, travel, etc.

Question: "{question}"

Respond with ONLY one word - either "YES" if this is a legal query, or "NO" if it is not legal.
Do not provide any explanation, just YES or NO."""

        # Get classification from LLM
        response = llm.invoke(classification_prompt)
        
        # Extract response text
        if hasattr(response, 'content'):
            response_text = response.content.strip().upper()
        else:
            response_text = str(response).strip().upper()
        
        # Parse response - look for YES/NO in the response
        is_legal = "YES" in response_text and "NO" not in response_text
        
        logger.info(f"LLM Classification for '{question[:50]}...': {'LEGAL' if is_legal else 'NON-LEGAL'}")
        
        return is_legal
        
    except Exception as e:
        logger.error(f"Error in LLM-based classification: {e}")
        # Fallback: if LLM fails, reject the query to be safe
        return False

@app.post("/query", response_model=QueryResponse)
async def query_legal_advice(req: QueryRequest):
    """
    Process legal query and return structured advice
    """
    global qa_chain
    
    try:
        if not qa_chain:
            logger.error("QA chain not initialized")
            raise HTTPException(status_code=500, detail="QA chain not initialized")
        
        logger.info(f"Processing query: {req.question}")
        
        # Check if query is legal-related
        if not is_legal_query(req.question):
            logger.info("Non-legal query detected, returning rejection message")
            return QueryResponse(
                question=req.question,
                offender_perspective="NON valid prompt",
                victim_perspective=""
            )
        
        # Create enhanced prompt
        enhanced_prompt = f"""
        {SYSTEM_PROMPT}
        
        Legal Query: {req.question}
        
        Provide a structured legal analysis with exactly 5 lines as specified above. 
        Do NOT use any markdown formatting, asterisks, or special characters.
        Use plain text only.
        """
        
        logger.info("Calling QA chain...")
        
        # Get response from QA chain using the newer invoke method
        try:
            response = qa_chain.invoke({"query": enhanced_prompt})
            if isinstance(response, dict):
                response_text = response.get("result", str(response))
            else:
                response_text = str(response)
        except Exception as invoke_error:
            logger.warning(f"invoke() failed: {invoke_error}, trying run() method")
            # Fallback to run method for older versions
            response_text = qa_chain.run(enhanced_prompt)
        
        logger.info(f"Raw Response (first 200 chars): {response_text[:200]}...")
        
        # Check if AI returned non-legal response
        if "NON valid prompt" in response_text:
            logger.info("AI detected non-legal query, returning rejection message")
            return QueryResponse(
                question=req.question,
                offender_perspective="NON valid prompt",
                victim_perspective=""
            )
        
        # Parse the response and clean it
        logger.info("Parsing and cleaning response...")
        offender_perspective, victim_perspective = parse_response(response_text)
        
        # Ensure we have some content
        if not offender_perspective.strip():
            offender_perspective = "Perspective 1: Offender\nAnalysis not available for this query."
        if not victim_perspective.strip():
            victim_perspective = "Perspective 2: Victim\nAnalysis not available for this query."
        
        logger.info("Query processed successfully")
        
        return QueryResponse(
            question=req.question,
            offender_perspective=offender_perspective,
            victim_perspective=victim_perspective
        )
        
    except HTTPException:
        raise  # Re-raise HTTP exceptions as-is
    except Exception as e:
        logger.error(f"Unexpected error processing query: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Error processing query: {str(e)}")

if __name__ == "__main__":
    # Use PORT from environment variable (for Render deployment) or default to 8003
    port = int(os.getenv("PORT", 8003))
    uvicorn.run(app, host="0.0.0.0", port=port)
