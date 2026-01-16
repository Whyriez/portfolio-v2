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
  const [isAdding, setIsAdding] = useState(false);

  const fetchJourneys = async () => {
    const res = await fetch('/api/journeys');
    const data = await res.json();
    setJourneys(data);
    setLoading(false);
  };

  useEffect(() => { fetchJourneys(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAdding(true);
    await fetch('/api/journeys', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    setForm({ title: '', company: '', period: '', description: '' });
    setIsAdding(false);
    fetchJourneys();
  };

  const handleDelete = async (id: string) => {
    if(!confirm('Delete this journey?')) return;
    await fetch(`/api/journeys/${id}`, { method: 'DELETE' });
    fetchJourneys();
  };

  return (
    <div className="bg-white dark:bg-white/5 p-6 rounded-2xl border border-gray-100 dark:border-white/10 mt-8">
      <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-6">Manage Journey</h3>

      {/* Add Form */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 bg-gray-50 dark:bg-black/20 p-4 rounded-xl">
        <input required placeholder="Job Title (e.g. Mobile Dev)" value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="p-3 rounded-lg border outline-none dark:bg-white/5 dark:border-white/10" />
        <input required placeholder="Company" value={form.company} onChange={e => setForm({...form, company: e.target.value})} className="p-3 rounded-lg border outline-none dark:bg-white/5 dark:border-white/10" />
        <input required placeholder="Period (e.g. 2023 - Present)" value={form.period} onChange={e => setForm({...form, period: e.target.value})} className="p-3 rounded-lg border outline-none dark:bg-white/5 dark:border-white/10" />
        <input required placeholder="Description (Short)" value={form.description} onChange={e => setForm({...form, description: e.target.value})} className="p-3 rounded-lg border outline-none dark:bg-white/5 dark:border-white/10" />
        <button type="submit" disabled={isAdding} className="md:col-span-2 bg-blue-600 text-white py-2 rounded-lg font-bold hover:bg-blue-700 transition">
          {isAdding ? 'Adding...' : '+ Add Journey'}
        </button>
      </form>

      {/* List */}
      <div className="space-y-4">
        {journeys.map((item) => (
          <div key={item.id} className="flex justify-between items-center p-4 border border-gray-200 dark:border-white/10 rounded-xl bg-white dark:bg-transparent">
            <div>
              <h4 className="font-bold text-gray-800 dark:text-white">{item.title}</h4>
              <p className="text-sm text-gray-500">{item.company} • <span className="text-blue-500">{item.period}</span></p>
            </div>
            <button onClick={() => handleDelete(item.id)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg">🗑️</button>
          </div>
        ))}
        {!loading && journeys.length === 0 && <p className="text-gray-500 text-center">No journeys yet.</p>}
      </div>
    </div>
  );
}