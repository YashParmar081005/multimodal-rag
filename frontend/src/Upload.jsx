import React, { useState, useRef } from 'react';
import { UploadCloud, File as FileIcon, CheckCircle2, AlertCircle } from 'lucide-react';
import axios from 'axios';

export default function Upload({ onUploadSuccess }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
      setError(null);
      setSuccess(false);
    } else {
      setFile(null);
      setError("Please select a valid PDF file.");
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    
    setLoading(true);
    setError(null);
    setSuccess(false);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('http://localhost:8000/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      setSuccess(true);
      if (onUploadSuccess) onUploadSuccess(response.data.chunks_processed);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.detail || "An error occurred during upload.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 w-full max-w-md mx-auto transition-all hover:shadow-md">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold tracking-tight text-slate-800">Upload Knowledge</h2>
        <p className="text-sm text-slate-500 mt-2">Upload a PDF to power the AI's answers.</p>
      </div>

      <div 
        className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${file ? 'border-brand-500 bg-brand-50' : 'border-slate-200 hover:border-brand-300 hover:bg-slate-50'}`}
        onClick={() => fileInputRef.current.click()}
      >
        <input 
          type="file" 
          className="hidden" 
          ref={fileInputRef} 
          accept=".pdf" 
          onChange={handleFileChange} 
        />
        
        {file ? (
          <div className="flex flex-col items-center">
            <div className="bg-white p-3 rounded-full shadow-sm mb-3">
              <FileIcon className="w-8 h-8 text-brand-500" />
            </div>
            <p className="text-sm font-medium text-slate-700 truncate max-w-full px-4">{file.name}</p>
            <p className="text-xs text-slate-400 mt-1">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
          </div>
        ) : (
          <div className="flex flex-col items-center">
             <div className="bg-slate-100 p-3 rounded-full mb-3">
              <UploadCloud className="w-8 h-8 text-slate-400" />
            </div>
            <p className="text-sm font-medium text-slate-600">Click to browse or drag and drop</p>
            <p className="text-xs text-slate-400 mt-1">PDF files only</p>
          </div>
        )}
      </div>

      {error && (
        <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {success && (
        <div className="mt-4 p-3 bg-green-50 text-green-700 rounded-lg text-sm flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          <p>Document processed! Ready for questions.</p>
        </div>
      )}

      <button
        onClick={handleUpload}
        disabled={!file || loading}
        className={`mt-6 w-full py-3 rounded-xl font-medium text-sm transition-all flex items-center justify-center gap-2 ${!file || loading ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-brand-600 text-white hover:bg-brand-700 shadow-sm hover:shadow'}`}
      >
        {loading ? (
          <>
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
            Processing...
          </>
        ) : (
          'Process Document'
        )}
      </button>
    </div>
  );
}
