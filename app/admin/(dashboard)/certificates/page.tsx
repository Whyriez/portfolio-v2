import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';
import Image from 'next/image';
import DeleteCertificateButton from './DeleteCertificateButton';

export default async function CertificatesPage() {
  const supabase = await createClient();
  
  const { data: certificates } = await supabase
    .from('certificates')
    .select('*')
    .order('issued_at', { ascending: false });

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Certificates</h1>
          <p className="text-gray-500 dark:text-gray-400">Manage your certifications</p>
        </div>
        <Link 
          href="/admin/certificates/create"
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors shadow-lg shadow-blue-500/20"
        >
          + Add Certificate
        </Link>
      </div>

      <div className="bg-white dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/10 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 dark:bg-white/5 border-b border-gray-100 dark:border-white/10">
            <tr>
              <th className="p-6 text-sm font-semibold text-gray-600 dark:text-gray-300">Certificate</th>
              <th className="p-6 text-sm font-semibold text-gray-600 dark:text-gray-300">Issuer</th>
              <th className="p-6 text-sm font-semibold text-gray-600 dark:text-gray-300">Date</th>
              <th className="p-6 text-sm font-semibold text-gray-600 dark:text-gray-300">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-white/10">
            {certificates?.map((cert) => {
              // Cek apakah file adalah PDF
              const isPdf = cert.image?.toLowerCase().includes('.pdf');

              return (
                <tr key={cert.id} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                  <td className="p-6">
                    <div className="flex items-center gap-4">
                      {/* Logic Tampilan Thumbnail */}
                      <div className="w-16 h-12 rounded-lg bg-gray-100 dark:bg-white/10 overflow-hidden relative border border-gray-200 dark:border-white/10 flex items-center justify-center">
                        {cert.image ? (
                          isPdf ? (
                            <a href={cert.image} target="_blank" className="text-red-500 font-bold text-xs flex flex-col items-center">
                              <span>📄</span>
                              <span>PDF</span>
                            </a>
                          ) : (
                            <Image src={cert.image} alt={cert.title} fill className="object-cover" />
                          )
                        ) : (
                          <span className="text-xs">No File</span>
                        )}
                      </div>
                      
                      <div className="font-semibold text-gray-800 dark:text-white">{cert.title}</div>
                    </div>
                  </td>
                  <td className="p-6 text-sm text-gray-600 dark:text-gray-400">{cert.issuer}</td>
                  <td className="p-6 text-sm text-gray-600 dark:text-gray-400">
                    {cert.issued_at ? new Date(cert.issued_at).toLocaleDateString() : '-'}
                  </td>
                  <td className="p-6">
                    <div className="flex items-center gap-3">
                      <Link 
                        href={`/admin/certificates/${cert.id}`}
                        className="text-blue-500 hover:text-blue-600 font-medium text-sm"
                      >
                        Edit
                      </Link>
                      <DeleteCertificateButton id={cert.id} />
                    </div>
                  </td>
                </tr>
              );
            })}
            
            {certificates?.length === 0 && (
              <tr>
                <td colSpan={4} className="p-8 text-center text-gray-500">No certificates yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}