import React, { useState } from 'react';
import { Upload, FileText, MessageCircle, CheckCircle, AlertTriangle, Clock, Download, Trash2, Search, Bot, Shield } from 'lucide-react';

export const IBMBot = () => {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [question, setQuestion] = useState('');
  const [qaPairs, setQaPairs] = useState([]);
  const [askingQuestion, setAskingQuestion] = useState(false);
  const [showFullContent, setShowFullContent] = useState(false);
  const [documentId, setDocumentId] = useState(null);
  const [uploadedDocuments, setUploadedDocuments] = useState([]);

  // Updated API base URL to use port 8002 for ClauseWise
  const API_BASE_URL = 'http://localhost:8002';

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setResult(null);
    setQaPairs([]);
    setDocumentId(null);
  };

  const handleUpload = async () => {
    if (!file) {
      alert('Please select a file first.');
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(`${API_BASE_URL}/upload`, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setResult(data.summary);
        setDocumentId(data.document_id);
        // Load uploaded documents list
        loadDocuments();
      } else {
        const error = await response.json();
        alert(`Error: ${error.detail || 'Failed to upload file'}`);
      }
    } catch (error) {
      alert(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const loadDocuments = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/documents`);
      if (response.ok) {
        const data = await response.json();
        setUploadedDocuments(data.documents);
      }
    } catch (error) {
      console.error('Failed to load documents:', error);
    }
  };

  const handleAskQuestion = async () => {
    if (!question.trim() || !documentId) {
      alert('Please enter a question and ensure a document is uploaded.');
      return;
    }

    setAskingQuestion(true);
    try {
      const response = await fetch(`${API_BASE_URL}/question`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question: question,
          document_id: documentId,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setQaPairs([...qaPairs, { 
          question: question, 
          answer: data.answer,
          relevant_sections: data.relevant_sections,
          confidence_score: data.confidence_score
        }]);
        setQuestion('');
      } else {
        const error = await response.json();
        alert(`Error: ${error.detail || 'Failed to get answer'}`);
      }
    } catch (error) {
      alert(`Error: ${error.message}`);
    } finally {
      setAskingQuestion(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAskQuestion();
    }
  };

  const deleteDocument = async (docId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/documents/${docId}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        loadDocuments();
        if (docId === documentId) {
          setResult(null);
          setDocumentId(null);
          setQaPairs([]);
        }
      }
    } catch (error) {
      console.error('Failed to delete document:', error);
    }
  };

  React.useEffect(() => {
    loadDocuments();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-950 via-green-900 to-teal-950 relative overflow-hidden">
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-72 h-72 bg-emerald-400/15 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-32 w-96 h-96 bg-green-400/12 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-32 left-1/3 w-80 h-80 bg-teal-400/15 rounded-full blur-3xl animate-pulse delay-2000"></div>
        <div className="absolute top-1/2 right-1/4 w-64 h-64 bg-lime-400/10 rounded-full blur-3xl animate-pulse delay-3000"></div>
      </div>

      <div className="relative z-10 container mx-auto px-6 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-4 mb-6">
            <div className="p-4 rounded-3xl bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 shadow-2xl animate-pulse">
              <FileText size={36} className="text-white" />
            </div>
            <div>
              <h1 className="text-5xl font-black bg-gradient-to-r from-emerald-300 via-green-400 to-teal-300 bg-clip-text text-transparent tracking-tight">
                Legal Document Analyzer
              </h1>
              <p className="text-emerald-100/80 text-xl font-medium mt-2">
                AI-Powered Document Analysis & Q&A
              </p>
            </div>
          </div>
          
          <div className="flex items-center justify-center gap-6 text-sm text-emerald-200/60">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
              <span>Google Gemini AI</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span>PDF/DOCX/TXT Support</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-teal-400 rounded-full animate-pulse"></div>
              <span>Intelligent Q&A</span>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Upload Section */}
          <div className="lg:col-span-1">
            <div className="bg-gradient-to-br from-emerald-900/40 to-green-900/30 backdrop-blur-xl rounded-3xl p-6 border border-emerald-400/20 shadow-2xl">
              <h2 className="text-2xl font-bold text-emerald-100 mb-6 flex items-center gap-3">
                <Upload size={24} className="text-emerald-400" />
                Upload Document
              </h2>
              
              <div className="space-y-4">
                <div className="border-2 border-dashed border-emerald-400/30 rounded-2xl p-8 text-center hover:border-emerald-400/50 transition-all duration-300">
                  <input
                    type="file"
                    accept=".pdf,.docx,.txt"
                    onChange={handleFileChange}
                    className="hidden"
                    id="file-upload"
                  />
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <FileText size={48} className="mx-auto text-emerald-400 mb-4" />
                    <p className="text-emerald-100 font-medium">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-emerald-200/60 text-sm mt-2">
                      PDF, DOCX, TXT files supported
                    </p>
                  </label>
                </div>
                
                {file && (
                  <div className="bg-emerald-900/30 rounded-xl p-4 border border-emerald-400/20">
                    <p className="text-emerald-100 font-medium">{file.name}</p>
                    <p className="text-emerald-200/60 text-sm">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                )}
                
                <button
                  onClick={handleUpload}
                  disabled={!file || loading}
                  className="w-full bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white py-4 px-6 rounded-2xl font-bold transition-all duration-300 shadow-xl hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Analyzing Document...
                    </div>
                  ) : (
                    'Analyze Document'
                  )}
                </button>
              </div>
            </div>

            {/* Recent Documents */}
            {uploadedDocuments.length > 0 && (
              <div className="mt-6 bg-gradient-to-br from-emerald-900/40 to-green-900/30 backdrop-blur-xl rounded-3xl p-6 border border-emerald-400/20 shadow-2xl">
                <h3 className="text-lg font-bold text-emerald-100 mb-4 flex items-center gap-2">
                  <Clock size={18} className="text-emerald-400" />
                  Recent Documents
                </h3>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {uploadedDocuments.map((doc) => (
                    <div key={doc.document_id} className="flex items-center justify-between bg-emerald-800/30 rounded-lg p-3">
                      <div className="flex-1 min-w-0">
                        <p className="text-emerald-100 text-sm font-medium truncate">{doc.filename}</p>
                        <p className="text-emerald-200/60 text-xs">{doc.document_type}</p>
                      </div>
                      <button
                        onClick={() => deleteDocument(doc.document_id)}
                        className="text-red-400 hover:text-red-300 p-1"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Results Section */}
          <div className="lg:col-span-2">
            {result && (
              <div className="space-y-6">
                {/* Document Summary */}
                <div className="bg-gradient-to-br from-emerald-900/40 to-green-900/30 backdrop-blur-xl rounded-3xl p-6 border border-emerald-400/20 shadow-2xl">
                  <h2 className="text-2xl font-bold text-emerald-100 mb-6 flex items-center gap-3">
                    <Bot size={24} className="text-emerald-400" />
                    Document Analysis
                  </h2>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Basic Info */}
                    <div className="space-y-4">
                      <div className="bg-emerald-800/30 rounded-xl p-4">
                        <h4 className="text-emerald-300 font-semibold mb-2">Document Type</h4>
                        <p className="text-emerald-100">{result.document_type}</p>
                      </div>
                      
                      <div className="bg-emerald-800/30 rounded-xl p-4">
                        <h4 className="text-emerald-300 font-semibold mb-2">Main Parties</h4>
                        <div className="space-y-1">
                          {result.main_parties.map((party, index) => (
                            <span key={index} className="inline-block bg-emerald-700/50 text-emerald-100 px-2 py-1 rounded-lg text-sm mr-2 mb-1">
                              {party}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      {result.important_dates.length > 0 && (
                        <div className="bg-emerald-800/30 rounded-xl p-4">
                          <h4 className="text-emerald-300 font-semibold mb-2">Important Dates</h4>
                          <div className="space-y-1">
                            {result.important_dates.map((date, index) => (
                              <div key={index} className="text-emerald-100 text-sm">{date}</div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {/* Analysis */}
                    <div className="space-y-4">
                      <div className="bg-emerald-800/30 rounded-xl p-4">
                        <h4 className="text-emerald-300 font-semibold mb-2">Key Sections</h4>
                        <div className="space-y-1">
                          {result.key_sections.map((section, index) => (
                            <div key={index} className="text-emerald-100 text-sm flex items-center gap-2">
                              <CheckCircle size={12} className="text-emerald-400" />
                              {section}
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="bg-emerald-800/30 rounded-xl p-4">
                        <h4 className="text-emerald-300 font-semibold mb-2">Legal Issues</h4>
                        <div className="space-y-1">
                          {result.legal_issues.map((issue, index) => (
                            <div key={index} className="text-emerald-100 text-sm flex items-center gap-2">
                              <AlertTriangle size={12} className="text-yellow-400" />
                              {issue}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Summary */}
                  <div className="mt-6 bg-emerald-800/30 rounded-xl p-4">
                    <h4 className="text-emerald-300 font-semibold mb-2">Summary</h4>
                    <p className="text-emerald-100 leading-relaxed">{result.summary}</p>
                  </div>
                  
                  {/* Risk Assessment */}
                  <div className="mt-4 bg-yellow-900/30 rounded-xl p-4 border border-yellow-400/20">
                    <h4 className="text-yellow-300 font-semibold mb-2 flex items-center gap-2">
                      <Shield size={16} />
                      Risk Assessment
                    </h4>
                    <p className="text-yellow-100 leading-relaxed">{result.risk_assessment}</p>
                  </div>
                  
                  {/* Recommendations */}
                  <div className="mt-4 bg-emerald-800/30 rounded-xl p-4">
                    <h4 className="text-emerald-300 font-semibold mb-2">Recommendations</h4>
                    <div className="space-y-2">
                      {result.recommendations.map((rec, index) => (
                        <div key={index} className="text-emerald-100 text-sm flex items-start gap-2">
                          <div className="w-2 h-2 bg-emerald-400 rounded-full mt-2 flex-shrink-0"></div>
                          {rec}
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Confidence Score */}
                  <div className="mt-4 flex items-center justify-between text-sm">
                    <span className="text-emerald-200/60">Analysis Confidence</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-2 bg-emerald-900/50 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-emerald-400 to-green-500"
                          style={{ width: `${result.confidence_score * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-emerald-100 font-medium">
                        {Math.round(result.confidence_score * 100)}%
                      </span>
                    </div>
                  </div>
                </div>

                {/* Q&A Section */}
                <div className="bg-gradient-to-br from-emerald-900/40 to-green-900/30 backdrop-blur-xl rounded-3xl p-6 border border-emerald-400/20 shadow-2xl">
                  <h2 className="text-2xl font-bold text-emerald-100 mb-6 flex items-center gap-3">
                    <MessageCircle size={24} className="text-emerald-400" />
                    Ask Questions
                  </h2>
                  
                  {/* Question Input */}
                  <div className="flex gap-4 mb-6">
                    <input
                      type="text"
                      value={question}
                      onChange={(e) => setQuestion(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Ask any question about the document..."
                      className="flex-1 bg-emerald-900/30 border border-emerald-400/30 rounded-xl px-4 py-3 text-emerald-100 placeholder-emerald-200/60 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent"
                      disabled={askingQuestion}
                    />
                    <button
                      onClick={handleAskQuestion}
                      disabled={!question.trim() || askingQuestion || !documentId}
                      className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {askingQuestion ? (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <Search size={20} />
                      )}
                    </button>
                  </div>
                  
                  {/* Q&A Pairs */}
                  <div className="space-y-4">
                    {qaPairs.map((qa, index) => (
                      <div key={index} className="border-l-4 border-emerald-400 pl-6 pb-4">
                        <div className="bg-emerald-800/30 rounded-xl p-4 mb-3">
                          <h5 className="text-emerald-300 font-semibold mb-2">Question:</h5>
                          <p className="text-emerald-100">{qa.question}</p>
                        </div>
                        <div className="bg-green-800/30 rounded-xl p-4">
                          <h5 className="text-green-300 font-semibold mb-2">Answer:</h5>
                          <p className="text-green-100 leading-relaxed mb-3">{qa.answer}</p>
                          
                          {qa.relevant_sections && qa.relevant_sections.length > 0 && (
                            <div className="border-t border-green-400/20 pt-3">
                              <p className="text-green-300 text-sm font-medium mb-2">Relevant Sections:</p>
                              <div className="flex flex-wrap gap-2">
                                {qa.relevant_sections.map((section, sIndex) => (
                                  <span key={sIndex} className="bg-green-700/50 text-green-100 px-2 py-1 rounded text-xs">
                                    {section}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                          
                          <div className="mt-3 flex items-center justify-end">
                            <span className="text-green-200/60 text-xs">
                              Confidence: {Math.round(qa.confidence_score * 100)}%
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
            
            {!result && (
              <div className="bg-gradient-to-br from-emerald-900/40 to-green-900/30 backdrop-blur-xl rounded-3xl p-12 border border-emerald-400/20 shadow-2xl text-center">
                <FileText size={64} className="mx-auto text-emerald-400/50 mb-6" />
                <h3 className="text-2xl font-bold text-emerald-100 mb-4">
                  No Document Analyzed Yet
                </h3>
                <p className="text-emerald-200/60 text-lg max-w-md mx-auto">
                  Upload a legal document to get started with AI-powered analysis and intelligent Q&A capabilities.
                </p>
              </div>
            )}
          </div>
        </div>
        
        {/* Footer */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-6 bg-emerald-900/30 backdrop-blur-xl rounded-2xl px-8 py-4 border border-emerald-400/20">
            <div className="flex items-center gap-2 text-emerald-300">
              <Bot size={20} />
              <span className="font-bold">Google Gemini AI</span>
            </div>
            <div className="w-px h-5 bg-emerald-400/30"></div>
            <div className="flex items-center gap-2 text-emerald-300">
              <Shield size={20} />
              <span className="font-bold">Privacy-First</span>
            </div>
            <div className="w-px h-5 bg-emerald-400/30"></div>
            <div className="flex items-center gap-2 text-emerald-300">
              <FileText size={20} />
              <span className="font-bold">Port 8001</span>
            </div>
          </div>
          <p className="text-emerald-200/60 text-sm mt-4 font-medium">
            Documents processed securely with Google AI. No permanent storage - your privacy is protected.
          </p>
        </div>
      </div>
    </div>
  );
};



