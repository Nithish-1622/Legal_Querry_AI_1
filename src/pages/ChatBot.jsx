import React, { useState, useEffect } from 'react';
import { SendHorizonal, Clock, Loader2, MessageCircle, Sparkles, Shield, User, Bot, Upload, Search } from 'lucide-react';
import logo from '../assets/logo.png';
import { apiClient, handleAPIError } from '../config/api';

export const ChatBot = () => {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('untested');
  const [uploadingDocument, setUploadingDocument] = useState(false);
  const [messages, setMessages] = useState([
    { 
      sender: 'bot', 
      text: 'Hello! I\'m your AI Legal. How can I help you with legal questions today?',
      timestamp: new Date()
    },
  ]);
  const [recentSearches, setRecentSearches] = useState([
    'Track FIR status',
    'How to file a complaint?',
    'Nearest police station', 
    'Property dispute resolution',
    'Employment law query',
  ]);

  useEffect(() => {
    checkBackendHealth();
  }, []);

  const checkBackendHealth = async () => {
    try {
      setConnectionStatus('checking');
      const health = await apiClient.checkHealth();
      setConnectionStatus('connected');
      console.log('Backend health:', health);
    } catch (error) {
      setConnectionStatus('disconnected');
      console.error('Backend health check failed:', error);
    }
  };

  const logAnalyticsEvent = (eventName, parameters = {}) => {
    try {
      // Analytics disabled for now - can be enabled later with proper Firebase setup
      console.log('Analytics event:', eventName, parameters);
    } catch (error) {
      console.warn('Analytics logging failed:', error);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = { 
      sender: 'user', 
      text: input,
      timestamp: new Date()
    };
    const currentInput = input;
    
    setMessages(prev => [...prev, userMessage]);
    setRecentSearches([currentInput, ...recentSearches.slice(0, 4)]);
    setInput('');
    setIsLoading(true);

    // Log analytics event
    logAnalyticsEvent('legal_query_submitted', {
      query_length: currentInput.length,
      query_type: 'text'
    });

    try {
      const data = await apiClient.queryLegal(currentInput);
      console.log('Backend response data:', data);

      let botResponse;
      
      // Check for non-legal query response
      if (data.offender_perspective === "NON valid prompt" && !data.victim_perspective) {
        botResponse = {
          sender: 'bot',
          text: "⚠️ Please ask questions related only to legal sector. I can help with legal advice, court procedures, laws, rights, and legal remedies.",
          isRejection: true,
          timestamp: new Date()
        };
        
        logAnalyticsEvent('non_legal_query_rejected', {
          query: currentInput
        });
      } else if (data.offender_perspective && data.victim_perspective) {
        // Clean the text to remove any unwanted formatting
        const cleanOffenderText = data.offender_perspective.replace(/\*\*/g, '').replace(/\*/g, '');
        const cleanVictimText = data.victim_perspective.replace(/\*\*/g, '').replace(/\*/g, '');
        
        botResponse = {
          sender: 'bot',
          perspectives: [
            {
              title: 'Offender Perspective',
              content: cleanOffenderText,
            },
            {
              title: 'Victim Perspective', 
              content: cleanVictimText,
            },
          ],
          confidence_score: data.confidence_score || 0,
          timestamp: new Date()
        };
        
        logAnalyticsEvent('legal_analysis_provided', {
          confidence_score: data.confidence_score,
          query_length: currentInput.length
        });
      } else if (data.detail) {
        // Handle backend error responses
        botResponse = {
          sender: 'bot',
          text: `❌ Backend Error: ${data.detail}`,
          isError: true,
          timestamp: new Date()
        };
      } else {
        // Handle unexpected response format
        console.warn('Unexpected response format:', data);
        botResponse = {
          sender: 'bot',
          text: `🤖 I received your query but couldn't generate the expected response format. Please try rephrasing your legal question.`,
          isError: true,
          timestamp: new Date()
        };
      }

      setMessages(prev => [...prev, botResponse]);
    } catch (error) {
      console.error('Error querying backend:', error);
      
      const errorMessage = handleAPIError(error);
      const errorResponse = {
        sender: 'bot',
        text: `❌ ${errorMessage}`,
        isError: true,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorResponse]);
      
      logAnalyticsEvent('query_error', {
        error_message: error.message,
        query: currentInput
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDocumentUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.type.includes('pdf')) {
      const errorResponse = {
        sender: 'bot',
        text: "❌ Please upload only PDF files.",
        isError: true,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorResponse]);
      return;
    }

    setUploadingDocument(true);
    
    const uploadMessage = {
      sender: 'user',
      text: `📄 Uploading document: ${file.name}`,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, uploadMessage]);

    try {
      const result = await apiClient.uploadDocument(file);
      
      const successResponse = {
        sender: 'bot',
        text: `✅ Document "${result.filename}" uploaded successfully! Created ${result.chunks_created} text chunks and ${result.vector_embeddings_created} vector embeddings. You can now ask questions about this document.`,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, successResponse]);
      
      logAnalyticsEvent('document_uploaded', {
        filename: result.filename,
        chunks_created: result.chunks_created
      });
      
    } catch (error) {
      console.error('Error uploading document:', error);
      
      const errorMessage = handleAPIError(error);
      const errorResponse = {
        sender: 'bot',
        text: `❌ Upload failed: ${errorMessage}`,
        isError: true,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorResponse]);
      
      logAnalyticsEvent('document_upload_error', {
        error_message: error.message,
        filename: file.name
      });
    } finally {
      setUploadingDocument(false);
      event.target.value = ''; // Reset file input
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const testConnection = async () => {
    try {
      const response = await fetch('http://localhost:8003/health', {
        method: 'GET',
        headers: { 'Accept': 'application/json' },
        mode: 'cors',
      });

      if (response.ok) {
        setConnectionStatus('connected');
        console.log('Backend connection: OK');
      } else {
        setConnectionStatus('error');
        console.log('Backend connection: Error', response.status);
      }
    } catch (error) {
      setConnectionStatus('error');
      console.log('Backend connection: Failed', error);
    }
  };

  React.useEffect(() => {
    testConnection();
  }, []);

  const quickActions = [
    { icon: Shield, text: "FIR Status", color: "bg-blue-500" },
    { icon: MessageCircle, text: "File Complaint", color: "bg-green-500" },
    { icon: Sparkles, text: "Legal Advice", color: "bg-purple-500" },
  ];

  return (
    <div 
      className="flex text-white h-screen overflow-y-scroll "
      style={{ 
        fontFamily: 'Montserrat, sans-serif',
        background: 'linear-gradient(135deg, #0d2818 0%, #1a4b2f 50%, #0f1b14 100%)'
      }}
    >
      {/* Enhanced Sidebar */}
      <aside className="w-80 backdrop-blur-lg bg-black/20 border-r border-emerald-500/20 shadow-2xl">
        <div className="p-6">
          {/* Logo & Title */}
          <div className="flex items-center gap-4 mb-8">
            <div className="relative">
              <img 
                src={logo} 
                alt="Logo" 
                className="w-12 h-12 rounded-xl shadow-lg ring-2 ring-emerald-500/30" 
              />
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-400 rounded-full animate-pulse"></div>
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-green-300 bg-clip-text text-transparent">
                Legal QueryAI
              </h1>
              <p className="text-xs text-emerald-300/70">Legal Assistant</p>
            </div>
          </div>

          {/* Connection Status */}
          <div className="mb-6 p-3 rounded-xl bg-black/30 border border-emerald-500/20">
            <div className="flex items-center justify-between">
              <span className="text-sm text-emerald-300">Backend Status</span>
              <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${
                connectionStatus === 'connected' 
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' 
                  : connectionStatus === 'error' 
                  ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                  : 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'
              }`}>
                <div className={`w-2 h-2 rounded-full ${
                  connectionStatus === 'connected' ? 'bg-emerald-400' :
                  connectionStatus === 'error' ? 'bg-red-400' : 'bg-yellow-400'
                } ${connectionStatus === 'connected' ? 'animate-pulse' : ''}`}></div>
                {connectionStatus === 'connected' ? 'Connected' :
                 connectionStatus === 'error' ? 'Disconnected' : 'Testing...'}
              </div>
            </div>
            <div className="text-xs text-emerald-400/60 mt-1">Port 8003</div>
          </div>

          {/* Quick Actions */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-emerald-300 mb-3 flex items-center gap-2">
              <Sparkles size={16} />
              Quick Actions
            </h3>
            <div className="space-y-2">
              {quickActions.map((action, idx) => (
                <button
                  key={idx}
                  onClick={() => setInput(action.text)}
                  className="w-full flex items-center gap-3 p-3 rounded-lg bg-black/30 hover:bg-black/50 border border-emerald-500/10 hover:border-emerald-500/30 transition-all duration-200 group"
                >
                  <div className={`p-2 rounded-lg ${action.color} bg-opacity-20 group-hover:bg-opacity-30 transition-all`}>
                    <action.icon size={16} className="text-white" />
                  </div>
                  <span className="text-sm text-emerald-100">{action.text}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Recent Searches */}
          <div>
            <h3 className="text-sm font-semibold text-emerald-300 mb-3 flex items-center gap-2">
              <Clock size={16} />
              Recent Searches
            </h3>
            <div className="space-y-2">
              {recentSearches.map((search, idx) => (
                <button
                  key={idx}
                  onClick={() => setInput(search)}
                  className="w-full text-left p-3 rounded-lg bg-black/20 hover:bg-black/40 border border-emerald-500/10 hover:border-emerald-500/20 transition-all duration-200 group"
                >
                  <div className="text-sm text-emerald-100 truncate group-hover:text-emerald-50">
                    {search}
                  </div>
                  <div className="text-xs text-emerald-400/60 mt-1">
                    {idx === 0 ? 'Latest' : `${idx + 1} searches ago`}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </aside>

      {/* Enhanced Main Section */}
      <main className="flex-1 flex flex-col">
        {/* Header */}
        <header className="relative border-b border-emerald-500/10 bg-gradient-to-r from-black/30 via-black/20 to-black/30 backdrop-blur-xl">
          <div className="max-w-6xl mx-auto px-8 py-8">
            {/* Top Bar with Logo and Status */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="relative">
                  {/* Professional Legal Symbol */}
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-emerald-500/20 to-teal-500/20 backdrop-blur-sm border border-emerald-400/30 flex items-center justify-center">
                    <svg className="w-7 h-7 text-emerald-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2L4 5v6.09c0 5.05 3.41 9.76 8 10.91 4.59-1.15 8-5.86 8-10.91V5l-8-3zm0 18c-3.86-.97-6-4.88-6-8.91V6.43l6-2.4 6 2.4v4.66c0 4.03-2.14 7.94-6 8.91z"/>
                      <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full border-2 border-black/50"></div>
                </div>
                <div>
                  <h1 className="text-3xl font-bold tracking-tight text-white flex items-baseline gap-2">
                    <span className="bg-gradient-to-r from-emerald-300 via-emerald-200 to-teal-300 bg-clip-text text-transparent">
                      LegalQuery
                    </span>
                    <span className="text-emerald-400/90 text-2xl font-light">AI</span>
                  </h1>
                  <p className="text-emerald-400/60 text-xs font-medium tracking-wider uppercase mt-0.5">
                    Advanced Legal Intelligence System
                  </p>
                </div>
              </div>
              
              {/* System Status Indicator */}
              <div className="flex items-center gap-3">
                <div className="px-4 py-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 backdrop-blur-sm">
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
                      <div className="absolute inset-0 w-2 h-2 rounded-full bg-emerald-400 animate-ping"></div>
                    </div>
                    <span className="text-xs font-semibold text-emerald-300">
                      {connectionStatus === 'connected' ? 'SYSTEM ACTIVE' : 
                       connectionStatus === 'error' ? 'OFFLINE' : 'CONNECTING'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Description */}
            <div className="space-y-3">
              <p className="text-emerald-100/90 text-base font-light leading-relaxed max-w-3xl">
                Comprehensive legal analysis powered by RAG technology. 
                Receive dual-perspective insights with actionable guidance for complex legal scenarios.
              </p>
              
              {/* Feature Pills */}
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-medium">
                  Dual-Perspective Analysis
                </span>
                <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-medium">
                  Indian Legal Framework
                </span>
                <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-medium">
                  Real-time Processing
                </span>
                <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-medium">
                  LLM-Powered Classification
                </span>
              </div>
            </div>
          </div>
          
          {/* Bottom accent line */}
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent"></div>
        </header>

        {/* Chat Container */}
        <div className="flex-1 flex flex-col max-w-5xl mx-auto w-full p-6">
                    {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto space-y-4 mb-6 px-2">
            {messages.map((msg, index) => {
              if (msg.sender === 'user') {
                return (
                  <div key={index} className="flex justify-end items-start gap-3">
                    <div className="bg-gradient-to-r from-emerald-600 to-green-600 text-white px-6 py-3 rounded-2xl rounded-tr-md max-w-[75%] shadow-lg">
                      <p className="text-sm leading-relaxed">{msg.text}</p>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center shadow-md">
                      <User size={16} className="text-white" />
                    </div>
                  </div>
                );
              } else if (msg.sender === 'bot' && msg.perspectives) {
                return (
                  <div key={index} className="flex justify-start items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-teal-500 to-emerald-500 flex items-center justify-center shadow-md flex-shrink-0">
                      <Bot size={16} className="text-white" />
                    </div>
                    <div className="flex gap-5 flex-wrap max-w-[90%]">
                      {msg.perspectives.map((perspective, i) => (
                        <div
                          key={i}
                          className="bg-gradient-to-br from-white to-gray-50/95 backdrop-blur-sm text-gray-800 px-7 py-6 rounded-2xl rounded-tl-md flex-1 min-w-[320px] shadow-2xl border-2 border-emerald-100/80 hover:border-emerald-200 transition-all duration-200"
                        >
                          {/* Header Section */}
                          <div className="flex items-center gap-3 mb-5 pb-4 border-b-2 border-gray-100">
                          
                            <h4 className="font-bold text-gray-800 text-base uppercase tracking-wider flex-1">
                              {perspective.title}
                            </h4>
                            <div className={`px-3 py-1 rounded-full text-xs font-semibold ${i === 0 ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-blue-50 text-blue-700 border border-blue-200'}`}>
                              {i === 0 ? 'Offender' : 'Victim'}
                            </div>
                          </div>
                          
                          {/* Content Section */}
                          <div className="space-y-3">
                            {perspective.content.split('\n').map((line, lineIndex) => {
                              if (line.trim() === '') return <div key={lineIndex} className="h-2"></div>;
                              
                              // Check if line is a numbered point (1., 2., etc.)
                              const isNumberedPoint = /^\d+\./.test(line.trim());
                              // Check if line starts with bullet point
                              const isBulletPoint = line.trim().startsWith('•');
                              
                              if (isNumberedPoint) {
                                return (
                                  <div key={lineIndex} className="flex gap-3 items-start">
                                    <span className="font-bold text-emerald-700 text-base flex-shrink-0">
                                      {line.trim().match(/^\d+\./)[0]}
                                    </span>
                                    <p className="text-gray-800 text-[15px] leading-relaxed font-medium flex-1">
                                      {line.trim().replace(/^\d+\.\s*/, '')}
                                    </p>
                                  </div>
                                );
                              } else if (isBulletPoint) {
                                return (
                                  <div key={lineIndex} className="flex gap-3 items-start ml-6">
                                    <span className="text-emerald-600 text-base flex-shrink-0 font-bold">•</span>
                                    <p className="text-gray-700 text-[14px] leading-relaxed flex-1">
                                      {line.trim().replace(/^•\s*/, '')}
                                    </p>
                                  </div>
                                );
                              } else {
                                return (
                                  <p key={lineIndex} className="text-gray-800 text-[15px] leading-relaxed font-normal">
                                    {line.trim()}
                                  </p>
                                );
                              }
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              } else if (msg.sender === 'bot' && msg.isRejection) {
                return (
                  <div key={index} className="flex justify-start items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center shadow-md">
                      <Bot size={16} className="text-white" />
                    </div>
                    <div className="bg-gradient-to-r from-orange-50 to-red-50 border-l-4 border-orange-400 text-orange-800 px-6 py-4 rounded-2xl rounded-tl-md max-w-[75%] shadow-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-2 h-2 rounded-full bg-orange-400"></div>
                        <p className="font-semibold text-xs uppercase tracking-wider">INVALID QUERY</p>
                      </div>
                      <p className="text-sm leading-relaxed font-medium">{msg.text}</p>
                    </div>
                  </div>
                );
              } else if (msg.sender === 'bot' && msg.isError) {
                return (
                  <div key={index} className="flex justify-start items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-red-500 to-red-600 flex items-center justify-center shadow-md">
                      <Bot size={16} className="text-white" />
                    </div>
                    <div className="bg-gradient-to-r from-red-50 to-red-100 border-l-4 border-red-500 text-red-800 px-6 py-4 rounded-2xl rounded-tl-md max-w-[85%] shadow-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-2 h-2 rounded-full bg-red-500"></div>
                        <p className="font-semibold text-xs uppercase tracking-wider">ERROR</p>
                      </div>
                      <p className="text-sm leading-relaxed font-medium whitespace-pre-wrap">{msg.text}</p>
                    </div>
                  </div>
                );
              } else {
                return (
                  <div key={index} className="flex justify-start items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-teal-500 to-emerald-500 flex items-center justify-center shadow-md">
                      <Bot size={16} className="text-white" />
                    </div>
                    <div className="bg-white/95 backdrop-blur-sm text-gray-800 px-6 py-3 rounded-2xl rounded-tl-md max-w-[75%] shadow-lg border border-emerald-100">
                      <p className="text-sm leading-relaxed">{msg.text}</p>
                    </div>
                  </div>
                );
              }
            })}
            
            {/* Enhanced Loading Indicator */}
            {isLoading && (
              <div className="flex justify-start items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-teal-500 to-emerald-500 flex items-center justify-center shadow-md">
                  <Bot size={16} className="text-white" />
                </div>
                <div className="bg-white/95 backdrop-blur-sm text-gray-800 px-6 py-4 rounded-2xl rounded-tl-md shadow-lg border border-emerald-100">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Loader2 size={20} className="animate-spin text-emerald-600" />
                      <div className="absolute inset-0 rounded-full border-2 border-emerald-200 animate-pulse"></div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-emerald-700">Analyzing your legal question...</p>
                      <p className="text-xs text-emerald-500 mt-1">This may take a moment</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Enhanced Input Section */}
          <div className="bg-black/20 backdrop-blur-lg rounded-2xl p-4 border border-emerald-500/20 shadow-2xl">
            <div className="flex items-center gap-4">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask any legal question... (e.g., What are my rights in property disputes?)"
                  disabled={isLoading}
                  className="w-full rounded-xl px-6 py-4 bg-white/95 backdrop-blur-sm text-gray-800 text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white disabled:opacity-50 disabled:cursor-not-allowed shadow-lg border border-emerald-100"
                />
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-xs text-gray-400">
                  Press Enter to send
                </div>
              </div>
              <button
                onClick={handleSend}
                disabled={isLoading || !input.trim()}
                className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white p-4 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
              >
                {isLoading ? (
                  <Loader2 size={20} className="animate-spin" />
                ) : (
                  <SendHorizonal size={20} />
                )}
              </button>
            </div>
            
            {/* Input Helper */}
            <div className="mt-3 flex items-center justify-between text-xs">
              <div className="text-emerald-300/70">
                💡 Tip: Be specific about your legal situation for better advice
              </div>
              <div className="text-emerald-400/60">
                {input.length}/500 characters
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
