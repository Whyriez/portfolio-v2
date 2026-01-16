'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function DeleteCertificateButton({ id }: { id: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm('Delete this certificate?')) return;
    setLoading(true);
    await fetch(`/api/certificates/${id}`, { method: 'DELETE' });
    router.refresh();
    setLoading(false);
  };

  return (
    <button 
      onClick={handleDelete} disabled={loading}
      className="text-red-500 hover:text-red-600 font-medium text-sm disabled:opacity-50"
    >
      {loading ? '...' : 'Delete'}
    </button>
  );
}