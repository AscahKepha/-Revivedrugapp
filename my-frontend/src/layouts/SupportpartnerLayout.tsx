import React, { useState } from 'react';
import { NavLink, Outlet, Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { 
  ShieldCheck, 
  History, 
  Activity, 
  UserCog, 
  Menu,
  HeartHandshake,
  ChevronRight
} from 'lucide-react';

import { type RootState } from '../app/types';
import { NavbarH } from '../components/Home/Navbarhome.tsx'; // Integrated Main Navbar
import Logout from '../components/Logout'; 
import FooterS from '../components/support-Partnerdashboard/footerS.tsx';

const navItems = [
  { to: '/partner/dashboard', icon: <Activity size={20} />, label: 'Partner Overview' },
  { to: '/partner/action-center', icon: <ShieldCheck size={20} />, label: 'Action Center' },
  { to: '/partner/patient-history', icon: <History size={20} />, label: 'Patient History' },
  { to: '/partner/profile', icon: <UserCog size={20} />, label: 'Account Settings' },
];

const SupportPartnerLayout: React.FC = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  
  // Dynamic User State from Redux
  const { user, userType } = useSelector((state: RootState) => state.auth);

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      
      {/* 1. Global Home Navbar (Stays fixed at the top) */}
      <NavbarH />

      <div className="flex flex-1 overflow-hidden">
        {/* Mobile Sidebar Overlay */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-slate-900/40 z-40 md:hidden backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* 2. Partner Sidebar Navigation */}
        <aside className={`
          fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-slate-200 
          transform transition-transform duration-300 ease-in-out flex flex-col
          md:relative md:translate-x-0
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}>
          
          {/* Branding Area */}
          <div className="p-8">
            <Link to="/partner/dashboard" className="flex items-center gap-3 group">
              <div className="bg-emerald-700 p-2 rounded-xl shadow-lg shadow-emerald-100 group-hover:rotate-6 transition-transform">
                <HeartHandshake className="text-white" size={24} />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-black tracking-tighter text-slate-900 leading-none">
                  GUARDIAN<span className="text-emerald-700">LINK</span>
                </span>
                <span className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em] mt-1">
                  {userType?.replace('_', ' ') || 'Partner Portal'}
                </span>
              </div>
            </Link>
          </div>

          {/* User Profile Quick-View (Connected to Redux) */}
          <div className="px-6 pb-6 mb-4 border-b border-slate-100">
            <Link 
              to="/partner/profile"
              className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl hover:bg-emerald-50/50 transition-colors group"
            >
              <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-emerald-600 overflow-hidden shadow-sm group-hover:border-emerald-300 transition-all font-black text-xs">
                {user?.profileImage ? (
                  <img src={user.profileImage} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  user?.userName?.charAt(0).toUpperCase() || <UserCog size={22} />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[11px] font-black text-slate-900 truncate uppercase tracking-tight">
                  {user?.userName || 'Support Partner'}
                </p>
                <p className="text-[9px] text-emerald-600 font-bold uppercase tracking-widest flex items-center gap-1">
                  Verified <ShieldCheck size={10} />
                </p>
              </div>
              <ChevronRight size={14} className="text-slate-300 group-hover:text-emerald-500 group-hover:translate-x-1 transition-all" />
            </Link>
          </div>

          {/* Navigation Items */}
          <nav className="flex-1 overflow-y-auto px-4 space-y-1.5 custom-scrollbar">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-4 px-5 py-4 rounded-2xl transition-all text-[11px] font-black uppercase tracking-widest ${
                    isActive
                      ? 'text-emerald-700 bg-emerald-50/80 border border-emerald-100 shadow-sm'
                      : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
                  }`
                }
              >
                <span className={location.pathname === item.to ? 'text-emerald-700' : 'text-slate-300'}>
                  {item.icon}
                </span>
                {item.label}
              </NavLink>
            ))}
          </nav>

          {/* Pinned Logout Button */}
          <div className="p-6 mt-auto border-t border-slate-100">
            <Logout 
              variant="ghost" 
              className="w-full justify-start px-5 py-4 h-auto rounded-2xl font-black uppercase text-[11px] tracking-widest text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors" 
            />
          </div>
        </aside>

        {/* 3. Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          
          {/* Mobile Header (Only visible on small screens) */}
          <header className="md:hidden flex items-center justify-between p-4 bg-white border-b border-slate-200 z-30 shadow-sm">
            <div className="flex items-center gap-2">
              <HeartHandshake className="text-emerald-700" size={22} />
              <span className="font-black text-xs uppercase tracking-tighter text-slate-900">GuardianLink</span>
            </div>
            <button 
              onClick={() => setSidebarOpen(true)}
              className="p-2.5 text-slate-600 bg-slate-50 rounded-xl"
            >
              <Menu size={22} />
            </button>
          </header>

          {/* Content Scroll Area */}
          <main className="flex-1 overflow-y-auto bg-slate-50/30">
            <div className="max-w-7xl mx-auto px-4 md:px-10 py-8 min-h-[calc(100vh-12rem)]">
              <Outlet />
            </div>
            
            <div className="px-4 md:px-10 pb-10">
              <FooterS />
            </div>
          </main>
        </div>
      </div>

      {/* Custom Styles */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default SupportPartnerLayout;