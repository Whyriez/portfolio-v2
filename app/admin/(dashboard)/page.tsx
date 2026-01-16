import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: "Dashboard - Admin",
};

export default async function AdminDashboard() {
  const supabase = await createClient();

  // 1. Cek User Session
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect('/admin/login');
  }

  // 2. Fetch Data Counts (Paralel agar cepat)
  // head: true artinya kita hanya ambil jumlahnya saja, tidak download isi datanya (Hemat bandwidth)
  const [
    { count: projectCount },
    { count: reviewCount },
    { count: certCount },
    { count: skillCount },
    { count: journeyCount }
  ] = await Promise.all([
    supabase.from('projects').select('*', { count: 'exact', head: true }),
    supabase.from('reviews').select('*', { count: 'exact', head: true }),
    supabase.from('certificates').select('*', { count: 'exact', head: true }),
    supabase.from('skills').select('*', { count: 'exact', head: true }),
    supabase.from('journeys').select('*', { count: 'exact', head: true })
  ]);

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
            Dashboard Overview
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Welcome back, <span className="font-semibold text-blue-600 dark:text-blue-400">{user.email}</span>! 👋
          </p>
        </div>
        <div className="bg-blue-50 dark:bg-blue-900/20 px-4 py-2 rounded-lg border border-blue-100 dark:border-blue-800 text-sm text-blue-700 dark:text-blue-300 flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
          </span>
          System Operational
        </div>
      </div>

      {/* --- STATS GRID --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        
        {/* Card 1: Projects */}
        <div className="bg-white dark:bg-white/5 p-6 rounded-2xl border border-gray-100 dark:border-white/10 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl text-blue-600 dark:text-blue-400">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
            </div>
            <span className="text-xs font-medium bg-green-100 text-green-700 py-1 px-2 rounded-full">Active</span>
          </div>
          <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-1">Total Projects</h3>
          <p className="text-3xl font-bold text-gray-800 dark:text-white">{projectCount || 0}</p>
        </div>

        {/* Card 2: Reviews */}
        <div className="bg-white dark:bg-white/5 p-6 rounded-2xl border border-gray-100 dark:border-white/10 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-xl text-yellow-600 dark:text-yellow-400">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path></svg>
            </div>
          </div>
          <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-1">Total Reviews</h3>
          <p className="text-3xl font-bold text-gray-800 dark:text-white">{reviewCount || 0}</p>
        </div>

        {/* Card 3: Certificates */}
        <div className="bg-white dark:bg-white/5 p-6 rounded-2xl border border-gray-100 dark:border-white/10 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-xl text-purple-600 dark:text-purple-400">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            </div>
          </div>
          <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-1">Certificates</h3>
          <p className="text-3xl font-bold text-gray-800 dark:text-white">{certCount || 0}</p>
        </div>

        {/* Card 4: Personal Data (Skills + Journey) */}
        <div className="bg-white dark:bg-white/5 p-6 rounded-2xl border border-gray-100 dark:border-white/10 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-pink-100 dark:bg-pink-900/30 rounded-xl text-pink-600 dark:text-pink-400">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
            </div>
          </div>
          <div className="flex justify-between items-end">
            <div>
              <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-1">Skills Listed</h3>
              <p className="text-2xl font-bold text-gray-800 dark:text-white">{skillCount || 0}</p>
            </div>
            <div className="text-right">
               <h3 className="text-gray-500 dark:text-gray-400 text-[10px] font-medium mb-1">Journey</h3>
               <p className="text-xl font-bold text-gray-800 dark:text-white">{journeyCount || 0}</p>
            </div>
          </div>
        </div>

      </div>

      {/* --- QUICK ACTIONS --- */}
      <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-6">Quick Actions</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        <Link href="/admin/projects/new" className="group p-4 bg-white dark:bg-white/5 rounded-xl border border-gray-200 dark:border-white/10 hover:border-blue-500 dark:hover:border-blue-500 transition-all flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
            +
          </div>
          <div>
            <h4 className="font-semibold text-gray-800 dark:text-white">Add Project</h4>
            <p className="text-xs text-gray-500 dark:text-gray-400">Create new portfolio item</p>
          </div>
        </Link>

        <Link href="/admin/certificates/new" className="group p-4 bg-white dark:bg-white/5 rounded-xl border border-gray-200 dark:border-white/10 hover:border-purple-500 dark:hover:border-purple-500 transition-all flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-colors">
            +
          </div>
          <div>
            <h4 className="font-semibold text-gray-800 dark:text-white">Add Certificate</h4>
            <p className="text-xs text-gray-500 dark:text-gray-400">Upload new certification</p>
          </div>
        </Link>

        <Link href="/admin/about" className="group p-4 bg-white dark:bg-white/5 rounded-xl border border-gray-200 dark:border-white/10 hover:border-pink-500 dark:hover:border-pink-500 transition-all flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-pink-50 dark:bg-pink-900/20 flex items-center justify-center text-pink-600 group-hover:bg-pink-600 group-hover:text-white transition-colors">
            ✎
          </div>
          <div>
            <h4 className="font-semibold text-gray-800 dark:text-white">Edit Profile</h4>
            <p className="text-xs text-gray-500 dark:text-gray-400">Update bio or skills</p>
          </div>
        </Link>

      </div>
    </div>
  );
}