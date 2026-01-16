"use client";
import { useEffect, useState } from "react";
import ReviewCard from "../../components/ReviewsCard";
import Link from "next/link";

function ReviewsPage() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [reviewData, setReviewData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [reviewsPerPage] = useState(6);

  // const fetchData = async () => {
  //   try {
  //     const snapshot = await getDocs(collection(db, "reviews"));
  //     const newReviewsData = [];

  //     snapshot.forEach((doc) => {E
  //       newReviewsData.push({
  //         id: doc.id,
  //         ...doc.data(),
  //       });
  //     });

  //     setReviewData(newReviewsData);
  //   } catch (error) {
  //     console.error("Error fetching reviews data:", error);
  //   }
  // };

  // useEffect(() => {
  //   fetchData();
  // }, []);

  // const reviewThemes = [
  //   {
  //     textColor: "text-blue-600",
  //     gradient: "from-blue-400 to-indigo-500",
  //   },
  //   {
  //     textColor: "text-purple-600",
  //     gradient: "from-purple-400 to-pink-500",
  //   },
  //   {
  //     textColor: "text-green-600",
  //     gradient: "from-green-400 to-teal-500",
  //   },
  //   {
  //     textColor: "text-yellow-600",
  //     gradient: "from-yellow-400 to-orange-500",
  //   },
  //   {
  //     textColor: "text-red-600",
  //     gradient: "from-red-400 to-rose-500",
  //   },
  //   // Add more unique themes here if you have more reviews than themes
  // ];

  // // Calculate total pages
  const totalPages = Math.ceil(reviewData.length / reviewsPerPage);

  const indexOfLastReview = currentPage * reviewsPerPage;
  const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
  const currentReviews = reviewData.slice(
    indexOfFirstReview,
    indexOfLastReview
  );

  return (
    <section id="reviewsPage" className="page-section active">
      <h2 className="text-4xl font-bold text-gray-800 mb-6">Client Reviews</h2>
      <p className="text-gray-600 mb-8">
        What clients and colleagues say about working with me.
      </p>

      <div className="flex flex-wrap justify-center mb-8">
        {["all"].map((filter) => (
          <button
            key={filter}
            className={`review-filter px-4 py-2 m-1 rounded-full font-medium ${
              activeFilter === filter
                ? "bg-white dark:bg-gray-800 bg-opacity-30 text-gray-800"
                : "text-gray-600"
            }`}
            onClick={() => setActiveFilter(filter)}
          >
            {filter === "all" ? "All Reviews" : ""}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {currentReviews.map((review, idx) => {
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
        })}
      </div>

      {/* Pagination Dots (static for now) */}
      <div className="flex justify-center space-x-2 mt-8">
        {[...Array(totalPages)].map((_, index) => (
          <button
            key={index}
            className={`pagination-dot w-3 h-3 rounded-full ${
              currentPage === index + 1 ? "bg-blue-500" : "bg-gray-300"
            }`}
            onClick={() => setCurrentPage(index + 1)}
          ></button>
        ))}
      </div>

      {/* CTA Section */}
      <div className="glassmorphism rounded-xl p-8 mt-12 text-center">
        <h3 className="text-2xl font-semibold text-gray-800 mb-4">
          Enjoyed working with me?
        </h3>
        <p className="text-gray-600 mb-6">
          I'd love to hear about your experience. Your feedback helps me improve
          and grow.
        </p>
        <Link
        href={'/send-review'}
          className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full font-medium hover:shadow-lg transition-all"
        >
          Leave a Review
        </Link>
      </div>
    </section>
  );
}

export default ReviewsPage;
