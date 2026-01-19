import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';
import Image from 'next/image';
import DeleteCertificateButton from './DeleteCertificateButton';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Certificates Management",
};

export default async function CertificatesPage() {
  const supabase = await createClient();
  
  const { data: certificates } = await supabase
    .from('certificates')
    .select('*')
    .order('issued_at', { ascending: false });

  const isEmpty = !certificates || certificates.length === 0;

  return (
    <div className="max-w-7xl mx-auto p-6 md:p-8 space-y-8">
      
      {/* --- HEADER SECTION --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Certifications</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Showcase your licenses, courses, and achievements.
          </p>
        </div>
        <Link 
          href="/admin/certificates/create"
          className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white rounded-xl font-medium transition-all shadow-lg shadow-blue-500/25"
        >
          <span>+</span>
          <span>Add Certificate</span>
        </Link>
      </div>

      {/* --- CONTENT CARD --- */}
      <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden flex flex-col min-h-[500px]">
        
        {/* Toolbar */}
        <div className="p-5 border-b border-gray-100 dark:border-gray-700 flex flex-col sm:flex-row gap-4 justify-between items-center bg-gray-50/50 dark:bg-white/5">
           <div className="relative w-full sm:w-72">
             <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
             <input 
               type="text" 
               placeholder="Search certificates..." 
               className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-900 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
             />
           </div>
           <div className="flex items-center gap-2">
             <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Total:</span>
             <span className="bg-white dark:bg-gray-700 px-3 py-1 rounded-lg border border-gray-200 dark:border-gray-600 text-sm font-bold">
               {certificates?.length || 0}
             </span>
           </div>
        </div>

        {/* Table Area */}
        <div className="flex-1 overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700 sticky top-0 z-10">
              <tr>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider w-[40%]">Certificate Name</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Issuer Organization</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Issued Date</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700/50">
              
              {isEmpty && (
                <tr>
                  <td colSpan={4} className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center justify-center text-gray-400">
                       <span className="text-5xl mb-4 opacity-50">📜</span>
                       <h3 className="text-lg font-medium text-gray-900 dark:text-white">No certificates found</h3>
                       <p className="text-sm mt-1">Add your first certification to display here.</p>
                    </div>
                  </td>
                </tr>
              )}

              {certificates?.map((cert) => {
                 // Cek file type
                 const isPdf = cert.image?.toLowerCase().includes('.pdf');

                 return (
                  <tr key={cert.id} className="group hover:bg-blue-50/30 dark:hover:bg-blue-900/10 transition-colors">
                    
                    {/* Column 1: Image & Title */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="shrink-0 w-16 h-12 rounded-lg bg-gray-100 dark:bg-gray-700 overflow-hidden relative border border-gray-200 dark:border-gray-600 flex items-center justify-center shadow-sm">
                          {cert.image ? (
                            isPdf ? (
                              <div className="flex flex-col items-center justify-center text-red-500">
                                <span className="text-xl">📄</span>
                                <span className="text-[8px] font-bold uppercase mt-0.5">PDF</span>
                              </div>
                            ) : (
                              <Image 
                                src={cert.image} 
                                alt={cert.title}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                              />
                            )
                          ) : (
                             <span className="text-xs text-gray-400">No File</span>
                          )}
                        </div>
                        <div>
                          <div className="font-bold text-gray-900 dark:text-white line-clamp-1" title={cert.title}>
                            {cert.title}
                          </div>
                          {isPdf && (
                             <a href={cert.image} target="_blank" className="text-[10px] text-blue-500 hover:underline flex items-center gap-1 mt-0.5">
                               View Document ↗
                             </a>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Column 2: Issuer */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                         <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                         <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">{cert.issuer}</span>
                      </div>
                    </td>

                    {/* Column 3: Date */}
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-500 dark:text-gray-400 font-mono">
                        {cert.issued_at 
                          ? new Date(cert.issued_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) 
                          : '-'}
                      </span>
                    </td>

                    {/* Column 4: Actions */}
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link 
                          href={`/admin/certificates/${cert.id}`}
                          className="p-2 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all"
                          title="Edit Certificate"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                        </Link>
                        <DeleteCertificateButton id={cert.id} />
                      </div>
                    </td>

                  </tr>
                 );
              })}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        {!isEmpty && (
           <div className="p-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-white/5 text-center text-xs text-gray-500">
             Showing all {certificates.length} certificates
           </div>
        )}

      </div>
    </div>
  );
}