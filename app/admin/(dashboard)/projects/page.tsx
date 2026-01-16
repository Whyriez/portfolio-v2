// File: app/admin/(dashboard)/projects/page.tsx
import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';
import Image from 'next/image';
import DeleteProjectButton from './DeleteProjectButton';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Projects Management",
};

export default async function ProjectsPage() {
  const supabase = await createClient();
  
  const { data: projects } = await supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false });

  const isEmpty = !projects || projects.length === 0;

  return (
    <div className="max-w-7xl mx-auto p-6 md:p-8 space-y-8">
      
      {/* --- HEADER SECTION --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">All Projects</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Showcase your best work. Manage your portfolio items here.
          </p>
        </div>
        <Link 
          href="/admin/projects/create"
          className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white rounded-xl font-medium transition-all shadow-lg shadow-blue-500/25"
        >
          <span>+</span>
          <span>Add Project</span>
        </Link>
      </div>

      {/* --- CONTENT CARD --- */}
      <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden flex flex-col min-h-[500px]">
        
        {/* Toolbar (Search & Filter) */}
        <div className="p-5 border-b border-gray-100 dark:border-gray-700 flex flex-col sm:flex-row gap-4 justify-between items-center bg-gray-50/50 dark:bg-white/5">
           <div className="relative w-full sm:w-72">
             <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
             <input 
               type="text" 
               placeholder="Search projects..." 
               className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-900 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
             />
           </div>
           <div className="flex items-center gap-2">
             <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Total:</span>
             <span className="bg-white dark:bg-gray-700 px-3 py-1 rounded-lg border border-gray-200 dark:border-gray-600 text-sm font-bold">
               {projects?.length || 0}
             </span>
           </div>
        </div>

        {/* Table Area */}
        <div className="flex-1 overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700 sticky top-0 z-10">
              <tr>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider w-[40%]">Project Info</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Category</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Tech Stack</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700/50">
              
              {isEmpty && (
                <tr>
                  <td colSpan={4} className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center justify-center text-gray-400">
                       <span className="text-5xl mb-4 opacity-50">📂</span>
                       <h3 className="text-lg font-medium text-gray-900 dark:text-white">No projects found</h3>
                       <p className="text-sm mt-1">Get started by creating your first project.</p>
                    </div>
                  </td>
                </tr>
              )}

              {projects?.map((project) => (
                <tr key={project.id} className="group hover:bg-blue-50/30 dark:hover:bg-blue-900/10 transition-colors">
                  
                  {/* Column 1: Image & Title */}
                  <td className="px-6 py-4">
                    <div className="flex items-start gap-4">
                      <div className="shrink-0 w-20 h-14 rounded-lg bg-gray-100 dark:bg-gray-700 overflow-hidden relative border border-gray-200 dark:border-gray-600 shadow-sm">
                        {project.images?.[0] ? (
                          <Image 
                            src={project.images[0]} 
                            alt={project.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-xs text-gray-400 font-medium">No Img</div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-gray-900 dark:text-white truncate" title={project.title}>
                          {project.title}
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1 mt-0.5">
                          {project.description || "No description"}
                        </p>
                        <div className="flex items-center gap-2 mt-1.5">
                           {project.demo_url && (
                             <a href={project.demo_url} target="_blank" className="text-[10px] flex items-center gap-1 text-blue-600 hover:underline">
                               <span>🔗 Live Demo</span>
                             </a>
                           )}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Column 2: Category */}
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-600">
                      {project.category || "Uncategorized"}
                    </span>
                  </td>

                  {/* Column 3: Tech Stack (Tags) */}
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1.5 max-w-[200px]">
                      {project.tags?.slice(0, 3).map((tag: string, i: number) => (
                        <span key={i} className="text-[10px] px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-300 border border-blue-100 dark:border-blue-900/30">
                          {tag}
                        </span>
                      ))}
                      {project.tags?.length > 3 && (
                        <span className="text-[10px] text-gray-400 px-1 self-center">+{project.tags.length - 3}</span>
                      )}
                    </div>
                  </td>

                  {/* Column 4: Actions */}
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link 
                        href={`/admin/projects/${project.id}`}
                        className="p-2 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all"
                        title="Edit Project"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </Link>
                      
                      <DeleteProjectButton id={project.id} />
                    </div>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Footer / Pagination Placeholder */}
        {!isEmpty && (
           <div className="p-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-white/5 text-center text-xs text-gray-500">
             Showing all {projects.length} projects
           </div>
        )}

      </div>
    </div>
  );
}