import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

export default async function AdminDashboard() {
  // 1. Inisialisasi Supabase Client (Server)
  const supabase = await createClient();

  // 2. Ambil User Session
  const { data: { user } } = await supabase.auth.getUser();

  // 3. (Opsional) Double check: kalau entah kenapa null, tendang balik
  // Middleware sebenarnya sudah handle ini, tapi ini untuk safety layer extra.
  if (!user) {
    redirect('/admin/login');
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
          Dashboard Overview
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          Welcome back, <span className="font-semibold text-blue-600">{user.email}</span>! 👋
        </p>
      </div>

      {/* Grid Stats Dummy */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-white/5 p-6 rounded-2xl border border-gray-100 dark:border-white/10 shadow-sm">
          <h3 className="text-gray-500 text-sm mb-1">Total Projects</h3>
          <p className="text-3xl font-bold text-gray-800 dark:text-white">12</p>
        </div>
        <div className="bg-white dark:bg-white/5 p-6 rounded-2xl border border-gray-100 dark:border-white/10 shadow-sm">
          <h3 className="text-gray-500 text-sm mb-1">Total Reviews</h3>
          <p className="text-3xl font-bold text-gray-800 dark:text-white">48</p>
        </div>
        <div className="bg-white dark:bg-white/5 p-6 rounded-2xl border border-gray-100 dark:border-white/10 shadow-sm">
          <h3 className="text-gray-500 text-sm mb-1">Messages</h3>
          <p className="text-3xl font-bold text-gray-800 dark:text-white">5</p>
        </div>
      </div>
      
      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-100 dark:border-blue-800 text-sm text-blue-800 dark:text-blue-300">
        🔒 Anda berada di area aman. Data user diambil langsung dari Server Session.
      </div>
    </div>
  );
}