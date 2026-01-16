import Image from "next/image";

function ReviewCard({ nama, profile, review, textColor, gradient }) {
  return (
    <div
      className={`glassmorphism review-card rounded-xl p-6 relative review-item`}
      data-category={nama}
    >
      <div className="quote-mark quote-mark-left">"</div>
      <div className="flex items-center mb-4">
        {profile !==
        "https://firebasestorage.googleapis.com/v0/b/portofolio-3f147.appspot.com/o/reviewProfiles%2Fdefault-profile.jpg?alt=media&token=5404c34d-d5c2-43bf-a12f-4270d19d46c5" ? (
          <Image
            className="rounded-full h-[40px] w-[40px] object-cover object-center mr-4"
            src={profile}
            width={70}
            height={70}
            alt="person image"
            priority
          />
        ) : (
          <div className="w-12 h-12 rounded-full overflow-hidden review-avatar mr-4">
            <svg
              className={`w-full h-full bg-gradient-to-r ${gradient}`}
              viewBox="0 0 100 100"
            >
              <circle cx="50" cy="35" r="20" fill="#fff" />
              <circle cx="50" cy="90" r="30" fill="#fff" />
            </svg>
          </div>
        )}
        <div>
          <h4 className="text-lg font-semibold text-gray-800">{nama}</h4>
          <p className={`text-sm ${textColor}`}>Client</p>
        </div>
      </div>
      <p className="text-gray-600 mb-4">{review}</p>
      <div className="quote-mark quote-mark-right">"</div>
    </div>
  );
}

export default ReviewCard;
