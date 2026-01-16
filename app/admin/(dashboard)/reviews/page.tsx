import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';
import Image from 'next/image';
import DeleteReviewButton from './DeleteReviewButton';
import ReviewCodesManager from '@/components/admin/ReviewCodesManager';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Reviews Management",
};

export default async function ReviewsPage() {
  const supabase = await createClient();
  
  const { data: reviews } = await supabase
    .from('reviews')
    .select('*')
    .order('created_at', { ascending: false });

  const isEmpty = !reviews || reviews.length === 0;

  return (
    <div className="max-w-7xl mx-auto p-6 md:p-8 space-y-8">
      
      {/* --- HEADER SECTION --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Testimonials</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Manage feedback and reviews from your clients.
          </p>
        </div>
        
        {/* Component Manager Kode Review (Undangan) */}
        <div className="shrink-0">
          <ReviewCodesManager />
        </div>
      </div>

      {/* --- CONTENT CARD --- */}
      <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden flex flex-col min-h-[500px]">
        
        {/* Toolbar */}
        <div className="p-5 border-b border-gray-100 dark:border-gray-700 flex flex-col sm:flex-row gap-4 justify-between items-center bg-gray-50/50 dark:bg-white/5">
           <div className="relative w-full sm:w-72">
             <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
             <input 
               type="text" 
               placeholder="Search reviews..." 
               className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-900 text-sm focus:ring-2 focus:ring-yellow-500/20 focus:border-yellow-500 outline-none transition-all"
             />
           </div>
           <div className="flex items-center gap-2">
             <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Total:</span>
             <span className="bg-white dark:bg-gray-700 px-3 py-1 rounded-lg border border-gray-200 dark:border-gray-600 text-sm font-bold">
               {reviews?.length || 0}
             </span>
           </div>
        </div>

        {/* Table Area */}
        <div className="flex-1 overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700 sticky top-0 z-10">
              <tr>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider w-[30%]">Client Profile</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider w-[40%]">Feedback</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Rating & Date</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700/50">
              
              {isEmpty && (
                <tr>
                  <td colSpan={4} className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center justify-center text-gray-400">
                       <span className="text-5xl mb-4 opacity-50">⭐</span>
                       <h3 className="text-lg font-medium text-gray-900 dark:text-white">No reviews yet</h3>
                       <p className="text-sm mt-1">Generate an invite code to get your first review.</p>
                    </div>
                  </td>
                </tr>
              )}

              {reviews?.map((review) => (
                <tr key={review.id} className="group hover:bg-yellow-50/30 dark:hover:bg-yellow-900/10 transition-colors">
                  
                  {/* Column 1: Profile */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="shrink-0 w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-700 overflow-hidden relative border border-gray-200 dark:border-gray-600 shadow-sm">
                        {review.avatar ? (
                          <Image 
                            src={review.avatar} 
                            alt={review.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-xl">👤</div>
                        )}
                      </div>
                      <div>
                        <div className="font-bold text-gray-900 dark:text-white">
                          {review.name}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {review.position || "Client"}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Column 2: Review Content */}
                  <td className="px-6 py-4">
                    <div className="relative">
                      <span className="text-2xl text-gray-300 absolute -top-2 -left-2">“</span>
                      <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 relative z-10 leading-relaxed italic">
                        {review.review}
                      </p>
                    </div>
                  </td>

                  {/* Column 3: Rating & Date */}
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      <div className="flex text-yellow-400 text-sm">
                         {/* Render Star Dummy (atau real jika ada field rating) */}
                         {'★'.repeat(review.rating || 5)}
                         <span className="text-gray-300">{'★'.repeat(5 - (review.rating || 5))}</span>
                      </div>
                      <span className="text-xs text-gray-400 font-medium">
                        {new Date(review.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                  </td>

                  {/* Column 4: Actions */}
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link 
                        href={`/admin/reviews/${review.id}`}
                        className="p-2 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all"
                        title="Edit Review"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                      </Link>
                      <DeleteReviewButton id={review.id} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        {!isEmpty && (
           <div className="p-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-white/5 text-center text-xs text-gray-500">
             Showing all {reviews.length} reviews
           </div>
        )}

      </div>
    </div>
  );
}