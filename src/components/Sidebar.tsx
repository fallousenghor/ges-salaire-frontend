import {   LogOut, X } from "lucide-react";
import { generalItems, menuItems, menuItemsuperAdmin } from "../config/sidebarItems";
import type { SidebarProps, SuperAdminSidebarProps } from "../types/propsType";
import { useLogout } from '../hooks/useLogout';
import { useNavigate } from 'react-router-dom';
import { useState } from "react";


export const Sidebar = ({ activeItem, setActiveItem }: SidebarProps) => {
  // Si caissier, n'affiche que le menu paiement
  const userStr = localStorage.getItem('user');
  let menuItem = menuItems;
  try {
    const user = userStr ? JSON.parse(userStr) : null;
    if (user?.role && user.role.toUpperCase() === 'CAISSIER') {
      menuItem = [
        { id: 'paiements', icon: LogOut, label: 'Paiements', path: '/paiements' }
      ];
    } else {
      menuItem = menuItems;
    }
  } catch {
    menuItem = menuItems;
  }
  const generalItem = generalItems;
  const { logout } = useLogout();
  const navigate = useNavigate();
  const [showSettings, setShowSettings] = useState(false);

  const handleGeneralClick = (itemId: string) => {
    if (itemId === 'logout') {
      logout();
      navigate('/login');
    } else if (itemId === 'settings') {
      setShowSettings(!showSettings);
    }
  };
  // Couleurs statiques
 
  return (
  <div className="w-64 border-r border-gray-200 h-full flex flex-col" >
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-theme-primary text-white" >
            <span className="font-bold text-sm">GES</span>
          </div>
          <span className="font-semibold text-lg text-theme-secondary">SALAIRE</span>
        </div>
      </div>

      <div className="flex-1 py-6">
        <div className="px-6 mb-6">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Menu</h3>
          <div className="space-y-1">
            {menuItem.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveItem(item.id);
                  if (item.path) {
                    navigate(item.path);
                  }
                }}
                className={`w-full flex items-center cursor-pointer space-x-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  activeItem === item.id
                    ? 'bg-theme-primary/10 text-theme-primary border-r-2 border-theme-primary'
                    : 'text-gray-600 hover:bg-theme-primary/5'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="flex-1 text-left">{item.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="px-6">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">General</h3>
          <div className="space-y-1">
            {generalItem.map((item) => (
              <div key={item.id}>
                <button
                  className="w-full flex items-center cursor-pointer space-x-3 px-3 py-2 text-sm font-medium text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
                  onClick={() => handleGeneralClick(item.id)}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="flex-1 text-left">{item.label}</span>
                </button>
                {item.items && showSettings && item.id === 'settings' && (
                  <div className="pl-8 space-y-1 mt-1">
                    {item.items.map((subItem) => (
                      <button
                        key={subItem.id}
                        className="w-full flex items-center cursor-pointer space-x-3 px-3 py-2 text-sm font-medium text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
                        onClick={() => navigate(subItem.path)}
                      >
                        <span className="flex-1 text-left">{subItem.label}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* <div className="p-6">
        <div className="bg-gray-900 rounded-xl p-4 text-white">
          <h4 className="font-semibold mb-2">Download our Mobile App</h4>
          <p className="text-sm text-gray-300 mb-4">Get the full experience on your phone</p>
          <button className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg flex items-center justify-center space-x-2 transition-colors">
            <Download className="w-4 h-4" />
            <span>Download</span>
          </button>
        </div>
      </div> */}
    </div>
  );
};


export const SuperAdminSidebar = ({ isOpen, onClose }: SuperAdminSidebarProps) => {
  const { logout } = useLogout();
  const [activeItem, setActiveItem] = useState('companies');
  const menuItems = menuItemsuperAdmin;
  return (
    <>
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        ></div>
      )}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50
        bg-white text-gray-800 w-64 h-screen p-6 flex flex-col justify-between
        border-r border-gray-200 shadow transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div>
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">GES</span>
              </div>
              <span className="font-semibold text-lg text-gray-800">SALAIRE</span>
            </div>
            <button 
              onClick={onClose}
              className="lg:hidden p-2 hover:bg-blue-50 rounded-lg transition-all text-blue-600"
            >
              <X size={20} />
            </button>
          </div>
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Menu SuperAdmin</h3>
          <ul className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.id}>
                  <button
                    onClick={() => setActiveItem(item.id)}
                    className={`w-full flex items-center space-x-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors cursor-pointer
                      ${activeItem === item.id
                        ? 'bg-blue-100 text-blue-600 shadow border-l-4 border-blue-600'
                        : 'text-gray-700 hover:bg-blue-50'}
                    `}
                  >
                    <Icon size={20} />
                    <span className="flex-1 text-left">{item.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
        <button
          onClick={() => {
            logout();
            window.location.href = '/login';
          }}
          className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg w-full transition-all duration-300 shadow hover:scale-105 group mt-6 cursor-pointer"
        >
          <LogOut size={20} className="group-hover:rotate-12 transition-transform" />
          <span className="font-semibold">Déconnexion</span>
        </button>
      </aside>
    </>
  );
};