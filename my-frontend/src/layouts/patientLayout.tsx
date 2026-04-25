import { useState } from 'react';
import { NavLink, Outlet, Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { 
  LayoutDashboard, 
  Users, 
  ClipboardCheck, 
  BarChart3, 
  Menu, 
  HeartPulse,
  Settings,
  HelpCircle,
  Activity
} from 'lucide-react';

import type { RootState } from '../app/store';
import { NavbarH } from '../components/Home/Navbarhome'; // Main Navbar integration
import Logout from '../components/Logout';
import Footerp from '../components/patientdashboard/footerp';

const navItems = [
  { to: '/patient/dashboard', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
  { to: '/patient/support-circle', icon: <Users size={20} />, label: 'Support Circle' },
  { to: '/patient/check-in', icon: <ClipboardCheck size={20} />, label: 'Daily Check-in' },
  { to: '/patient/scores', icon: <BarChart3 size={20} />, label: 'Recovery Scores' },
];

const secondaryNav = [
  { to: '/patient/settings', icon: <Settings size={20} />, label: 'Settings' },
  { to: '/patient/help', icon: <HelpCircle size={20} />, label: 'Help & Support' },
];

const PatientLayout: React.FC = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  
  // Connect to Redux Auth State
  const { user, userType } = useSelector((state: RootState) => state.auth);

  // Helper for initials
  const getInitials = (name: string) => {
    return name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'PT';
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden font-sans">
      
      {/* 1. Persistent Home Navbar at the very top */}
      <NavbarH />

      <div className="flex flex-1 overflow-hidden">
        {/* Mobile Sidebar Overlay */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-slate-900/40 z-40 md:hidden backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* 2. Sidebar Navigation */}
        <aside className={`
          fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-slate-200 
          transform transition-transform duration-300 ease-in-out flex flex-col
          md:relative md:translate-x-0
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}>
          
          {/* Branding Section */}
          <div className="p-8">
            <Link to="/patient/dashboard" className="flex items-center gap-3 group">
              <div className="bg-emerald-600 p-2 rounded-xl shadow-lg shadow-emerald-100 group-hover:rotate-12 transition-transform duration-300">
                <HeartPulse className="text-white" size={24} />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-black tracking-tighter text-slate-900 uppercase italic leading-none">
                  Revive<span className="text-emerald-600">Pro</span>
                </span>
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1">
                  Patient Portal
                </span>
              </div>
            </Link>
          </div>

          {/* Dynamic Patient Card */}
          <div className="px-6 pb-6 mb-2 border-b border-slate-100">
            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-black text-xs shadow-md">
                {getInitials(user?.userName || 'Patient')}
              </div>
              <div className="flex flex-col overflow-hidden">
                <span className="text-xs font-black text-slate-900 uppercase tracking-tight truncate">
                  {user?.userName || 'User'}
                </span>
                <div className="flex items-center gap-1">
                  <Activity size={10} className="text-emerald-500" />
                  <span className="text-[9px] text-emerald-600 font-bold uppercase tracking-widest">
                    {userType || 'Patient'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Section */}
          <nav className="flex-1 overflow-y-auto px-4 py-2 space-y-8 custom-scrollbar">
            {/* Main Links */}
            <div>
              <h3 className="px-5 mb-4 text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em]">
                Main Menu
              </h3>
              <ul className="space-y-1.5">
                {navItems.map((item) => (
                  <li key={item.to}>
                    <NavLink
                      to={item.to}
                      onClick={() => setSidebarOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center gap-4 px-5 py-4 rounded-2xl transition-all text-[11px] font-black uppercase tracking-widest ${
                          isActive
                            ? 'text-emerald-600 bg-emerald-50 border border-emerald-100 shadow-sm'
                            : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
                        }`
                      }
                    >
                      <span className={location.pathname === item.to ? 'text-emerald-600' : 'text-slate-300'}>
                        {item.icon}
                      </span>
                      {item.label}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>

            {/* Secondary Links */}
            <div>
              <h3 className="px-5 mb-4 text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em]">
                Preferences
              </h3>
              <ul className="space-y-1.5">
                {secondaryNav.map((item) => (
                  <li key={item.to}>
                    <NavLink
                      to={item.to}
                      onClick={() => setSidebarOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center gap-4 px-5 py-4 rounded-2xl transition-all text-[11px] font-black uppercase tracking-widest ${
                          isActive
                            ? 'text-emerald-600 bg-emerald-50 border border-emerald-100 shadow-sm'
                            : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
                        }`
                      }
                    >
                      <span className="text-slate-300">{item.icon}</span>
                      {item.label}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          </nav>

          {/* Sidebar Footer / Logout */}
          <div className="p-6 mt-auto border-t border-slate-100 bg-slate-50/50">
            <Logout 
              variant="ghost" 
              className="w-full justify-start px-5 py-4 h-auto rounded-2xl font-black uppercase text-[11px] tracking-widest text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors" 
            />
          </div>
        </aside>

        {/* 3. Main Content Wrapper */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          
          {/* Mobile Navbar Header (Hidden on Desktop) */}
          <header className="md:hidden flex items-center justify-between p-5 bg-white border-b border-slate-200 z-30 shadow-sm">
            <div className="flex items-center gap-2">
              <div className="bg-emerald-600 p-1.5 rounded-lg">
                <HeartPulse className="text-white" size={18} />
              </div>
              <span className="font-black text-sm uppercase tracking-tighter italic text-slate-900">RevivePro</span>
            </div>
            <button 
              onClick={() => setSidebarOpen(true)}
              className="p-2 text-slate-600 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors"
            >
              <Menu size={22} />
            </button>
          </header>

          {/* Scrollable Body Area */}
          <main className="flex-1 overflow-y-auto bg-slate-50/50">
            {/* Main Container */}
            <div className="max-w-7xl mx-auto px-4 md:px-10 py-10 min-h-[calc(100vh-12rem)]">
              <Outlet />
            </div>
            
            {/* Footer Integration */}
            <div className="px-4 md:px-10 pb-10">
              <Footerp />
            </div>
          </main>
        </div>
      </div>

      {/* Sidebar Scrollbar Styling */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default PatientLayout;