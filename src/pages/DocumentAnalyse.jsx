import React, { useState, useRef, useEffect } from 'react';
import { SendHorizonal, Clock, UploadCloud } from 'lucide-react';
import logo from '../assets/logo.png';

export const DocumentAnalyse = () => {
  const [file, setFile] = useState(null);
  const [summary, setSummary] = useState('');
  const [messages, setMessages] = useState([]);
  const [recentDocs, setRecentDocs] = useState([]);
  const [hasStartedChat, setHasStartedChat] = useState(false);

  const chatEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleFileUpload = (e) => {
    const uploadedFile = e.target.files[0];
    if (!uploadedFile) return;

    setFile(uploadedFile);
    setRecentDocs([uploadedFile.name, ...recentDocs.slice(0, 4)]);

    // Simulate summary generation
    setTimeout(() => {
      setSummary(
        'This is a detailed summary of the uploaded legal document. It covers key points, obligations, and clauses relevant to your needs.'
      );
    }, 1000);
  };

  const handleAskQuestion = (question) => {
    if (!file) {
      alert('Please upload a document first.');
      return;
    }
    if (!question.trim()) return;

    if (!hasStartedChat) {
      setHasStartedChat(true);
    }

    setMessages((prev) => [...prev, { sender: 'user', text: question }]);

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { sender: 'bot', text: `🤖 AI Response based on "${file.name}" - ${question}` },
      ]);
    }, 500);
  };

  return (
    <div className="flex h-screen bg-white">
      {/* Sidebar */}
      <aside className="w-72 rounded-tr-2xl rounded-br-2xl bg-[#0c1c11] text-white p-6 border-r border-green-700 flex flex-col shadow-lg">
        <div className="flex items-center gap-3 mb-10">
          <img src={logo} alt="Logo" className="w-10 h-10 rounded-lg" />
          <h1 className="text-2xl font-bold">ClauseWise</h1>
        </div>

        <h2 className="text-sm text-green-100 mb-3">Recent Documents</h2>
        <ul className="space-y-2 text-sm">
          {recentDocs.length > 0 ? (
            recentDocs.map((doc, idx) => (
              <li key={idx} className="flex items-center gap-2 hover:text-green-200 cursor-pointer">
                <Clock size={14} /> {doc}
              </li>
            ))
          ) : (
            <li className="text-green-100/70">No recent documents</li>
          )}
        </ul>
      </aside>

      {/* Main Section */}
      <main className="flex-1 flex flex-col items-center px-6 py-6">
        {/* Before chat starts */}
        {!hasStartedChat && (
          <>
            {/* Header */}
            <div className="text-center mb-6">
              <h1 className="text-4xl font-bold mb-2 text-green-800">Upload & Analyse</h1>
              <p className="text-gray-600 text-lg">AI answers based strictly on your uploaded legal document</p>
            </div>

            {/* File Upload Zone */}
            <label className="w-full max-w-3xl h-44 border-2 border-dashed border-green-700 bg-green-50 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:bg-green-100 transition mb-6 shadow-lg">
              <UploadCloud size={40} className="text-green-600 mb-3" />
              <p className="text-gray-700 mb-1">{file ? file.name : "Drag & drop your PDF here"}</p>
              <span className="text-xs text-gray-500">or click to browse</span>
              <input type="file" accept="application/pdf" onChange={handleFileUpload} className="hidden" />
            </label>

            {/* Summary */}
            {summary && (
              <div className="w-full max-w-3xl mb-6 bg-white rounded-xl p-5 shadow-xl">
                <h2 className="text-lg font-semibold text-green-800 mb-2">📄 Document Summary</h2>
                <p className="text-gray-700 text-sm">{summary}</p>
              </div>
            )}
          </>
        )}

        {/* Chat Mode */}
        {hasStartedChat && (
          <div className="w-full flex-1 overflow-y-auto space-y-3 px-1 p-3 bg-green-50 rounded-xl shadow-lg">
            {messages.map((msg, index) => (
              <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`px-5 py-3 rounded-2xl shadow-lg max-w-[75%] text-sm ${
                    msg.sender === 'user'
                      ? 'bg-green-600 text-white rounded-br-none'
                      : 'bg-white text-gray-800 rounded-bl-none'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>
        )}

        {/* Ask Question Box */}
        <div className={`${hasStartedChat ? 'max-w-full' : 'max-w-3xl'} w-full mt-4 flex items-center gap-3`}>
          <input
            ref={inputRef}
            type="text"
            placeholder="Ask a question about the document..."
            className="flex-1 rounded-full px-5 py-3 bg-white border border-gray-200 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-green-600 shadow-md"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && e.target.value.trim()) {
                handleAskQuestion(e.target.value.trim());
                e.target.value = '';
              }
            }}
          />
          <button
            onClick={() => {
              if (inputRef.current?.value.trim()) {
                handleAskQuestion(inputRef.current.value.trim());
                inputRef.current.value = '';
              }
            }}
            className="bg-green-700 hover:bg-green-800 text-white p-3 rounded-full shadow-md"
          >
            <SendHorizonal size={18} />
          </button>
        </div>
      </main>
    </div>
  );
};