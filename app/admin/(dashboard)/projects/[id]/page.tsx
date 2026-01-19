'use client';

import { useEffect, useState, use, useRef } from 'react';
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

export default function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
  // Unwrapping params (Next.js 15+)
  const { id } = use(params);
  const supabase = createClient();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- States ---
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
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

  // Image State
  const [oldImages, setOldImages] = useState<string[]>([]); // Gambar lama dari DB
  const [newFiles, setNewFiles] = useState<File[]>([]);     // File baru yang akan diupload
  const [newPreviewUrls, setNewPreviewUrls] = useState<string[]>([]); // Preview untuk file baru

  // --- Helpers ---
  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast(prev => ({ ...prev, show: false })), 3000);
  };

  // 1. Fetch Data
  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await fetch(`/api/projects/${id}`);
        if (!res.ok) throw new Error('Failed to fetch project');

        const data = await res.json();

        setTitle(data.title || '');
        setCategory(data.category || '');
        setDescription(data.description || '');
        setGithub(data.github || '');
        setLink(data.link || '');
        
        // Handle tags (support both array or legacy string)
        if (Array.isArray(data.tags)) {
            setTags(data.tags);
        } else if (typeof data.tags === 'string') {
            setTags(data.tags.split(',').map((t: string) => t.trim()).filter(Boolean));
        }

        setOldImages(data.images || []);
      } catch (err) {
        console.error(err);
        showToast('Error loading project data', 'error');
        // router.push('/admin/projects'); // Optional: redirect on error
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id, router]);

  // 2. Handle Tags
  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === 'Enter' || e.key === ',') && tagInput.trim()) {
      e.preventDefault();
      if (!tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()]);
      }
      setTagInput('');
    }
  };

  const removeTag = (index: number) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  // 3. Handle Images
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const filesArr = Array.from(e.target.files);
      setNewFiles(prev => [...prev, ...filesArr]);
      
      const urls = filesArr.map(file => URL.createObjectURL(file));
      setNewPreviewUrls(prev => [...prev, ...urls]);
    }
  };

  const removeNewFile = (index: number) => {
    setNewFiles(prev => prev.filter((_, i) => i !== index));
    setNewPreviewUrls(prev => prev.filter((_, i) => i !== index));
  };

  const removeOldImage = (urlToRemove: string) => {
    setOldImages(prev => prev.filter(url => url !== urlToRemove));
  };

  // 4. Handle Update
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      // A. Combine Old Images (that weren't deleted)
      const finalImages = [...oldImages];

      // B. Upload New Images
      if (newFiles.length > 0) {
        for (const file of newFiles) {
          const fileExt = file.name.split('.').pop();
          const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
          const filePath = `projects/${fileName}`;

          const { error: uploadError } = await supabase.storage
            .from('portfolio')
            .upload(filePath, file);

          if (uploadError) throw uploadError;

          const { data } = supabase.storage.from('portfolio').getPublicUrl(filePath);
          finalImages.push(data.publicUrl);
        }
      }

      // C. Save to DB
      const res = await fetch(`/api/projects/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          category,
          description,
          github,
          link,
          tags, // Array of strings
          images: finalImages,
        }),
      });

      if (!res.ok) throw new Error('Failed to update project');

      showToast('Project updated successfully!', 'success');
      
      // Redirect after delay
      setTimeout(() => {
        router.push('/admin/projects');
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
           <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Edit Project</h1>
           <p className="text-sm text-gray-500 dark:text-gray-400">Update project details and gallery.</p>
        </div>
      </div>

      <form onSubmit={handleUpdate} className="animate-fade-in">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* LEFT COLUMN (2/3) */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* 1. Details */}
            <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 md:p-8 border border-gray-100 dark:border-gray-700 shadow-sm">
               <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-2">
                 <span>📝</span> Project Information
               </h2>
               <div className="space-y-5">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-semibold uppercase text-gray-500 mb-2">Project Name</label>
                      <input required type="text" value={title} onChange={(e) => setTitle(e.target.value)}
                        className="w-full p-3.5 rounded-xl bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold uppercase text-gray-500 mb-2">Category</label>
                      <div className="relative">
                        <select required value={category} onChange={(e) => setCategory(e.target.value)}
                          className="w-full p-3.5 rounded-xl bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 outline-none focus:border-blue-500 appearance-none cursor-pointer">
                          <option value="Mobile App">Mobile App</option>
                          <option value="Desktop App">Desktop App</option>
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
                    <label className="block text-xs font-semibold uppercase text-gray-500 mb-2">Description</label>
                    <textarea required rows={5} value={description} onChange={(e) => setDescription(e.target.value)}
                      className="w-full p-3.5 rounded-xl bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all resize-none" />
                 </div>
               </div>
            </div>

            {/* 2. Tech Stack */}
            <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 md:p-8 border border-gray-100 dark:border-gray-700 shadow-sm">
               <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-2">
                 <span>⚡</span> Tech Stack
               </h2>
               <div>
                  <label className="block text-xs font-semibold uppercase text-gray-500 mb-2">
                    Tags <span className="normal-case font-normal text-gray-400 ml-1">(Type and press Enter)</span>
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
                      placeholder={tags.length === 0 ? "Add tags..." : ""}
                      className="flex-1 bg-transparent outline-none min-w-[150px] text-gray-800 dark:text-white placeholder-gray-400"
                    />
                  </div>
               </div>
            </div>

            {/* 3. Gallery */}
             <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 md:p-8 border border-gray-100 dark:border-gray-700 shadow-sm">
               <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-2">
                 <span>📸</span> Gallery Management
               </h2>
               
               {/* A. Existing Images */}
               {oldImages.length > 0 && (
                 <div className="mb-6">
                    <p className="text-xs font-semibold uppercase text-gray-500 mb-3">Current Images</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {oldImages.map((url, idx) => (
                        <div key={idx} className="relative group aspect-video rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
                           <Image src={url} alt="Existing" fill className="object-cover" />
                           <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <button 
                                type="button" 
                                onClick={() => removeOldImage(url)}
                                className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors transform hover:scale-110"
                                title="Remove image"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                              </button>
                           </div>
                        </div>
                      ))}
                    </div>
                 </div>
               )}

               {/* B. Upload Area */}
               <div className="mt-4">
                 <p className="text-xs font-semibold uppercase text-gray-500 mb-3">Add New Images</p>
                 <div 
                   onClick={() => fileInputRef.current?.click()}
                   className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-2xl p-6 text-center hover:bg-gray-50 dark:hover:bg-white/5 transition-colors cursor-pointer group"
                 >
                   <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                     <span className="text-2xl">+</span>
                   </div>
                   <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Click to upload more</p>
                   <input type="file" ref={fileInputRef} multiple accept="image/*" onChange={handleFileChange} className="hidden" />
                 </div>

                 {/* New Previews */}
                 {newPreviewUrls.length > 0 && (
                   <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 animate-fade-in">
                     {newPreviewUrls.map((url, idx) => (
                       <div key={idx} className="relative group aspect-video rounded-xl overflow-hidden border-2 border-blue-500/30">
                         <Image src={url} alt="New Upload" fill className="object-cover" />
                         <button 
                           type="button" 
                           onClick={() => removeNewFile(idx)}
                           className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                         >
                           <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                         </button>
                         <div className="absolute bottom-1 right-1 px-2 py-0.5 bg-blue-500 text-white text-[10px] rounded-full font-bold shadow-sm">
                           NEW
                         </div>
                       </div>
                     ))}
                   </div>
                 )}
               </div>
             </div>

          </div>

          {/* RIGHT COLUMN (1/3) */}
          <div className="lg:col-span-1 space-y-8">
             
             {/* Links */}
             <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm">
              <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-6">🔗 External Links</h2>
              <div className="space-y-4">
                <div>
                   <label className="block text-xs font-semibold uppercase text-gray-500 mb-2">GitHub</label>
                   <div className="flex items-center gap-2 p-3 rounded-xl bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700">
                     <span className="text-lg">🐙</span>
                     <input type="url" value={github} onChange={(e) => setGithub(e.target.value)}
                       className="flex-1 bg-transparent outline-none text-sm min-w-0" />
                   </div>
                </div>
                <div>
                   <label className="block text-xs font-semibold uppercase text-gray-500 mb-2">Live Demo</label>
                   <div className="flex items-center gap-2 p-3 rounded-xl bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700">
                     <span className="text-lg">🌍</span>
                     <input type="url" value={link} onChange={(e) => setLink(e.target.value)}
                       className="flex-1 bg-transparent outline-none text-sm min-w-0" />
                   </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="sticky top-8">
              <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 border border-gray-100 dark:border-gray-700 shadow-lg shadow-blue-500/5">
                 <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-4">Save Changes</h2>
                 <p className="text-sm text-gray-500 mb-6">Make sure all details are correct before updating.</p>
                 
                 <div className="space-y-3">
                   <button
                      type="submit"
                      disabled={saving}
                      className="w-full py-3.5 rounded-xl font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:shadow-lg hover:shadow-blue-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {saving ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          <span>Updating...</span>
                        </>
                      ) : (
                        <>
                          <span>💾</span> Update Project
                        </>
                      )}
                    </button>
                    
                    <Link 
                      href="/admin/projects"
                      className="block w-full py-3 text-center text-sm font-medium text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
                    >
                      Cancel
                    </Link>
                 </div>
              </div>
            </div>

          </div>
        </div>
      </form>

      <Toast show={toast.show} message={toast.message} type={toast.type} />
    </div>
  );
}