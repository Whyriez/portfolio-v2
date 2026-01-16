// File: components/admin/AdminSidebar.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import LogoutButton from './LogoutButton';

const AdminSidebar = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { name: 'Overview', href: '/admin', icon: '📊' },
    { name: 'Projects', href: '/admin/projects', icon: '📂' },
    { name: 'Reviews', href: '/admin/reviews', icon: '⭐' },
    { name: 'Profile & CV', href: '/admin/about', icon: '👤' },
    { name: 'Certificates', href: '/admin/certificates', icon: '📜' },
  ];

  return (
    <>
      {/* Mobile Toggle & Overlay (Tetap sama) */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden fixed top-4 right-4 z-50 p-2 rounded-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-md shadow-sm border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-white transition-all hover:scale-105"
      >
        {isOpen ? '✕' : '☰'}
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-30 md:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Container - Update Style */}
      <aside className={`
        fixed top-0 left-0 h-screen z-40 w-72 transition-transform duration-300 ease-out
        border-r border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-[#0f1115]/90 backdrop-blur-xl
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="flex flex-col h-full p-6">

          {/* 1. Brand / Profile Area yang lebih bersih */}
          <div className="flex items-center gap-4 mb-10 px-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold shadow-lg shadow-blue-500/30">
              A
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-800 dark:text-white tracking-tight">Admin Panel</h2>
              <p className="text-xs text-gray-500 font-medium">Whyriez Portfolio</p>
            </div>
          </div>

          {/* 2. Navigation Menu */}
          <nav className="space-y-1 flex-1">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4 px-2">Menu</p>
            {menuItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`group flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 font-medium text-sm
                    ${isActive
                      ? 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400' 
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-200'
                    }`}
                >
                  <span className={`text-lg transition-transform group-hover:scale-110 ${isActive ? 'scale-110' : ''}`}>
                    {item.icon}
                  </span>
                  <span>{item.name}</span>
                  {isActive && (
                    <span className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* 3. Footer Actions */}
          <div className="pt-6 border-t border-gray-100 dark:border-gray-800 space-y-3">
             <LogoutButton /> 
             
             <Link
                href="/"
                className="flex items-center justify-center gap-2 text-xs font-medium text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors py-2"
              >
                <span>←</span> Back to Website
              </Link>
          </div>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;