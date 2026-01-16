'use client';

import { useState, useEffect } from 'react';

interface Skill {
  id: string;
  name: string;
  level: string;
  description: string;
}

export default function SkillManager() {
  const [skills, setSkills] = useState<Skill[]>([]);
  
  const [form, setForm] = useState({ name: '', level: 'Proficient', description: '' });
  const [isAdding, setIsAdding] = useState(false);

  const fetchSkills = async () => {
    const res = await fetch('/api/skills');
    const data = await res.json();
    setSkills(data);
  };

  useEffect(() => { fetchSkills(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAdding(true);
    await fetch('/api/skills', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    setForm({ name: '', level: 'Proficient', description: '' });
    setIsAdding(false);
    fetchSkills();
  };

  const handleDelete = async (id: string) => {
    if(!confirm('Delete skill?')) return;
    await fetch(`/api/skills/${id}`, { method: 'DELETE' });
    fetchSkills();
  };

  return (
    <div className="bg-white dark:bg-white/5 p-6 rounded-2xl border border-gray-100 dark:border-white/10 mt-8">
      <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-6">Manage Skills</h3>

      {/* Add Form */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 bg-gray-50 dark:bg-black/20 p-4 rounded-xl">
        <input required placeholder="Skill Name (e.g. React)" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="p-3 rounded-lg border outline-none dark:bg-white/5 dark:border-white/10" />
        
        <select value={form.level} onChange={e => setForm({...form, level: e.target.value})} className="p-3 rounded-lg border outline-none dark:bg-white/5 dark:border-white/10">
          <option value="Beginner">Beginner</option>
          <option value="Familiar">Familiar</option>
          <option value="Proficient">Proficient</option>
          <option value="Expert">Expert</option>
        </select>

        <input required placeholder="Description (Short)" value={form.description} onChange={e => setForm({...form, description: e.target.value})} className="p-3 rounded-lg border outline-none dark:bg-white/5 dark:border-white/10" />
        
        <button type="submit" disabled={isAdding} className="md:col-span-3 bg-green-600 text-gray-800 py-2 rounded-lg font-bold hover:bg-green-700 transition">
          {isAdding ? 'Adding...' : '+ Add Skill'}
        </button>
      </form>

      {/* List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {skills.map((item) => (
          <div key={item.id} className="flex justify-between items-center p-4 border border-gray-200 dark:border-white/10 rounded-xl bg-white dark:bg-transparent">
            <div>
              <h4 className="font-bold text-gray-800 dark:text-white">{item.name}</h4>
              <p className="text-xs font-bold text-green-600 bg-green-100 px-2 py-0.5 rounded-full inline-block mb-1">{item.level}</p>
              <p className="text-sm text-gray-500 line-clamp-1">{item.description}</p>
            </div>
            <button onClick={() => handleDelete(item.id)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg">🗑️</button>
          </div>
        ))}
      </div>
    </div>
  );
}