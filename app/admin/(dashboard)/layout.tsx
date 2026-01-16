import React from 'react';
import AdminSidebar from '@/components/admin/AdminSidebar';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 dark:from-gray-900 dark:via-gray-900 dark:to-black text-gray-900 dark:text-gray-100 transition-colors duration-300">
      
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Content Area */}
      {/* md:ml-72 agar tidak tertutup sidebar di desktop */}
      <main className="transition-all duration-300 md:ml-72 p-4 md:p-8">
        <div className="glassmorphism rounded-3xl p-6 md:p-8 min-h-[calc(100vh-4rem)] shadow-xl">
          
          {/* Header Admin */}
          <div className="flex justify-between items-center mb-8 border-b border-gray-200 dark:border-white/10 pb-4 pt-10 md:pt-0">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
                Dashboard
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Welcome back, Admin
              </p>
            </div>
          </div>

          {children}
        </div>
      </main>
    </div>
  );
}