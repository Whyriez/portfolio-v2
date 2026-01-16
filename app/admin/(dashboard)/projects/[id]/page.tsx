'use client';

import { useEffect, useState, use } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

export default function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
  // Unwrapping params (Next.js 15+ compatible)
  const { id } = use(params);
  const supabase = createClient();

  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [github, setGithub] = useState('');
  const [link, setLink] = useState('');
  const [tagsInput, setTagsInput] = useState('');

  // Image State
  const [oldImages, setOldImages] = useState<string[]>([]); // Gambar yang sudah ada di DB
  const [newFiles, setNewFiles] = useState<FileList | null>(null); // File baru yang mau diupload
  const [newPreviewUrls, setNewPreviewUrls] = useState<string[]>([]); // Preview file baru

  // 1. Fetch Data saat halaman dimuat
  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await fetch(`/api/projects/${id}`);
        if (!res.ok) throw new Error('Failed to fetch');

        const data = await res.json();

        // Isi state form
        setTitle(data.title);
        setCategory(data.category);
        setDescription(data.description || '');
        setGithub(data.github || '');
        setLink(data.link || '');
        setTagsInput(data.tags ? data.tags.join(', ') : '');
        setOldImages(data.images || []);
      } catch (err) {
        console.error(err);
        router.push('/admin/projects');
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id, router]);

  // Handle New File Selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setNewFiles(e.target.files);
      const urls = Array.from(e.target.files).map(file => URL.createObjectURL(file));
      setNewPreviewUrls(urls);
    }
  };

  // Handle Delete Old Image (Hanya hapus dari state array, belum hapus di storage biar aman)
  const handleDeleteOldImage = (urlToDelete: string) => {
    setOldImages(oldImages.filter(url => url !== urlToDelete));
  };

  // Handle Update
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const finalImages = [...oldImages];

      // Upload gambar baru (tetap client side logic)
      if (newFiles && newFiles.length > 0) {
        setUploading(true);
        for (let i = 0; i < newFiles.length; i++) {
          const file = newFiles[i];
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
        setUploading(false);
      }

      // Process Tags
      const tagsArray = tagsInput.split(',').map(tag => tag.trim()).filter(tag => tag !== '');

      // PANGGIL API PUT
      const res = await fetch(`/api/projects/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          category,
          description,
          github,
          link,
          tags: tagsArray,
          images: finalImages,
        }),
      });

      if (!res.ok) throw new Error('Failed to update');

      router.push('/admin/projects');
      router.refresh();

    } catch (error) {
      alert('Error: ' + (error as Error).message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8 text-center">Loading project data...</div>;

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-8 flex items-center gap-4">
        <Link
          href="/admin/projects"
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
        >
          ←
        </Link>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Edit Project</h1>
      </div>

      <form onSubmit={handleUpdate} className="space-y-6">

        {/* Title & Category */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Title</label>
            <input
              required
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-3 rounded-xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 outline-none focus:border-blue-500 transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Category</label>
            <select
              required
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full p-3 rounded-xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 outline-none focus:border-blue-500 transition-colors"
            >
              <option value="Mobile App">Mobile App</option>
              <option value="Web App">Web App</option>
              <option value="UI/UX Design">UI/UX Design</option>
              <option value="IoT">IoT</option>
            </select>
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Description</label>
          <textarea
            required
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-3 rounded-xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 outline-none focus:border-blue-500 transition-colors"
          />
        </div>

        {/* Links & Tags */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">GitHub</label>
            <input
              type="url"
              value={github}
              onChange={(e) => setGithub(e.target.value)}
              className="w-full p-3 rounded-xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 outline-none focus:border-blue-500 transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Demo Link</label>
            <input
              type="url"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              className="w-full p-3 rounded-xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 outline-none focus:border-blue-500 transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Tags</label>
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              className="w-full p-3 rounded-xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 outline-none focus:border-blue-500 transition-colors"
            />
          </div>
        </div>

        {/* Image Management Section */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">Manage Images</label>

          {/* 1. Existing Images */}
          {oldImages.length > 0 && (
            <div className="mb-4">
              <p className="text-xs text-gray-500 mb-2">Current Images (Click X to remove on save):</p>
              <div className="grid grid-cols-4 gap-4">
                {oldImages.map((url, idx) => (
                  <div key={idx} className="relative group aspect-video rounded-lg overflow-hidden border border-gray-200 dark:border-white/10">
                    <Image src={url} alt="Project" fill className="object-cover" />
                    <button
                      type="button"
                      onClick={() => handleDeleteOldImage(url)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 2. Upload New Images */}
          <div className="border-2 border-dashed border-gray-300 dark:border-white/20 rounded-xl p-6 text-center hover:bg-gray-50 dark:hover:bg-white/5 transition-colors cursor-pointer relative">
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <div className="text-gray-500 dark:text-gray-400">
              <span className="text-xl block mb-1">➕</span>
              <p className="text-sm">Add more images</p>
            </div>
          </div>

          {/* 3. New Images Preview */}
          {newPreviewUrls.length > 0 && (
            <div className="mt-4">
              <p className="text-xs text-blue-500 mb-2">New Images to be uploaded:</p>
              <div className="grid grid-cols-4 gap-4">
                {newPreviewUrls.map((url, idx) => (
                  <div key={idx} className="relative aspect-video rounded-lg overflow-hidden border border-blue-200">
                    <Image src={url} alt="New Preview" fill className="object-cover" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div className="pt-4 flex gap-4">
          <Link
            href="/admin/projects"
            className="px-6 py-3 rounded-xl font-medium text-gray-600 bg-gray-100 dark:bg-white/5 hover:bg-gray-200 transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={saving}
            className={`flex-1 py-3 rounded-xl font-bold text-white shadow-lg shadow-blue-500/20 transition-all 
              ${saving
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:scale-[1.01] active:scale-[0.99]'
              }`}
          >
            {saving ? (uploading ? 'Uploading Images...' : 'Saving Project...') : 'Update Project'}
          </button>
        </div>

      </form>
    </div>
  );
}