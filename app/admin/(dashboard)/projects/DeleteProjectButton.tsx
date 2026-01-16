'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function DeleteProjectButton({ id }: { id: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this project?')) return;
    
    setLoading(true);
    
    // Panggil API DELETE
    const res = await fetch(`/api/projects/${id}`, {
      method: 'DELETE',
    });
    
    if (!res.ok) {
      alert('Error deleting project');
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