import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  ClipboardCheck, 
  BarChart3, 
  UserCircle, 
  HeartPulse,
  ShieldAlert
} from 'lucide-react';

import NavbarA from '../components/Admindashboard/NavbarA';
import Footer from '../components/Admindashboard/footerA';
import Logout from '../components/Logout'; // Using your custom UI component

const navItems = [
  { to: '/dashboard', icon: <LayoutDashboard size={20} className="mr-3" />, label: 'Dashboard' },
  { to: '/support-circle', icon: <Users size={20} className="mr-3" />, label: 'Support Circle' },
  { to: '/check-in', icon: <ClipboardCheck size={20} className="mr-3" />, label: 'Daily Check-in' },
  { to: '/scores', icon: <BarChart3 size={20} className="mr-3" />, label: 'Recovery Scores' },
  { to: '/profile', icon: <UserCircle size={20} className="mr-3" />, label: 'My Profile' },
  { to: '/help-now', icon: <ShieldAlert size={20} className="mr-3 text-red-500" />, label: 'Emergency SOS' },
];

const PatientLayout: React.FC = () => {
  return (
    <div className="bg-gray-50/50 min-h-screen">
      {/* Top Navbar */}
      <NavbarA />

      <div className="flex">
        {/* Sidebar - Fixed on the left for Desktop */}
        <aside className="fixed top-20 left-0 h-[calc(100vh-5rem)] w-72 bg-white border-r border-gray-100 p-8 hidden md:flex flex-col z-40">
          <div className="mb-10 px-4">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-600 mb-1">
              Patient Portal
            </p>
            <h2 className="text-2xl font-black text-gray-900 tracking-tighter uppercase">
              Recovery<span className="text-emerald-600">Hub</span>
            </h2>
          </div>

          <nav className="flex-grow">
            <ul className="space-y-2">
              {navItems.map((item) => (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    className={({ isActive }) =>
                      `flex items-center px-5 py-4 rounded-2xl transition-all text-xs font-black uppercase tracking-widest ${
                        isActive
                          ? 'text-emerald-600 bg-emerald-50 shadow-sm shadow-emerald-100/50'
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

          {/* Specialized Logout Section */}
          <div className="pt-6 border-t border-gray-100">
            <Logout 
              variant="ghost" 
              className="w-full justify-start px-5 py-4 h-auto rounded-2xl font-black uppercase text-xs tracking-widest text-gray-400 hover:text-red-500 hover:bg-red-50" 
            />
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 ml-0 md:ml-72 p-4 md:p-10 transition-all duration-300">
          <div className="max-w-6xl mx-auto min-h-[calc(100vh-12rem)]">
            {/* The individual pages (Dashboard, Support Circle, etc.) render here */}
            <Outlet />
          </div>
          
          {/* Footer inside the main scroll area */}
          <Footer />
        </main>
      </div>
    </div>
  );
};

export default PatientLayout;