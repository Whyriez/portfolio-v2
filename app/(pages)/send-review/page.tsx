'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ManualCodeEntryPage() {
  const router = useRouter();
  const [code, setCode] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (code.trim()) {
      router.push(`/send-review/${code.trim()}`);
    }
  };

  return (
    <section className="page-section active">
      {/* Wrapper Flexbox Baru untuk Centering */}
      <div className="flex flex-col items-center justify-center min-h-[70vh] w-full px-4">
        
        <div className="glassmorphism w-full max-w-md p-8 rounded-2xl text-center border border-white/20 shadow-xl">
          <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-2xl mx-auto mb-6 flex items-center justify-center text-3xl shadow-sm">
            🎟️
          </div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
            Enter Invitation Code
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
            To leave a review, please enter the unique invitation code provided to you.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="e.g. REV-XY123"
              className="w-full px-4 mb-3 py-3 text-center text-lg font-mono tracking-widest uppercase rounded-xl bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all dark:text-white placeholder-gray-400"
              required
            />
            <button
              type="submit"
              className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] text-white font-bold rounded-xl transition-all duration-300"
            >
              Continue →
            </button>
          </form>
        </div>

      </div>
    </section>
  );
}