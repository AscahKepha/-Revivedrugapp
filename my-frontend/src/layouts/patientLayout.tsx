import React, { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  ClipboardCheck, 
  BarChart3, 
  HeartPulse,
  Menu,
  X
} from 'lucide-react';

import Navbarp from '../components/patientdashboard/Navbarp';
import Footerp from '../components/patientdashboard/footerp';
import Logout from '../components/Logout'; // Using your default export component

// Sidebar items matched to your specific patientdashboard files
const navItems = [
  { to: '/patient/dashboard', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
  { to: '/patient/support-circle', icon: <Users size={20} />, label: 'Support Circle' },
  { to: '/patient/check-in', icon: <ClipboardCheck size={20} />, label: 'Daily Check-in' },
  { to: '/patient/scores', icon: <BarChart3 size={20} />, label: 'Recovery Scores' },
  // { to: '/patient/profile', icon: <UserCircle size={20} />, label: 'My Profile' },
];

const PatientLayout: React.FC = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      {/* Top Navigation Bar */}
      <Navbarp />

      <div className="flex flex-1 pt-20">
        {/* Mobile Sidebar Toggle */}
        <button 
          onClick={() => setSidebarOpen(!isSidebarOpen)}
          className="md:hidden fixed bottom-6 right-6 z-50 bg-emerald-600 text-white p-4 rounded-full shadow-lg"
        >
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Sidebar - Integrated with your emerald aesthetic */}
        <aside className={`
          fixed inset-y-0 left-0 z-40 w-72 bg-white border-r border-gray-100 p-8 
          transform transition-transform duration-300 ease-in-out
          md:translate-x-0 md:static md:h-[calc(100vh-5rem)]
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}>
          <div className="mb-10 px-4">
            <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 mb-1">
              Patient Portal
            </h2>
            <div className="flex items-center gap-2">
              <div className="bg-emerald-600 p-1.5 rounded-lg text-white">
                <HeartPulse size={18} />
              </div>
              <span className="text-xl font-black text-gray-900 tracking-tighter uppercase italic">
                Revive<span className="text-emerald-600">Pro</span>
              </span>
            </div>
          </div>

          <nav className="flex-grow">
            <ul className="space-y-2">
              {navItems.map((item) => (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    onClick={() => setSidebarOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-4 px-5 py-4 rounded-2xl transition-all text-[11px] font-black uppercase tracking-widest ${
                        isActive
                          ? 'text-emerald-600 bg-emerald-50 shadow-sm'
                          : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
                      }`
                    }
                  >
                    {item.icon}
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          {/* Logout Component Integration */}
          <div className="pt-6 border-t border-gray-100">
             {/* Note: This fixes the TS2554/TS2345 errors by using the UI component directly */}
            <Logout 
              variant="ghost" 
              className="w-full justify-start px-5 py-4 h-auto rounded-2xl font-black uppercase text-[11px] tracking-widest text-gray-400 hover:text-red-500 hover:bg-red-50" 
            />
          </div>
        </aside>

        {/* Main Content Scroll Area */}
        <main className="flex-1 px-4 md:px-10 pb-10 overflow-y-auto">
          <div className="max-w-6xl mx-auto py-6 min-h-[calc(100vh-15rem)]">
            {/* Renders Dashboard, Scorepage, Supportcircle, etc. */}
            <Outlet />
          </div>
          
          <Footerp />
        </main>
      </div>
    </div>
  );
};

export default PatientLayout;