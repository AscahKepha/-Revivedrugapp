import React, { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { 
  ShieldCheck, 
  History, 
  Activity, 
  UserCog, 
  HeartPulse,
  Menu,
  X,
  Users
} from 'lucide-react';

import Navbars from '../components/support-Partnerdashboard/NavbarS.tsx';
//import footers from '../components/support-Partnerdashboard/footerS.tsx';
import Logout from '../components/Logout'; // Using your default export component
import FooterS from '../components/support-Partnerdashboard/footerS.tsx';

// Sidebar items matched to your support-Partnerdashboard files
const navItems = [
  { to: '/partner/dashboard', icon: <Activity size={20} />, label: 'Partner Overview' },
  { to: '/partner/action-center', icon: <ShieldCheck size={20} />, label: 'Action Center' },
  { to: '/partner/patient-history', icon: <History size={20} />, label: 'Patient History' },
  { to: '/partner/profile', icon: <UserCog size={20} />, label: 'Account Settings' },
];

const SupportPartnerLayout: React.FC = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="bg-slate-50 min-h-screen flex flex-col">
      {/* Top Navigation Bar specific to Partners */}
      <Navbars />

      <div className="flex flex-1 pt-20">
        {/* Mobile Sidebar Toggle */}
        <button 
          onClick={() => setSidebarOpen(!isSidebarOpen)}
          className="md:hidden fixed bottom-6 right-6 z-50 bg-emerald-700 text-white p-4 rounded-full shadow-2xl"
        >
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Partner Sidebar */}
        <aside className={`
          fixed inset-y-0 left-0 z-40 w-72 bg-white border-r border-slate-200 p-8 
          transform transition-transform duration-300 ease-in-out
          md:translate-x-0 md:static md:h-[calc(100vh-5rem)]
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}>
          <div className="mb-10 px-4">
            <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-600 mb-1">
              Support Partner
            </h2>
            <div className="flex items-center gap-2">
              <div className="bg-emerald-700 p-1.5 rounded-lg text-white">
                <Users size={18} />
              </div>
              <span className="text-xl font-black text-slate-900 tracking-tighter uppercase">
                Guardian<span className="text-emerald-700">Link</span>
              </span>
            </div>
          </div>

          <nav className="flex-grow">
            <ul className="space-y-1.5">
              {navItems.map((item) => (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    onClick={() => setSidebarOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-4 px-5 py-4 rounded-2xl transition-all text-[11px] font-black uppercase tracking-widest ${
                        isActive
                          ? 'text-emerald-700 bg-emerald-50/50 shadow-sm border border-emerald-100'
                          : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
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

          {/* Logout Section */}
          <div className="pt-6 border-t border-slate-100">
            <Logout 
              variant="ghost" 
              className="w-full justify-start px-5 py-4 h-auto rounded-2xl font-black uppercase text-[11px] tracking-widest text-slate-400 hover:text-red-600 hover:bg-red-50" 
            />
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 px-4 md:px-10 pb-10 overflow-y-auto">
          <div className="max-w-6xl mx-auto py-8 min-h-[calc(100vh-15rem)]">
            {/* Renders Actioncenter, patienthistory, etc. */}
            <Outlet />
          </div>
          
          <FooterS/>
        </main>
      </div>
    </div>
  );
};

export default SupportPartnerLayout;