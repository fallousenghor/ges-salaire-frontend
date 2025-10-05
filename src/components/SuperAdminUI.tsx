
import { useState } from 'react';
import { Users, Building2, BarChart3, Settings,  } from 'lucide-react';


import { SuperAdminNavbar } from './Navbar';
import { SuperAdminSidebar } from './Sidebar';


export default function SuperAdminDemo() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <SuperAdminSidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
      />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <SuperAdminNavbar onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
        
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">
              Bienvenue sur votre tableau de bord
            </h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[
                { label: 'Entreprises', value: '156', color: 'from-blue-500 to-cyan-500', icon: Building2 },
                { label: 'Utilisateurs', value: '2,847', color: 'from-purple-500 to-pink-500', icon: Users },
                { label: 'Revenus', value: '€45.2K', color: 'from-green-500 to-emerald-500', icon: BarChart3 },
                { label: 'Actifs', value: '98%', color: 'from-orange-500 to-red-500', icon: Settings },
              ].map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div 
                    key={index}
                    className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all hover:scale-105 cursor-pointer border border-gray-100"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color}`}>
                        <Icon size={24} className="text-white" />
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm mb-1">{stat.label}</p>
                    <p className="text-3xl font-bold text-gray-800">{stat.value}</p>
                  </div>
                );
              })}
            </div>
            
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Activité récente</h2>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all cursor-pointer">
                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                      {i}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-800">Action importante #{i}</p>
                      <p className="text-sm text-gray-500">Il y a {i * 2} heures</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}