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
  const [loading, setLoading] = useState(true);
  
  // Form State
  const [form, setForm] = useState({ name: '', level: 'Proficient', description: '' });
  const [isAdding, setIsAdding] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Helper untuk Visual Level
  const getLevelAttributes = (level: string) => {
    switch (level) {
      case 'Beginner': return { width: '25%', color: 'bg-blue-400', text: 'text-blue-600 dark:text-blue-400' };
      case 'Familiar': return { width: '50%', color: 'bg-teal-400', text: 'text-teal-600 dark:text-teal-400' };
      case 'Proficient': return { width: '75%', color: 'bg-indigo-500', text: 'text-indigo-600 dark:text-indigo-400' };
      case 'Expert': return { width: '100%', color: 'bg-purple-600', text: 'text-purple-600 dark:text-purple-400' };
      default: return { width: '50%', color: 'bg-gray-400', text: 'text-gray-600' };
    }
  };

  const fetchSkills = async () => {
    try {
      const res = await fetch('/api/skills');
      const data = await res.json();
      setSkills(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchSkills(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAdding(true);
    try {
      await fetch('/api/skills', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      setForm({ name: '', level: 'Proficient', description: '' });
      fetchSkills();
    } catch (error) {
      alert('Failed to add skill');
    } finally {
      setIsAdding(false);
    }
  };

  const handleDelete = async (id: string) => {
    if(!confirm('Delete this skill?')) return;
    setDeletingId(id);
    try {
      await fetch(`/api/skills/${id}`, { method: 'DELETE' });
      setSkills(prev => prev.filter(s => s.id !== id));
    } catch (error) {
      alert('Failed to delete');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl border border-gray-100 dark:border-gray-700 h-full flex flex-col">
      
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-xl text-purple-600 dark:text-purple-400">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
        </div>
        <div>
           <h3 className="text-xl font-bold text-gray-800 dark:text-white">Technical Skills</h3>
           <p className="text-sm text-gray-500 dark:text-gray-400">Stack & technologies you use.</p>
        </div>
      </div>

      {/* Add Form */}
      <form onSubmit={handleSubmit} className="mb-10 bg-gray-50 dark:bg-white/5 p-6 rounded-2xl border border-gray-100 dark:border-white/10 group relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none group-hover:opacity-20 transition-opacity">
           <span className="text-6xl">⚡</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
           <div className="col-span-1 md:col-span-2">
             <label className="text-xs font-semibold uppercase text-gray-500 mb-1 block">Skill Name</label>
             <input required placeholder="e.g. React.js / Figma" value={form.name} onChange={e => setForm({...form, name: e.target.value})} 
               className="w-full p-3 rounded-xl bg-white dark:bg-black/20 border border-gray-200 dark:border-white/10 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all text-sm" />
           </div>
           
           <div>
             <label className="text-xs font-semibold uppercase text-gray-500 mb-1 block">Proficiency Level</label>
             <div className="relative">
                <select value={form.level} onChange={e => setForm({...form, level: e.target.value})} 
                  className="w-full p-3 rounded-xl bg-white dark:bg-black/20 border border-gray-200 dark:border-white/10 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all text-sm appearance-none cursor-pointer">
                  <option value="Beginner">Beginner (Learning)</option>
                  <option value="Familiar">Familiar (Can use)</option>
                  <option value="Proficient">Proficient (Daily driver)</option>
                  <option value="Expert">Expert (Mastery)</option>
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">▼</div>
             </div>
           </div>

           <div>
             <label className="text-xs font-semibold uppercase text-gray-500 mb-1 block">Short Description</label>
             <input required placeholder="e.g. Frontend Framework" value={form.description} onChange={e => setForm({...form, description: e.target.value})} 
               className="w-full p-3 rounded-xl bg-white dark:bg-black/20 border border-gray-200 dark:border-white/10 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all text-sm" />
           </div>
           
           <div className="col-span-1 md:col-span-2 flex justify-end mt-2">
             <button type="submit" disabled={isAdding} className="bg-purple-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-purple-700 transition-all active:scale-95 text-sm flex items-center gap-2 shadow-lg shadow-purple-500/20">
               {isAdding ? <span className="animate-spin text-lg">C</span> : <span>+</span>}
               {isAdding ? 'Adding...' : 'Add Skill'}
             </button>
           </div>
        </div>
      </form>

      {/* Skill Grid */}
      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
         {loading ? (
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-pulse">
               {[1,2,3,4].map(i => <div key={i} className="h-24 bg-gray-100 dark:bg-white/5 rounded-xl"></div>)}
             </div>
         ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-4">
              {skills.length === 0 && (
                <div className="col-span-2 py-10 text-center border-2 border-dashed border-gray-200 dark:border-white/10 rounded-2xl">
                   <p className="text-gray-400">No skills added yet.</p>
                </div>
              )}

              {skills.map((item) => {
                 const style = getLevelAttributes(item.level);
                 return (
                  <div key={item.id} className="group flex flex-col justify-between p-5 border border-gray-200 dark:border-white/10 rounded-2xl bg-white dark:bg-white/5 hover:border-purple-300 dark:hover:border-purple-500/50 hover:shadow-md transition-all">
                    
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-bold text-gray-800 dark:text-white text-base">{item.name}</h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{item.description}</p>
                      </div>
                      <button 
                        onClick={() => handleDelete(item.id)} 
                        disabled={deletingId === item.id}
                        className="opacity-0 group-hover:opacity-100 text-gray-300 hover:text-red-500 p-1 transition-all"
                      >
                         {deletingId === item.id ? "..." : "🗑️"}
                      </button>
                    </div>

                    {/* Progress Bar */}
                    <div>
                      <div className="flex justify-between text-xs font-semibold mb-1.5">
                        <span className={style.text}>{item.level}</span>
                        <span className="text-gray-400 text-[10px]">{style.width}</span>
                      </div>
                      <div className="w-full h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${style.color} transition-all duration-1000 ease-out`} 
                          style={{ width: style.width }} 
                        />
                      </div>
                    </div>

                  </div>
                 );
              })}
            </div>
         )}
      </div>

    </div>
  );
}