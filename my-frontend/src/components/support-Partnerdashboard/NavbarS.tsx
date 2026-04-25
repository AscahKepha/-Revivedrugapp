import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { 
  LayoutDashboard, 
  Users, 
  UserCircle, 
  LogOut, 
  Bell, 
  Menu, 
  X,
  ShieldCheck,
  HeartHandshake
} from 'lucide-react';
import { type RootState } from '../../app/types'; // Adjust path to your store types
// import { logout } from '../../features/auth/authSlice'; // Import your logout action

const NavbarS = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((state: RootState) => state.auth);

  const navLinks = [
    { name: 'Dashboard', path: '/support-partner/dashboard', icon: <LayoutDashboard size={18} /> },
    { name: 'My Patients', path: '/support-partner/patients', icon: <Users size={18} /> },
    { name: 'Action Center', path: '/support-partner/action-center', icon: <Bell size={18} /> },
  ];

  const handleLogout = () => {
    // dispatch(logout());
    navigate('/login');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          
          {/* Logo Section */}
          <div className="flex items-center gap-2">
            <div className="bg-emerald-600 p-2 rounded-xl shadow-lg shadow-emerald-100">
              <HeartHandshake className="text-white" size={24} />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black tracking-tighter text-gray-900 leading-none">
                DRUG-REVIVE
              </span>
              <span className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em]">
                Partner Portal
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                  isActive(link.path)
                    ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100'
                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                {link.icon}
                {link.name}
              </Link>
            ))}

            <div className="h-8 w-[1px] bg-gray-100 mx-2" />

            {/* Profile Dropdown Trigger / Avatar */}
            <Link 
              to="/support-partner/profile"
              className={`flex items-center gap-3 p-1 pr-4 rounded-2xl transition-all ${
                isActive('/support-partner/profile') 
                ? 'bg-gray-900 text-white' 
                : 'hover:bg-gray-50 text-gray-700'
              }`}
            >
              <div className="w-10 h-10 rounded-xl overflow-hidden border-2 border-emerald-100 bg-emerald-50 flex items-center justify-center">
                {user?.profile_picture ? (
                  <img src={user.profile_picture} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <UserCircle size={20} className="text-emerald-600" />
                )}
              </div>
              <div className="hidden lg:block text-left">
                <p className="text-xs font-black uppercase tracking-tight leading-none mb-1">
                  {user?.userName || 'Partner'}
                </p>
                <div className="flex items-center gap-1">
                  <ShieldCheck size={10} className="text-emerald-500" />
                  <span className="text-[9px] font-bold text-gray-400 uppercase">Verified</span>
                </div>
              </div>
            </Link>

            <button 
              onClick={handleLogout}
              className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
              title="Logout"
            >
              <LogOut size={20} />
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-xl text-gray-600 hover:bg-gray-100"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-50 p-4 space-y-2 shadow-xl animate-in slide-in-from-top-4">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setIsOpen(false)}
              className={`flex items-center gap-3 p-4 rounded-2xl font-bold ${
                isActive(link.path) ? 'bg-emerald-600 text-white' : 'text-gray-600 bg-gray-50'
              }`}
            >
              {link.icon}
              {link.name}
            </Link>
          ))}
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 w-full p-4 rounded-2xl font-bold text-red-600 bg-red-50"
          >
            <LogOut size={18} /> Logout
          </button>
        </div>
      )}
    </nav>
  );
};

export default NavbarS;