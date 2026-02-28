from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import PyPDF2
from docx import Document
import tempfile
import os
import uuid
import io
from typing import Dict, List, Optional
from datetime import datetime
import json
import logging
import re

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="Legal Document Analyzer", version="1.0.0")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models
class QuestionRequest(BaseModel):
    question: str
    document_id: str

class DocumentResponse(BaseModel):
    document_id: str
    filename: str
    summary: dict

class QuestionResponse(BaseModel):
    answer: str
    relevant_sections: List[str]
    confidence_score: float

# In-memory storage for documents
documents_store: Dict[str, Dict] = {}

# Free AI-powered text processing using rule-based approaches and simple heuristics
class FreeTextAnalyzer:
    def __init__(self):
        # Legal document keywords and patterns
        self.contract_keywords = [
            'agreement', 'contract', 'party', 'parties', 'whereas', 'therefore',
            'consideration', 'terms', 'conditions', 'obligations', 'rights',
            'liability', 'termination', 'breach', 'damages', 'clause', 'section'
        ]
        
        self.legal_issues_patterns = [
            r'liability.*(?:limited|unlimited|excluded)',
            r'breach.*(?:contract|agreement)',
            r'termination.*(?:notice|immediate)',
            r'force.*majeure',
            r'dispute.*(?:resolution|arbitration)',
            r'confidentiality.*(?:agreement|clause)',
            r'intellectual.*property',
            r'indemnification',
            r'governing.*law',
            r'jurisdiction'
        ]
        
        self.date_patterns = [
            r'\b\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}\b',
            r'\b\d{1,2}\s+(?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{2,4}\b',
            r'\b(?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2},?\s+\d{2,4}\b'
        ]
    
    def extract_entities(self, text: str) -> Dict:
        """Extract legal entities using pattern matching"""
        # Find potential party names (capitalized words/phrases)
        party_pattern = r'\b[A-Z][A-Z\s]{2,50}\b(?:\s+(?:LLC|Inc|Corp|Ltd|Company|Corporation))?'
        parties = list(set(re.findall(party_pattern, text)))[:5]  # Limit to 5 parties
        
        # Find dates
        dates = []
        for pattern in self.date_patterns:
            dates.extend(re.findall(pattern, text, re.IGNORECASE))
        dates = list(set(dates))[:5]  # Limit to 5 dates
        
        # Find amounts/financial terms
        money_pattern = r'\$[\d,]+(?:\.\d{2})?'
        amounts = list(set(re.findall(money_pattern, text)))[:5]
        
        return {
            'parties': [p.strip() for p in parties if len(p.strip()) > 3],
            'dates': dates,
            'amounts': amounts
        }
    
    def classify_document_type(self, text: str) -> str:
        """Classify document type based on keywords"""
        text_lower = text.lower()
        
        if any(word in text_lower for word in ['lease', 'rental', 'tenant', 'landlord']):
            return "Lease Agreement"
        elif any(word in text_lower for word in ['employment', 'employee', 'employer', 'salary', 'wages']):
            return "Employment Contract"
        elif any(word in text_lower for word in ['nda', 'confidentiality', 'non-disclosure']):
            return "Non-Disclosure Agreement"
        elif any(word in text_lower for word in ['ser e', 'services', 'provider', 'client']):
            return "Service Agreement"
        elif any(word in text_lower for word in ['purchase', 'sale', 'buy', 'sell', 'goods']):
            return "Purchase/Sale Agreement"
        elif any(word in text_lower for word in ['license', 'licensing', 'software', 'intellectual property']):
            return "License Agreement"
        elif any(word in text_lower for word in ['partnership', 'partners', 'joint venture']):
            return "Partnership Agreement"
        else:
            return "Legal Contract"
    
    def identify_key_sections(self, text: str) -> List[str]:
        """Identify key sections in the document"""
        sections = []
        
        # Common legal section headers
        section_patterns = [
            r'(?:section|article|clause)\s+\d+[:\.\-]?\s*([^.\n]{10,100})',
            r'\b(definitions?)\b',
            r'\b(terms?\s+and\s+conditions?)\b',
            r'\b(payment\s+terms?)\b',
            r'\b(termination)\b',
            r'\b(liability)\b',
            r'\b(confidentiality)\b',
            r'\b(dispute\s+resolution)\b',
            r'\b(governing\s+law)\b',
            r'\b(force\s+majeure)\b'
        ]
        
        for pattern in section_patterns:
            matches = re.findall(pattern, text, re.IGNORECASE)
            sections.extend([match.strip() for match in matches if isinstance(match, str)])
        
        return list(set(sections))[:8]  # Limit to 8 sections
    
    def identify_legal_issues(self, text: str) -> List[str]:
        """Identify potential legal issues"""
        issues = []
        
        for pattern in self.legal_issues_patterns:
            matches = re.findall(pattern, text, re.IGNORECASE)
            if matches:
                issues.append(f"Contains {pattern.replace('.*', ' ').replace(r'\b', '').strip()} provisions")
        
        # Additional heuristic checks
        if 'penalty' in text.lower() or 'liquidated damages' in text.lower():
            issues.append("Contains penalty or damages clauses")
        
        if 'warranty' in text.lower() or 'guarantee' in text.lower():
            issues.append("Contains warranty or guarantee provisions")
        
        if 'arbitration' in text.lower():
            issues.append("Includes arbitration clause")
        
        if 'non-compete' in text.lower() or 'restraint of trade' in text.lower():
            issues.append("Contains non-compete restrictions")
        
        return list(set(issues))[:6]  # Limit to 6 issues
    
    def generate_summary(self, text: str, entities: Dict) -> str:
        """Generate a comprehensive summary using rule-based approach"""
        doc_type = self.classify_document_type(text)
        
        summary_parts = [
            f"This appears to be a {doc_type.lower()} that requires careful review and consideration."
        ]
        
        # Party information (always include this line)
        if entities['parties']:
            if len(entities['parties']) == 1:
                summary_parts.append(f"The document involves {entities['parties'][0]} as a primary party, with specific rights and obligations outlined throughout the agreement.")
            else:
                summary_parts.append(f"The main parties involved are {', '.join(entities['parties'][:3])}, each with distinct roles and responsibilities as defined in the contract terms.")
        else:
            summary_parts.append("The document involves multiple parties whose specific identities and roles should be carefully identified before proceeding with any commitments.")
        
        # Temporal and financial information (ensure at least one more line)
        temporal_financial_added = False
        if entities['dates']:
            summary_parts.append(f"Important dates mentioned include {', '.join(entities['dates'][:3])}, which establish critical timelines for performance, compliance, and potential expiration of the agreement.")
            temporal_financial_added = True
        
        if entities['amounts']:
            if temporal_financial_added:
                summary_parts.append(f"The document specifies financial terms including {', '.join(entities['amounts'][:3])}, representing monetary obligations that require careful consideration of payment schedules and consequences.")
            else:
                summary_parts.append(f"Financial terms include {', '.join(entities['amounts'][:3])}, establishing monetary obligations and payment structures that form a core component of this legal arrangement.")
                temporal_financial_added = True
        
        # Ensure we have at least one temporal/financial line if none were added
        if not temporal_financial_added:
            summary_parts.append("The document establishes specific timelines and may include financial obligations that should be thoroughly reviewed to understand all commitments and deadlines involved.")
        
        # Content complexity and scope analysis (always include)
        word_count = len(text.split())
        legal_issues = self.identify_legal_issues(text)
        if word_count > 5000:
            summary_parts.append(f"This comprehensive document spans {word_count:,} words and contains {len(legal_issues)} distinct legal provisions, indicating a complex agreement that warrants professional legal review before execution.")
        elif word_count > 1000:
            summary_parts.append(f"This standard-length legal document contains {word_count:,} words with {len(legal_issues)} key legal provisions, representing a substantive agreement with multiple terms and conditions that require careful attention.")
        else:
            summary_parts.append(f"This concise document of {word_count:,} words focuses on essential terms while containing {len(legal_issues)} important legal provisions that, despite its brevity, establish significant legal obligations.")
        
        # Risk and recommendation summary (always include)
        risk_indicators = ['unlimited liability', 'personal guarantee', 'liquidated damages', 'immediate termination', 'penalty']
        risk_count = sum(1 for indicator in risk_indicators if indicator in text.lower())
        
        if risk_count >= 2:
            summary_parts.append("The document contains multiple high-risk provisions including potential penalties and liability terms, making it essential to understand all consequences and seek appropriate legal counsel before agreement.")
        elif risk_count >= 1:
            summary_parts.append("The document includes certain risk provisions that require careful evaluation, particularly regarding liability and termination terms, to ensure full understanding of potential obligations and consequences.")
        else:
            summary_parts.append("While appearing to contain standard legal provisions, this document establishes binding obligations and rights that should be thoroughly understood, with particular attention to compliance requirements and dispute resolution mechanisms.")
        
        return " ".join(summary_parts)
    
    def assess_risk(self, text: str, legal_issues: List[str]) -> str:
        """Assess risk level based on document content"""
        risk_indicators = [
            'unlimited liability', 'personal guarantee', 'liquidated damages',
            'immediate termination', 'no refund', 'non-negotiable',
            'irrevocable', 'penalty', 'forfeiture'
        ]
        
        high_risk_count = sum(1 for indicator in risk_indicators if indicator in text.lower())
        
        if high_risk_count >= 3:
            return "HIGH RISK: Document contains multiple potentially unfavorable terms. Careful review recommended before signing."
        elif high_risk_count >= 1:
            return "MEDIUM RISK: Document contains some terms that require attention. Review specific clauses carefully."
        elif len(legal_issues) > 4:
            return "MEDIUM RISK: Complex document with multiple legal provisions. Professional review recommended."
        else:
            return "LOW-MEDIUM RISK: Standard legal document. Review terms to ensure they meet your requirements."
    
    def generate_recommendations(self, text: str, doc_type: str, legal_issues: List[str]) -> List[str]:
        """Generate recommendations based on document analysis"""
        recommendations = []
        
        # Basic recommendations based on document type
        if "employment" in doc_type.lower():
            recommendations.extend([
                "Review compensation and benefits terms carefully",
                "Check termination notice requirements",
                "Verify non-compete and confidentiality clauses"
            ])
        elif "lease" in doc_type.lower():
            recommendations.extend([
                "Confirm rent amount and payment schedule",
                "Review maintenance and repair responsibilities",
                "Check security deposit and return conditions"
            ])
        elif "service" in doc_type.lower():
            recommendations.extend([
                "Verify scope of services and deliverables",
                "Review payment terms and schedule",
                "Check termination and cancellation clauses"
            ])
        else:
            recommendations.extend([
                "Carefully review all terms and conditions",
                "Verify party obligations and responsibilities",
                "Check termination and dispute resolution procedures"
            ])
        
        # Add specific recommendations based on content
        if 'confidentiality' in text.lower():
            recommendations.append("Pay special attention to confidentiality obligations")
        
        if 'liability' in text.lower():
            recommendations.append("Review liability limitations and exclusions")
        
        if 'governing law' in text.lower():
            recommendations.append("Note the governing law and jurisdiction clauses")
        
        return recommendations[:5]  # Limit to 5 recommendations

# Initialize the analyzer
analyzer = FreeTextAnalyzer()

def extract_text_from_pdf(file_content: bytes) -> str:
    """Extract text from PDF file"""
    try:
        pdf_reader = PyPDF2.PdfReader(io.BytesIO(file_content))
        text = ""
        for page in pdf_reader.pages:
            text += page.extract_text() + "\n"
        return text.strip()
    except Exception as e:
        logger.error(f"Error extracting text from PDF: {e}")
        raise HTTPException(status_code=400, detail="Failed to extract text from PDF")

def extract_text_from_docx(file_content: bytes) -> str:
    """Extract text from DOCX file"""
    try:
        doc = Document(io.BytesIO(file_content))
        text = ""
        for paragraph in doc.paragraphs:
            text += paragraph.text + "\n"
        return text.strip()
    except Exception as e:
        logger.error(f"Error extracting text from DOCX: {e}")
        raise HTTPException(status_code=400, detail="Failed to extract text from DOCX")

def extract_text_from_txt(file_content: bytes) -> str:
    """Extract text from TXT file"""
    try:
        return file_content.decode('utf-8', errors='ignore').strip()
    except Exception as e:
        logger.error(f"Error extracting text from TXT: {e}")
        raise HTTPException(status_code=400, detail="Failed to extract text from TXT")

def analyze_document(text: str) -> Dict:
    """Analyze document and return structured summary"""
    try:
        # Extract entities and basic info
        entities = analyzer.extract_entities(text)
        doc_type = analyzer.classify_document_type(text)
        key_sections = analyzer.identify_key_sections(text)
        legal_issues = analyzer.identify_legal_issues(text)
        
        # Generate analysis
        summary = analyzer.generate_summary(text, entities)
        risk_assessment = analyzer.assess_risk(text, legal_issues)
        recommendations = analyzer.generate_recommendations(text, doc_type, legal_issues)
        
        return {
            "document_type": doc_type,
            "main_parties": entities['parties'],
            "important_dates": entities['dates'],
            "key_sections": key_sections,
            "legal_issues": legal_issues,
            "summary": summary,
            "risk_assessment": risk_assessment,
            "recommendations": recommendations,
            "confidence_score": 0.75,  # Static confidence for rule-based analysis
            "analysis_timestamp": datetime.now().isoformat()
        }
    except Exception as e:
        logger.error(f"Error analyzing document: {e}")
        # Return fallback analysis
        return {
            "document_type": "Legal Document",
            "main_parties": ["Not specified"],
            "important_dates": [],
            "key_sections": ["Document analysis"],
            "legal_issues": ["Standard legal provisions"],
            "summary": "This document contains legal terms and conditions that should be reviewed carefully.",
            "risk_assessment": "MEDIUM RISK: Please review all terms carefully before proceeding.",
            "recommendations": [
                "Review all terms and conditions thoroughly",
                "Consider seeking legal advice if needed",
                "Ensure you understand all obligations"
            ],
            "confidence_score": 0.5,
            "analysis_timestamp": datetime.now().isoformat()
        }

def answer_question(question: str, document_text: str) -> Dict:
    """Answer questions about the document using simple text matching"""
    try:
        question_lower = question.lower()
        text_lower = document_text.lower()
        
        # Find relevant sections based on keywords
        relevant_sections = []
        sentences = document_text.split('. ')
        
        # Extract keywords from question
        question_keywords = re.findall(r'\b\w+\b', question_lower)
        question_keywords = [word for word in question_keywords if len(word) > 3]
        
        # Find sentences containing question keywords
        relevant_sentences = []
        for sentence in sentences:
            sentence_lower = sentence.lower()
            keyword_matches = sum(1 for keyword in question_keywords if keyword in sentence_lower)
            if keyword_matches > 0:
                relevant_sentences.append((sentence.strip(), keyword_matches))
        
        # Sort by relevance and take top 3
        relevant_sentences.sort(key=lambda x: x[1], reverse=True)
        top_sentences = [sent[0] for sent in relevant_sentences[:3]]
        
        # Generate answer based on question type
        if any(word in question_lower for word in ['who', 'party', 'parties']):
            entities = analyzer.extract_entities(document_text)
            if entities['parties']:
                answer = f"The main parties mentioned in the document are: {', '.join(entities['parties'][:3])}."
            else:
                answer = "The specific parties are not clearly identified in the document."
            relevant_sections = ["Parties section"]
        
        elif any(word in question_lower for word in ['when', 'date', 'time']):
            entities = analyzer.extract_entities(document_text)
            if entities['dates']:
                answer = f"Important dates mentioned include: {', '.join(entities['dates'][:3])}."
            else:
                answer = "No specific dates are clearly mentioned in the document."
            relevant_sections = ["Dates and timeline"]
        
        elif any(word in question_lower for word in ['how much', 'cost', 'price', 'amount', 'payment']):
            entities = analyzer.extract_entities(document_text)
            if entities['amounts']:
                answer = f"Financial amounts mentioned include: {', '.join(entities['amounts'][:3])}."
            else:
                answer = "No specific financial amounts are clearly mentioned in the document."
            relevant_sections = ["Payment terms"]
        
        elif any(word in question_lower for word in ['termination', 'end', 'cancel']):
            if 'termination' in text_lower:
                answer = "The document contains termination provisions. " + (top_sentences[0] if top_sentences else "Please review the termination section for specific details.")
            else:
                answer = "Termination provisions are not explicitly mentioned in this document."
            relevant_sections = ["Termination clause"]
        
        elif any(word in question_lower for word in ['liability', 'responsible', 'liable']):
            if 'liability' in text_lower:
                answer = "The document contains liability provisions. " + (top_sentences[0] if top_sentences else "Please review the liability section for specific details.")
            else:
                answer = "Liability provisions are not explicitly mentioned in this document."
            relevant_sections = ["Liability section"]
        
        else:
            # General question - return most relevant content
            if top_sentences:
                answer = f"Based on the document content: {top_sentences[0]}"
                if len(top_sentences) > 1:
                    answer += f" Additionally, {top_sentences[1]}"
            else:
                answer = "I couldn't find specific information related to your question in the document. Please try rephrasing your question or ask about specific topics like parties, dates, payments, or termination."
            relevant_sections = ["General content"]
        
        return {
            "answer": answer,
            "relevant_sections": relevant_sections,
            "confidence_score": 0.7 if top_sentences else 0.3
        }
    
    except Exception as e:
        logger.error(f"Error answering question: {e}")
        return {
            "answer": "I apologize, but I encountered an error while processing your question. Please try rephrasing your question or ask about specific aspects of the document.",
            "relevant_sections": ["Error handling"],
            "confidence_score": 0.1
        }

@app.post("/upload", response_model=DocumentResponse)
async def upload_document(file: UploadFile = File(...)):
    """Upload and analyze a legal document"""
    try:
        # Validate file type
        if not file.filename.lower().endswith(('.pdf', '.docx', '.txt')):
            raise HTTPException(status_code=400, detail="Only PDF, DOCX, and TXT files are supported")
        
        # Read file content
        file_content = await file.read()
        
        # Extract text based on file type
        if file.filename.lower().endswith('.pdf'):
            text = extract_text_from_pdf(file_content)
        elif file.filename.lower().endswith('.docx'):
            text = extract_text_from_docx(file_content)
        else:  # .txt
            text = extract_text_from_txt(file_content)
        
        if not text.strip():
            raise HTTPException(status_code=400, detail="No text content found in the document")
        
        # Generate unique document ID
        document_id = str(uuid.uuid4())
        
        # Analyze document
        analysis = analyze_document(text)
        
        # Store document
        documents_store[document_id] = {
            "id": document_id,
            "filename": file.filename,
            "text": text,
            "analysis": analysis,
            "upload_time": datetime.now().isoformat()
        }
        
        logger.info(f"Successfully analyzed document: {file.filename}")
        
        return DocumentResponse(
            document_id=document_id,
            filename=file.filename,
            summary=analysis
        )
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error processing document upload: {e}")
        raise HTTPException(status_code=500, detail="Failed to process document")

@app.post("/question", response_model=QuestionResponse)
async def ask_question(request: QuestionRequest):
    """Ask a question about an uploaded document"""
    try:
        if request.document_id not in documents_store:
            raise HTTPException(status_code=404, detail="Document not found")
        
        document = documents_store[request.document_id]
        response = answer_question(request.question, document["text"])
        
        return QuestionResponse(**response)
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error processing question: {e}")
        raise HTTPException(status_code=500, detail="Failed to process question")

@app.get("/documents")
async def list_documents():
    """List all uploaded documents"""
    try:
        documents = []
        for doc_id, doc in documents_store.items():
            documents.append({
                "document_id": doc_id,
                "filename": doc["filename"],
                "document_type": doc["analysis"]["document_type"],
                "upload_time": doc["upload_time"]
            })
        
        return {"documents": documents}
    
    except Exception as e:
        logger.error(f"Error listing documents: {e}")
        raise HTTPException(status_code=500, detail="Failed to list documents")

@app.delete("/documents/{document_id}")
async def delete_document(document_id: str):
    """Delete a document"""
    try:
        if document_id not in documents_store:
            raise HTTPException(status_code=404, detail="Document not found")
        
        del documents_store[document_id]
        return {"message": "Document deleted successfully"}
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting document: {e}")
        raise HTTPException(status_code=500, detail="Failed to delete document")

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": "Legal Document Analyzer",
        "version": "1.0.0",
        "ai_service": "Rule-based Free Analysis",
        "timestamp": datetime.now().isoformat()
    }

@app.get("/")
async def root():
    """Root endpoint with API information"""
    return {
        "message": "Legal Document Analyzer API",
        "version": "1.0.0",
        "description": "Free AI-powered legal document analysis and Q&A",
        "endpoints": {
            "upload": "/upload",
            "question": "/question",
            "documents": "/documents",
            "health": "/health"
        }
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8002)