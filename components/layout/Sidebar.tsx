'use client';

import React, { useEffect, useState } from "react";
import Link from "next/link"; // Gunakan Link Next.js untuk Social Media jika internal, atau 'a' jika eksternal

// --- Config ---
const CACHE_KEY_SIDEBAR = "profile_sidebar_cache";
const CACHE_EXPIRY_MS = 60 * 60 * 1000; // 1 Jam

// Default Values (Fallback)
const DEFAULT_AVATAR = "/dev4.png";
const DEFAULT_NAME = "Alim Suma";
const DEFAULT_HEADLINE = "Mobile Developer";
const DEFAULT_BIO = "Passionate about crafting beautiful, functional mobile applications and robust backend solutions with modern technologies.";

export default function Sidebar() {
  // State Profile
  const [fullname, setFullname] = useState(DEFAULT_NAME);
  const [headline, setHeadline] = useState(DEFAULT_HEADLINE);
  const [bio, setBio] = useState(DEFAULT_BIO);
  const [avatarUrl, setAvatarUrl] = useState(DEFAULT_AVATAR);

  useEffect(() => {
    const fetchSidebarProfile = async () => {
      const now = Date.now();
      const cachedData = localStorage.getItem(CACHE_KEY_SIDEBAR);

      // 1. Cek Cache
      if (cachedData) {
        const { data, timestamp } = JSON.parse(cachedData);
        if (now - timestamp < CACHE_EXPIRY_MS) {
          if (data.fullname) setFullname(data.fullname);
          if (data.headline) setHeadline(data.headline);
          if (data.bio_sidebar) setBio(data.bio_sidebar);
          if (data.avatar_url) setAvatarUrl(data.avatar_url);
          return;
        }
      }

      // 2. Fetch API Fresh
      try {
        const res = await fetch('/api/profile');
        if (res.ok) {
          const data = await res.json();
          
          if (data.fullname) setFullname(data.fullname);
          if (data.headline) setHeadline(data.headline);
          if (data.bio_sidebar) setBio(data.bio_sidebar);
          if (data.avatar_url) setAvatarUrl(data.avatar_url);

          // Simpan Cache
          localStorage.setItem(CACHE_KEY_SIDEBAR, JSON.stringify({
            data: data,
            timestamp: now
          }));
        }
      } catch (error) {
        console.error("Sidebar profile fetch error:", error);
      }
    };

    fetchSidebarProfile();
  }, []);

  return (
    <aside className="sidebar-gradient w-full md:w-80 md:h-screen md:fixed md:overflow-y-auto p-6 flex flex-col items-center z-10 shadow-2xl">
      <div className="flex flex-col items-center">
        
        {/* AVATAR DENGAN SVG MASKING */}
        <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white profile-shadow mb-4 relative">
          <svg
            className="w-full h-full"
            viewBox="0 0 100 100"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <pattern
                id="imgPattern"
                patternUnits="userSpaceOnUse"
                width="100"
                height="100"
              >
                {/* LOGIC: Menggunakan <image> di dalam SVG pattern.
                   preserveAspectRatio="xMidYMid slice" agar gambar cover lingkaran (object-cover)
                */}
                <image 
                  href={avatarUrl} 
                  x="0" y="0" 
                  width="100" height="100" 
                  preserveAspectRatio="xMidYMid slice"
                />
              </pattern>
            </defs>
            <circle cx="50" cy="50" r="50" fill="url(#imgPattern)" />
          </svg>
        </div>

        {/* NAMA & HEADLINE DINAMIS */}
        <h1 className="text-white text-2xl font-semibold mt-2 text-center">
          {fullname}
        </h1>
        <h2 className="text-blue-100 text-lg font-light mb-4 text-center">
          {headline}
        </h2>
        
        <div className="w-16 h-1 bg-white opacity-50 rounded-full mb-4"></div>
        
        {/* BIO SIDEBAR DINAMIS */}
        <p className="text-white text-center text-sm opacity-90 mb-8 font-light leading-relaxed px-2">
          {bio}
        </p>
      </div>

      {/* SOCIAL LINKS (Tetap Statis / Hardcoded karena jarang berubah, atau bisa didinamiskan nanti) */}
      <div className="flex space-x-4 mt-auto mb-8">
        <a
          href="https://www.instagram.com/alimsuma"
          target="_blank"
          rel="noopener noreferrer"
          className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-all hover:scale-110 duration-200 backdrop-blur-sm"
        >
          <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
          </svg>
        </a>
        
        <a
          href="https://www.linkedin.com/in/alimsuma"
          target="_blank"
          rel="noopener noreferrer"
          className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-all hover:scale-110 duration-200 backdrop-blur-sm"
        >
          <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
          </svg>
        </a>
        
        <a
          href="https://github.com/Whyriez"
          target="_blank"
          rel="noopener noreferrer"
          className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-all hover:scale-110 duration-200 backdrop-blur-sm"
        >
          <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
          </svg>
        </a>
      </div>
    </aside>
  );
}