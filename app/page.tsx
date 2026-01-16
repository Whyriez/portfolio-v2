"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import PortfolioCard from "@/components/features/portfolio/PortfolioCard";

function HomePage() {
  const [projectData, setProjectData] = useState([]);

  // const fetchData = async () => {
  //   try {
  //     const projectsRef = collection(db, "projects");
  //     const q = query(projectsRef, orderBy("createdAt", "desc"), limit(3));
  //     const snapshot = await getDocs(q);
  //     const newUserData = [];

  //     snapshot.forEach((doc) => {
  //       newUserData.push({
  //         id: doc.id,
  //         ...doc.data(),
  //       });
  //     });

  //     setProjectData(newUserData);
  //     const uniqueCategories = [
  //       ...new Set(newUserData.map((item) => item.category)),
  //     ];
  //   } catch (error) {
  //     console.error("Error fetching user data:", error);
  //   }
  // };

  // useEffect(() => {
  //   fetchData();
  // }, []);

  return (
    <section id="homePage" className="page-section active">
      <div className="flex flex-col md:flex-row items-center mb-12">
        <div className="md:w-1/2 mb-8 md:mb-0">
          <h1 className="text-5xl font-bold text-gray-800 mb-4">
            Hello, I'm{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              Alim Suma
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-6">
            Mobile Developer & Backend Engineer
          </p>
          <p className="text-gray-600 mb-8">
            I'm a dedicated Mobile Developer & Backend Engineer passionate about
            building seamless and powerful digital experiences. Leveraging
            modern technologies, I help businesses thrive online by developing
            high-performing, scalable mobile apps and reliable backend
            infrastructures.
          </p>
          <div className="flex space-x-4">
            <button
              onClick={() => {
                setActivePage(2);
              }}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full font-medium hover:shadow-lg transition-all"
            >
              View My Work
            </button>
            <Link
              href={"/contact"}
              className="px-6 py-3 border border-gray-300 rounded-full font-medium text-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
            >
              Contact Me
            </Link>
          </div>
        </div>
        <div className="md:w-1/2 flex justify-center">
          <div className="w-64 h-64 relative">
            <svg
              className="absolute -top-10 -right-10 w-full h-full text-blue-500 opacity-20"
              viewBox="0 0 200 200"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill="currentColor"
                d="M42.7,-62.9C56.7,-53.5,70.3,-42.8,76.2,-28.5C82.1,-14.2,80.3,3.7,74.9,19.9C69.5,36.1,60.5,50.5,47.7,60.1C34.9,69.7,18.4,74.5,1.2,72.9C-16.1,71.3,-32.2,63.3,-45.1,52.2C-58,41.1,-67.8,26.9,-72.8,10.3C-77.8,-6.3,-78,-25.2,-69.7,-39.6C-61.4,-54,-44.6,-63.8,-28.8,-72.3C-13,-80.8,1.8,-87.9,16.1,-83.8C30.4,-79.7,44.2,-64.4,42.7,-62.9Z"
                transform="translate(100 100)"
              />
            </svg>
            <svg
              className="w-full h-full"
              viewBox="0 0 200 200"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient
                  id="heroGradient"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="100%"
                >
                  <stop offset="0%" stopColor="#4776E6" />
                  <stop offset="100%" stopColor="#8E54E9" />
                </linearGradient>
              </defs>
              C
              <rect
                x="20"
                y="20"
                width="160"
                height="160"
                rx="10"
                fill="rgba(255,255,255,0.9)"
                stroke="url(#heroGradient)"
                strokeWidth="2"
              />
              <circle cx="40" cy="40" r="5" fill="#FF5F57" />
              <circle cx="60" cy="40" r="5" fill="#FFBD2E" />
              <circle cx="80" cy="40" r="5" fill="#28CA41" />
              <rect
                x="40"
                y="70"
                width="120"
                height="6"
                rx="3"
                fill="#E0E0E0"
              />
              <rect x="40" y="90" width="80" height="6" rx="3" fill="#E0E0E0" />
              <rect
                x="40"
                y="110"
                width="100"
                height="6"
                rx="3"
                fill="#E0E0E0"
              />
              <rect
                x="40"
                y="130"
                width="60"
                height="6"
                rx="3"
                fill="#E0E0E0"
              />
              <rect
                x="40"
                y="150"
                width="90"
                height="6"
                rx="3"
                fill="#E0E0E0"
              />
              <rect
                x="130"
                y="90"
                width="20"
                height="20"
                rx="4"
                fill="url(#heroGradient)"
              />
              <rect
                x="130"
                y="120"
                width="30"
                height="10"
                rx="5"
                fill="url(#heroGradient)"
                opacity="0.7"
              />
              <rect
                x="130"
                y="140"
                width="15"
                height="15"
                rx="7.5"
                fill="url(#heroGradient)"
                opacity="0.5"
              />
            </svg>
          </div>
        </div>
      </div>

      <div className="mt-16">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Featured Projects
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {projectData.map((project, index) => (
            <PortfolioCard key={index} {...project} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default HomePage;
