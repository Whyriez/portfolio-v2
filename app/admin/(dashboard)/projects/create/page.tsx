'use client';

import { useState, useRef } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

// --- Toast Component (Local) ---
const Toast = ({ show, message, type }: { show: boolean, message: string, type: 'success' | 'error' }) => {
  if (!show) return null;
  return (
    <div className={`fixed bottom-8 right-8 z-50 px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 text-white animate-bounce-in ${type === 'success' ? 'bg-green-600' : 'bg-red-600'}`}>
      <span>{type === 'success' ? '✅' : '⚠️'}</span>
      <span className="font-medium">{message}</span>
    </div>
  );
};

export default function CreateProjectPage() {
  const router = useRouter();
  const supabase = createClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- States ---
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' as 'success' | 'error' });

  // Form Fields
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [github, setGithub] = useState('');
  const [link, setLink] = useState('');
  
  // Tags State
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');

  // Files State
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  // --- Helpers ---
  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast(prev => ({ ...prev, show: false })), 3000);
  };

  // 1. Handle Tags (Chip System)
  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === 'Enter' || e.key === ',') && tagInput.trim()) {
      e.preventDefault();
      if (!tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()]);
      }
      setTagInput('');
    }
  };

  const removeTag = (indexToRemove: number) => {
    setTags(tags.filter((_, index) => index !== indexToRemove));
  };

  // 2. Handle Files
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      setSelectedFiles(prev => [...prev, ...newFiles]); // Append files

      const newUrls = newFiles.map(file => URL.createObjectURL(file));
      setPreviewUrls(prev => [...prev, ...newUrls]); // Append previews
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    setPreviewUrls(prev => prev.filter((_, i) => i !== index));
  };

  // 3. Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // A. Upload Images
      const imageUrls: string[] = [];
      if (selectedFiles.length > 0) {
        for (const file of selectedFiles) {
          const fileExt = file.name.split('.').pop();
          const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
          const filePath = `projects/${fileName}`;

          const { error: uploadError } = await supabase.storage
            .from('portfolio')
            .upload(filePath, file);

          if (uploadError) throw uploadError;

          const { data } = supabase.storage.from('portfolio').getPublicUrl(filePath);
          imageUrls.push(data.publicUrl);
        }
      }

      // B. Save to DB
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          category,
          description,
          github,
          link,
          tags, // Kirim array langsung
          images: imageUrls,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to create project');
      }

      showToast('Project created successfully!', 'success');
      
      // Redirect after short delay
      setTimeout(() => {
        router.push('/admin/projects');
        router.refresh();
      }, 1500);

    } catch (error: any) {
      showToast(error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 md:p-8 pb-24">
      
      {/* --- HEADER --- */}
      <div className="flex items-center gap-4 mb-8">
        <Link
          href="/admin/projects"
          className="w-10 h-10 flex items-center justify-center rounded-xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-300 hover:scale-105 transition-transform shadow-sm"
        >
          ←
        </Link>
        <div>
           <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Create New Project</h1>
           <p className="text-sm text-gray-500 dark:text-gray-400">Add a new item to your portfolio gallery.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 animate-fade-in">

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT COLUMN (2/3) - Main Info */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* CARD 1: Basic Details */}
            <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 md:p-8 border border-gray-100 dark:border-gray-700 shadow-sm">
               <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-2">
                 <span>📝</span> Project Details
               </h2>
               
               <div className="space-y-5">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-semibold uppercase text-gray-500 mb-2">Project Name <span className="text-red-500">*</span></label>
                      <input required type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. E-Commerce App"
                        className="w-full p-3.5 rounded-xl bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold uppercase text-gray-500 mb-2">Category <span className="text-red-500">*</span></label>
                      <div className="relative">
                        <select required value={category} onChange={(e) => setCategory(e.target.value)}
                          className="w-full p-3.5 rounded-xl bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 outline-none focus:border-blue-500 appearance-none cursor-pointer">
                          <option value="">Select Category...</option>
                          <option value="Mobile App">Mobile App</option>
                          <option value="Web App">Web App</option>
                          <option value="UI/UX Design">UI/UX Design</option>
                          <option value="Backend System">Backend System</option>
                          <option value="IoT Project">IoT Project</option>
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">▼</div>
                      </div>
                    </div>
                 </div>

                 <div>
                    <label className="block text-xs font-semibold uppercase text-gray-500 mb-2">Description <span className="text-red-500">*</span></label>
                    <textarea required rows={5} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe the features, challenges, and solutions..."
                      className="w-full p-3.5 rounded-xl bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all resize-none" />
                 </div>
               </div>
            </div>

            {/* CARD 2: Tech Stack (Improved Tags) */}
            <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 md:p-8 border border-gray-100 dark:border-gray-700 shadow-sm">
               <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-2">
                 <span>⚡</span> Tech Stack & Tags
               </h2>
               
               <div>
                  <label className="block text-xs font-semibold uppercase text-gray-500 mb-2">
                    Add Tags <span className="normal-case font-normal text-gray-400 ml-1">(Type and press Enter)</span>
                  </label>
                  <div className="flex flex-wrap items-center gap-2 p-3 rounded-xl bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all">
                    {tags.map((tag, index) => (
                      <span key={index} className="flex items-center gap-1 px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg text-sm font-medium animate-pop-in">
                        {tag}
                        <button type="button" onClick={() => removeTag(index)} className="hover:text-blue-900 dark:hover:text-blue-100 ml-1">×</button>
                      </span>
                    ))}
                    <input 
                      type="text" 
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={handleTagKeyDown}
                      placeholder={tags.length === 0 ? "e.g. React, Supabase, TypeScript..." : ""}
                      className="flex-1 bg-transparent outline-none min-w-[150px] text-gray-800 dark:text-white placeholder-gray-400"
                    />
                  </div>
               </div>
            </div>

            {/* CARD 3: Gallery Upload */}
             <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 md:p-8 border border-gray-100 dark:border-gray-700 shadow-sm">
               <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-2">
                 <span>📸</span> Project Gallery
               </h2>
               
               <div 
                 onClick={() => fileInputRef.current?.click()}
                 className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-2xl p-8 text-center hover:bg-gray-50 dark:hover:bg-white/5 transition-colors cursor-pointer group"
               >
                 <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/20 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                   <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                 </div>
                 <h3 className="font-semibold text-gray-800 dark:text-white">Click to upload images</h3>
                 <p className="text-sm text-gray-500 mt-1">SVG, PNG, JPG or GIF (Max. 5MB)</p>
                 <input type="file" ref={fileInputRef} multiple accept="image/*" onChange={handleFileChange} className="hidden" />
               </div>

               {/* Preview Grid */}
               {previewUrls.length > 0 && (
                 <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                   {previewUrls.map((url, idx) => (
                     <div key={idx} className="group relative aspect-video rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm">
                       <Image src={url} alt="Preview" fill className="object-cover" />
                       <button 
                         type="button" 
                         onClick={() => removeFile(idx)}
                         className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 shadow-lg"
                       >
                         <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                       </button>
                     </div>
                   ))}
                 </div>
               )}
             </div>

          </div>

          {/* RIGHT COLUMN (1/3) - Sidebar Actions */}
          <div className="lg:col-span-1 space-y-8">
            
            {/* LINKS CARD */}
            <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm">
              <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-6">🔗 Project Links</h2>
              <div className="space-y-4">
                <div>
                   <label className="block text-xs font-semibold uppercase text-gray-500 mb-2">GitHub Repository</label>
                   <div className="flex items-center gap-2 p-3 rounded-xl bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700">
                     <span className="text-lg">🐙</span>
                     <input type="url" value={github} onChange={(e) => setGithub(e.target.value)} placeholder="https://github.com/..."
                       className="flex-1 bg-transparent outline-none text-sm min-w-0" />
                   </div>
                </div>
                <div>
                   <label className="block text-xs font-semibold uppercase text-gray-500 mb-2">Live Demo URL</label>
                   <div className="flex items-center gap-2 p-3 rounded-xl bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700">
                     <span className="text-lg">🌍</span>
                     <input type="url" value={link} onChange={(e) => setLink(e.target.value)} placeholder="https://..."
                       className="flex-1 bg-transparent outline-none text-sm min-w-0" />
                   </div>
                </div>
              </div>
            </div>

            {/* PUBLISH ACTION */}
            <div className="sticky top-8">
              <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 border border-gray-100 dark:border-gray-700 shadow-lg shadow-blue-500/5">
                 <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-4">Publish Project</h2>
                 <p className="text-sm text-gray-500 mb-6">Once published, this project will be visible to everyone on your portfolio.</p>
                 
                 <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 rounded-xl font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:shadow-lg hover:shadow-blue-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Processing...</span>
                      </>
                    ) : (
                      <>
                        <span>🚀</span> Publish Now
                      </>
                    )}
                  </button>
              </div>
            </div>

          </div>
        </div>

      </form>
      
      <Toast show={toast.show} message={toast.message} type={toast.type} />
    </div>
  );
}