'use client';

import { useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

export default function CreateCertificatePage() {
  const router = useRouter();
  const supabase = createClient();

  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState('');
  const [issuer, setIssuer] = useState('');
  const [issuedAt, setIssuedAt] = useState('');
  const [link, setLink] = useState('');

  const [type, setType] = useState('Competence');

  // File State
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [fileType, setFileType] = useState<'image' | 'pdf' | null>(null);
  const [isDragging, setIsDragging] = useState(false); // State untuk visual drag

  // Function helper untuk memproses file (dipakai di onChange dan onDrop)
  const processFile = (selectedFile: File) => {
    // Validasi tipe file manual jika dari drag-drop
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf'];
    if (!validTypes.includes(selectedFile.type)) {
      alert('File type not supported. Please upload Image or PDF.');
      return;
    }

    setFile(selectedFile);
    setPreviewUrl(URL.createObjectURL(selectedFile));

    if (selectedFile.type === 'application/pdf') {
      setFileType('pdf');
    } else {
      setFileType('image');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      processFile(e.target.files[0]);
    }
  };

  // --- Drag & Drop Handlers ---
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };
  // -----------------------------

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let fileUrl = '';

      if (file) {
        const fileExt = file.name.split('.').pop();
        const fileName = `certificates/${Date.now()}.${fileExt}`;
        const { error: upErr } = await supabase.storage.from('portfolio').upload(fileName, file);
        if (upErr) throw upErr;
        const { data } = supabase.storage.from('portfolio').getPublicUrl(fileName);
        fileUrl = data.publicUrl;
      }

      const res = await fetch('/api/certificates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          issuer,
          issued_at: issuedAt,
          link,
          image: fileUrl,
          type // <--- Kirim Type ke API
        }),
      });

      if (!res.ok) throw new Error('Failed to create');
      router.push('/admin/certificates');
      router.refresh();

    } catch (error: any) {
      alert('Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <div className="mb-8 flex items-center gap-4">
        <Link href="/admin/certificates" className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg">←</Link>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Add Certificate</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* File Upload Area dengan Drag & Drop */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-6 cursor-pointer relative transition-all duration-300
            ${isDragging
              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 scale-[1.02]'
              : 'border-gray-300 dark:border-white/20 hover:bg-gray-50 dark:hover:bg-white/5'
            }`}
        >
          {previewUrl ? (
            <div className="relative w-full h-48 flex items-center justify-center bg-gray-50 dark:bg-white/5 rounded-lg">
              {fileType === 'pdf' ? (
                <div className="text-center text-red-500">
                  <span className="text-5xl block mb-2">📄</span>
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-300">PDF Selected</span>
                  <p className="text-xs text-gray-400 mt-1">{file?.name}</p>
                </div>
              ) : (
                <Image src={previewUrl} alt="Preview" fill className="object-contain" />
              )}
              {/* Overlay saat hover agar user tau bisa ganti */}
              <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 flex items-center justify-center text-white font-medium rounded-lg transition-opacity">
                Click or Drop to Change
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-500">
              <span className={`text-4xl block mb-2 transition-transform ${isDragging ? 'scale-110' : ''}`}>
                {isDragging ? '📂' : '☁️'}
              </span>
              <p className="font-medium text-gray-700 dark:text-gray-300">
                {isDragging ? 'Drop file here' : 'Click or Drag file here'}
              </p>
              <p className="text-xs mt-1">JPG, PNG, PDF (Max 5MB)</p>
            </div>
          )}

          <input
            type="file"
            accept="image/*,.pdf"
            onChange={handleFileChange}
            className="absolute inset-0 opacity-0 cursor-pointer"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Certificate Type</label>
          <div className="relative">
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full p-3 rounded-xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 outline-none focus:border-blue-500 appearance-none cursor-pointer"
            >
              <option value="Competence">🏅 Competence (Keahlian)</option>
              <option value="Achievement">🏆 Achievement (Prestasi/Lomba)</option>
              <option value="General">📜 General (Seminar/Event)</option>
            </select>
            <div className="absolute right-4 top-3.5 pointer-events-none text-gray-500">▼</div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Certificate Name</label>
          <input required type="text" value={title} onChange={(e) => setTitle(e.target.value)}
            className="w-full p-3 rounded-xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 outline-none focus:border-blue-500 transition-colors" />
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Issuer</label>
            <input required type="text" value={issuer} onChange={(e) => setIssuer(e.target.value)}
              className="w-full p-3 rounded-xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 outline-none focus:border-blue-500 transition-colors" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Issue Date</label>
            <input required type="date" value={issuedAt} onChange={(e) => setIssuedAt(e.target.value)}
              className="w-full p-3 rounded-xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 outline-none focus:border-blue-500 transition-colors" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Credential URL</label>
          <input type="url" value={link} onChange={(e) => setLink(e.target.value)}
            className="w-full p-3 rounded-xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 outline-none focus:border-blue-500 transition-colors" placeholder="https://..." />
        </div>

        <button type="submit" disabled={loading}
          className="w-full py-3.5 rounded-xl font-bold text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:scale-[1.01] transition-transform shadow-lg shadow-blue-500/20 disabled:opacity-70">
          {loading ? 'Saving...' : 'Save Certificate'}
        </button>
      </form>
    </div>
  );
}