'use client';

import { useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

export default function CreateProjectPage() {
  const router = useRouter();
  const supabase = createClient();

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [github, setGithub] = useState('');
  const [link, setLink] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [files, setFiles] = useState<FileList | null>(null);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  // Handle File Selection & Preview
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFiles(e.target.files);

      // Buat preview URL
      const urls = Array.from(e.target.files).map(file => URL.createObjectURL(file));
      setPreviewUrls(urls);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const imageUrls: string[] = [];

      if (files && files.length > 0) {
        setUploading(true);
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
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
        setUploading(false);
      }

      // 2. Process Tags
      const tagsArray = tagsInput.split(',').map(tag => tag.trim()).filter(tag => tag !== '');

      // 3. PANGGIL API ROUTE KITA (Refactored)
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          category,
          description,
          github,
          link,
          tags: tagsArray,
          images: imageUrls,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to create project');
      }

      router.push('/admin/projects');
      router.refresh();

    } catch (error) {
      // Paksa TypeScript menganggap ini sebagai Error
      alert('Error: ' + (error as Error).message);
    } finally {
      setLoading(false);
      setUploading(false);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-8 flex items-center gap-4">
        <Link
          href="/admin/projects"
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
        >
          ←
        </Link>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Create New Project</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">

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
              placeholder="Project Name"
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
              <option value="">Select Category</option>
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
            placeholder="Tell us about the project..."
          />
        </div>

        {/* Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">GitHub URL</label>
            <input
              type="url"
              value={github}
              onChange={(e) => setGithub(e.target.value)}
              className="w-full p-3 rounded-xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 outline-none focus:border-blue-500 transition-colors"
              placeholder="https://github.com/..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Live Demo URL</label>
            <input
              type="url"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              className="w-full p-3 rounded-xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 outline-none focus:border-blue-500 transition-colors"
              placeholder="https://..."
            />
          </div>
        </div>

        {/* Tags */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Tags</label>
          <input
            type="text"
            value={tagsInput}
            onChange={(e) => setTagsInput(e.target.value)}
            className="w-full p-3 rounded-xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 outline-none focus:border-blue-500 transition-colors"
            placeholder="React, TypeScript, Tailwind (separate with comma)"
          />
          <p className="text-xs text-gray-500 mt-1">Pisahkan dengan koma untuk membuat multiple tags</p>
        </div>

        {/* Images Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Project Images (Multiple)</label>
          <div className="border-2 border-dashed border-gray-300 dark:border-white/20 rounded-xl p-8 text-center hover:bg-gray-50 dark:hover:bg-white/5 transition-colors cursor-pointer relative">
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <div className="text-gray-500 dark:text-gray-400">
              <span className="text-2xl block mb-2">📸</span>
              <p>Click or drag images here</p>
            </div>
          </div>

          {/* Image Previews */}
          {previewUrls.length > 0 && (
            <div className="grid grid-cols-4 gap-4 mt-4">
              {previewUrls.map((url, idx) => (
                <div key={idx} className="relative aspect-video rounded-lg overflow-hidden border border-gray-200 dark:border-white/10">
                  <Image src={url} alt="Preview" fill className="object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-4 rounded-xl font-bold text-white shadow-lg shadow-blue-500/20 transition-all 
              ${loading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:scale-[1.01] active:scale-[0.99]'
              }`}
          >
            {loading ? (uploading ? 'Uploading Images...' : 'Saving Project...') : 'Create Project'}
          </button>
        </div>

      </form>
    </div>
  );
}