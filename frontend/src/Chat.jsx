import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Bot, Loader2, Sparkles } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

export default function Chat({ isReady }) {
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleAsk = async (e) => {
    e.preventDefault();
    if (!query.trim() || loading || !isReady) return;

    const userMsg = { role: 'user', content: query };
    setMessages(prev => [...prev, userMsg, { role: 'assistant', content: '' }]);
    setQuery('');
    setLoading(true);

    try {
      const response = await fetch(`http://localhost:8000/ask?query=${encodeURIComponent(userMsg.content)}`);
      if (!response.ok) throw new Error("Failed to fetch response");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const textChunk = decoder.decode(value, { stream: true });
        
        setMessages(prev => {
          const newMessages = [...prev];
          const lastIndex = newMessages.length - 1;
          newMessages[lastIndex] = {
            ...newMessages[lastIndex],
            content: newMessages[lastIndex].content + textChunk
          };
          return newMessages;
        });
      }
    } catch (err) {
      console.error(err);
      setMessages(prev => {
        const newMessages = [...prev];
        const lastIndex = newMessages.length - 1;
        newMessages[lastIndex] = {
          role: 'assistant',
          content: newMessages[lastIndex].content + "\n\nSorry, I encountered an error: " + err.message,
          error: true
        };
        return newMessages;
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 flex flex-col h-[600px] overflow-hidden">
      <div className="p-4 border-b border-slate-100 bg-white flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-brand-50 rounded-lg">
            <Sparkles className="w-5 h-5 text-brand-600" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-800">AI Assistant</h3>
            <p className="text-xs text-slate-500">
              {isReady ? "Ready to answer questions" : "Awaiting document upload"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
           <span className="relative flex h-3 w-3">
            {isReady && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75"></span>}
            <span className={`relative inline-flex rounded-full h-3 w-3 ${isReady ? 'bg-brand-500' : 'bg-slate-300'}`}></span>
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-3">
            <Bot className="w-12 h-12 text-slate-300" />
            <p className="text-sm">Ask anything about the uploaded document</p>
          </div>
        ) : (
          messages.map((msg, idx) => (
            <div key={idx} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.role === 'assistant' && (
                <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center flex-shrink-0 mt-1">
                  <Bot className="w-5 h-5 text-brand-600" />
                </div>
              )}
              
              <div className={`max-w-[80%] rounded-2xl px-5 py-3.5 text-sm overflow-hidden ${
                msg.role === 'user' 
                  ? 'bg-brand-600 text-white shadow-sm' 
                  : msg.error 
                    ? 'bg-red-50 text-red-700 border border-red-100' 
                    : 'bg-white text-slate-700 shadow-sm border border-slate-100'
              }`}>
                {msg.role === 'user' ? (
                  <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                ) : (
                  <div className="prose prose-sm prose-slate max-w-none prose-p:leading-relaxed prose-pre:bg-slate-800 prose-pre:text-slate-100 prose-a:text-brand-600 hover:prose-a:text-brand-700 break-words">
                    {msg.content === '' && loading ? (
                      <span className="animate-pulse">...</span>
                    ) : (
                      <ReactMarkdown>{msg.content}</ReactMarkdown>
                    )}
                  </div>
                )}
              </div>

              {msg.role === 'user' && (
                <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center flex-shrink-0 mt-1">
                  <User className="w-5 h-5 text-slate-600" />
                </div>
              )}
            </div>
          ))
        )}
        
        {loading && messages[messages.length-1]?.role !== 'assistant' && (
          <div className="flex gap-3 justify-start">
            <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center flex-shrink-0 mt-1">
              <Bot className="w-5 h-5 text-brand-600" />
            </div>
            <div className="bg-white border border-slate-100 rounded-2xl px-5 py-4 flex items-center gap-2 shadow-sm">
              <Loader2 className="w-4 h-4 text-brand-500 animate-spin" />
              <span className="text-sm text-slate-500 font-medium">Connecting...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-white border-t border-slate-100">
        <form onSubmit={handleAsk} className="relative flex items-center">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            disabled={!isReady || loading}
            placeholder={isReady ? "Ask a question..." : "Please upload a document first"}
            className="w-full pl-5 pr-14 py-4 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all disabled:opacity-60 disabled:cursor-not-allowed text-slate-900"
          />
          <button
            type="submit"
            disabled={!query.trim() || !isReady || loading}
            className="absolute right-2 p-2.5 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors disabled:opacity-50 disabled:bg-slate-300 disabled:hover:bg-slate-300 disabled:text-slate-500 disabled:cursor-not-allowed"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
