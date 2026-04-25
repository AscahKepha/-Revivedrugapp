import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
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
import { type RootState } from '../app/types'; 

const NavbarS = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  // dispatch removed to fix ts(6133)

  const { user } = useSelector((state: RootState) => state.auth);

  const navLinks = [
    { name: 'Dashboard', path: '/partner/dashboard', icon: <LayoutDashboard size={18} /> },
    { name: 'Action Center', path: '/partner/action-center', icon: <Bell size={18} /> },
    { name: 'Patient History', path: '/partner/patient-history', icon: <Users size={18} /> },
  ];

  const handleLogout = () => {
    // If you decide to use dispatch later, re-add: const dispatch = useDispatch();
    // dispatch(logout()); 
    navigate('/login');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-white border-b border-slate-200 fixed top-0 w-full z-[60] h-20 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
        <div className="flex justify-between items-center h-full">

          {/* Logo Section */}
          <div className="flex items-center gap-2">
            <div className="bg-emerald-700 p-2 rounded-xl shadow-lg shadow-emerald-100">
              <HeartHandshake className="text-white" size={24} />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black tracking-tighter text-slate-900 leading-none">
                GUARDIAN<span className="text-emerald-700">LINK</span>
              </span>
              <span className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em]">
                Partner Portal
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-wider transition-all ${
                  isActive(link.path)
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                {link.icon}
                {link.name}
              </Link>
            ))}

            <div className="h-8 w-[1px] bg-slate-100 mx-3" />

            {/* Profile Link */}
            <Link
              to="/partner/profile"
              className={`flex items-center gap-3 p-1.5 pr-5 rounded-2xl transition-all ${
                isActive('/partner/profile')
                ? 'bg-slate-900 text-white'
                : 'hover:bg-slate-50 text-slate-700 border border-transparent'
              }`}
            >
              <div className="w-9 h-9 rounded-xl overflow-hidden border-2 border-emerald-100 bg-emerald-50 flex items-center justify-center">
                {user?.profile_picture ? (
                  <img src={user.profile_picture} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <UserCircle size={20} className="text-emerald-600" />
                )}
              </div>
              <div className="hidden lg:block text-left">
                <p className={`text-[10px] font-black uppercase tracking-tight leading-none mb-1 ${isActive('/partner/profile') ? 'text-white' : 'text-slate-900'}`}>
                  {user?.userName || 'Partner'}
                </p>
                <div className="flex items-center gap-1">
                  <ShieldCheck size={10} className="text-emerald-500" />
                  <span className="text-[9px] font-bold text-slate-400 uppercase">Verified</span>
                </div>
              </div>
            </Link>

            <button
              onClick={handleLogout}
              className="ml-2 p-2.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
              title="Logout"
            >
              <LogOut size={20} />
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2.5 rounded-xl text-slate-600 bg-slate-50 hover:bg-slate-100 transition-colors"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="md:hidden absolute top-20 left-0 w-full bg-white border-b border-slate-200 p-4 space-y-2 shadow-2xl animate-in fade-in slide-in-from-top-2">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setIsOpen(false)}
              className={`flex items-center gap-3 p-4 rounded-2xl font-black text-[11px] uppercase tracking-widest transition-colors ${
                isActive(link.path) 
                ? 'bg-emerald-700 text-white' 
                : 'text-slate-600 bg-slate-50 hover:bg-slate-100'
              }`}
            >
              {link.icon}
              {link.name}
            </Link>
          ))}
          
          <Link
            to="/partner/profile"
            onClick={() => setIsOpen(false)}
            className={`flex items-center gap-3 p-4 rounded-2xl font-black text-[11px] uppercase tracking-widest ${
              isActive('/partner/profile') ? 'bg-slate-900 text-white' : 'text-slate-600 bg-slate-50'
            }`}
          >
            <UserCircle size={18} /> Profile Settings
          </Link>

          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full p-4 rounded-2xl font-black text-[11px] uppercase tracking-widest text-red-600 bg-red-50 border border-red-100 mt-4"
          >
            <LogOut size={18} /> Logout
          </button>
        </div>
      )}
    </nav>
  );
};

export default NavbarS;