'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const AdminSidebar = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { name: 'Overview', href: '/admin', icon: '📊' },
    { name: 'Projects', href: '/admin/projects', icon: '📂' },
    { name: 'Reviews', href: '/admin/reviews', icon: '⭐' },
    { name: 'Messages', href: '/admin/messages', icon: '💬' },
  ];

  return (
    <>
      {/* Mobile Menu Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden fixed top-4 right-4 z-50 p-2 rounded-lg bg-white/20 backdrop-blur-md border border-white/20 shadow-lg text-gray-800 dark:text-white"
      >
        {isOpen ? '✕' : '☰'}
      </button>

      {/* Overlay untuk menutup sidebar di mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 md:hidden backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside className={`
        fixed top-0 left-0 h-screen z-40 w-72 p-4 md:p-8 transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="flex flex-col h-full">
          
          {/* Profile / Brand Area */}
          <div className="glassmorphism p-6 rounded-3xl mb-6 text-center shadow-lg">
            <div className="w-16 h-16 bg-gradient-to-tr from-blue-500 to-purple-600 rounded-full mx-auto mb-3 flex items-center justify-center text-xl font-bold text-white shadow-lg shadow-purple-500/20">
              A
            </div>
            <h2 className="text-lg font-bold text-gray-800 dark:text-white">Admin Panel</h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">Manage Portfolio</p>
          </div>

          {/* Navigation Menu */}
          <div className="glassmorphism rounded-3xl flex-1 p-6 flex flex-col shadow-lg overflow-y-auto">
            <nav className="space-y-2 flex-1">
              {menuItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsOpen(false)} // Tutup sidebar saat klik di mobile
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                      isActive
                        ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 shadow-inner'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100/50 dark:hover:bg-white/5'
                    }`}
                  >
                    <span>{item.icon}</span>
                    <span className="font-medium">{item.name}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Footer Link */}
            <div className="pt-6 border-t border-gray-200 dark:border-white/10 mt-auto">
              <Link 
                href="/" 
                className="flex items-center gap-2 justify-center text-sm text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors p-2 rounded-lg hover:bg-gray-100/50 dark:hover:bg-white/5"
              >
                ← Back to Site
              </Link>
            </div>
          </div>

        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;