'use client';

import { useEffect, useState, useRef } from 'react';
import { createClient } from '@/utils/supabase/client';
import Image from 'next/image';
import JourneyManager from '@/components/admin/JourneyManager';
import SkillManager from '@/components/admin/SkillManager';

// --- Components Kecil untuk UI ---
const TabButton = ({ active, onClick, icon, label }: any) => (
  <button
    onClick={onClick}
    type="button"
    className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 ${active
        ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
        : 'bg-white dark:bg-white/5 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/10'
      }`}
  >
    <span>{icon}</span>
    <span>{label}</span>
  </button>
);

const Toast = ({ show, message, type }: { show: boolean, message: string, type: 'success' | 'error' }) => {
  if (!show) return null;
  return (
    <div className={`fixed bottom-8 right-8 z-50 px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 text-white animate-bounce-in ${type === 'success' ? 'bg-green-600' : 'bg-red-600'
      }`}>
      <span>{type === 'success' ? '✅' : '⚠️'}</span>
      <span className="font-medium">{message}</span>
    </div>
  );
};

export default function AdminProfilePage() {
  const supabase = createClient();

  // --- UI States ---
  const [activeTab, setActiveTab] = useState<'info' | 'experience'>('info');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' as 'success' | 'error' });

  // --- Data States ---
  const [id, setId] = useState<string | null>(null);
  const [fullname, setFullname] = useState('');
  const [headline, setHeadline] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [bioSidebar, setBioSidebar] = useState('');
  const [bioHero, setBioHero] = useState('');
  const [aboutMe, setAboutMe] = useState('');

  // --- File States ---
  const [avatarUrl, setAvatarUrl] = useState('');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState('');
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
          setPhone(data.phone_number || '');
          setLocation(data.location || '');
          setBioSidebar(data.bio_sidebar || '');
          setBioHero(data.bio_hero || '');
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

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast(prev => ({ ...prev, show: false })), 3000);
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleCvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) setCvFile(e.target.files[0]);
  };

  // 2. Handle Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      let finalAvatarUrl = avatarUrl;
      let finalCvUrl = cvUrl;

      // Upload Logic (Sama seperti sebelumnya)
      if (avatarFile) {
        const fileExt = avatarFile.name.split('.').pop();
        const fileName = `profile/avatar-${Date.now()}.${fileExt}`;
        const { error: upErr } = await supabase.storage.from('portfolio').upload(fileName, avatarFile);
        if (upErr) throw upErr;
        const { data } = supabase.storage.from('portfolio').getPublicUrl(fileName);
        finalAvatarUrl = data.publicUrl;
      }

      if (cvFile) {
        const fileExt = cvFile.name.split('.').pop();
        const fileName = `profile/cv-${Date.now()}.${fileExt}`;
        const { error: upErr } = await supabase.storage.from('portfolio').upload(fileName, cvFile);
        if (upErr) throw upErr;
        const { data } = supabase.storage.from('portfolio').getPublicUrl(fileName);
        finalCvUrl = data.publicUrl;
      }

      const res = await fetch('/api/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id, fullname, headline, email, phone_number: phone, location,
          bio_sidebar: bioSidebar, bio_hero: bioHero, about_me: aboutMe,
          avatar_url: finalAvatarUrl, cv_url: finalCvUrl
        }),
      });

      if (!res.ok) throw new Error('Failed to save');

      const updatedData = await res.json();
      setId(updatedData.id);
      showToast('Profile updated successfully!', 'success');
      
      // Reset file states
      setAvatarFile(null);
      setCvFile(null);

    } catch (error: any) {
      showToast(error.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="flex h-96 items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto pb-20">
      
      {/* --- HEADER SECTION --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Profile & Settings</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Manage your personal branding and experience.</p>
        </div>
        
        {/* Tab Navigation */}
        <div className="flex gap-2 bg-gray-100 dark:bg-white/5 p-1.5 rounded-2xl">
          <TabButton 
            active={activeTab === 'info'} 
            onClick={() => setActiveTab('info')} 
            icon="👤" 
            label="Personal Info" 
          />
          <TabButton 
            active={activeTab === 'experience'} 
            onClick={() => setActiveTab('experience')} 
            icon="🚀" 
            label="Experience & Skills" 
          />
        </div>
      </div>

      {/* --- CONTENT SECTION --- */}
      
      {/* TAB 1: PERSONAL INFO FORM */}
      {activeTab === 'info' && (
        <form onSubmit={handleSubmit} className="animate-fade-in space-y-8">
          
          {/* Top Card: Avatar & CV */}
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-sm border border-gray-100 dark:border-gray-700">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-2">
              <span>📸</span> Media & Resume
            </h2>
            
            <div className="flex flex-col md:flex-row gap-10 items-center">
              {/* Avatar Upload */}
              <div className="text-center">
                 <div 
                   onClick={() => avatarInputRef.current?.click()}
                   className="group relative w-36 h-36 rounded-full overflow-hidden border-4 border-white dark:border-gray-600 shadow-xl cursor-pointer transition-transform hover:scale-105"
                 >
                   {(avatarPreview || avatarUrl) ? (
                     <Image src={avatarPreview || avatarUrl} alt="Avatar" fill className="object-cover" />
                   ) : (
                     <div className="w-full h-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-4xl">👤</div>
                   )}
                   {/* Overlay */}
                   <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <span className="text-2xl">📷</span>
                      <span className="text-xs font-bold mt-1">CHANGE</span>
                   </div>
                 </div>
                 <p className="text-xs text-gray-500 mt-3 font-medium">Profile Picture</p>
                 <input type="file" ref={avatarInputRef} onChange={handleAvatarChange} accept="image/*" className="hidden" />
              </div>

              {/* CV Upload */}
              <div className="flex-1 w-full p-6 bg-gray-50 dark:bg-white/5 rounded-2xl border border-dashed border-gray-300 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-500 transition-colors group">
                 <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                       <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                         📄
                       </div>
                       <div>
                         <h3 className="font-semibold text-gray-800 dark:text-white">Curriculum Vitae</h3>
                         <p className="text-sm text-gray-500 dark:text-gray-400">
                           {cvFile ? cvFile.name : (cvUrl ? "File available" : "PDF format recommended")}
                         </p>
                       </div>
                    </div>
                    <div className="flex gap-2">
                       {cvUrl && (
                         <a href={cvUrl} target="_blank" className="p-2.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="View CV">
                           👁️
                         </a>
                       )}
                       <button 
                         type="button" 
                         onClick={() => cvInputRef.current?.click()}
                         className="px-4 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors shadow-sm"
                       >
                         {cvFile || cvUrl ? "Replace" : "Upload"}
                       </button>
                    </div>
                 </div>
                 <input type="file" ref={cvInputRef} onChange={handleCvChange} accept=".pdf" className="hidden" />
              </div>
            </div>
          </div>

          {/* Middle Card: Basic Info */}
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-sm border border-gray-100 dark:border-gray-700">
             <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-2">
              <span>📝</span> Basic Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputGroup label="Full Name" value={fullname} onChange={setFullname} placeholder="e.g. John Doe" required />
              <InputGroup label="Headline / Job Title" value={headline} onChange={setHeadline} placeholder="e.g. Senior Frontend Developer" required />
              <InputGroup label="Email Address" value={email} onChange={setEmail} type="email" placeholder="john@example.com" />
              <InputGroup label="Phone Number" value={phone} onChange={setPhone} type="tel" placeholder="+62 812..." />
              <div className="md:col-span-2">
                 <InputGroup label="Location" value={location} onChange={setLocation} placeholder="e.g. Jakarta, Indonesia" />
              </div>
            </div>
          </div>

          {/* Bottom Card: Descriptions */}
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-sm border border-gray-100 dark:border-gray-700">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-2">
              <span>✨</span> Personal Bios
            </h2>
            <div className="space-y-6">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <TextAreaGroup 
                    label="Sidebar Bio (Short)" 
                    value={bioSidebar} 
                    onChange={setBioSidebar} 
                    rows={3}
                    placeholder="Short description under your profile picture..." 
                  />
                  <TextAreaGroup 
                    label="Hero Section Bio" 
                    value={bioHero} 
                    onChange={setBioHero} 
                    rows={3}
                    placeholder="Introductory text for the homepage..." 
                  />
               </div>
               <TextAreaGroup 
                  label="About Me (Full Story)" 
                  value={aboutMe} 
                  onChange={setAboutMe} 
                  rows={6}
                  placeholder="Tell your professional journey..." 
               />
            </div>
          </div>

          {/* Floating Action Button / Sticky Bottom */}
          <div className="sticky bottom-4 z-40 flex justify-end">
             <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md p-2 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700">
                <button 
                  type="submit" 
                  disabled={saving}
                  className="flex items-center gap-2 px-8 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:shadow-lg hover:shadow-blue-500/25 active:scale-95 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {saving ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/>
                      Saving...
                    </>
                  ) : (
                    <>
                      <span>💾</span> Save Changes
                    </>
                  )}
                </button>
             </div>
          </div>
        </form>
      )}

      {/* TAB 2: SKILLS & JOURNEY */}
      {activeTab === 'experience' && (
        <div className="animate-fade-in grid grid-cols-1 lg:grid-cols-2 gap-8">
           <div className="bg-white dark:bg-gray-800 rounded-3xl p-2 shadow-sm border border-gray-100 dark:border-gray-700">
              <JourneyManager />
           </div>
           <div className="bg-white dark:bg-gray-800 rounded-3xl p-2 shadow-sm border border-gray-100 dark:border-gray-700">
              <SkillManager />
           </div>
        </div>
      )}

      {/* TOAST NOTIFICATION */}
      <Toast show={toast.show} message={toast.message} type={toast.type} />
    </div>
  );
}

// --- Helper Input Components ---
function InputGroup({ label, value, onChange, type = "text", placeholder, required = false }: any) {
  return (
    <div>
      <label className="block text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 mb-2 tracking-wider">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        placeholder={placeholder}
        className="w-full p-3.5 rounded-xl bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none text-gray-800 dark:text-white placeholder-gray-400"
      />
    </div>
  );
}

function TextAreaGroup({ label, value, onChange, rows, placeholder }: any) {
  return (
    <div>
      <label className="block text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 mb-2 tracking-wider">
        {label}
      </label>
      <textarea
        rows={rows}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full p-3.5 rounded-xl bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none text-gray-800 dark:text-white placeholder-gray-400 resize-none"
      />
    </div>
  );
}