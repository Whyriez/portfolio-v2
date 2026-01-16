import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';
import Image from 'next/image';
import DeleteReviewButton from './DeleteReviewButton';
import ReviewCodesManager from '@/components/admin/ReviewCodesManager';


export default async function ReviewsPage() {
  const supabase = await createClient();
  
  // Fetch via Supabase Client (Server Component) agar lebih cepat saat render awal
  // Atau bisa via fetch('/api/reviews') tapi direct DB call di server component lebih efisien
  const { data: reviews } = await supabase
    .from('reviews')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Reviews</h1>
          <p className="text-gray-500 dark:text-gray-400">Manage client testimonials</p>
        </div>
        <ReviewCodesManager />
      </div>

      <div className="bg-white dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 dark:bg-white/5 border-b border-gray-100 dark:border-white/10">
              <tr>
                <th className="p-6 text-sm font-semibold text-gray-600 dark:text-gray-300">Profile</th>
                <th className="p-6 text-sm font-semibold text-gray-600 dark:text-gray-300">Review Content</th>
                <th className="p-6 text-sm font-semibold text-gray-600 dark:text-gray-300">Date</th>
                <th className="p-6 text-sm font-semibold text-gray-600 dark:text-gray-300">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-white/10">
              {reviews?.map((review) => (
                <tr key={review.id} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                  <td className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-white/10 overflow-hidden relative">
                        {review.avatar ? (
                          <Image 
                            src={review.avatar} 
                            alt={review.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-xs">👤</div>
                        )}
                      </div>
                      <div className="font-semibold text-gray-800 dark:text-white">
                        {review.name}
                      </div>
                    </div>
                  </td>
                  <td className="p-6">
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 w-80">
                      {review.review}
                    </p>
                  </td>
                  <td className="p-6 text-sm text-gray-500">
                    {new Date(review.created_at).toLocaleDateString()}
                  </td>
                  <td className="p-6">
                    <div className="flex items-center gap-3">
                      <Link 
                        href={`/admin/reviews/${review.id}`}
                        className="text-blue-500 hover:text-blue-600 font-medium text-sm transition-colors"
                      >
                        Edit
                      </Link>
                      <DeleteReviewButton id={review.id} />
                    </div>
                  </td>
                </tr>
              ))}
              {reviews?.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-gray-500">
                    No reviews yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}