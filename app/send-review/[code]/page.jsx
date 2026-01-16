"use client";

import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { useParams, useRouter } from "next/navigation"; 
import { db, storage } from "../../../../firebase";
import React, { useEffect, useRef, useState } from "react";
import { getDownloadURL, uploadBytes, ref } from "firebase/storage"; 

function SendReviewPage() {
  const router = useRouter();
  const { code } = useParams();
  const [isValid, setIsValid] = useState(null);
  const [reviewData, setReviewData] = useState({
    name: "",
    review: "",
  });
  const [codeText, setCodeText] = useState(code || "");
  const [avatarPreviewUrl, setAvatarPreviewUrl] = useState("");
  const [docId, setDocId] = useState(null); 
  const [selectedFile, setSelectedFile] = useState(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const fileInputRef = useRef(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);

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

    if (code) {
      getData(code); 
    } else {
      setIsValid(false);
    }
  }, []); 

  const getData = async (codeToCheck) => {
    if (!codeToCheck) {
      setIsValid(false);
      return;
    }

    setIsValid(null); 
    try {
      const q = query(
        collection(db, "reviews-valid"),
        where("idProject", "==", codeToCheck)
      );

      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        querySnapshot.forEach((doc) => {
          const docID = doc.id;
          setDocId(docID);
        });
        setIsValid(true); 
      } else {
        console.log("No documents found for code:", codeToCheck);
        setIsValid(false);
      }
    } catch (error) {
      console.error("Error fetching documents:", error);
      setIsValid(false); 
    }
  };

  const handleCheckCode = () => {
    getData(codeText); 
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault(); 
    setIsSubmitting(true);
    setSubmitSuccess(false);
    setSubmitError(null);

    try {
      if (!reviewData.name.trim() || !reviewData.review.trim()) {
        throw new Error("Name and Review fields cannot be empty.");
      }

      const words = reviewData.review.split(/\s+/).filter(word => word.length > 0);
      if (words.length > 30) {
        throw new Error("Your review exceeds the 30-word limit.");
      }

      let profileDownloadUrl = "";
      if (selectedFile) {
        const fileRef = ref(storage, `reviewProfiles/${selectedFile.name}`);
        await uploadBytes(fileRef, selectedFile);
        profileDownloadUrl = await getDownloadURL(fileRef);
      } else {
        profileDownloadUrl =
          "https://firebasestorage.googleapis.com/v0/b/portofolio-3f147.appspot.com/o/reviewProfiles%2Fdefault-profile.jpg?alt=media&token=5404c34d-d5c2-43bf-a12f-4270d19d46c5";
      }

      const reviewPayload = {
        nama: reviewData.name,
        review: reviewData.review,
        profile: profileDownloadUrl,
        timestamp: new Date(),
        projectId: codeText,
      };

      await addDoc(collection(db, "reviews"), reviewPayload);

      if (docId) {
        await deleteDoc(doc(db, "reviews-valid", docId));
      } else {
        console.warn("No docId found to delete from 'reviews-valid' collection.");
      }
      
      setSubmitSuccess(true);
      setReviewData({ name: "", review: "" }); 
      setSelectedFile(null); 
      setAvatarPreviewUrl("");

      setTimeout(() => {
        router.push("/reviews");
      }, 3000);

    } catch (error) {
      console.error("Error submitting review:", error.message || error);
      setSubmitError(error.message || "Failed to submit review. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isValid === null) {
    return (
      <section id="sendReviewPage" className="page-section active">
        <div className="glassmorphism rounded-xl p-8 text-center text-gray-700">
          <p>Loading validation...</p>
        </div>
      </section>
    );
  }

  if (isValid === false) {
    return (
      <section id="sendReviewPage" className="page-section active">
        <div className="glassmorphism rounded-xl p-8 text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Invalid Code</h2>
          <p className="text-gray-700 mb-6">
            The review code you provided is not valid or has expired. Please
            enter your code and click "Check Code".
          </p>
          <div className="mb-4">
            <label
              htmlFor="code"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Enter Code Manually
            </label>
            <input
              type="text"
              id="code"
              name="code"
              value={codeText}
              onChange={(e) => setCodeText(e.target.value)}
              className="form-input w-full px-4 py-3 rounded-lg bg-white dark:bg-gray-800 border border-gray-300 focus:outline-none transition-colors"
              placeholder="Enter your code"
            />
            <button
              type="button" 
              onClick={handleCheckCode}
              className="submit-button w-full mt-3 py-3 px-6 text-white font-medium rounded-lg focus:outline-none bg-blue-600 hover:bg-blue-700 transition-colors"
            >
              Check Code
            </button>
          </div>
        </div>
      </section>
    );
  }


  if (submitSuccess) {
    return (
      <section id="sendReviewPage" className="page-section active">
        <div className="glassmorphism rounded-xl p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Review Submitted Successfully!</h2>
          <p className="text-gray-600 mb-4">Thank you for your valuable feedback. You will be redirected shortly.</p>
        </div>
      </section>
    );
  }

  if (submitError) {
    return (
      <section id="sendReviewPage" className="page-section active">
        <div className="glassmorphism rounded-xl p-8 text-center">
          <svg className="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2A9 9 0 111 10a9 9 0 0118 0z"></path>
          </svg>
          <h2 className="text-2xl font-bold text-red-600 mb-2">Submission Failed!</h2>
          <p className="text-gray-600 mb-4">{submitError}</p>
          <button
            type="button"
            onClick={() => setSubmitError(null)} 
            className="submit-button py-2 px-4 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg focus:outline-none transition-colors"
          >
            Try Again
          </button>
        </div>
      </section>
    );
  }


  return (
    <section id="sendReviewPage" className="page-section active">
      <div className="glassmorphism rounded-xl p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Share Your Experience
        </h2>

        <form id="reviewForm" onSubmit={handleSubmitReview} className="space-y-6">
          <div className="avatar-upload mb-8">
            <div className="avatar-edit">
              <input
                type="file"
                id="profilePhotoUpload"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                style={{ display: 'none' }}
              />
              <label htmlFor="profilePhotoUpload" className="cursor-pointer">
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
                onClick={() => fileInputRef.current.click()} 
              >
                {!avatarPreviewUrl && (
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
                )}
              </div>
            </div>
          </div>

          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Your Name
              <span className="required-asterisk">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={reviewData.name}
              onChange={(e) => setReviewData({ ...reviewData, name: e.target.value })}
              className="form-input w-full px-4 py-3 rounded-lg bg-white dark:bg-gray-800 border border-gray-300 focus:outline-none transition-colors"
              placeholder="Enter your name"
              required
            />
            <p className="mt-1 text-xs text-gray-500">Required field</p>
          </div>

          <div>
            <label
              htmlFor="review"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Your Review
              <span className="required-asterisk">*</span>
            </label>
            <textarea
              id="review"
              name="review"
              rows="5"
              required
              value={reviewData.review}
              onChange={(e) => setReviewData({ ...reviewData, review: e.target.value })}
              className="form-textarea w-full px-4 py-3 rounded-lg bg-white dark:bg-gray-800 border border-gray-300 focus:outline-none transition-colors"
              placeholder="Share your thoughts and experience..."
            ></textarea>
            <p className="mt-1 text-xs text-gray-500">
                Required field. Current words: {reviewData.review.split(/\s+/).filter(word => word.length > 0).length}
            </p>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              className="submit-button w-full py-3 px-6 text-white font-medium rounded-lg focus:outline-none"
              disabled={isSubmitting || !reviewData.name.trim() || !reviewData.review.trim()}
            >
              {isSubmitting ? "Submitting..." : "Submit Review"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

export default SendReviewPage;