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

export default function EditReviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const supabase = createClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' as 'success' | 'error' });
  
  // Form State
  const [name, setName] = useState('');
  const [review, setReview] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [newFile, setNewFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState('');

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast(prev => ({ ...prev, show: false })), 3000);
  };

  // 1. Fetch Data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`/api/reviews/${id}`);
        if (!res.ok) throw new Error('Failed to fetch review');
        const data = await res.json();
        
        setName(data.name || '');
        setReview(data.review || '');
        setAvatarUrl(data.avatar || '');
      } catch (err) {
        console.error(err);
        showToast('Error loading data', 'error');
        setTimeout(() => router.push('/admin/reviews'), 2000);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, router]);

  // Handle File Change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setNewFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  // 2. Handle Update
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      let finalAvatarUrl = avatarUrl;

      // Upload Image if new file selected
      if (newFile) {
        const fileExt = newFile.name.split('.').pop();
        const fileName = `reviews/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('portfolio')
          .upload(fileName, newFile);

        if (uploadError) throw uploadError;

        const { data } = supabase.storage.from('portfolio').getPublicUrl(fileName);
        finalAvatarUrl = data.publicUrl;
      }

      // Update Data
      const res = await fetch(`/api/reviews/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          review,
          avatar: finalAvatarUrl
        }),
      });

      if (!res.ok) throw new Error('Failed to update review');

      showToast('Review updated successfully!', 'success');
      
      setTimeout(() => {
        router.push('/admin/reviews');
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
    <div className="max-w-2xl mx-auto p-6 md:p-8">
      
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link 
          href="/admin/reviews"
          className="w-10 h-10 flex items-center justify-center rounded-xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-300 hover:scale-105 transition-transform shadow-sm"
        >
          ←
        </Link>
        <div>
           <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Edit Testimonial</h1>
           <p className="text-sm text-gray-500 dark:text-gray-400">Update client feedback details.</p>
        </div>
      </div>

      <form onSubmit={handleUpdate} className="space-y-6 animate-fade-in">
        
        {/* Main Card */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 border border-gray-100 dark:border-gray-700 shadow-sm">
           
           {/* Avatar Section */}
           <div className="flex flex-col items-center mb-8">
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="relative w-28 h-28 rounded-full overflow-hidden border-4 border-gray-100 dark:border-gray-700 cursor-pointer group shadow-lg"
              >
                {(previewUrl || avatarUrl) ? (
                  <Image 
                    src={previewUrl || avatarUrl} 
                    alt="Avatar" 
                    fill 
                    className="object-cover group-hover:scale-110 transition-transform duration-500" 
                  />
                ) : (
                  <div className="w-full h-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-4xl">👤</div>
                )}
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                   <span className="text-white text-xs font-bold uppercase tracking-wider">Change</span>
                </div>
              </div>
              <p className="text-xs text-gray-400 mt-3">Click picture to upload new avatar</p>
              <input 
                type="file" 
                ref={fileInputRef}
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
           </div>

           {/* Input Fields */}
           <div className="space-y-5">
             <div>
               <label className="block text-xs font-semibold uppercase text-gray-500 mb-2">Client Name</label>
               <input
                 required
                 type="text"
                 value={name}
                 onChange={(e) => setName(e.target.value)}
                 className="w-full p-3.5 rounded-xl bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all font-medium"
                 placeholder="e.g. John Doe"
               />
             </div>

             <div>
               <label className="block text-xs font-semibold uppercase text-gray-500 mb-2">Feedback / Review</label>
               <div className="relative">
                 <textarea
                   required
                   rows={5}
                   value={review}
                   onChange={(e) => setReview(e.target.value)}
                   className="w-full p-4 rounded-xl bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all resize-none italic text-gray-600 dark:text-gray-300"
                   placeholder="Write the review content here..."
                 />
                 <span className="absolute top-2 right-4 text-4xl text-gray-200 pointer-events-none">”</span>
               </div>
             </div>
           </div>

           {/* Submit Button */}
           <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-700">
             <button
               type="submit"
               disabled={saving}
               className="w-full py-3.5 rounded-xl font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:shadow-lg hover:shadow-blue-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
             >
               {saving ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Saving Changes...
                  </>
               ) : (
                  'Update Review'
               )}
             </button>
           </div>

        </div>
      </form>

      <Toast show={toast.show} message={toast.message} type={toast.type} />
    </div>
  );
}