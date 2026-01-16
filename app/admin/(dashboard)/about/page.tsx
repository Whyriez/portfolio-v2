'use client';

import { useEffect, useState, useRef } from 'react';
import { createClient } from '@/utils/supabase/client';
import Image from 'next/image';
import JourneyManager from '@/components/admin/JourneyManager';
import SkillManager from '@/components/admin/SkillManager';

export default function AdminProfilePage() {
  const supabase = createClient();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [id, setId] = useState<string | null>(null);

  // --- Form States ---
  const [fullname, setFullname] = useState('');
  const [headline, setHeadline] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState(''); // New Field
  const [location, setLocation] = useState('');

  // Descriptions
  const [bioSidebar, setBioSidebar] = useState(''); // New Field
  const [bioHero, setBioHero] = useState('');       // New Field
  const [aboutMe, setAboutMe] = useState('');

  // File States (Avatar)
  const [avatarUrl, setAvatarUrl] = useState('');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState('');

  // File States (CV)
  const [cvUrl, setCvUrl] = useState('');
  const [cvFile, setCvFile] = useState<File | null>(null);

  const avatarInputRef = useRef<HTMLInputElement>(null);
  const cvInputRef = useRef<HTMLInputElement>(null);

  // 1. Fetch Data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/profile');
        const data = await res.json();

        if (data && data.id) {
          setId(data.id);
          setFullname(data.fullname || '');
          setHeadline(data.headline || '');
          setEmail(data.email || '');
          setPhone(data.phone_number || ''); // Fetch Phone
          setLocation(data.location || '');

          setBioSidebar(data.bio_sidebar || ''); // Fetch Sidebar Bio
          setBioHero(data.bio_hero || '');       // Fetch Hero Bio
          setAboutMe(data.about_me || '');

          setAvatarUrl(data.avatar_url || '');
          setCvUrl(data.cv_url || '');
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleCvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setCvFile(e.target.files[0]);
    }
  };

  // 2. Handle Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      let finalAvatarUrl = avatarUrl;
      let finalCvUrl = cvUrl;

      // Upload Avatar
      if (avatarFile) {
        const fileExt = avatarFile.name.split('.').pop();
        const fileName = `profile/avatar-${Date.now()}.${fileExt}`;
        const { error: upErr } = await supabase.storage.from('portfolio').upload(fileName, avatarFile);
        if (upErr) throw upErr;
        const { data } = supabase.storage.from('portfolio').getPublicUrl(fileName);
        finalAvatarUrl = data.publicUrl;
      }

      // Upload CV
      if (cvFile) {
        const fileExt = cvFile.name.split('.').pop();
        const fileName = `profile/cv-${Date.now()}.${fileExt}`;
        const { error: upErr } = await supabase.storage.from('portfolio').upload(fileName, cvFile);
        if (upErr) throw upErr;
        const { data } = supabase.storage.from('portfolio').getPublicUrl(fileName);
        finalCvUrl = data.publicUrl;
      }

      // Save Data
      const res = await fetch('/api/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id,
          fullname,
          headline,
          email,
          phone_number: phone,   // Save Phone
          location,
          bio_sidebar: bioSidebar, // Save Sidebar Bio
          bio_hero: bioHero,       // Save Hero Bio
          about_me: aboutMe,
          avatar_url: finalAvatarUrl,
          cv_url: finalCvUrl
        }),
      });

      if (!res.ok) throw new Error('Failed to save profile');

      const updatedData = await res.json();
      setId(updatedData.id);
      alert('Profile updated successfully!');

    } catch (error: any) {
      alert('Error: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8">Loading profile...</div>;

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Edit Profile</h1>
        <p className="text-gray-500 dark:text-gray-400">Manage your personal information, bios, and CV.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">

        {/* --- SECTION 1: MEDIA --- */}
        <div className="bg-white dark:bg-white/5 p-6 rounded-2xl border border-gray-100 dark:border-white/10 flex flex-col md:flex-row gap-8 items-center">
          <div className="flex flex-col items-center gap-4">
            <div
              onClick={() => avatarInputRef.current?.click()}
              className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-gray-100 dark:border-white/10 cursor-pointer hover:opacity-80 transition-opacity bg-gray-200 dark:bg-gray-700"
            >
              {(avatarPreview || avatarUrl) ? (
                <Image src={avatarPreview || avatarUrl} alt="Avatar" fill className="object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-4xl">👤</div>
              )}
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center text-white text-xs font-bold opacity-0 hover:opacity-100 transition-opacity">CHANGE</div>
            </div>
            <input type="file" ref={avatarInputRef} onChange={handleAvatarChange} accept="image/*" className="hidden" />
          </div>

          <div className="flex-1 w-full">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Curriculum Vitae (CV)</label>
            <div className="flex gap-4 items-center">
              <div
                onClick={() => cvInputRef.current?.click()}
                className="flex-1 border-2 border-dashed border-gray-300 dark:border-white/20 rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
              >
                <span className="text-2xl mb-1">📄</span>
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {cvFile ? cvFile.name : (cvUrl ? "Change CV File" : "Upload CV (PDF)")}
                </span>
              </div>
              {cvUrl && (
                <a href={cvUrl} target="_blank" className="p-4 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-xl hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors">👁️</a>
              )}
            </div>
            <input type="file" ref={cvInputRef} onChange={handleCvChange} accept=".pdf" className="hidden" />
          </div>
        </div>

        {/* --- SECTION 2: BASIC INFO --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Full Name</label>
            <input required type="text" value={fullname} onChange={(e) => setFullname(e.target.value)}
              className="w-full p-3 rounded-xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 outline-none focus:border-blue-500" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Headline / Job Title</label>
            <input required type="text" value={headline} onChange={(e) => setHeadline(e.target.value)}
              className="w-full p-3 rounded-xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 outline-none focus:border-blue-500" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 rounded-xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 outline-none focus:border-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Phone Number</label>
            <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)}
              className="w-full p-3 rounded-xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 outline-none focus:border-blue-500" placeholder="+62..." />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Location</label>
            <input type="text" value={location} onChange={(e) => setLocation(e.target.value)}
              className="w-full p-3 rounded-xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 outline-none focus:border-blue-500" />
          </div>
        </div>

        {/* --- SECTION 3: DESCRIPTIONS --- */}
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Bio Sidebar <span className="text-gray-400 text-xs">(Very short, under photo)</span>
              </label>
              <textarea rows={4} value={bioSidebar} onChange={(e) => setBioSidebar(e.target.value)}
                className="w-full p-3 rounded-xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 outline-none focus:border-blue-500"
                placeholder="Ex: Passionate developer building cool things." />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Bio Hero Section <span className="text-gray-400 text-xs">(Introduction on Home/About)</span>
              </label>
              <textarea rows={4} value={bioHero} onChange={(e) => setBioHero(e.target.value)}
                className="w-full p-3 rounded-xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 outline-none focus:border-blue-500"
                placeholder="Ex: Hello! I'm Alim, a software engineer based in..." />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              About Me <span className="text-gray-400 text-xs">(Full Story)</span>
            </label>
            <textarea rows={8} value={aboutMe} onChange={(e) => setAboutMe(e.target.value)}
              className="w-full p-3 rounded-xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 outline-none focus:border-blue-500" />
          </div>
        </div>

        {/* --- SUBMIT --- */}
        <div className="flex justify-end pt-4 border-t border-gray-100 dark:border-white/10">
          <button type="submit" disabled={saving}
            className="px-8 py-3.5 rounded-xl font-bold text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-blue-500/20 disabled:opacity-70 disabled:cursor-not-allowed">
            {saving ? 'Saving Profile...' : 'Save Changes'}
          </button>
        </div>

      </form>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pb-20">
        <JourneyManager />
        <SkillManager />
      </div>
    </div>
  );
}