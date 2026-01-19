'use client';

import { useEffect, useState, use, useRef } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

// --- Toast Component ---
const Toast = ({ show, message, type }: { show: boolean, message: string, type: 'success' | 'error' }) => {
  if (!show) return null;
  return (
    <div className={`fixed bottom-8 right-8 z-50 px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 text-white animate-bounce-in ${type === 'success' ? 'bg-green-600' : 'bg-red-600'}`}>
      <span>{type === 'success' ? '✅' : '⚠️'}</span>
      <span className="font-medium">{message}</span>
    </div>
  );
};

export default function EditCertificatePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const supabase = createClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // States
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' as 'success' | 'error' });

  // Form Fields
  const [title, setTitle] = useState('');
  const [issuer, setIssuer] = useState('');
  const [issuedAt, setIssuedAt] = useState('');
  const [link, setLink] = useState('');
  const [type, setType] = useState('Competence');
  
  // File States
  const [oldFileUrl, setOldFileUrl] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [fileType, setFileType] = useState<'image' | 'pdf' | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Helper: Toast
  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast(prev => ({ ...prev, show: false })), 3000);
  };

  // 1. Fetch Data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`/api/certificates/${id}`);
        if (!res.ok) throw new Error('Failed to fetch certificate');
        
        const data = await res.json();
        setTitle(data.title || '');
        setIssuer(data.issuer || '');
        setIssuedAt(data.issued_at ? data.issued_at.split('T')[0] : '');
        setLink(data.link || '');
        setType(data.type || 'Competence');
        setOldFileUrl(data.image || '');

        // Determine initial file type
        if (data.image) {
           const isPdf = data.image.toLowerCase().includes('.pdf');
           setFileType(isPdf ? 'pdf' : 'image');
        }

      } catch (err) {
        console.error(err);
        showToast('Error loading data', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  // Helper: Process File
  const processFile = (selectedFile: File) => {
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf'];
    if (!validTypes.includes(selectedFile.type)) {
      showToast('File type not supported. Please upload Image or PDF.', 'error');
      return;
    }

    if (selectedFile.size > 5 * 1024 * 1024) {
        showToast('File size too large (Max 5MB).', 'error');
        return;
    }

    setFile(selectedFile);
    setPreviewUrl(URL.createObjectURL(selectedFile));
    setFileType(selectedFile.type === 'application/pdf' ? 'pdf' : 'image');
  };

  // Drag & Drop Handlers
  const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(false); };
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files?.[0]) processFile(e.dataTransfer.files[0]);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) processFile(e.target.files[0]);
  };

  // 2. Handle Update
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      let finalFileUrl = oldFileUrl;

      // Upload ONLY if new file exists
      if (file) {
        const fileExt = file.name.split('.').pop();
        const fileName = `certificates/${Date.now()}.${fileExt}`;
        const { error: upErr } = await supabase.storage.from('portfolio').upload(fileName, file);
        if (upErr) throw upErr;
        
        const { data } = supabase.storage.from('portfolio').getPublicUrl(fileName);
        finalFileUrl = data.publicUrl;
      }

      const res = await fetch(`/api/certificates/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            title, 
            issuer, 
            issued_at: issuedAt, 
            link, 
            image: finalFileUrl,
            type 
        }),
      });

      if (!res.ok) throw new Error('Failed to update certificate');

      showToast('Certificate updated successfully!', 'success');
      setTimeout(() => {
        router.push('/admin/certificates');
        router.refresh();
      }, 1500);

    } catch (error: any) {
      showToast(error.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
     <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
     </div>
  );

  return (
    <div className="max-w-4xl mx-auto p-6 md:p-8 pb-20">
      
      {/* --- HEADER --- */}
      <div className="flex items-center gap-4 mb-8">
        <Link 
          href="/admin/certificates" 
          className="w-10 h-10 flex items-center justify-center rounded-xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-300 hover:scale-105 transition-transform shadow-sm"
        >
          ←
        </Link>
        <div>
           <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Edit Certificate</h1>
           <p className="text-sm text-gray-500 dark:text-gray-400">Update certification details.</p>
        </div>
      </div>

      <form onSubmit={handleUpdate} className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in">
        
        {/* LEFT: File Upload (1/3) */}
        <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm h-full">
                <h2 className="text-sm font-bold text-gray-800 dark:text-white mb-4 uppercase tracking-wider flex items-center gap-2">
                    <span>📄</span> Document
                </h2>
                
                <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`flex flex-col items-center justify-center border-2 border-dashed rounded-2xl p-6 cursor-pointer relative transition-all duration-300 aspect-[3/4]
                    ${isDragging
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 scale-[1.02]'
                        : 'border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-white/5'
                    }`}
                >
                    {(previewUrl || oldFileUrl) ? (
                        <div className="w-full h-full flex flex-col items-center justify-center relative">
                            {fileType === 'pdf' ? (
                                <div className="text-center text-red-500 animate-pop-in">
                                    <span className="text-6xl block mb-3">📄</span>
                                    <span className="text-sm font-bold bg-red-100 text-red-600 px-3 py-1 rounded-full">PDF File</span>
                                    <p className="text-xs text-gray-500 mt-2 px-2 break-all line-clamp-2">
                                        {file ? file.name : 'Current PDF File'}
                                    </p>
                                </div>
                            ) : (
                                <Image 
                                    src={previewUrl || oldFileUrl} 
                                    alt="Preview" 
                                    fill 
                                    className="object-contain rounded-lg p-2" 
                                />
                            )}
                            
                            {/* Hover Overlay */}
                            <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 flex items-center justify-center text-white font-bold rounded-lg transition-opacity backdrop-blur-sm">
                                <span>↻ Change File</span>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center text-gray-400">
                             <span className="text-5xl block mb-4">☁️</span>
                             <p>Upload File</p>
                        </div>
                    )}
                    
                    <input type="file" ref={fileInputRef} accept="image/*,.pdf" onChange={handleFileChange} className="hidden" />
                </div>
            </div>
        </div>

        {/* RIGHT: Details Form (2/3) */}
        <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 md:p-8 border border-gray-100 dark:border-gray-700 shadow-sm">
                <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-2">
                    <span>📝</span> Certificate Details
                </h2>

                <div className="space-y-6">
                    {/* Title */}
                    <div>
                        <label className="block text-xs font-semibold uppercase text-gray-500 mb-2">Certificate Name</label>
                        <input required type="text" value={title} onChange={(e) => setTitle(e.target.value)}
                            className="w-full p-3.5 rounded-xl bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Issuer */}
                        <div>
                            <label className="block text-xs font-semibold uppercase text-gray-500 mb-2">Issuer Organization</label>
                            <input required type="text" value={issuer} onChange={(e) => setIssuer(e.target.value)}
                                className="w-full p-3.5 rounded-xl bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all" />
                        </div>

                        {/* Date */}
                        <div>
                            <label className="block text-xs font-semibold uppercase text-gray-500 mb-2">Issue Date</label>
                            <input required type="date" value={issuedAt} onChange={(e) => setIssuedAt(e.target.value)}
                                className="w-full p-3.5 rounded-xl bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all text-gray-600 dark:text-gray-300" />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Type */}
                        <div>
                            <label className="block text-xs font-semibold uppercase text-gray-500 mb-2">Category</label>
                            <div className="relative">
                                <select value={type} onChange={(e) => setType(e.target.value)}
                                    className="w-full p-3.5 rounded-xl bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 outline-none focus:border-blue-500 appearance-none cursor-pointer">
                                    <option value="Competence">🏅 Competence (Keahlian)</option>
                                    <option value="Achievement">🏆 Achievement (Prestasi)</option>
                                    <option value="General">📜 General (Seminar/Event)</option>
                                </select>
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">▼</div>
                            </div>
                        </div>

                        {/* Link */}
                        <div>
                            <label className="block text-xs font-semibold uppercase text-gray-500 mb-2">Credential URL</label>
                            <input type="url" value={link} onChange={(e) => setLink(e.target.value)}
                                className="w-full p-3.5 rounded-xl bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all" />
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-700 flex justify-end gap-4">
                    <button
                        type="submit"
                        disabled={saving}
                        className="px-8 py-3.5 rounded-xl font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:shadow-lg hover:shadow-blue-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        {saving ? (
                            <>
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                Saving...
                            </>
                        ) : (
                            'Update Certificate'
                        )}
                    </button>
                </div>
            </div>
        </div>

      </form>

      <Toast show={toast.show} message={toast.message} type={toast.type} />
    </div>
  );
}