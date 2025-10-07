
import { Bell,  Building2, Menu, Search } from "lucide-react";

import type { SuperAdminNavbarProps } from "../types/propsType";
import { useState } from "react";
import { useCurrentEntreprise } from '../hooks/useCurrentEntreprise';
import { getLogoUrl } from '../utils/uploads';
import { getUser } from "../services/authService";



export const Navbar = () => {
  const user = getUser();
  const { entreprise } = useCurrentEntreprise();
  const displayName = user ? (user.email.split('@')[0]) : 'Utilisateur';
  const logoUrl = getLogoUrl(entreprise?.logo ?? null);
  const [showNotifications, setShowNotifications] = useState(false);  return (
  <div className="border-b border-gray-200 px-6 py-4" >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-6">
          {/* Logo de l'entreprise */}
            {logoUrl && (
            <div className="flex items-center space-x-3">
              <img 
                  src={logoUrl} 
                  data-logo-url={logoUrl}
                alt={`Logo ${entreprise?.nom ?? ''}`}
                className="w-10 h-10 rounded-lg object-cover shadow-sm border border-gray-200"
              />
              <div className="flex flex-col">
                <span className="font-semibold text-theme-primary">{entreprise?.nom ?? ''}</span>
              </div>
            </div>
          )}
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-theme-secondary/60 w-5 h-5" />
            <input
              type="text"
              placeholder="Rechercher..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-theme-primary focus:border-transparent w-80"
            />
          </div>
          <div className="flex items-center space-x-1 text-sm text-gray-500">
            <span>⌘</span>
            <span>F</span>
          </div>
        </div>

        
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 hover:bg-theme-primary/5 rounded-full transition-all relative"
          >
            <Bell className="w-5 h-5 text-theme-primary" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
          </button>
          
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-theme-primary rounded-full flex items-center justify-center font-bold shadow cursor-pointer hover:scale-110 transition-transform">
                <span className="text-white">
                  {user ? user.email.slice(0, 2).toUpperCase() : 'US'}
                </span>
              </div>
              <div className="hidden md:flex flex-col">
                <span className="text-sm font-medium text-theme-secondary">{displayName}</span>
                <span className="text-xs text-gray-500">{user?.email}</span>
              </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export const SuperAdminNavbar = ({ onMenuToggle }: SuperAdminNavbarProps) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const user = getUser();
  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between shadow-sm">
      <div className="flex items-center gap-4">
        <button 
          onClick={onMenuToggle}
          className="lg:hidden p-2 hover:bg-blue-50 rounded-lg transition-all"
        >
          <Menu size={24} className="text-blue-600" />
        </button>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <Building2 size={20} className="text-white" />
          </div>
          <span className="font-bold text-xl text-gray-800">SuperAdmin Panel</span>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="hidden md:flex items-center bg-blue-50 rounded-full px-4 py-2">
          <Search size={18} className="text-blue-600/60" />
          <input 
            type="text" 
            placeholder="Rechercher..." 
            className="bg-transparent border-none outline-none ml-2 text-gray-800 placeholder-blue-400 w-48"
          />
        </div>
        <div className="relative">
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 hover:bg-blue-50 rounded-full transition-all relative"
          >
            <Bell size={20} className="text-blue-600" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
          </button>
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-72 bg-white text-gray-800 rounded-xl shadow-2xl p-4 z-50">
              <h3 className="font-semibold mb-3">Notifications</h3>
              <div className="space-y-2">
                <div className="p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-all cursor-pointer">
                  <p className="text-sm font-medium">Nouvelle entreprise inscrite</p>
                  <p className="text-xs text-gray-500">Il y a 5 minutes</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all cursor-pointer">
                  <p className="text-sm font-medium">Rapport mensuel disponible</p>
                  <p className="text-xs text-gray-500">Il y a 2 heures</p>
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center font-bold shadow cursor-pointer hover:scale-110 transition-transform">
            {user ? user.email.slice(0, 2).toUpperCase() : 'SA'}
          </div>
          <span className="text-gray-800 font-medium text-sm">{user ? user.email : ''}</span>
        </div>
      </div>
    </nav>
  );
};