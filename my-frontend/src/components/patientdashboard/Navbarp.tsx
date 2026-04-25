import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { 
  LayoutDashboard, 
  Users, 
  ClipboardCheck, 
  BarChart3, 
  UserCircle, 
  Menu, 
  X,
  HeartPulse
} from 'lucide-react';

// ✅ Correctly import your Logout UI component
import Logout from '../../components/Logout';
import { type RootState } from '../../app/types';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  
  // ✅ Access user data from Redux
  const { user } = useSelector((state: RootState) => state.auth);

  const navLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={18} /> },
    { name: 'Support Circle', path: '/support-circle', icon: <Users size={18} /> },
    { name: 'Daily Check-in', path: '/check-in', icon: <ClipboardCheck size={18} /> },
    { name: 'My Scores', path: '/scores', icon: <BarChart3 size={18} /> },
  ];

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          
          {/* Logo Section */}
          <div className="flex items-center">
            <Link to="/dashboard" className="flex items-center gap-2 group">
              <div className="bg-emerald-600 p-2 rounded-xl text-white group-hover:rotate-12 transition-transform">
                <HeartPulse size={24} />
              </div>
              <span className="text-xl font-black tracking-tighter text-gray-900 uppercase">
                Drug<span className="text-emerald-600">-Revive</span>
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                  location.pathname === link.path
                    ? 'bg-emerald-50 text-emerald-600'
                    : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
                }`}
              >
                {link.icon}
                {link.name}
              </Link>
            ))}
          </div>

          {/* User Profile & Logout */}
          <div className="hidden md:flex items-center gap-4 border-l border-gray-100 ml-4 pl-4">
            <Link to="/profile" className="flex items-center gap-3 group">
              <div className="text-right">
                <p className="text-[10px] font-black text-gray-400 uppercase leading-none">Patient</p>
                <p className="text-sm font-black text-gray-900 group-hover:text-emerald-600 transition-colors">
                  {user?.userName || 'User'}
                </p>
              </div>
              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 group-hover:bg-emerald-100 group-hover:text-emerald-600 transition-all overflow-hidden border-2 border-white shadow-sm">
                {user?.profile_picture ? (
                   <img src={user.profile_picture} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                   <UserCircle size={24} />
                )}
              </div>
            </Link>
            
            {/* ✅ Use your specialized Logout component instead of a raw button */}
            <Logout 
              variant="ghost" 
              className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all" 
            />
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-500 p-2 hover:bg-gray-50 rounded-xl"
            >
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-50 p-4 space-y-2 animate-in slide-in-from-top duration-300">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setIsOpen(false)}
              className={`flex items-center gap-4 p-4 rounded-2xl text-sm font-black uppercase tracking-widest ${
                location.pathname === link.path
                  ? 'bg-emerald-600 text-white'
                  : 'text-gray-500 bg-gray-50'
              }`}
            >
              {link.icon}
              {link.name}
            </Link>
          ))}
          <div className="pt-4 border-t border-gray-100 flex flex-col gap-2">
            <Link 
              to="/profile" 
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50 text-gray-900 font-black uppercase text-xs"
            >
              <UserCircle size={20} /> Profile Settings
            </Link>
            
            {/* ✅ Large Logout Button for Mobile */}
            <Logout 
              className="w-full h-14 rounded-2xl font-black uppercase text-xs tracking-[0.2em]" 
            />
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;