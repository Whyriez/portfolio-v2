'use client';

import React, { useEffect, useState } from "react";
import Link from "next/link";
import ReviewCard from "@/components/features/reviews/ReviewsCard";
import { useAppContext } from "@/context/AppContext";


// --- Konfigurasi Tema ---
const reviewThemes = [
  { textColor: "text-blue-600", gradient: "from-blue-400 to-blue-600" },
  { textColor: "text-purple-600", gradient: "from-purple-400 to-purple-600" },
  { textColor: "text-pink-600", gradient: "from-pink-400 to-pink-600" },
  { textColor: "text-orange-600", gradient: "from-orange-400 to-orange-600" },
  { textColor: "text-green-600", gradient: "from-green-400 to-green-600" },
  { textColor: "text-teal-600", gradient: "from-teal-400 to-teal-600" },
];

const DEFAULT_PROFILE_URL = "https://supabase1.limapp.my.id/storage/v1/object/public/portfolio//default-profile.jpg";

// --- Konfigurasi Cache ---
const CACHE_KEY_REVIEWS = "reviews_data_cache";
const CACHE_EXPIRY_MS = 60 * 60 * 1000; // 1 Jam

// Tipe Data
interface ReviewData {
  id: string;
  name: string;
  avatar: string | null;
  review: string;
}

interface FormattedReview {
  nama: string;
  profile: string;
  review: string;
}

function ReviewsPage() {
  const { setActivePage } = useAppContext();
  
  const [activeFilter, setActiveFilter] = useState("all");
  const [reviewData, setReviewData] = useState<FormattedReview[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [reviewsPerPage] = useState(6);

  // --- Helper: Format Data ---
  const formatReviews = (data: ReviewData[]): FormattedReview[] => {
    return data.map(item => ({
      nama: item.name,
      profile: item.avatar || DEFAULT_PROFILE_URL,
      review: item.review
    }));
  };

  // 1. Fetch Data (Cache + API)
  useEffect(() => {
    setActivePage(3);

    const fetchReviews = async () => {
      const now = Date.now();
      const cachedData = localStorage.getItem(CACHE_KEY_REVIEWS);

      // --- A. CEK CACHE ---
      if (cachedData) {
        const { data, timestamp } = JSON.parse(cachedData);
        
        // Jika cache valid
        if (now - timestamp < CACHE_EXPIRY_MS) {
          setReviewData(formatReviews(data));
          setLoading(false);
          return; // Stop, pakai cache
        }
      }

      // --- B. FETCH API FRESH ---
      try {
        const res = await fetch('/api/reviews');
        if (!res.ok) throw new Error('Failed to fetch reviews');
        
        const data: ReviewData[] = await res.json();

        setReviewData(formatReviews(data));

        // Simpan Data Mentah ke Cache
        localStorage.setItem(CACHE_KEY_REVIEWS, JSON.stringify({
          data: data,
          timestamp: now
        }));

      } catch (error) {
        console.error("Error loading reviews:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [setActivePage]);

  // 2. Logic Pagination
  const totalPages = Math.ceil(reviewData.length / reviewsPerPage);
  const indexOfLastReview = currentPage * reviewsPerPage;
  const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
  const currentReviews = reviewData.slice(indexOfFirstReview, indexOfLastReview);

  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    document.getElementById('reviewsPage')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="reviewsPage" className="page-section active p-8 pt-0">
      <h2 className="text-4xl font-bold text-gray-800 dark:text-white mb-6">Client Reviews</h2>
      <p className="text-gray-600 dark:text-gray-400 mb-8">
        What clients and colleagues say about working with me.
      </p>

      {/* Filter Buttons */}
      <div className="flex flex-wrap justify-center mb-8">
        {["all"].map((filter) => (
          <button
            key={filter}
            className={`review-filter px-4 py-2 m-1 rounded-full font-medium transition-all ${
              activeFilter === filter
                ? "bg-white dark:bg-gray-800 bg-opacity-30 text-gray-800 dark:text-white shadow-sm"
                : "text-gray-600 dark:text-gray-400 hover:bg-white/10"
            }`}
            onClick={() => setActiveFilter(filter)}
          >
            {filter === "all" ? "All Reviews" : ""}
          </button>
        ))}
      </div>

      {/* Content */}
      {loading ? (
        // Loading State (Center Fix)
        <div className="w-full min-h-[50vh] flex flex-col justify-center items-center">
           <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {currentReviews.length > 0 ? (
              currentReviews.map((review, idx) => {
                const theme = reviewThemes[idx % reviewThemes.length];
                return (
                  <ReviewCard
                    key={idx}
                    nama={review.nama}
                    profile={review.profile}
                    review={review.review}
                    textColor={theme.textColor}
                    gradient={theme.gradient}
                  />
                );
              })
            ) : (
              <div className="col-span-full text-center py-12 text-gray-500">
                No reviews yet. Be the first to leave one!
              </div>
            )}
          </div>

          {/* Pagination Dots */}
          {totalPages > 1 && (
            <div className="flex justify-center space-x-2 mt-8">
              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={index}
                  className={`pagination-dot w-3 h-3 rounded-full transition-all ${
                    currentPage === index + 1 
                      ? "bg-blue-600 scale-125" 
                      : "bg-gray-300 dark:bg-gray-600 hover:bg-gray-400"
                  }`}
                  onClick={() => paginate(index + 1)}
                ></button>
              ))}
            </div>
          )}
        </>
      )}

      {/* CTA Section */}
      <div className="glassmorphism rounded-xl p-8 mt-12 text-center border border-white/20 dark:border-white/10">
        <h3 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
          Enjoyed working with me?
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          I'd love to hear about your experience. Your feedback helps me improve and grow.
        </p>
        <Link
          href={'/send-review'}
          className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full font-medium hover:shadow-lg hover:shadow-blue-500/30 transition-all inline-block hover:-translate-y-1"
        >
          Leave a Review
        </Link>
      </div>
    </section>
  );
}

export default ReviewsPage;