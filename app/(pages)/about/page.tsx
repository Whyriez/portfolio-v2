'use client';

import React, { useEffect, useState } from "react";
import { useAppContext } from "@/context/AppContext";


// --- Types ---
interface Journey {
  id: string;
  title: string;
  company: string;
  period: string;
  description: string;
}

interface Skill {
  id: string;
  name: string;
  level: string;
  description: string;
}

// --- Config Cache ---
const CACHE_KEY_ABOUT = "about_page_data";
const CACHE_EXPIRY_MS = 60 * 60 * 1000; // 1 Jam

// --- Helper Colors ---
const COLORS = [
  { text: "text-purple-600", border: "border-purple-500" },
  { text: "text-blue-600", border: "border-blue-500" },
  { text: "text-green-600", border: "border-green-500" },
  { text: "text-pink-600", border: "border-pink-500" },
];

export default function AboutPage() {
  const { setActivePage } = useAppContext();
  
  const [aboutText, setAboutText] = useState("");
  const [journeys, setJourneys] = useState<Journey[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setActivePage(1);

    const fetchAboutData = async () => {
      const now = Date.now();
      const cachedData = localStorage.getItem(CACHE_KEY_ABOUT);

      // --- 1. CEK CACHE ---
      if (cachedData) {
        const { profile, journeys, skills, timestamp } = JSON.parse(cachedData);
        
        // Jika cache belum expired (masih valid)
        if (now - timestamp < CACHE_EXPIRY_MS) {
          if (profile) setAboutText(profile.about_me || "No description available.");
          if (journeys) setJourneys(journeys);
          if (skills) setSkills(skills);
          
          setLoading(false); 
          return; // Stop di sini, tidak perlu fetch API
        }
      }

      // --- 2. FETCH API FRESH (Jika Cache Kosong/Expired) ---
      try {
        const [profileRes, journeyRes, skillRes] = await Promise.all([
          fetch('/api/profile'),
          fetch('/api/journeys'),
          fetch('/api/skills')
        ]);

        let profileData = {};
        let journeyData = [];
        let skillData = [];

        if (profileRes.ok) {
          profileData = await profileRes.json();
          // @ts-ignore
          setAboutText(profileData.about_me || "No description available.");
        }

        if (journeyRes.ok) {
          journeyData = await journeyRes.json();
          setJourneys(journeyData);
        }

        if (skillRes.ok) {
          skillData = await skillRes.json();
          setSkills(skillData);
        }

        // --- 3. SIMPAN KE CACHE ---
        localStorage.setItem(CACHE_KEY_ABOUT, JSON.stringify({
          profile: profileData,
          journeys: journeyData,
          skills: skillData,
          timestamp: now
        }));

      } catch (error) {
        console.error("Error fetching about data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAboutData();
  }, [setActivePage]);

  // Fallback Loading UI (Center Fix)
  if (loading) {
    return (
      <section id="aboutPage" className="page-section active">
        {/* Wrapper Flexbox Center */}
        <div className="w-full min-h-[80vh] flex flex-col justify-center items-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-400 text-sm animate-pulse">Loading profile...</p>
        </div>
      </section>
    );
  }

  return (
    <section id="aboutPage" className="page-section active p-8 pt-0">
      <div className="mb-8">
        <h2 className="text-4xl font-bold text-gray-800 dark:text-white mb-6">About me</h2>
        
        {/* About Me Text */}
        <div className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6 whitespace-pre-line">
          {aboutText}
        </div>

        {/* --- JOURNEY SECTION --- */}
        <div className="mt-12 mb-12">
          <h3 className="text-2xl font-semibold text-gray-800 dark:text-white mb-8">
            My Journey
          </h3>
          
          <div className="relative">
            <div className="absolute left-0 md:left-1/2 transform md:-translate-x-1/2 h-full w-1 bg-gradient-to-b from-blue-400 to-purple-600 rounded-full"></div>

            <div className="relative z-10">
              {journeys.length === 0 ? (
                 <p className="text-center text-gray-500 py-4 pl-4 md:pl-0">No journey added yet.</p>
              ) : (
                journeys.map((item, index) => {
                  const isEven = index % 2 === 0;
                  const color = COLORS[index % COLORS.length];

                  return (
                    <div key={item.id} className={`flex flex-col ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'} mb-12`}>
                      
                      {/* Content Box */}
                      <div className={`md:w-1/2 ${isEven ? 'md:pr-12 md:text-right' : 'md:pl-12'} mb-4 md:mb-0`}>
                        <div className={`glassmorphism bg-white dark:bg-white/5 rounded-xl p-5 border border-gray-100 dark:border-white/10 ${isEven ? 'md:ml-auto md:mr-0' : 'md:mr-auto md:ml-0'} max-w-md`}>
                          <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-1">
                            {item.title}
                          </h4>
                          <div className="text-sm text-gray-500 dark:text-gray-400 mb-1 font-medium">
                             {item.company}
                          </div>
                          <p className={`${color.text} font-medium mb-2 text-sm`}>
                            {item.period}
                          </p>
                          <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                            {item.description}
                          </p>
                        </div>
                      </div>

                      {/* Dot Timeline */}
                      <div className={`md:w-1/2 ${isEven ? 'md:pl-12 justify-start' : 'md:pr-12 justify-end'} flex`}>
                        <div className={`w-8 h-8 rounded-full bg-white dark:bg-gray-800 border-4 ${color.border} z-10 mt-1 ${isEven ? 'md:ml-[-1.65rem]' : 'md:mr-[-1.65rem]'}`}></div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* --- SKILLS SECTION --- */}
        <div className="mt-12">
          <h3 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6">
            My Skills
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {skills.length > 0 ? (
              skills.map((skill, index) => (
                <div key={skill.id} className="glassmorphism bg-white dark:bg-white/5 rounded-xl p-5 border border-gray-100 dark:border-white/10 hover:shadow-lg transition-shadow">
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-700 dark:text-gray-200 font-medium">{skill.name}</span>
                    <span className={`font-medium ${COLORS[index % COLORS.length].text}`}>
                      {skill.level}
                    </span>
                  </div>
                  <div className="text-gray-600 dark:text-gray-400 text-sm">
                    {skill.description}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 col-span-2">No skills added yet.</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}