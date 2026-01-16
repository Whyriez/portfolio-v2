'use client';

import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  const handleLogout = async () => {
    setLoading(true);
    // Logout dari Supabase (menghapus cookie session)
    await supabase.auth.signOut();
    
    // Refresh halaman agar Middleware mendeteksi session hilang & redirect ke login
    router.refresh(); 
  };

  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      className="w-full flex items-center gap-3 px-4 py-3 text-gray-600 dark:text-gray-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 rounded-xl transition-all duration-300 group"
    >
      <span className="p-2 bg-gray-100 dark:bg-white/5 rounded-lg group-hover:bg-red-100 dark:group-hover:bg-red-900/40 transition-colors">
        {loading ? (
           <div className="w-5 h-5 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
        ) : (
          /* Icon Logout SVG */
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
        )}
      </span>
      <span className="font-medium">
        {loading ? 'Signing out...' : 'Sign Out'}
      </span>
    </button>
  );
}