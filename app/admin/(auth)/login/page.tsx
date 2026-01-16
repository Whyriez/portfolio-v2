'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminLogin() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulasi login sementara (nanti kita ganti dengan logic asli)
    setTimeout(() => {
      setIsLoading(false);
      router.push('/admin');
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 dark:from-gray-900 dark:via-gray-900 dark:to-black transition-colors duration-300">
      
      {/* Container Utama */}
      <div className="glassmorphism w-full max-w-md p-8 rounded-3xl shadow-2xl border border-white/20 dark:border-white/10 relative overflow-hidden">
        
        {/* Dekorasi Background Blob */}
        <div className="absolute -top-20 -right-20 w-60 h-60 bg-blue-500/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-purple-500/20 rounded-full blur-3xl"></div>

        <div className="relative z-10">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="w-16 h-16 bg-gradient-to-tr from-blue-600 to-purple-600 rounded-2xl mx-auto mb-4 flex items-center justify-center text-3xl shadow-lg shadow-blue-500/20 text-white">
              🔐
            </div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
              Admin Access
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Enter your credentials to continue
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 ml-1">
                Email
              </label>
              <div className="relative">
                <span className="absolute left-4 top-3.5 text-gray-400">📧</span>
                <input
                  type="email"
                  placeholder="admin@example.com"
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all text-gray-800 dark:text-white placeholder-gray-400"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 ml-1">
                Password
              </label>
              <div className="relative">
                <span className="absolute left-4 top-3.5 text-gray-400">🔒</span>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all text-gray-800 dark:text-white placeholder-gray-400"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3.5 rounded-xl font-semibold text-white shadow-lg shadow-blue-500/20 transition-all duration-300 
                ${isLoading 
                  ? 'bg-gray-400 cursor-not-allowed opacity-70' 
                  : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-blue-500/40 hover:scale-[1.02] active:scale-[0.98]'
                }`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Signing in...</span>
                </div>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Footer Link */}
          <div className="mt-8 text-center">
            <Link 
              href="/" 
              className="text-sm text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              ← Back to Portfolio
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}