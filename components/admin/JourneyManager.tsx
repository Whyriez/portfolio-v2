'use client';

import { useState, useEffect } from 'react';

interface Journey {
  id: string;
  title: string;
  company: string;
  period: string;
  description: string;
}

export default function JourneyManager() {
  const [journeys, setJourneys] = useState<Journey[]>([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [form, setForm] = useState({ title: '', company: '', period: '', description: '' });
  const [isSubmitting, setIsSubmitting] = useState(false); // Ganti isAdding jadi isSubmitting agar general
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Edit State (BARU)
  const [editingId, setEditingId] = useState<string | null>(null);

  const fetchJourneys = async () => {
    try {
      const res = await fetch('/api/journeys');
      const data = await res.json();
      // Sorting manual jika perlu (misal by created_at desc)
      // data.sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      setJourneys(data);
    } catch (error) {
      console.error("Failed to fetch journeys", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchJourneys(); }, []);

  // Handler untuk memulai Edit (Mengisi form)
  const handleEditClick = (item: Journey) => {
    setEditingId(item.id);
    setForm({
      title: item.title,
      company: item.company,
      period: item.period,
      description: item.description
    });
    // Scroll ke atas agar user sadar form sudah terisi
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handler untuk membatalkan Edit
  const handleCancelEdit = () => {
    setEditingId(null);
    setForm({ title: '', company: '', period: '', description: '' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (editingId) {
        // --- LOGIKA UPDATE (PUT) ---
        const res = await fetch(`/api/journeys/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        });

        if (!res.ok) throw new Error('Failed to update');

        // Update state lokal langsung agar UI cepat (Optimistic update style)
        setJourneys(prev => prev.map(item =>
          item.id === editingId ? { ...item, ...form } : item
        ));

        // Reset form
        handleCancelEdit();

      } else {
        // --- LOGIKA CREATE (POST) ---
        const res = await fetch('/api/journeys', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        });

        if (!res.ok) throw new Error('Failed to add');

        setForm({ title: '', company: '', period: '', description: '' });
        fetchJourneys(); // Refresh list
      }
    } catch (error) {
      alert("Operation failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this history?')) return;
    setDeletingId(id);
    try {
      await fetch(`/api/journeys/${id}`, { method: 'DELETE' });
      setJourneys(prev => prev.filter(item => item.id !== id));

      // Jika user menghapus item yang sedang diedit, reset form
      if (editingId === id) handleCancelEdit();
    } catch (error) {
      alert("Failed to delete");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl border border-gray-100 dark:border-gray-700 h-full flex flex-col">

      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl text-blue-600 dark:text-blue-400">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-800 dark:text-white">Career Journey</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Manage your work experience timeline.</p>
        </div>
      </div>

      {/* Form Section - Berubah warna border jika sedang Edit mode */}
      <form onSubmit={handleSubmit} className={`mb-10 bg-gray-50 dark:bg-white/5 p-6 rounded-2xl border relative overflow-hidden group transition-colors ${editingId ? 'border-blue-500 dark:border-blue-500 ring-1 ring-blue-500/20' : 'border-gray-100 dark:border-white/10'}`}>

        {/* Indikator Mode Edit */}
        {editingId && (
          <div className="absolute top-0 left-0 right-0 bg-blue-500 h-1"></div>
        )}

        <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none group-hover:opacity-20 transition-opacity">
          <span className="text-6xl">{editingId ? '✏️' : '💼'}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
          {/* ... Input Fields sama seperti sebelumnya ... */}
          <div className="col-span-1">
            <label className="text-xs font-semibold uppercase text-gray-500 mb-1 block">Role / Position</label>
            <input required placeholder="e.g. Senior Frontend Dev" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })}
              className="w-full p-3 rounded-xl bg-white dark:bg-black/20 border border-gray-200 dark:border-white/10 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all text-sm" />
          </div>
          <div className="col-span-1">
            <label className="text-xs font-semibold uppercase text-gray-500 mb-1 block">Company Name</label>
            <input required placeholder="e.g. Google Inc." value={form.company} onChange={e => setForm({ ...form, company: e.target.value })}
              className="w-full p-3 rounded-xl bg-white dark:bg-black/20 border border-gray-200 dark:border-white/10 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all text-sm" />
          </div>
          <div className="col-span-2">
            <label className="text-xs font-semibold uppercase text-gray-500 mb-1 block">Period</label>
            <input required placeholder="e.g. Jan 2023 - Present" value={form.period} onChange={e => setForm({ ...form, period: e.target.value })}
              className="w-full p-3 rounded-xl bg-white dark:bg-black/20 border border-gray-200 dark:border-white/10 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all text-sm" />
          </div>
          <div className="md:col-span-2">
            <label className="text-xs font-semibold uppercase text-gray-500 mb-1 block">Description</label>
            <textarea
              required
              rows={4} // Mengatur tinggi default (4 baris)
              placeholder="Tell us more about your responsibilities and achievements..."
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
              className="w-full p-3 rounded-xl bg-white dark:bg-black/20 border border-gray-200 dark:border-white/10 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all text-sm resize-none" // resize-none biar ga ditarik-tarik user sembarangan (opsional)
            />
          </div>

          <div className="md:col-span-2 mt-2 flex justify-end gap-2">
            {/* Tombol Cancel hanya muncul saat mode edit */}
            {editingId && (
              <button type="button" onClick={handleCancelEdit} className="px-5 py-2.5 rounded-xl font-medium text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors text-sm">
                Cancel
              </button>
            )}

            <button type="submit" disabled={isSubmitting} className={`text-white px-6 py-2.5 rounded-xl font-bold hover:opacity-90 transition-all active:scale-95 text-sm flex items-center gap-2 ${editingId ? 'bg-blue-600' : 'bg-gray-900 dark:bg-white dark:text-gray-900'}`}>
              {isSubmitting ? <span className="animate-spin text-lg">C</span> : <span>{editingId ? '✓' : '+'}</span>}
              {isSubmitting ? 'Saving...' : (editingId ? 'Update Journey' : 'Add Journey')}
            </button>
          </div>
        </div>
      </form>

      {/* Timeline List */}
      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
        {loading ? (
          /* Loading Skeleton (sama seperti sebelumnya) */
          <div className="space-y-4 animate-pulse">
            {[1, 2, 3].map(i => <div key={i} className="h-20 bg-gray-100 dark:bg-white/5 rounded-xl"></div>)}
          </div>
        ) : (
          <div className="relative border-l-2 border-gray-100 dark:border-white/10 ml-3 space-y-8 pb-4">
            {journeys.length === 0 && (
              <div className="ml-8 py-10 text-center border-2 border-dashed border-gray-200 dark:border-white/10 rounded-2xl">
                <p className="text-gray-400">No journey history found.</p>
              </div>
            )}

            {journeys.map((item) => (
              <div key={item.id} className={`relative ml-8 group transition-opacity ${editingId && editingId !== item.id ? 'opacity-50' : 'opacity-100'}`}>
                {/* Timeline Dot */}
                <div className={`absolute -left-[41px] top-1 h-5 w-5 rounded-full border-4 border-white dark:border-gray-800 transition-transform shadow-md ${editingId === item.id ? 'bg-green-500 scale-125' : 'bg-blue-500 group-hover:scale-125'}`}></div>

                {/* Content Card */}
                <div className={`bg-white dark:bg-white/5 p-4 rounded-2xl border shadow-sm hover:shadow-md transition-all flex justify-between items-start ${editingId === item.id ? 'border-blue-500 ring-1 ring-blue-500/20' : 'border-gray-100 dark:border-white/5 group-hover:border-blue-100 dark:group-hover:border-blue-500/30'}`}>
                  <div>
                    <h4 className="font-bold text-gray-800 dark:text-white text-lg">{item.title}</h4>
                    <div className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 font-medium mb-1">
                      <span>🏢 {item.company}</span>
                      <span>•</span>
                      <span>🗓️ {item.period}</span>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{item.description}</p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center ml-4 gap-1">

                    {/* BUTTON EDIT (BARU) */}
                    <button
                      onClick={() => handleEditClick(item)}
                      disabled={editingId === item.id}
                      className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                    </button>

                    <button
                      onClick={() => handleDelete(item.id)}
                      disabled={deletingId === item.id}
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                      title="Delete"
                    >
                      {deletingId === item.id ? (
                        <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}