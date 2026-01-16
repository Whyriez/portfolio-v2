'use client';

import React, { useEffect, useRef, useState } from "react";

function SendReviewPage() {
  const [avatarPreviewUrl, setAvatarPreviewUrl] = useState("");

  const fileInputRef = useRef(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreviewUrl(reader.result);
      };

      reader.readAsDataURL(file);
    } else {
      setAvatarPreviewUrl("");
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <section id="sendReviewPage" className="page-section active">
      <div className="glassmorphism rounded-xl p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Share Your Experience
        </h2>

        <form id="reviewForm" className="space-y-6">
          <div className="avatar-upload mb-8">
            <div className="avatar-edit">
              <input
                type="file"
                id="profilePhotoUpload"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
              />
              <label htmlFor="profilePhotoUpload">
                <svg
                  className="w-4 h-4 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                  ></path>
                </svg>
              </label>
            </div>
            <div className="avatar-preview">
              <div
                id="avatarPreview"
                style={{
                  backgroundImage: avatarPreviewUrl
                    ? `url(${avatarPreviewUrl})`
                    : "none",
                }}
              >
                <svg
                  className="w-12 h-12 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  ></path>
                </svg>
              </div>
            </div>
          </div>

          <div>
            <label
              htmlFor="userName"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Your Name
              <span className="required-asterisk">*</span>
            </label>
            <input
              type="text"
              id="userName"
              name="userName"
              className="form-input w-full px-4 py-3 rounded-lg bg-white dark:bg-gray-800 border border-gray-300 focus:outline-none transition-colors"
              placeholder="Enter your name"
              required
            />
            <p className="mt-1 text-xs text-gray-500">Required field</p>
          </div>

          <div>
            <label
              htmlFor="userReview"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Your Review
              <span className="required-asterisk">*</span>
            </label>
            <textarea
              id="userReview"
              name="userReview"
              rows="5"
              required
              className="form-textarea w-full px-4 py-3 rounded-lg bg-white dark:bg-gray-800 border border-gray-300 focus:outline-none transition-colors"
              placeholder="Share your thoughts and experience..."
            ></textarea>
            <p className="mt-1 text-xs text-gray-500">Required field</p>
          </div>

          <div>
            <label
              htmlFor="code"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Your Code
              <span className="required-asterisk">*</span>
            </label>
            <input
              type="text"
              id="code"
              name="code"
              className="form-input w-full px-4 py-3 rounded-lg bg-white dark:bg-gray-800 border border-gray-300 focus:outline-none transition-colors"
              placeholder="Enter your code"
              required
            />
            <p className="mt-1 text-xs text-gray-500">Required field</p>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              className="submit-button w-full py-3 px-6 text-white font-medium rounded-lg focus:outline-none"
            >
              Submit Review
            </button>
          </div>
        </form>

        <div
          id="successMessage"
          className="hidden mt-6 p-4 bg-green-50 border border-green-200 rounded-lg"
        >
          <div className="flex items-center">
            <svg
              className="w-5 h-5 text-green-500 mr-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              ></path>
            </svg>
            <p className="text-green-700">
              Thank you for your review! It has been submitted successfully.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default SendReviewPage;
