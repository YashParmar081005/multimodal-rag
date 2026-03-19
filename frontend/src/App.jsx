import React, { useState } from 'react';
import Upload from './Upload';
import Chat from './Chat';
import { Layers, Trash2 } from 'lucide-react';
import axios from 'axios';

function App() {
  const [chunksProcessed, setChunksProcessed] = useState(0);
  const isReady = chunksProcessed > 0;

  const handleClear = async () => {
    try {
      await axios.delete('http://localhost:8000/clear');
      setChunksProcessed(0);
    } catch (err) {
      console.error("Failed to clear document", err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5 shadow-sm">
            <div className="bg-brand-600 p-2 rounded-lg relative overflow-hidden group">
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out"></div>
              <Layers className="w-5 h-5 text-white relative z-10" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">Multimodal RAG</h1>
            </div>
          </div>
          <div className="flex items-center gap-3">
             <div className="text-sm font-medium text-slate-500 bg-slate-100 px-3 py-1.5 rounded-full flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${isReady ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' : 'bg-amber-400 shadow-[0_0_8px_rgba(250,204,21,0.6)]'}`}></div>
                {isReady ? 'System Ready' : 'Waiting for PDF'}
             </div>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-5xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full">
          
          <div className="lg:col-span-4 flex flex-col gap-6">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
               <h2 className="text-sm font-semibold text-slate-800 uppercase tracking-wider mb-4 border-b border-slate-50 pb-2">Knowledge Base</h2>
               <p className="text-sm text-slate-600 mb-6 leading-relaxed">
                 Upload a PDF document to provide context. The system will extract text, generate vector embeddings, and store them securely in FAISS.
               </p>
               {isReady ? (
                 <div className="mb-6 p-4 bg-brand-50 rounded-xl border border-brand-100 flex justify-between items-center group">
                   <div>
                     <div className="text-xs font-semibold text-brand-700 uppercase tracking-wider mb-1">Status</div>
                     <div className="flex items-baseline gap-2">
                       <div className="text-2xl font-bold text-brand-900">{chunksProcessed}</div>
                       <div className="text-sm text-brand-600 font-medium">text chunks indexed</div>
                     </div>
                   </div>
                   <button 
                     onClick={handleClear}
                     className="p-3 text-red-500 hover:bg-red-100 hover:text-red-600 rounded-lg transition-colors flex items-center justify-center opacity-80 hover:opacity-100"
                     title="Remove File and Clear Knowledge Base"
                   >
                     <Trash2 className="w-5 h-5" />
                   </button>
                 </div>
               ) : (
                 <Upload onUploadSuccess={(chunks) => setChunksProcessed(chunks)} />
               )}
            </div>
          </div>

          <div className="lg:col-span-8 flex flex-col h-full min-h-[500px]">
            <Chat isReady={isReady} />
          </div>
          
        </div>
      </main>
    </div>
  );
}

export default App;
