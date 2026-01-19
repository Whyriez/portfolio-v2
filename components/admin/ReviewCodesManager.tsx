'use client';

import { useState, useEffect } from 'react';

// --- Toast Component (Local) ---
const Toast = ({ show, message, type }: { show: boolean, message: string, type: 'success' | 'error' }) => {
  if (!show) return null;
  return (
    <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[60] px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 text-white bg-gray-900/90 backdrop-blur-md animate-fade-in-up">
      <span>{type === 'success' ? '✨' : '⚠️'}</span>
      <span className="font-medium text-sm">{message}</span>
    </div>
  );
};

interface ReviewCode {
  id: string;
  code: string;
  client_name: string;
  is_used: boolean;
  created_at: string;
}

export default function ReviewCodesManager() {
  const [isOpen, setIsOpen] = useState(false);
  const [codes, setCodes] = useState<ReviewCode[]>([]);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [clientName, setClientName] = useState('');
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' as 'success' | 'error' });

  // Fetch Codes saat modal dibuka
  useEffect(() => {
    if (isOpen) {
      fetchCodes();
    }
  }, [isOpen]);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast(prev => ({ ...prev, show: false })), 2000);
  };

  const fetchCodes = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/review-codes');
      if (res.ok) {
        const data = await res.json();
        setCodes(data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setGenerating(true);
    
    try {
      const res = await fetch('/api/review-codes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ client_name: clientName || 'Unknown Client' }),
      });

      if (res.ok) {
        setClientName('');
        fetchCodes(); // Refresh list
        showToast('New code generated!', 'success');
      }
    } catch (error) {
      showToast('Failed to generate code', 'error');
    } finally {
      setGenerating(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this invitation code?')) return;
    try {
      await fetch(`/api/review-codes/${id}`, { method: 'DELETE' });
      setCodes(prev => prev.filter(c => c.id !== id));
      showToast('Code deleted', 'success');
    } catch (error) {
      showToast('Failed to delete', 'error');
    }
  };

  const copyLink = (code: string) => {
    const url = `${window.location.origin}/send-review/${code}`;
    navigator.clipboard.writeText(url);
    showToast('Link copied to clipboard!', 'success');
  };

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-xl font-medium transition-all shadow-lg shadow-purple-500/20 hover:shadow-purple-500/30 active:scale-95 flex items-center gap-2 text-sm"
      >
        <span>🎟️</span> 
        <span className="hidden sm:inline">Invite Client</span>
      </button>

      {/* Modal Backdrop */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
            onClick={() => setIsOpen(false)}
          />
          
          <div className="relative bg-white dark:bg-gray-800 w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-scale-in">
            
            {/* Header */}
            <div className="p-6 border-b border-gray-100 dark:border-white/10 flex justify-between items-center bg-gray-50/50 dark:bg-white/5">
              <div>
                <h3 className="text-xl font-bold text-gray-800 dark:text-white">Review Invitations</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Generate unique codes for clients to submit reviews.</p>
              </div>
              <button 
                onClick={() => setIsOpen(false)} 
                className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 dark:bg-white/10 hover:bg-gray-300 dark:hover:bg-white/20 transition-colors text-gray-600 dark:text-gray-300"
              >
                ✕
              </button>
            </div>

            {/* Body */}
            <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
              
              {/* Generator Form */}
              <div className="bg-purple-50 dark:bg-purple-900/10 p-5 rounded-2xl border border-purple-100 dark:border-purple-500/20 mb-8">
                 <label className="text-xs font-bold uppercase text-purple-600 dark:text-purple-400 mb-2 block tracking-wider">Create New Invitation</label>
                 <form onSubmit={handleGenerate} className="flex gap-3">
                  <div className="relative flex-1">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">🏢</span>
                    <input 
                      type="text" 
                      placeholder="Client Name (e.g. Acme Corp)" 
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-white dark:bg-gray-900 border border-purple-100 dark:border-purple-500/30 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all text-sm"
                      required
                    />
                  </div>
                  <button 
                    type="submit" 
                    disabled={generating}
                    className="px-6 py-3 bg-purple-600 text-white rounded-xl font-bold hover:bg-purple-700 disabled:opacity-50 transition-all shadow-md shadow-purple-500/20 active:scale-95 text-sm whitespace-nowrap"
                  >
                    {generating ? '...' : 'Generate ⚡'}
                  </button>
                </form>
              </div>

              {/* List Codes */}
              <div>
                 <h4 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-4 flex items-center gap-2">
                   <span>🎫</span> Active Tickets
                 </h4>
                 
                 {loading ? (
                    <div className="space-y-3">
                       {[1,2,3].map(i => <div key={i} className="h-20 bg-gray-100 dark:bg-white/5 rounded-xl animate-pulse"/>)}
                    </div>
                 ) : (
                    <div className="space-y-4">
                      {codes.length === 0 && (
                        <div className="text-center py-10 border-2 border-dashed border-gray-200 dark:border-white/10 rounded-2xl">
                           <span className="text-4xl block mb-2 opacity-50">📭</span>
                           <p className="text-gray-500 text-sm">No invitations generated yet.</p>
                        </div>
                      )}

                      {codes.map((item) => (
                        <div key={item.id} className={`group relative flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-xl border transition-all hover:shadow-md
                            ${item.is_used 
                              ? 'bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/5 opacity-75 grayscale' 
                              : 'bg-white dark:bg-gray-800 border-purple-100 dark:border-purple-500/30 hover:border-purple-300 dark:hover:border-purple-500/50'
                            }`}>
                          
                          {/* Left: Code Info */}
                          <div className="flex items-center gap-4 mb-3 sm:mb-0">
                            <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-xl font-bold shrink-0
                                ${item.is_used ? 'bg-gray-200 text-gray-500' : 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400'}`}>
                               {item.is_used ? '✓' : '#'}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-mono font-bold text-lg text-gray-800 dark:text-white tracking-wider">
                                  {item.code}
                                </span>
                                {item.is_used ? (
                                  <span className="text-[10px] font-bold bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full border border-gray-300">USED</span>
                                ) : (
                                  <span className="text-[10px] font-bold bg-green-100 text-green-600 px-2 py-0.5 rounded-full border border-green-200 flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"/> ACTIVE
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                Client: <span className="font-semibold text-gray-700 dark:text-gray-300">{item.client_name}</span>
                              </p>
                              <p className="text-[10px] text-gray-400">Created: {new Date(item.created_at).toLocaleDateString()}</p>
                            </div>
                          </div>
                          
                          {/* Right: Actions */}
                          <div className="flex items-center gap-2 w-full sm:w-auto pl-16 sm:pl-0">
                            {!item.is_used && (
                              <button 
                                onClick={() => copyLink(item.code)}
                                className="flex-1 sm:flex-none px-4 py-2 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-900/40 text-blue-600 dark:text-blue-400 rounded-lg text-xs font-bold transition-colors border border-blue-200 dark:border-blue-800"
                              >
                                Copy Link 🔗
                              </button>
                            )}
                            <button 
                              onClick={() => handleDelete(item.id)}
                              className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                              title="Delete Code"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                            </button>
                          </div>

                        </div>
                      ))}
                    </div>
                 )}
              </div>
            </div>
            
            {/* Toast Container inside modal context if needed, but we used fixed position */}
          </div>
        </div>
      )}

      <Toast show={toast.show} message={toast.message} type={toast.type} />
    </>
  );
}