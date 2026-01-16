'use client';
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

function CertificatesPage() {
  const [isFullStackModalOpen, setIsFullStackModalOpen] = useState(false);

  const openFullStackModal = () => {
    setIsFullStackModalOpen(true);
    document.body.style.overflow = "hidden";
  };

  const closeFullStackModal = () => {
    setIsFullStackModalOpen(false);
    document.body.style.overflow = "unset";
  };

  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === "Escape") {
        closeFullStackModal();
      }
    };

    if (isFullStackModalOpen) {
      window.addEventListener("keydown", handleEsc);
    }

    return () => {
      window.removeEventListener("keydown", handleEsc);
    };
  }, [isFullStackModalOpen]);

  const backdropVariants = {
    visible: { opacity: 1, transition: { duration: 0.2 } },
    hidden: { opacity: 0, transition: { duration: 0.2 } },
  };

  const modalVariants = {
    hidden: {
      y: "-10vh",
      opacity: 0,
      scale: 0.9,
      transition: { duration: 0.2, ease: "easeOut" },
    },
    visible: {
      y: "0",
      opacity: 1,
      scale: 1,
      transition: { duration: 0.3, ease: "easeOut" },
    },
    exit: {
      y: "-10vh",
      opacity: 0,
      scale: 0.9,
      transition: { duration: 0.2, ease: "easeIn" },
    },
  };

  return (
    <section id="certificatesPage" className="page-section active">
      <div className="max-w-6xl mx-auto">
        <header className="mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            My Certificates
          </h1>
          <p className="text-gray-600 max-w-2xl">
            Professional certifications and achievements that demonstrate my
            expertise and continuous learning in web development and design.
          </p>
        </header>

        <div className="certificates-container grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* CARD 1: Full-Stack Web Development */}
          <div className="certificate-card glassmorphism rounded-xl overflow-hidden">
            <div className="h-16 bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center">
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                ></path>
              </svg>
            </div>
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-semibold text-gray-800">
                  Full-Stack Web Development
                </h3>
                <span className="text-sm text-blue-600 font-medium">2022</span>
              </div>
              <p className="text-gray-700 font-medium mb-2">Udacity</p>
              {/* <p className="text-gray-600 mb-6">
                Comprehensive program covering front-end and back-end
                technologies, including React, Node.js, and database management.
              </p>

              <div className="flex flex-wrap gap-2 mb-6">
                <span className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm">
                  React
                </span>
                <span className="px-3 py-1 bg-green-100 text-green-600 rounded-full text-sm">
                  Node.js
                </span>
                <span className="px-3 py-1 bg-purple-100 text-purple-600 rounded-full text-sm">
                  MongoDB
                </span>
              </div> */}

              <div className="flex justify-end">
                <button
                  className="px-5 py-2.5 bg-blue-100 text-blue-600 rounded-lg font-medium hover:bg-blue-200 transition-colors flex items-center gap-2"
                  onClick={openFullStackModal}
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    ></path>
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    ></path>
                  </svg>
                  View Certificate
                </button>
              </div>
            </div>
          </div>

          {/* CARD 2: Advanced React & Redux (tidak ada perubahan pada fungsionalitas modalnya) */}
          <div className="certificate-card glassmorphism rounded-xl overflow-hidden">
            <div className="h-16 bg-gradient-to-r from-purple-500 to-pink-600 flex items-center justify-center">
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                ></path>
              </svg>
            </div>
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-semibold text-gray-800">
                  Advanced React & Redux
                </h3>
                <span className="text-sm text-purple-600 font-medium">
                  2021
                </span>
              </div>
              <p className="text-gray-700 font-medium mb-2">Coursera</p>
              {/* <p className="text-gray-600 mb-6">
                Specialized course on advanced React patterns, state management
                with Redux, and performance optimization techniques.
              </p>

              <div className="flex flex-wrap gap-2 mb-6">
                <span className="px-3 py-1 bg-indigo-100 text-indigo-600 rounded-full text-sm">
                  React
                </span>
                <span className="px-3 py-1 bg-red-100 text-red-600 rounded-full text-sm">
                  Redux
                </span>
                <span className="px-3 py-1 bg-yellow-100 text-yellow-600 rounded-full text-sm">
                  Performance
                </span>
              </div> */}

              <div className="flex justify-end">
                <button className="px-5 py-2.5 bg-purple-100 text-purple-600 rounded-lg font-medium hover:bg-purple-200 transition-colors flex items-center gap-2">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    ></path>
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    ></path>
                  </svg>
                  View Certificate
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL UNTUK FULL-STACK WEB DEVELOPMENT (Sudah Disesuaikan) */}
      <AnimatePresence>
        {" "}
        {/* Wajib membungkus elemen yang di-mount/unmount */}
        {isFullStackModalOpen && (
          <motion.div
            id="fullstack-modal"
            className="fixed inset-0 bg-gray-200/50 dark:bg-gray-800/70
                       flex items-center justify-center p-4 z-50 overflow-y-auto backdrop-blur-sm"
            onClick={closeFullStackModal}
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            {/* Konten Modal */}
            <motion.div
              className="bg-white dark:bg-gray-700 rounded-xl shadow-xl p-6
                         w-full max-w-lg mx-auto relative"
              onClick={(e) => e.stopPropagation()}
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit" // Gunakan state 'exit' untuk animasi keluar
            >
              {/* ... (konten modal tetap sama) ... */}
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                  Full-Stack Web Development Certificate
                </h3>
                <button
                  onClick={closeFullStackModal}
                  className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  <svg
                    className="w-6 h-6 text-gray-700 dark:text-gray-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    ></path>
                  </svg>
                </button>
              </div>

              <div className="certificate-preview bg-gray-100 dark:bg-gray-600 rounded-lg p-4 flex items-center justify-center mb-6">
                <p className="text-gray-500 dark:text-gray-300 text-center">
                  [Preview Gambar Sertifikat di sini]
                  <br />
                  (Contoh placeholder)
                </p>
              </div>

              <div className="text-center mb-6">
                <p className="text-gray-700 dark:text-gray-200 font-medium">
                  Udacity
                </p>
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  Issued: June 2022
                </p>
              </div>

              <p className="text-gray-600 dark:text-gray-300 text-sm mb-6 text-center">
                A comprehensive program covering front-end and back-end
                technologies.
              </p>

              <div className="flex justify-center gap-4">
                <a
                  href="#"
                  className="px-4 py-2 bg-blue-100 dark:bg-blue-800 text-blue-600 dark:text-blue-200 rounded-lg font-medium hover:bg-blue-200 dark:hover:bg-blue-700 transition-colors flex items-center gap-2"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    ></path>
                  </svg>
                  View Online
                </a>
                <button className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                    ></path>
                  </svg>
                  Download
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

export default CertificatesPage;
