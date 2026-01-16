'use client';

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppContext } from "@/context/AppContext";
import Image from "next/image";

// Definisi Tipe Data
interface Certificate {
  id: string;
  title: string;
  issuer: string;
  issued_at: string;
  link: string;
  image: string;
  type: 'Competence' | 'Achievement' | 'General';
}

// Konfigurasi Tema
const themeConfig: Record<string, any> = {
  Competence: {
    gradient: "from-blue-600 to-indigo-600",
    text: "text-blue-600",
    icon: (
      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  Achievement: {
    gradient: "from-purple-500 to-pink-600",
    text: "text-purple-600",
    icon: (
      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
      </svg>
    ),
  },
  General: {
    gradient: "from-cyan-400 to-sky-500", 
    text: "text-cyan-600",
    icon: (
      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
      </svg>
    ),
  },
};

function CertificatesPage() {
  const { setActivePage } = useAppContext();
  
  // Data State
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCert, setSelectedCert] = useState<Certificate | null>(null);

  // Filter & Pagination State
  const [activeFilter, setActiveFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6; 

  useEffect(() => {
    setActivePage(3);
    const fetchCertificates = async () => {
      try {
        const res = await fetch('/api/certificates');
        if (!res.ok) throw new Error('Failed fetch');
        const data = await res.json();
        setCertificates(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCertificates();
  }, [setActivePage]);

  // Handle ESC
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelectedCert(null);
    };
    if (selectedCert) window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [selectedCert]);

  // --- LOGIC FILTERING & PAGINATION ---
  const filteredCertificates = activeFilter === "All"
    ? certificates
    : certificates.filter((cert) => cert.type === activeFilter);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCertificates = filteredCertificates.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredCertificates.length / itemsPerPage);

  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter);
    setCurrentPage(1); 
  };

  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    document.getElementById('certificatesPage')?.scrollIntoView({ behavior: 'smooth' });
  };

  // Variants Animation
  const backdropVariants = {
    visible: { opacity: 1 },
    hidden: { opacity: 0 },
  };

  const modalVariants = {
    hidden: { y: "20px", opacity: 0, scale: 0.95 },
    visible: { y: "0", opacity: 1, scale: 1, transition: { type: "spring", duration: 0.5 } },
    exit: { y: "20px", opacity: 0, scale: 0.95 },
  };

  return (
    <section id="certificatesPage" className="page-section active p-8 pt-0">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">
            My Certificates
          </h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl">
            Professional certifications and achievements that demonstrate my
            expertise.
          </p>
        </header>

        {/* --- FILTER BUTTONS (Updated Style to Match Portfolio) --- */}
        <div className="flex flex-wrap justify-center mb-8">
          {["All", "Competence", "Achievement", "General"].map((cat) => (
            <button
              key={cat}
              onClick={() => handleFilterChange(cat)}
              className={`portfolio-filter px-4 py-2 m-1 rounded-full font-medium transition-all ${
                activeFilter === cat
                  ? "bg-white dark:bg-gray-800 bg-opacity-30 text-gray-800 dark:text-white"
                  : "text-gray-600 dark:text-gray-400"
              }`}
            >
              {cat === "All" ? "All Certificates" : cat}
            </button>
          ))}
        </div>

        {/* --- CONTENT GRID --- */}
        {loading ? (
           <div className="flex justify-center p-20">
             <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
           </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {currentCertificates.length > 0 ? (
                currentCertificates.map((cert) => {
                  const theme = themeConfig[cert.type] || themeConfig['General'];
                  
                  return (
                    <div key={cert.id} className="certificate-card glassmorphism bg-white dark:bg-white/5 rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-white/10 flex flex-col h-full group">
                      {/* Heading Card */}
                      <div className={`h-16 bg-gradient-to-r ${theme.gradient} flex items-center justify-center`}>
                        {theme.icon}
                      </div>
                      
                      <div className="p-6 flex-1 flex flex-col">
                        <div className="flex justify-between items-start mb-4">
                          <h3 className="text-lg font-bold text-gray-800 dark:text-white line-clamp-2 min-h-[3.5rem]" title={cert.title}>
                            {cert.title}
                          </h3>
                          <span className={`text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-300`}>
                            {cert.issued_at ? new Date(cert.issued_at).getFullYear() : '-'}
                          </span>
                        </div>
                        
                        <p className="text-gray-600 dark:text-gray-400 font-medium mb-6 text-sm flex-1">
                          Issuer: {cert.issuer}
                        </p>

                        <div className="flex justify-end mt-auto">
                          {/* Button View Certificate */}
                          <button
                            className={`px-5 py-2.5 rounded-lg font-medium transition-all duration-300 flex items-center gap-2 text-sm w-full justify-center text-white shadow-md hover:shadow-lg hover:-translate-y-0.5 bg-gradient-to-r ${theme.gradient}`}
                            onClick={() => setSelectedCert(cert)}
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            View Certificate
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="col-span-full py-20 text-center">
                  <div className="text-4xl mb-4">🔍</div>
                  <p className="text-gray-500 dark:text-gray-400">
                    No certificates found in "{activeFilter}" category.
                  </p>
                </div>
              )}
            </div>

            {/* --- PAGINATION CONTROLS --- */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2">
                <button
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-4 py-2 rounded-lg bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-white/10 transition-colors"
                >
                  ← Prev
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
                  <button
                    key={number}
                    onClick={() => paginate(number)}
                    className={`w-10 h-10 rounded-lg font-medium transition-all duration-300
                      ${currentPage === number
                        ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30"
                        : "bg-white dark:bg-white/5 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10 border border-gray-200 dark:border-white/10"
                      }`}
                  >
                    {number}
                  </button>
                ))}

                <button
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 rounded-lg bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-white/10 transition-colors"
                >
                  Next →
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* --- MODAL DINAMIS --- */}
      <AnimatePresence>
        {selectedCert && (
          <motion.div
            className="fixed inset-0 bg-gray-900/60 dark:bg-black/80 flex items-center justify-center p-4 z-50 backdrop-blur-sm"
            onClick={() => setSelectedCert(null)}
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            <motion.div
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden relative max-h-[90vh] flex flex-col"
              onClick={(e) => e.stopPropagation()}
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              {/* Modal Header */}
              <div className="p-5 border-b border-gray-100 dark:border-white/10 flex justify-between items-center bg-gray-50 dark:bg-white/5">
                <h3 className="text-lg font-bold text-gray-800 dark:text-white pr-4">
                  {selectedCert.title}
                </h3>
                <button
                  onClick={() => setSelectedCert(null)}
                  className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                  <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 overflow-y-auto">
                
                {/* Preview Container */}
                {selectedCert.image ? (
                  selectedCert.image.toLowerCase().includes('.pdf') ? (
                    // TAMPILAN PDF: Fixed Height
                    <div className="w-full h-[500px] bg-gray-100 dark:bg-black/40 rounded-xl overflow-hidden mb-6 border border-gray-200 dark:border-white/10">
                       <iframe 
                          src={`${selectedCert.image}#toolbar=0&navpanes=0`} 
                          className="w-full h-full"
                          title="Certificate PDF"
                       />
                    </div>
                  ) : (
                    // TAMPILAN IMAGE: Proporsional
                    <div className="w-full relative min-h-[300px] max-h-[500px] bg-gray-100 dark:bg-black/40 rounded-xl overflow-hidden mb-6 border border-gray-200 dark:border-white/10 flex items-center justify-center">
                       <Image 
                          src={selectedCert.image} 
                          alt={selectedCert.title} 
                          width={800}
                          height={600}
                          className="w-full h-auto max-h-[500px] object-contain p-2"
                       />
                    </div>
                  )
                ) : (
                   <div className="w-full h-40 bg-gray-100 dark:bg-white/5 rounded-xl flex items-center justify-center text-gray-400 mb-6">
                      No Document Available
                   </div>
                )}

                <div className="flex flex-col md:flex-row justify-between items-center gap-4 border-t border-gray-100 dark:border-white/10 pt-4">
                  <div className="text-center md:text-left">
                    <p className="text-gray-900 dark:text-white font-semibold">
                      Issuer: {selectedCert.issuer}
                    </p>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">
                      Issued: {selectedCert.issued_at ? new Date(selectedCert.issued_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : '-'}
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    {selectedCert.link && (
                      <a
                        href={selectedCert.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-gray-200 rounded-lg text-sm font-medium hover:bg-gray-200 dark:hover:bg-white/20 transition-colors"
                      >
                        Verify 🔗
                      </a>
                    )}

                    {selectedCert.image && (
                      <a
                        href={selectedCert.image}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`px-4 py-2 text-white rounded-lg text-sm font-medium hover:opacity-90 transition-opacity bg-gradient-to-r 
                          ${themeConfig[selectedCert.type]?.gradient || themeConfig['General'].gradient}`}
                      >
                        Open Full
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

export default CertificatesPage;