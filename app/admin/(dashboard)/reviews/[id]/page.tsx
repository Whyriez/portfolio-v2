'use client';

import { useEffect, useState, use } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

export default function EditReviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const supabase = createClient();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Form State
  const [name, setName] = useState('');
  const [review, setReview] = useState('');
  const [avatarUrl, setAvatarUrl] = useState(''); // URL existing
  const [newFile, setNewFile] = useState<File | null>(null); // File baru (optional)
  const [previewUrl, setPreviewUrl] = useState(''); // Preview file baru

  // 1. Fetch Data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`/api/reviews/${id}`);
        if (!res.ok) throw new Error('Failed fetch');
        const data = await res.json();
        
        setName(data.name);
        setReview(data.review);
        setAvatarUrl(data.avatar || '');
      } catch (err) {
        console.error(err);
        router.push('/admin/reviews');
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

      // Logic Upload Image (Client Side)
      if (newFile) {
        const fileExt = newFile.name.split('.').pop();
        const fileName = `reviews/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('portfolio') // Menggunakan bucket yang sama
          .upload(fileName, newFile);

        if (uploadError) throw uploadError;

        const { data } = supabase.storage.from('portfolio').getPublicUrl(fileName);
        finalAvatarUrl = data.publicUrl;
      }

      // Logic Update Data (API Side)
      const res = await fetch(`/api/reviews/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          review,
          avatar: finalAvatarUrl
        }),
      });

      if (!res.ok) throw new Error('Failed update');

      router.push('/admin/reviews');
      router.refresh();

    } catch (error: unknown) {
      if (error instanceof Error) {
        alert('Error: ' + error.message);
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <div className="mb-8 flex items-center gap-4">
        <Link 
          href="/admin/reviews"
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
        >
          ←
        </Link>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Edit Review</h1>
      </div>

      <form onSubmit={handleUpdate} className="space-y-6">
        
        {/* Profile Avatar */}
        <div className="flex items-center gap-6">
          <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-gray-200 dark:border-white/10">
            {/* Prioritize preview, then existing url, then placeholder */}
            {(previewUrl || avatarUrl) ? (
              <Image 
                src={previewUrl || avatarUrl} 
                alt="Avatar" 
                fill 
                className="object-cover" 
              />
            ) : (
              <div className="w-full h-full bg-gray-100 flex items-center justify-center">👤</div>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Change Profile Picture
            </label>
            <input 
              type="file" 
              accept="image/*"
              onChange={handleFileChange}
              className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>
        </div>

        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Name</label>
          <input
            required
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-3 rounded-xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 outline-none focus:border-blue-500 transition-colors"
          />
        </div>

        {/* Review */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Review</label>
          <textarea
            required
            rows={4}
            value={review}
            onChange={(e) => setReview(e.target.value)}
            className="w-full p-3 rounded-xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 outline-none focus:border-blue-500 transition-colors"
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          className={`w-full py-3.5 rounded-xl font-bold text-white shadow-lg shadow-blue-500/20 transition-all 
            ${saving 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:scale-[1.01] active:scale-[0.99]'
            }`}
        >
          {saving ? 'Saving Changes...' : 'Update Review'}
        </button>

      </form>
    </div>
  );
}