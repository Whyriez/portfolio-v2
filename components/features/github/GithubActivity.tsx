'use client';

import React, { useEffect, useState } from 'react';
// Import Named Exports
import { ActivityCalendar, type ThemeInput } from 'react-activity-calendar'; 
import { Tooltip as ReactTooltip } from 'react-tooltip';
import Link from 'next/link';
import 'react-tooltip/dist/react-tooltip.css';

const GITHUB_USERNAME = "Whyriez";

interface GitHubUser {
  public_repos: number;
  followers: number;
  following: number;
}

interface Repo {
  stargazers_count: number;
}

export default function GithubActivity() {
  const [contributions, setContributions] = useState<any[]>([]);
  const [stats, setStats] = useState({ repos: 0, followers: 0, stars: 0 });
  const [loading, setLoading] = useState(true);
  
  // State untuk mendeteksi Dark Mode
  const [colorScheme, setColorScheme] = useState<'light' | 'dark'>('light');

  const theme: ThemeInput = {
    light: ['#ebedf0', '#9be9a8', '#40c463', '#30a14e', '#216e39'],
    dark: ['#161b22', '#0e4429', '#006d32', '#26a641', '#39d353'],
  };

  useEffect(() => {
    const checkTheme = () => {
      const isDark = document.documentElement.classList.contains('dark');
      setColorScheme(isDark ? 'dark' : 'light');
    };

    checkTheme();

    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);

        const calendarRes = await fetch(`https://github-contributions-api.jogruber.de/v4/${GITHUB_USERNAME}?y=last`);
        const calendarData = await calendarRes.json();
        // Validasi data
        if (calendarData && calendarData.contributions) {
          setContributions(calendarData.contributions);
        }

        const userRes = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}`);
        const userData: GitHubUser = await userRes.json();

        const reposRes = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?per_page=100`);
        const reposData: Repo[] = await reposRes.json();
        
        const totalStars = Array.isArray(reposData) 
          ? reposData.reduce((acc, repo) => acc + repo.stargazers_count, 0)
          : 0;

        setStats({
          repos: userData.public_repos || 0,
          followers: userData.followers || 0,
          stars: totalStars,
        });

      } catch (err) {
        console.error("Gagal ambil data GitHub:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  return (
    <div className="w-full">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
            Open Source Activity
          </h2>
          <p className="text-gray-500 dark:text-gray-400">
            Stats fetched directly from GitHub API.
          </p>
        </div>
        <Link 
          href={`https://github.com/${GITHUB_USERNAME}`} 
          target="_blank"
          className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
        >
          View GitHub Profile →
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="glassmorphism bg-white dark:bg-white/5 p-6 rounded-2xl border border-gray-100 dark:border-white/10 flex flex-col items-center justify-center hover:scale-105 transition-transform">
          <div className="text-3xl mb-2">📦</div>
          <h3 className="text-2xl font-bold text-gray-800 dark:text-white">{loading ? "-" : stats.repos}</h3>
          <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Repositories</p>
        </div>
        <div className="glassmorphism bg-white dark:bg-white/5 p-6 rounded-2xl border border-gray-100 dark:border-white/10 flex flex-col items-center justify-center hover:scale-105 transition-transform">
          <div className="text-3xl mb-2">⭐</div>
          <h3 className="text-2xl font-bold text-gray-800 dark:text-white">{loading ? "-" : stats.stars}</h3>
          <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Total Stars</p>
        </div>
        <div className="glassmorphism bg-white dark:bg-white/5 p-6 rounded-2xl border border-gray-100 dark:border-white/10 flex flex-col items-center justify-center hover:scale-105 transition-transform">
          <div className="text-3xl mb-2">👥</div>
          <h3 className="text-2xl font-bold text-gray-800 dark:text-white">{loading ? "-" : stats.followers}</h3>
          <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Followers</p>
        </div>
        <div className="glassmorphism bg-white dark:bg-white/5 p-6 rounded-2xl border border-gray-100 dark:border-white/10 flex flex-col items-center justify-center hover:scale-105 transition-transform">
          <div className="text-3xl mb-2">🔥</div>
          <h3 className="text-2xl font-bold text-gray-800 dark:text-white">
            {loading ? "-" : contributions.reduce((acc, curr) => acc + curr.count, 0)}
          </h3>
          <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Total Contribs</p>
        </div>
      </div>

      <div className="glassmorphism bg-white dark:bg-white/5 p-6 rounded-2xl border border-gray-100 dark:border-white/10 overflow-x-auto shadow-sm hover:shadow-md transition-shadow">
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="min-w-[700px] flex justify-center">
            {/* PERBAIKAN DI SINI: renderBlock menggunakan React.cloneElement */}
            <ActivityCalendar
              data={contributions}
              theme={theme}
              colorScheme={colorScheme}
              blockSize={13}
              blockMargin={4}
              fontSize={12}
              renderBlock={(block, activity) => 
                React.cloneElement(block, {
                  'data-tooltip-id': 'github-tooltip',
                  'data-tooltip-content': `${activity.count} activities on ${activity.date}`,
                })
              }
            />
            <ReactTooltip 
              id="github-tooltip" 
              style={{ fontSize: '12px', padding: '5px 10px', borderRadius: '6px' }}
            />
          </div>
        )}
      </div>
    </div>
  );
}