import React from 'react';
import Logo from "../assets/logo.png";
import img1 from "../assets/imga1.jpg";
import img2 from "../assets/img2.jpg";
import img3 from "../assets/img3.png";
import img4 from "../assets/img4.svg";
import img5 from "../assets/img5.svg";
import img6 from "../assets/img6.svg";
import img7 from "../assets/img7.svg";
import { useEffect, useRef,useState} from "react";
import img8 from "../assets/legal-services.png";
import img9 from "../assets/img9.png";
import img10 from "../assets/img10.png";
import img11 from "../assets/img11.png";
import img12 from "../assets/img12.png";
import img13 from "../assets/legal.png"
import img14 from "../assets/court.jpeg";
import vid from "../assets/Artificial.mp4"
import { useNavigate } from 'react-router-dom';
import { Plus } from "lucide-react";
import { X } from 'lucide-react';

import {
  PhoneCall,
  Mail,
  MapPin,
  Linkedin,
  Instagram,
  Youtube,
  Facebook
} from "lucide-react";




export const DashBoard = () => {

  const navigate = useNavigate();

const partners = [
  "Indian Kanoon", "Vakilsearch", "MyAdvo", "LegalKart", "Judis", "LiveLaw",
  "Nyaaya", "LexisNexis", "Westlaw", "Clio", "Casetext", "Rocket Lawyer",
  "LegalZoom", "DoNotPay", "LawDepot", "Everlaw", "DocuSign"
];

const faqs = [
  {
    question: 'Does the platform work smoothly across devices?',
    answer:
      'Yes, it’s fully responsive and optimized for both mobile and desktop use.',
  },
  {
    question: 'Can I search lawyers by category?',
    answer:
      'Yes, you can filter lawyers by civil, criminal, or family law easily.',
  },
  {
    question: 'Does the platform offer personalized support?',
    answer:
      'Yes, it remembers your search history and improves responses over time.',
  },
];

  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(index === openIndex ? null : index);
  };

  const row1Ref = useRef(null);
  const row2Ref = useRef(null);

  useEffect(() => {
    let scroll1 = 0;
    let scroll2 = 0;

    const animateScroll = () => {
      if (row1Ref.current && row2Ref.current) {
        scroll1 += 0.5;  // left to right
        scroll2 -= 0.5;  // right to left

        const maxScroll = row1Ref.current.scrollWidth;

        row1Ref.current.scrollLeft = scroll1 % maxScroll;
        row2Ref.current.scrollLeft = (maxScroll + (scroll2 % maxScroll)) % maxScroll;
      }

      requestAnimationFrame(animateScroll);
    };

    requestAnimationFrame(animateScroll);
  }, []);

  return (
    <main className="bg-[#0a1a0f] text-white" style={{ fontFamily: 'Montserrat, sans-serif' }}>
      {/* Top Section */}
      <section className="min-h-screen flex items-center justify-center px-4">
        <div className="bg-[#0a1a0f] p-5 flex flex-col md:flex-row w-full max-w-6xl rounded-xl shadow-xl">
          {/* Left */}
          <div className="flex-1 flex flex-col justify-center pr-6">
            <div className="mb-8 flex items-center space-x-4">
              <img src={Logo} alt="Legal Query AI Logo" className="h-20 w-auto" />
              <h1 className="text-3xl font-semibold">Legal Query AI</h1>
            </div>
            <h1 className="text-6xl font-bold leading-tight mb-4">
Your Smart <br/> AI Assistant for <br/> All Legal Essentials
            </h1>
            <p className="text-lg text-gray-300">
Get instant, structured legal support for daily-life scenarios with our intelligent chatbot. Whether it’s filing an e-FIR, understanding your rights, or getting expert advice.            </p>
          </div>

          {/* Right (Form) */}
          {/* Right (Form with Video) */}
<div className="flex-1 bg-white h-fit text-black p-8 rounded-xl shadow-md mt-5 md:mt-0 md:ml-10 flex flex-col justify-between">
  <div>
    <h2 className="text-2xl font-bold mb-1">
      Intelligent Legal Assistance Made Simple
    </h2>
    <p className="text-sm text-gray-600 mb-6">
      An intelligent, scenario-based assistant that provides accurate, structured responses to legal queries in simple language.
    </p>

    {/* Video Element */}
    <div className="mb-6">
      <video
        className="w-full rounded-md h-80 "
        muted autoPlay loop>
        <source src={vid} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  </div>

  {/* Ask Button */}
  <div className="flex gap-1.5">
  <button
    onClick={() => navigate("/chat")}
    className="w-full bg-green-600 text-white py-3 rounded-md font-semibold hover:bg-green-700 transition"
  >
    Ask
  </button>
  <button
    onClick={() => navigate("/ibm")}
    className="w-full bg-green-600 text-white py-3 rounded-md font-semibold hover:bg-green-700 transition"
  >
    Analyse
  </button>
</div>
</div>
        </div>
      </section>

{/* Strength Section */}
{/* Enhanced Strengths Section */}
<section className="bg-white text-black py-8  px-6 relative overflow-hidden">
  {/* Subtle Background Pattern */}
  <div className="absolute inset-0 opacity-[0.03]">
    <div className="absolute top-20 left-20 w-40 h-40 border-2 border-green-300 rounded-full"></div>
    <div className="absolute bottom-32 right-32 w-32 h-32 border border-green-400 rounded-full"></div>
    <div className="absolute top-1/3 left-1/3 w-24 h-24 bg-green-200 rounded-full blur-3xl"></div>
    <div className="absolute bottom-1/4 right-1/4 w-20 h-20 bg-emerald-200 rounded-full blur-2xl"></div>
  </div>

  {/* Enhanced Header */}
  <div className="max-w-7xl mx-auto text-center mb-24 relative z-10">
    {/* Premium Badge */}
    <div className="inline-flex items-center gap-3 px-8 py-4 bg-white/80 backdrop-blur-sm text-green-800 font-bold text-base rounded-full border border-green-200/50 shadow-xl mb-8 hover:shadow-2xl transition-all duration-300">
      <div className="w-3 h-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full animate-pulse"></div>
      STRENGTHS
      <div className="w-3 h-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full animate-pulse"></div>
    </div>

    {/* Enhanced Title with Better Typography */}
    <h2 className="text-6xl md:text-7xl font-black mb-6 leading-[0.9] tracking-tight">
      <span className="bg-gradient-to-r from-green-800 via-emerald-700 to-green-900 bg-clip-text text-transparent">
        Your Smart Legal
      </span>
      <br />
      <span className="text-gray-800">Companion</span>
    </h2>
    
    {/* Elegant Subtitle */}
    <div className="text-2xl md:text-2xl font-light text-gray-600 mb-4 tracking-wide">
      — Simplifying Justice for Everyone
    </div>
    
    {/* Sophisticated Decorative Line */}
    <div className="flex justify-center mb-4">
      <div className="flex items-center gap-4">
        <div className="w-16 h-px bg-gradient-to-r from-transparent to-green-400"></div>
        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
        <div className="w-24 h-px bg-gradient-to-r from-green-400 to-emerald-400"></div>
        <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
        <div className="w-16 h-px bg-gradient-to-r from-emerald-400 to-transparent"></div>
      </div>
    </div>

    <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed font-light">
      Your trusted AI-powered legal companion simplifying everyday legal needs with smart, structured assistance
    </p>

{/* Creative Animated Legal Workflow */}
{/* Creative Animated Legal Workflow */}
    <div className="relative w-full max-w-6xl mx-auto h-80 mb-16 overflow-hidden" style={{ fontFamily: 'Montserrat, sans-serif' }}>
      
      {/* Legal Workflow Path */}
      <div className="absolute inset-0 flex items-center justify-center">
        
        {/* Step 1: Legal Query - Left */}
        <div className="absolute left-8 top-1/2 transform -translate-y-1/2">
          <div className="relative">
            <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-emerald-200 rounded-2xl flex items-center justify-center shadow-xl border-2 border-green-300 animate-bounce" style={{ animationDelay: '0s', animationDuration: '2s' }}>
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 text-xs font-semibold text-green-700 whitespace-nowrap bg-white px-2 py-1 rounded shadow-sm">
              Legal Query
            </div>
            {/* Floating particles around icon */}
            <div className="absolute -top-2 -right-2 w-2 h-2 bg-green-400 rounded-full animate-ping"></div>
            <div className="absolute -bottom-2 -left-2 w-2 h-2 bg-emerald-400 rounded-full animate-ping" style={{ animationDelay: '1s' }}></div>
          </div>
        </div>

        {/* Step 2: AI Processing - Left-Center */}
        <div className="absolute left-1/4 top-1/4 transform -translate-x-1/2 -translate-y-1/4">
          <div className="relative">
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-100 to-green-200 rounded-2xl flex items-center justify-center shadow-xl border-2 border-emerald-300 animate-pulse" style={{ animationDelay: '0.5s' }}>
              <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 text-xs font-semibold text-emerald-700 whitespace-nowrap bg-white px-2 py-1 rounded shadow-sm">
              AI Processing
            </div>
            {/* Processing indicator */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 border-2 border-emerald-300 rounded-full animate-spin opacity-30" style={{ animationDuration: '3s' }}></div>
          </div>
        </div>

        {/* Step 3: Legal Database - Center */}
        <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="relative">
            <div className="w-20 h-20 bg-gradient-to-br from-green-200 to-emerald-300 rounded-2xl flex items-center justify-center shadow-2xl border-3 border-green-400 animate-pulse">
              <svg className="w-10 h-10 text-green-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <div className="absolute -bottom-14 left-1/2 transform -translate-x-1/2 text-sm font-bold text-green-800 whitespace-nowrap bg-white px-3 py-1 rounded shadow-md">
              Legal Database
            </div>
            {/* Central hub glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-green-300 to-emerald-300 rounded-2xl blur-xl opacity-30 animate-pulse"></div>
          </div>
        </div>

        {/* Step 4: Legal Analysis - Right-Center */}
        <div className="absolute right-1/4 top-1/4 transform translate-x-1/2 -translate-y-1/4">
          <div className="relative">
            <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-emerald-200 rounded-2xl flex items-center justify-center shadow-xl border-2 border-green-300 animate-bounce" style={{ animationDelay: '1s', animationDuration: '2s' }}>
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 text-xs font-semibold text-green-700 whitespace-nowrap bg-white px-2 py-1 rounded shadow-sm">
              Legal Analysis
            </div>
            {/* Analysis waves */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 border border-green-400 rounded-full animate-ping opacity-40" style={{ animationDelay: '0.5s' }}></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 border border-green-300 rounded-full animate-ping opacity-30" style={{ animationDelay: '1.5s' }}></div>
          </div>
        </div>

        {/* Step 5: Legal Solution - Right */}
        <div className="absolute right-8 top-1/2 transform -translate-y-1/2">
          <div className="relative">
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-100 to-green-200 rounded-2xl flex items-center justify-center shadow-xl border-2 border-emerald-300 animate-bounce" style={{ animationDelay: '1.5s', animationDuration: '2s' }}>
              <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 text-xs font-semibold text-emerald-700 whitespace-nowrap bg-white px-2 py-1 rounded shadow-sm">
              Legal Solution
            </div>
            {/* Success indicator */}
            <div className="absolute -top-2 -right-2 w-4 h-4 bg-emerald-500 rounded-full animate-pulse"></div>
            <div className="absolute -bottom-2 -left-2 w-3 h-3 bg-green-500 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
          </div>
        </div>

      </div>

    {/* Enhanced Connecting Flow Lines with Better Pathways */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        <defs>
          <linearGradient id="flowGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#10b981" stopOpacity="0.8"/>
            <stop offset="50%" stopColor="#059669" stopOpacity="0.6"/>
            <stop offset="100%" stopColor="#047857" stopOpacity="0.4"/>
          </linearGradient>
          
          <linearGradient id="flowGradient2" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#047857" stopOpacity="0.4"/>
            <stop offset="50%" stopColor="#059669" stopOpacity="0.6"/>
            <stop offset="100%" stopColor="#10b981" stopOpacity="0.8"/>
          </linearGradient>
          
          <filter id="flowGlow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        {/* Enhanced Moving data packets with corrected path */}
        <g>
          <circle r="6" fill="#10b981" opacity="0.9">
            <animateMotion dur="15s" repeatCount="indefinite">
              <mpath href="#dataPath"/>
            </animateMotion>
            <animate attributeName="opacity" values="0;1;1;0" dur="15s" repeatCount="indefinite"/>
          </circle>
          
          <circle r="5" fill="#059669" opacity="0.8">
            <animateMotion dur="15s" begin="3s" repeatCount="indefinite">
              <mpath href="#dataPath"/>
            </animateMotion>
            <animate attributeName="opacity" values="0;1;1;0" dur="15s" begin="3s" repeatCount="indefinite"/>
          </circle>
          
          <circle r="4" fill="#047857" opacity="0.7">
            <animateMotion dur="15s" begin="6s" repeatCount="indefinite">
              <mpath href="#dataPath"/>
            </animateMotion>
            <animate attributeName="opacity" values="0;1;1;0" dur="15s" begin="6s" repeatCount="indefinite"/>
          </circle>
          
          <circle r="5" fill="#34d399" opacity="0.6">
            <animateMotion dur="15s" begin="9s" repeatCount="indefinite">
              <mpath href="#dataPath"/>
            </animateMotion>
            <animate attributeName="opacity" values="0;1;1;0" dur="15s" begin="9s" repeatCount="indefinite"/>
          </circle>
          
          <circle r="4" fill="#6ee7b7" opacity="0.5">
            <animateMotion dur="15s" begin="12s" repeatCount="indefinite">
              <mpath href="#dataPath"/>
            </animateMotion>
            <animate attributeName="opacity" values="0;1;1;0" dur="15s" begin="12s" repeatCount="indefinite"/>
          </circle>
        </g>
        
        {/* EXTENDED path that reaches the 5th icon (Legal Solution) */}
        <defs>
        <path id="dataPath" d="M 72 160 Q 100 140 130 120 Q 160 100 180 80 Q 200 90 230 100 Q 260 120 290 140 Q 320 155 360 160 Q 400 155 430 140 Q 460 120 490 100 Q 520 90 550 85 Q 580 80 610 100 Q 640 120 670 140 Q 700 155 720 160" fill="none"/>
      </defs>
      </svg>
      {/* Enhanced Workflow Status Indicators with better positioning */}
      <div className="absolute top-4 left-4">
        <div className="bg-white/95 backdrop-blur-sm rounded-lg px-4 py-2 shadow-lg border border-green-100">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-xs text-green-700 font-semibold">Legal AI Workflow Active</span>
          </div>
        </div>
      </div>
      
      <div className="absolute top-4 right-4">
        <div className="bg-white/95 backdrop-blur-sm rounded-lg px-4 py-2 shadow-lg border border-emerald-100">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
            <span className="text-xs text-emerald-700 font-semibold">Processing Solutions</span>
          </div>
        </div>
      </div>

      {/* Enhanced Progress Bar with better positioning */}
      <div className="absolute bottom-4  left-1/2 transform -translate-x-1/2 w-120 h-3 bg-gray-200 rounded-full overflow-hidden shadow-inner">
        <div className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-40 animate-pulse"></div>
          {/* Moving progress indicator */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white opacity-30">
            <div className="h-full w-8 bg-white opacity-40 animate-pulse" style={{ animationDuration: '2s' }}></div>
          </div>
        </div>
        <div className="absolute -top-6 left-0 text-xs text-green-700 font-medium bg-white px-2 py-1 rounded shadow-sm">
          Legal Workflow Progress
        </div>
      </div>

    </div>

  </div>

  

  <div className="max-w-7xl mx-auto space-y-32 relative z-10">

    {/* Enhanced Section 1 - E-FIR Registration */}
    <div className="group">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
        {/* Left Content */}
        <div className="space-y-8 transform transition-all duration-700 group-hover:translate-x-2">
          {/* Professional Icon Badge */}
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-100 to-emerald-100 border border-green-200/50 rounded-3xl shadow-lg mb-6 group-hover:shadow-xl transition-all duration-300">
            <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>

          <h3 className="text-4xl md:text-5xl font-bold text-gray-800 leading-tight tracking-tight">
            E-FIR REGISTRATION
          </h3>
          
          <p className="text-xl text-gray-600 leading-relaxed font-light">
            E-FIR lets you file complaints online through verified state portals, accessible anytime from anywhere, ensuring faster registration
          </p>

          {/* Professional Feature List */}
          <div className="space-y-6 pl-4 border-l-2 border-green-200">
            {[
              "Click to Register",
              "Navigate to Official Portal",
              "File Your Complaint"
            ].map((item, idx) => (
              <div key={idx} className="flex items-center gap-4 group/item">
                <div className="w-4 h-4 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full shadow-md transform transition-all duration-300 group-hover/item:scale-125"></div>
                <span className="text-gray-700 font-medium text-lg">{item}</span>
              </div>
            ))}
          </div>

          {/* Premium Button */}
          <div className="pt-6">
            <a
              href="https://eservices.tnpolice.gov.in/CCTNSNICSDC/ComplaintRegistrationPage?0"
              target="_blank"
              rel="noopener noreferrer"
              className="group/btn inline-flex items-center gap-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-10 py-5 rounded-2xl font-semibold text-lg shadow-xl transform transition-all duration-300 hover:scale-105 hover:shadow-2xl"
            >
              Register Now
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center transform transition-transform duration-300 group-hover/btn:translate-x-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
            </a>
          </div>
        </div>

        {/* Enhanced Image Section */}
        <div className="flex justify-center transform transition-all duration-700 group-hover:-translate-x-2">
          <div className="relative">
            {/* Professional Glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-green-200/30 to-emerald-200/30 rounded-[2rem] blur-3xl opacity-60 animate-pulse"></div>
            
            <img
              src={img1}
              alt="E-FIR Registration"
              className="relative w-full max-w-xl h-[28rem] object-cover rounded-[2rem] shadow-2xl transform transition-all duration-500 hover:scale-[1.02] border border-green-100/50"
            />
            
            {/* Professional Badge */}
            <div className="absolute -top-6 -right-6 bg-white rounded-2xl px-6 py-3 shadow-xl border border-green-100">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm font-bold text-green-700">Verified Portal</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* Enhanced Section 2 - FIR Generator */}
    <div className="group">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
        {/* Enhanced Image */}
        <div className="order-2 lg:order-1 flex justify-center transform transition-all duration-700 group-hover:translate-x-2">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-200/30 to-green-200/30 rounded-[2rem] blur-3xl opacity-60 animate-pulse"></div>
            
            <img
              src={img2}
              alt="FIR Generator"
              className="relative w-full max-w-xl h-[28rem] object-cover rounded-[2rem] shadow-2xl transform transition-all duration-500 hover:scale-[1.02] border border-emerald-100/50"
            />
            
            <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl px-6 py-3 shadow-xl border border-emerald-100">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-bold text-emerald-700">Instant Generation</span>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Content */}
        <div className="order-1 lg:order-2 space-y-8 transform transition-all duration-700 group-hover:-translate-x-2">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-emerald-100 to-green-100 border border-emerald-200/50 rounded-3xl shadow-lg mb-6 group-hover:shadow-xl transition-all duration-300">
            <svg className="w-10 h-10 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>

          <h3 className="text-4xl md:text-5xl font-bold text-gray-800 leading-tight tracking-tight">
            Instant FIR Generator
          </h3>
          
          <p className="text-xl text-gray-600 leading-relaxed font-light">
            Quickly turn real-life incidents into legally structured complaints or FIR drafts. Just fill a simple form detailing what happened, when, where, & who was involved.
          </p>

          <div className="space-y-6 pl-4 border-l-2 border-emerald-200">
            {[
              "Fill the Smart Form",
              "Complaint / FIR is Generated",
              "Download as PDF"
            ].map((item, idx) => (
              <div key={idx} className="flex items-center gap-4 group/item">
                <div className="w-4 h-4 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full shadow-md transform transition-all duration-300 group-hover/item:scale-125"></div>
                <span className="text-gray-700 font-medium text-lg">{item}</span>
              </div>
            ))}
          </div>

          <div className="pt-6">
            <button
              onClick={() => navigate("/fir")}
              className="group/btn inline-flex items-center gap-4 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white px-10 py-5 rounded-2xl font-semibold text-lg shadow-xl transform transition-all duration-300 hover:scale-105 hover:shadow-2xl"
            >
              Fill Form
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center transform transition-transform duration-300 group-hover/btn:translate-x-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>

    {/* Enhanced Section 3 - Legal Consultation */}
    <div className="group">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
        {/* Enhanced Content */}
        <div className="space-y-8 transform transition-all duration-700 group-hover:translate-x-2">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-100 to-emerald-100 border border-green-200/50 rounded-3xl shadow-lg mb-6 group-hover:shadow-xl transition-all duration-300">
            <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>

          <h3 className="text-4xl md:text-5xl font-bold text-gray-800 leading-tight tracking-tight">
            Get Legal Consultation
          </h3>
          
          <p className="text-xl text-gray-600 leading-relaxed font-light">
            Click the "Hire Lawyer" button to access a smart search page where you can easily find legal professionals based on your specific needs.
          </p>

          <div className="space-y-6 pl-4 border-l-2 border-green-200">
            {[
              "Click 'Hire Lawyer'",
              "Apply Filters",
              "Browse Lawyer Profiles"
            ].map((item, idx) => (
              <div key={idx} className="flex items-center gap-4 group/item">
                <div className="w-4 h-4 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full shadow-md transform transition-all duration-300 group-hover/item:scale-125"></div>
                <span className="text-gray-700 font-medium text-lg">{item}</span>
              </div>
            ))}
          </div>

          <div className="pt-6">
            <button
              onClick={() => navigate("/hire-lawyer")}
              className="group/btn inline-flex items-center gap-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-10 py-5 rounded-2xl font-semibold text-lg shadow-xl transform transition-all duration-300 hover:scale-105 hover:shadow-2xl"
            >
              Hire Lawyer
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center transform transition-transform duration-300 group-hover/btn:translate-x-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
            </button>
          </div>
        </div>

        {/* Enhanced Image */}
        <div className="flex justify-center transform transition-all duration-700 group-hover:-translate-x-2">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-green-200/30 to-emerald-200/30 rounded-[2rem] blur-3xl opacity-60 animate-pulse"></div>
            
            <img
              src={img3}
              alt="Legal Consultation"
              className="relative w-full max-w-xl h-[28rem] object-cover rounded-[2rem] shadow-2xl transform transition-all duration-500 hover:scale-[1.02] border border-green-100/50"
            />
            
            <div className="absolute -top-6 -right-6 bg-white rounded-2xl px-6 py-3 shadow-xl border border-green-100">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm font-bold text-green-700">Expert Lawyers</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>


<section className="bg-[#0c1c11] text-white py-12 px-6 md:px-16 ">
  <div className="max-w-6xl mx-auto text-center mb-16">
    <span className="px-4 py-1 bg-green-200 text-green-800 text-sm font-semibold rounded-full">
      FEATURES
    </span>
    <h1 className="text-6xl font-bold mb-4 mt-6">Packed with Power</h1>
    <p className="text-gray-400 mt-2 max-w-2xl mx-auto"> Designed for Real Legal Needs.</p>
  </div>
<div className="space-y-12 my-12 px-4">
  {/* Row 1 */}
  <div className="flex flex-col md:flex-row gap-8 max-w-6xl mx-auto">
    {/* Card 1 - Flex 2 */}
    <div className="flex-[2] bg-[#d3e8da] text-black p-8 rounded-3xl hover:shadow-lg transition-shadow duration-300 flex items-center justify-between gap-6">
      <div className="max-w-lg">
        <h1 className="text-2xl md:text-3xl font-bold mb-4">Multilanguage Support</h1>
        <p className="text-gray-800 text-base md:text-lg leading-relaxed">
           The platform provides multilingual support, allowing users to access and fill the FIR form in regional languages (like Hindi, Tamil, etc.) to ensure better accessibility for non-English speakers.

        </p>
      </div>
      <img src={img4} alt="Cross-Platform Sync" className="w-48 md:w-60 h-auto" />
    </div>

    {/* Card 2 - Flex 1 */}
    <div className="flex-[1.5] bg-[#d3e8da] text-black p-8 rounded-3xl hover:shadow-lg transition-shadow duration-300 flex items-center justify-between gap-6">
      <div className="max-w-lg">
        <h1 className="text-2xl md:text-3xl font-bold mb-4">Voice Recoganiser
</h1>
        <p className="text-gray-800 text-base md:text-lg leading-relaxed">
           Voice-to-text input lets users speak their complaint details, making the process easier for those with limited typing skills or disabilities.

        </p>
      </div>
      <img src={img5} alt="Dependent Task" className="w-40 md:w-52 h-auto" />
    </div>
  </div>

  {/* Row 2 (reverse ratio) */}
  <div className="flex flex-col md:flex-row gap-8 max-w-6xl mx-auto">
    {/* Card 1 - Flex 1 */}
    <div className="flex-[2] bg-[#d3e8da] text-black p-8 rounded-3xl hover:shadow-lg transition-shadow duration-300 flex items-center justify-between gap-6">
      <div className="max-w-lg">
        <h1 className="text-2xl md:text-3xl font-bold mb-4">Mobile-Friendly App</h1>
        <p className="text-gray-800 text-base md:text-lg leading-relaxed">
           The interface is fully responsive and optimized for mobile devices, ensuring seamless FIR filing on-the-go with smooth navigation and faster form submission.

        </p>
      </div>
      <img src={img6} alt="Cross-Platform Sync" className="w-40 md:w-52 h-auto" />
    </div>

    {/* Card 2 - Flex 2 */}
    <div className="flex-[2] bg-[#d3e8da] text-black p-8 rounded-3xl hover:shadow-lg transition-shadow duration-300 flex items-center justify-between gap-6">
      <div className="max-w-lg">
        <h1 className="text-2xl md:text-3xl font-bold mb-4">Maintain Chatbot History</h1>
        <p className="text-gray-800 text-base md:text-lg leading-relaxed">
          The system stores previous chatbot interactions, allowing users and administrators to refer back to past queries, follow-ups, or suggestions made by the AI assistant.

        </p>
      </div>
      <img src={img7} alt="Dependent Task" className="w-48 md:w-60 h-auto" />
    </div>
  </div>
</div>
</section>


<div className="flex justify-center mb-8">
  <div className="w-full h-1 bg-gradient-to-r from-transparent via-emerald-500 to-transparent"></div>
</div>


<section className="bg-[#0d1b14] py-16">
  <h1 className="text-white text-center text-4xl md:text-6xl font-bold mb-36">
    Legal Collaborative Partners
  </h1>

  {/* Setup logos array */}
  {(() => {
    const logos = [img8, img9, img10, img11, img12];

    return (
      <>
        {/* Row 1: Left to Right */}
        <div
          ref={row1Ref}
          className="flex gap-6 overflow-hidden whitespace-nowrap px-4 mb-10"
        >
          {partners.map((name, i) => (
            <div
              key={`row1-${i}`}
              className="flex-shrink-0 flex items-center gap-4 px-6 py-3 bg-white text-black rounded-full shadow-md text-lg md:text-xl font-semibold min-w-max"
            >
              <img
                src={logos[i % logos.length]}
                alt={name}
                className="w-8 h-8 object-contain rounded-full"
              />
              {name}
            </div>
          ))}
        </div>

        {/* Row 2: Right to Left */}
        <div
          ref={row2Ref}
          className="flex gap-6 overflow-hidden whitespace-nowrap px-4"
        >
          {[...partners].reverse().map((name, i) => (
            <div
              key={`row2-${i}`}
              className="flex-shrink-0 flex items-center gap-4 px-6 py-3 bg-white text-black rounded-full shadow-md text-lg md:text-xl font-semibold min-w-max"
            >
              <img
                src={logos[i % logos.length]}
                alt={name}
                className="w-8 h-8 object-contain rounded-full"
              />
              {name}
            </div>
          ))}
        </div>
      </>
    );
  })()}
</section>


<section className="flex flex-col md:flex-row bg-white min-h-screen">
      <div className="flex-1 flex flex-col justify-center px-10 py-20">
        <span className="inline-block bg-green-100 w-28 text-green-800 px-4 py-1 rounded-full text-sm font-semibold mb-6">
          FileStack
        </span>
        <h1 className="text-6xl font-bold mb-6  text-green-800  leading-tight">
         1500+ Verified Legal Documents for reference
        </h1>
        <p className="text-gray-600 text-lg max-w-md">
One platform to search, reference, and validate legal documents relevant to your case — instantly and effortlessly.        </p>

         <a
          href="https://indiankanoon.org/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-black w-32 mt-16 text-white px-6 py-2 rounded-lg text-lg font-semibold shadow hover:bg-gray-800 transition"
        >
          Search
        </a>
      </div>

      <div className="flex-1 flex items-center justify-center px-10 py-20 bg-white relative overflow-hidden">
        <img
          src={img13}
          alt="Templates Preview"
          className="max-w-full h-auto object-contain"
          style={{ transform: "scale(1.2)", marginRight: "-100px" }}
        />
      </div>
</section>

      {/* Document  */}



<section className="flex flex-col md:flex-row bg-white h-[500px] px-10 items-center">
      <div className="flex-1 mb-10 md:mb-0">
        <span className="inline-block bg-green-100 text-green-800 px-4 py-1 rounded-full text-sm font-semibold mb-6">
          FAQS
        </span>
        <h2 className="text-4xl md:text-5xl text-green-950 font-bold leading-tight mb-4">
          Have a question?<br />Here are some solutions
        </h2>
        <p className="text-gray-600 text-lg">
          For more queries, feel free to reach us.
        </p>
      </div>

      <div className="flex-1 space-y-4 w-full">
        {faqs.map((faq, idx) => (
          <div
            key={idx}
            className={`border border-green-200 rounded-xl px-6 py-4 transition ${
              openIndex === idx ? 'shadow-md bg-green-50' : 'hover:shadow-md'
            }`}
          >
            <div
              className="flex justify-between items-center cursor-pointer"
              onClick={() => toggleFAQ(idx)}
            >
              <p className="text-lg font-medium text-gray-900">{faq.question}</p>
              {openIndex === idx ? (
                <X className="text-gray-500 w-6 h-6" />
              ) : (
                <Plus className="text-gray-500 w-6 h-6" />
              )}
            </div>
            {openIndex === idx && (
              <p className="text-gray-700 mt-4 text-base">{faq.answer}</p>
            )}
          </div>
        ))}
      </div>
</section>


     <footer className="bg-[#0B1B10] text-white py-10 px-6 md:px-20">
      <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-10 border-b border-[#1c3123] pb-8">
        <div className="flex items-center gap-4">
          <img src={Logo} alt="Logo" className="w-14 h-14" />
          <div>
            <h2 className="text-xl font-bold tracking-wide">Legal Query AI</h2>
          </div>
        </div>

        <div className="text-center md:text-left">
          <p className="font-medium mb-2">Connect with us:</p>
          <div className="flex flex-col md:flex-row md:items-center gap-2 text-sm">
            <div className="flex items-center gap-2">
              <PhoneCall className="w-4 h-4" />
              <span>+91 63589 16474</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              <a href="mailto:gettasks@petpooja.com" className="underline">
                gettasks@legalqueryai.com
              </a>
            </div>
          </div>
        </div>

        <div className="flex items-start gap-2 text-sm max-w-xs">
          <MapPin className="w-4 h-4 mt-1" />
          <p>
            Sri Eshwar College Of Engineering, Coimbatore, 641202
          </p>
        </div>
      </div>

      <div className="flex justify-center gap-6 py-6">
        {[Linkedin, Instagram, Youtube, Facebook].map((Icon, idx) => (
          <div
            key={idx}
            className="w-12 h-12 border border-white rounded-full flex items-center justify-center hover:bg-white hover:text-[#0B1B10] transition"
          >
            <Icon className="w-5 h-5" />
          </div>
        ))}
      </div>

      <p className="text-center text-sm text-white">
        COPYRIGHT © 2025 – Syntax Squad Pvt. Ltd., India • Privacy • Compliance • Terms • EULA • Cancellation & Refund • Escalation Matrix
      </p>
    </footer>



        </main>
  );
};