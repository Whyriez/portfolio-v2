import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';
import Image from 'next/image';
import DeleteProjectButton from './DeleteProjectButton';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Projects - Admin",
};


export default async function ProjectsPage() {
  const supabase = await createClient();
  
  const { data: projects } = await supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <div className="p-8">
      {/* Header sama seperti sebelumnya... */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Projects</h1>
          <p className="text-gray-500 dark:text-gray-400">Manage your portfolio projects</p>
        </div>
        <Link 
          href="/admin/projects/create"
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors shadow-lg shadow-blue-500/20"
        >
          + New Project
        </Link>
      </div>

      <div className="bg-white dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 dark:bg-white/5 border-b border-gray-100 dark:border-white/10">
              <tr>
                <th className="p-6 text-sm font-semibold text-gray-600 dark:text-gray-300">Project</th>
                <th className="p-6 text-sm font-semibold text-gray-600 dark:text-gray-300">Category</th>
                <th className="p-6 text-sm font-semibold text-gray-600 dark:text-gray-300">Tags</th>
                <th className="p-6 text-sm font-semibold text-gray-600 dark:text-gray-300">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-white/10">
              {projects?.map((project) => (
                <tr key={project.id} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                  <td className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-12 rounded-lg bg-gray-100 dark:bg-white/10 overflow-hidden relative">
                        {project.images?.[0] ? (
                          <Image 
                            src={project.images[0]} 
                            alt={project.title}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">No Img</div>
                        )}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-800 dark:text-white">{project.title}</div>
                        <div className="text-xs text-gray-400 truncate w-40">{project.description}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-6 text-sm text-gray-600 dark:text-gray-400">
                    <span className="px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-300 text-xs font-medium">
                      {project.category}
                    </span>
                  </td>
                  <td className="p-6">
                    <div className="flex flex-wrap gap-1">
                      {project.tags?.slice(0, 2).map((tag: string, i: number) => (
                        <span key={i} className="text-xs text-gray-500 bg-gray-100 dark:bg-white/10 px-2 py-0.5 rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="p-6">
                    <div className="flex items-center gap-3">
                      {/* Tombol EDIT */}
                      <Link 
                        href={`/admin/projects/${project.id}`}
                        className="text-blue-500 hover:text-blue-600 font-medium text-sm transition-colors"
                      >
                        Edit
                      </Link>
                      
                      {/* Tombol DELETE (Client Component) */}
                      <DeleteProjectButton id={project.id} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}