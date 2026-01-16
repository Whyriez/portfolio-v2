'use client';

import React, { useEffect, useState } from "react";
import PortfolioCard from "@/components/features/portfolio/PortfolioCard";
import { useAppContext } from "@/context/AppContext";

// Tipe data Project
interface Project {
  id: string;
  title: string;
  category: string;
  description: string;
  tags: string[];
  images: string[];
  link: string;
  github: string;
}

function PortfolioPage() {
  const { setActivePage } = useAppContext();
  
  // State Data
  const [projectData, setProjectData] = useState<Project[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // State Filter & Pagination
  const [activeFilter, setActiveFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; 

  // 1. Fetch Data API
  useEffect(() => {
    setActivePage(2); 

    const fetchProjects = async () => {
      try {
        const res = await fetch('/api/projects');
        if (!res.ok) throw new Error('Failed to fetch');
        const data = await res.json();
        
        setProjectData(data);
        
        // Auto-generate categories dari DB
        const uniqueCategories = Array.from(new Set(data.map((item: Project) => item.category))) as string[];
        setCategories(uniqueCategories);

      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [setActivePage]);

  // 2. Logic Filtering
  const filteredProjects = activeFilter === "all"
    ? projectData
    : projectData.filter((project) => project.category === activeFilter);

  // 3. Logic Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProjects = filteredProjects.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredProjects.length / itemsPerPage);

  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    document.getElementById('portfolioPage')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="portfolioPage" className="page-section active p-8 pt-0">
      {/* Header Original Anda */}
      <h2 className="text-4xl font-bold text-gray-800 mb-8">My Portfolio</h2>

      {/* Filter Buttons (Style Original Anda) */}
      <div className="flex flex-wrap justify-center mb-8">
        {["all", ...categories].map((filter) => (
          <button
            key={filter}
            className={`portfolio-filter px-4 py-2 m-1 rounded-full font-medium ${
              activeFilter === filter
                ? "bg-white dark:bg-gray-800 bg-opacity-30 text-gray-800 dark:text-white"
                : "text-gray-600 dark:text-gray-400"
            }`}
            onClick={() => {
              setActiveFilter(filter);
              setCurrentPage(1); // Reset ke page 1 saat ganti filter
            }}
          >
            {filter === "all" ? "All" : filter}
          </button>
        ))}
      </div>

      {/* Content Area */}
      {loading ? (
        <div className="flex justify-center p-20">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <>
          {/* Projects Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {currentProjects.length > 0 ? (
              currentProjects.map((project) => (
                <PortfolioCard 
                  key={project.id} 
                  {...project}
                  images={project.images?.[0] || '/dev4.png'} 
                />
              ))
            ) : (
              <div className="col-span-full text-center py-12 text-gray-500">
                No projects found.
              </div>
            )}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2">
              <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 rounded-lg bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-600 disabled:opacity-50"
              >
                ← Prev
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
                <button
                  key={number}
                  onClick={() => paginate(number)}
                  className={`w-10 h-10 rounded-lg font-medium transition-all ${
                    currentPage === number
                      ? "bg-blue-600 text-white"
                      : "bg-white dark:bg-white/5 text-gray-600"
                  }`}
                >
                  {number}
                </button>
              ))}

              <button
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-4 py-2 rounded-lg bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-600 disabled:opacity-50"
              >
                Next →
              </button>
            </div>
          )}
        </>
      )}
    </section>
  );
}

export default PortfolioPage;