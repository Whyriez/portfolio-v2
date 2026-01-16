'use client';

import { useState, useEffect } from 'react';

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

  // Fetch Codes saat modal dibuka
  useEffect(() => {
    if (isOpen) {
      fetchCodes();
    }
  }, [isOpen]);

  const fetchCodes = async () => {
    setLoading(true);
    const res = await fetch('/api/review-codes');
    if (res.ok) {
      const data = await res.json();
      setCodes(data);
    }
    setLoading(false);
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setGenerating(true);
    
    const res = await fetch('/api/review-codes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ client_name: clientName || 'Unknown Client' }),
    });

    if (res.ok) {
      setClientName('');
      fetchCodes(); // Refresh list
    }
    setGenerating(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this code?')) return;
    await fetch(`/api/review-codes/${id}`, { method: 'DELETE' });
    fetchCodes();
  };

  const copyLink = (code: string) => {
    // Generate URL lengkap (misal localhost:3000/send-review/CODE)
    const url = `${window.location.origin}/send-review/${code}`;
    navigator.clipboard.writeText(url);
    alert('Review Link Copied! Send this to your client.');
  };

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-gray-800 rounded-xl font-medium transition-colors shadow-lg shadow-purple-500/20 flex items-center gap-2"
      >
        <span>🎟️</span> Manage Codes
      </button>

      {/* Modal Backdrop */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
            
            {/* Header */}
            <div className="p-6 border-b border-gray-100 dark:border-white/10 flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-800 dark:text-white">Review Invitation Codes</h3>
              <button onClick={() => setIsOpen(false)} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">✕</button>
            </div>

            {/* Body */}
            <div className="p-6 overflow-y-auto flex-1">
              
              {/* Generator Form */}
              <form onSubmit={handleGenerate} className="flex gap-3 mb-8">
                <input 
                  type="text" 
                  placeholder="Client Name (e.g. PT. Mencari Cinta Sejati)" 
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="flex-1 p-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 outline-none focus:border-purple-500"
                  required
                />
                <button 
                  type="submit" 
                  disabled={generating}
                  className="px-6 py-3 bg-purple-600 text-white rounded-xl font-bold hover:bg-purple-700 disabled:opacity-50 transition-colors"
                >
                  {generating ? 'Generating...' : 'Generate New Code'}
                </button>
              </form>

              {/* List Codes */}
              {loading ? (
                <div className="text-center py-8">Loading codes...</div>
              ) : (
                <div className="space-y-3">
                  {codes.map((item) => (
                    <div key={item.id} className={`flex items-center justify-between p-4 rounded-xl border ${item.is_used ? 'bg-gray-100 dark:bg-white/5 border-gray-200 dark:border-white/5 opacity-60' : 'bg-white dark:bg-white/5 border-purple-200 dark:border-purple-900/30'}`}>
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <span className="font-mono font-bold text-lg text-purple-600 dark:text-purple-400">{item.code}</span>
                          {item.is_used ? (
                            <span className="text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded">USED</span>
                          ) : (
                            <span className="text-xs bg-green-100 text-green-600 px-2 py-0.5 rounded">ACTIVE</span>
                          )}
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">For: {item.client_name} • {new Date(item.created_at).toLocaleDateString()}</p>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {!item.is_used && (
                          <button 
                            onClick={() => copyLink(item.code)}
                            className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg text-sm font-medium"
                            title="Copy Link"
                          >
                            Copy Link 🔗
                          </button>
                        )}
                        <button 
                          onClick={() => handleDelete(item.id)}
                          className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                          title="Delete Code"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  ))}
                  
                  {codes.length === 0 && (
                    <div className="text-center text-gray-500 py-8">No codes generated yet.</div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}