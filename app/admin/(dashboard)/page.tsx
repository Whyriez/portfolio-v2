import React from 'react';

export default function AdminDashboard() {
  return (
    <div>
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <StatsCard 
          title="Total Projects" 
          value="12" 
          subtitle="+2 this month" 
          icon="📂"
          colorClass="text-blue-500"
          bgClass="bg-blue-500/10"
        />
        <StatsCard 
          title="Reviews" 
          value="48" 
          subtitle="4.9 Average rating" 
          icon="⭐"
          colorClass="text-yellow-500"
          bgClass="bg-yellow-500/10"
        />
        <StatsCard 
          title="Messages" 
          value="5" 
          subtitle="2 Unread" 
          icon="💬"
          colorClass="text-emerald-500"
          bgClass="bg-emerald-500/10"
        />
      </div>

      {/* Recent Activity Section */}
      <div className="bg-white/50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl p-6 shadow-sm">
        <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">Recent Activity</h2>
        
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-white dark:bg-white/5 hover:bg-gray-50 dark:hover:bg-white/10 transition-colors border border-gray-100 dark:border-white/5 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400">
                  ⚡
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800 dark:text-white">New project added "E-Commerce App"</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">2 hours ago</p>
                </div>
              </div>
              <span className="text-xs px-2 py-1 rounded-full bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-500/30 font-medium">
                Published
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Komponen Card yang Responsive & Adaptive Theme
function StatsCard({ 
  title, value, subtitle, icon, colorClass, bgClass 
}: { 
  title: string, value: string, subtitle: string, icon: string, colorClass: string, bgClass: string 
}) {
  return (
    <div className="relative overflow-hidden p-6 rounded-2xl bg-white/60 dark:bg-white/5 border border-gray-200 dark:border-white/10 shadow-sm hover:shadow-md transition-all duration-300 group">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">{title}</h3>
          <p className="text-3xl font-bold text-gray-800 dark:text-white mt-2 mb-1">{value}</p>
        </div>
        <div className={`p-3 rounded-xl ${bgClass} ${colorClass} text-xl`}>
          {icon}
        </div>
      </div>
      <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">{subtitle}</p>
    </div>
  );
}