import { useState } from 'react';
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
import Logout from '../components/Logout';
import { type RootState } from '../app/types';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  
  // ✅ Access user data from Redux
  const { user } = useSelector((state: RootState) => state.auth);

  const navLinks = [
    { name: 'Dashboard', path: '/patient/dashboard', icon: <LayoutDashboard size={18} /> },
    { name: 'Support Circle', path: '/patient/support-circle', icon: <Users size={18} /> },
    { name: 'Check-in', path: '/patient/check-in', icon: <ClipboardCheck size={18} /> },
    { name: 'Scores', path: '/patient/scores', icon: <BarChart3 size={18} /> },
  ];

  return (
    <nav className="bg-white border-b border-gray-100 fixed top-0 w-full z-[60] h-20 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
        <div className="flex justify-between items-center h-full">
          
          {/* Logo Section */}
          <div className="flex items-center">
            <Link to="/patient/dashboard" className="flex items-center gap-2 group">
              <div className="bg-emerald-600 p-2 rounded-xl text-white group-hover:rotate-12 transition-transform">
                <HeartPulse size={24} />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-black tracking-tighter text-gray-900 uppercase italic leading-none">
                  Revive<span className="text-emerald-600">Pro</span>
                </span>
                <span className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] mt-1">
                  Patient Hub
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  location.pathname === link.path
                    ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
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
            <Link to="/patient/profile" className="flex items-center gap-3 group">
              <div className="text-right">
                <p className="text-[9px] font-black text-gray-400 uppercase leading-none mb-1">Active</p>
                <p className="text-xs font-black text-gray-900 group-hover:text-emerald-600 transition-colors">
                  {user?.userName || 'User'}
                </p>
              </div>
              <div className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center text-gray-400 group-hover:bg-emerald-100 group-hover:text-emerald-600 transition-all overflow-hidden border-2 border-white shadow-sm">
                {user?.profile_picture ? (
                   <img src={user.profile_picture} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                   <UserCircle size={22} />
                )}
              </div>
            </Link>
            
            <Logout 
              variant="ghost" 
              className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all" 
            />
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-500 p-2 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors"
            >
              {isOpen ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden absolute top-20 left-0 w-full bg-white border-b border-gray-200 p-4 space-y-2 shadow-2xl animate-in fade-in slide-in-from-top-2 duration-300">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setIsOpen(false)}
              className={`flex items-center gap-4 p-4 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-colors ${
                location.pathname === link.path
                  ? 'bg-emerald-600 text-white'
                  : 'text-gray-500 bg-gray-50 hover:bg-gray-100'
              }`}
            >
              {link.icon}
              {link.name}
            </Link>
          ))}
          <div className="pt-4 border-t border-gray-100 flex flex-col gap-2">
            <Link 
              to="/patient/profile" 
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50 text-gray-900 font-black uppercase text-[11px] tracking-widest"
            >
              <UserCircle size={20} /> My Profile
            </Link>
            
            <Logout 
              className="w-full h-14 rounded-2xl font-black uppercase text-[11px] tracking-widest bg-red-50 text-red-600 border border-red-100" 
            />
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;