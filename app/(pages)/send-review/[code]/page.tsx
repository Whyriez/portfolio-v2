'use client';

import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useRef, useState, use } from "react";
import { createClient } from '@/utils/supabase/client';

export default function SendReviewPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = use(params);
  const router = useRouter();
  const supabase = createClient();

  // State Validation
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [validating, setValidating] = useState(true);

  // State Form
  const [name, setName] = useState("");
  const [review, setReview] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  // State Submission
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false); // State Sukses
  const [submitError, setSubmitError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // 1. Validate Code on Mount
  useEffect(() => {
    const validateCode = async () => {
      try {
        const { data, error } = await supabase
          .from('review_codes')
          .select('*')
          .eq('code', code)
          .single();

        if (error || !data) {
          setIsValid(false);
        } else if (data.is_used) {
          setIsValid(false);
        } else {
          setIsValid(true);
          if (data.client_name && data.client_name !== 'Unknown Client') {
            setName(data.client_name);
          }
        }
      } catch (err) {
        setIsValid(false);
      } finally {
        setValidating(false);
      }
    };

    if (code) {
      validateCode();
    }
  }, [code, supabase]);

  // Handle Avatar
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle Submit
  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      let finalAvatarUrl = "https://supabase1.limapp.my.id/storage/v1/object/public/portfolio//default-profile.jpg";

      // Upload Avatar
      if (avatarFile) {
        const fileExt = avatarFile.name.split('.').pop();
        const fileName = `reviews/${Date.now()}-${Math.random().toString(36).substr(2, 5)}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from('portfolio')
          .upload(fileName, avatarFile);

        if (uploadError) throw new Error("Failed to upload avatar image.");

        const { data } = supabase.storage.from('portfolio').getPublicUrl(fileName);
        finalAvatarUrl = data.publicUrl;
      }

      // API Call
      const res = await fetch('/api/reviews/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code,
          name,
          review,
          avatar: finalAvatarUrl
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || "Submission failed.");
      }

      // SUKSES
      setSubmitSuccess(true);
      setIsValid(false); // <--- KUNCI: Tandai kode invalid secara lokal agar tidak bisa dipakai lagi di sesi ini

      setTimeout(() => {
        router.push('/');
      }, 3000);

    } catch (error: any) {
      setSubmitError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- RENDER STATES (URUTAN SANGAT PENTING) ---

  // 1. Cek Sukses DULUAN.
  // Jika sukses, tampilkan layar terima kasih (meskipun isValid sudah kita set false)
  if (submitSuccess) {
    return (
      <section className="page-section active">
        {/* Wrapper Flexbox untuk Centering */}
        <div className="flex flex-col items-center justify-center min-h-[80vh] w-full p-4">

          <div className="glassmorphism max-w-lg w-full rounded-2xl p-8 text-center border border-green-100 dark:border-green-900/30 shadow-2xl">
            <div style={{ width: '6rem', height: '6rem' }} className="bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner animate-bounce">
              <span className="text-5xl">✅</span>
            </div>

            <h2 className="text-3xl font-bold text-green-600 dark:text-green-400 mb-4">
              Review Submitted!
            </h2>

            <p className="text-gray-600 dark:text-gray-300 mb-8 leading-relaxed text-lg">
              Thank you for your valuable feedback, <strong className="text-gray-800 dark:text-white">{name}</strong>!
              <br />Your review has been successfully recorded.
            </p>

            <div className="flex items-center justify-center gap-2 text-sm text-gray-400 animate-pulse">
              <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
              Redirecting to homepage...
            </div>
          </div>

        </div>
      </section>
    );
  }

  // 2. Cek Loading
  if (validating) {
    return (
      <section className="page-section active flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">Validating invitation code...</p>
        </div>
      </section>
    );
  }

  // 3. Cek Invalid
  if (isValid === false) {
    return (
      <section className="page-section active">
        {/* Wrapper Flexbox untuk Centering */}
        <div className="flex flex-col items-center justify-center min-h-[80vh] w-full p-4">

          <div className="glassmorphism max-w-lg w-full rounded-2xl p-8 text-center border border-red-100 dark:border-red-900/30 shadow-2xl">
            <div
              style={{ width: '6rem', height: '6rem' }}
              className="bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-6 shadow-inner mx-auto"
            >
              <span className="text-5xl">🚫</span>
            </div>

            <h2 className="text-3xl font-bold text-red-600 dark:text-red-400 mb-4">
              Invalid Code
            </h2>

            <p className="text-gray-600 dark:text-gray-300 mb-8 leading-relaxed text-lg">
              The review invitation code <span className="font-mono bg-red-50 dark:bg-red-900/30 px-2 py-1 rounded text-red-600 dark:text-red-300 font-bold">"{code}"</span> is invalid or has already been used.
              <br /><span className="text-sm mt-2 block opacity-80">Please verify the link sent to you.</span>
            </p>

            <button
              onClick={() => router.push('/')}
              className="px-8 py-3.5 bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20 rounded-xl font-bold transition-all transform hover:scale-105 text-gray-700 dark:text-white shadow-md"
            >
              Go to Homepage
            </button>
          </div>

        </div>
      </section>
    );
  }

  // 4. Render Form (Jika Valid & Belum Submit)
  return (
    <section className="page-section active p-8 pt-4">
      <div className="glassmorphism max-w-2xl mx-auto rounded-2xl p-8 border border-white/20 shadow-xl">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-2 text-center">
          Share Your Experience
        </h2>
        <p className="text-center text-gray-500 dark:text-gray-400 mb-8">
          Your feedback helps me improve and grow.
        </p>

        {submitError && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-600 text-center text-sm">
            {submitError}
          </div>
        )}

        <form onSubmit={handleSubmitReview} className="space-y-6">

          {/* Avatar Upload */}
          <div className="flex flex-col items-center mb-8">
            <div
              className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-white dark:border-gray-700 shadow-lg cursor-pointer group bg-gray-100 dark:bg-gray-800"
              onClick={() => fileInputRef.current?.click()}
            >
              {previewUrl ? (
                <img src={previewUrl} alt="Avatar Preview" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 group-hover:text-blue-500 transition-colors">
                  <svg className="w-8 h-8 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                </div>
              )}

              {/* Overlay Hover */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xs font-medium transition-opacity">
                Change Photo
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">Upload Profile Photo (Optional)</p>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />
          </div>

          {/* Name Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Your Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all dark:text-white"
              placeholder="e.g. John Doe"
            />
          </div>

          {/* Review Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Your Review <span className="text-red-500">*</span>
            </label>
            <textarea
              required
              rows={5}
              value={review}
              onChange={(e) => setReview(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all dark:text-white resize-none"
              placeholder="Tell us what you liked about working with me..."
            ></textarea>
            <div className="text-right mt-1">
              <span className="text-xs text-gray-400">
                {review.trim().split(/\s+/).filter(w => w.length > 0).length} words
              </span>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting || !name.trim() || !review.trim()}
            className={`w-full py-4 rounded-xl font-bold text-white shadow-lg transition-all transform active:scale-[0.98]
              ${isSubmitting || !name.trim() || !review.trim()
                ? "bg-gray-400 cursor-not-allowed opacity-70"
                : "bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-blue-500/30 hover:-translate-y-1"
              }`}
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Sending...
              </span>
            ) : (
              "Submit Review"
            )}
          </button>

        </form>
      </div>
    </section>
  );
}