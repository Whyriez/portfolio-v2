'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function DeleteReviewButton({ id }: { id: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm('Delete this review permanently?')) return;
    
    setLoading(true);
    const res = await fetch(`/api/reviews/${id}`, { method: 'DELETE' });
    
    if (!res.ok) {
      alert('Failed to delete review');
    } else {
      router.refresh();
    }
    setLoading(false);
  };

  return (
    <button 
      onClick={handleDelete}
      disabled={loading}
      className="text-red-500 hover:text-red-600 font-medium text-sm transition-colors disabled:opacity-50"
    >
      {loading ? '...' : 'Delete'}
    </button>
  );
}