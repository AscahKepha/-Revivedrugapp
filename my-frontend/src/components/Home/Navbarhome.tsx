import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { BiHome, BiUserCircle, BiLogOut, BiChevronDown, BiLayout } from "react-icons/bi";
import { MdOutlineMedicalServices, MdContactSupport } from "react-icons/md";
import { FaLocationDot } from "react-icons/fa6";
import { HiMenuAlt3, HiX } from "react-icons/hi";

import type { RootState } from "../../app/store";
import { clearCredentials } from "../../features/auth/authSlice";
import logo from "../../assets/Screenshot 2026-04-23 111622.png";

export const NavbarH = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Redux State
  const { isAuthenticated, user, userType } = useSelector((state: RootState) => state.auth);

  // Helper to get the correct base path for the user's dashboard
  const getDashboardBase = () => {
    switch (userType) {
      case "admin":
        return "/admin";
      case "support_partner":
        return "/partner";
      case "patient":
        return "/patient";
      default:
        return "/";
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    dispatch(clearCredentials());
    setIsProfileOpen(false);
    setIsMobileMenuOpen(false);
    navigate("/");
  };

  const navLinks = [
    { name: "Home", path: "/", icon: <BiHome size={20} /> },
    { name: "Services", path: "/services", icon: <MdOutlineMedicalServices size={20} /> },
    { name: "Locations", path: "/location", icon: <FaLocationDot size={18} /> },
    { name: "Support", path: "/contact", icon: <MdContactSupport size={20} /> },
    { name: "Testimonials", path: "/testimonials", icon: <BiUserCircle size={20} /> },
  ];

  return (
    <nav className="sticky top-0 z-[100] bg-white/90 backdrop-blur-md border-b border-teal-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-3 flex justify-between items-center">

        {/* Brand Identity */}
        <Link to="/" className="flex items-center gap-2 group shrink-0">
          <img src={logo} alt="Drug-Revive" className="h-10 w-auto group-hover:rotate-12 transition-transform duration-300" />
          <div className="flex flex-col leading-none">
            <span className="font-black text-2xl tracking-tighter text-teal-900">
              Drug-<span className="text-emerald-500">Revive</span>
            </span>
            <span className="text-[9px] uppercase tracking-[0.2em] font-bold text-teal-600/60">
              Recovery Companion
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-8 font-bold text-gray-600">
          {navLinks.map((link) => (
            <Link key={link.name} to={link.path} className="flex items-center gap-1.5 hover:text-emerald-600 transition-colors group">
              <span className="text-teal-500 group-hover:scale-110 transition-transform">{link.icon}</span>
              {link.name}
            </Link>
          ))}
        </div>

        {/* Desktop Auth/Profile Section */}
        <div className="hidden md:flex items-center gap-3">
          {!isAuthenticated ? (
            <>
              <Link to="/login" className="text-teal-800 hover:text-emerald-600 font-black px-4 py-2 transition">
                Log In
              </Link>
              <Link to="/signin" className="bg-teal-600 hover:bg-teal-700 text-white font-black px-6 py-2.5 rounded-full shadow-lg shadow-teal-100 transform hover:-translate-y-0.5 transition-all active:scale-95">
                Join Community
              </Link>
            </>
          ) : (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className={`flex items-center gap-2 p-1.5 pr-3 rounded-full transition-all border ${isProfileOpen ? 'bg-teal-100 border-teal-200' : 'bg-teal-50 border-teal-100 hover:bg-teal-100'
                  }`}
              >
                <div className="h-9 w-9 rounded-full bg-emerald-500 flex items-center justify-center text-white font-bold shadow-inner overflow-hidden">
                  {user?.profile_picture ? (
                    <img src={user.profile_picture} alt="profile" className="h-full w-full object-cover" />
                  ) : (
                    user?.userName?.charAt(0).toUpperCase()
                  )}
                </div>
                <div className="text-left hidden lg:block">
                  <p className="text-xs font-black text-teal-900 leading-none truncate max-w-[100px]">{user?.userName}</p>
                  <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">
                    {userType?.replace('_', ' ')}
                  </p>
                </div>
                <BiChevronDown className={`text-teal-600 transition-transform duration-300 ${isProfileOpen ? 'rotate-180' : ''}`} size={20} />
              </button>

              {/* Desktop Dropdown Menu */}
              {isProfileOpen && (
                <div className="absolute right-0 mt-3 w-60 bg-white border border-teal-50 rounded-2xl shadow-2xl py-2 animate-in fade-in zoom-in-95 slide-in-from-top-2 duration-200">
                  <div className="px-4 py-3 border-b border-teal-50 mb-1">
                    <p className="text-[10px] uppercase font-black text-gray-400 tracking-widest">Account Hub</p>
                  </div>

                  <Link
                    to={getDashboardBase()}
                    onClick={() => setIsProfileOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 text-slate-700 hover:bg-teal-50 hover:text-teal-600 font-bold transition"
                  >
                    <BiLayout size={20} className="text-emerald-500" /> Control Panel
                  </Link>

                  <Link
                    to={`${getDashboardBase()}/profile`}
                    onClick={() => setIsProfileOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 text-slate-700 hover:bg-teal-50 hover:text-teal-600 font-bold transition"
                  >
                    <BiUserCircle size={20} className="text-teal-500" /> My Profile
                  </Link>

                  <div className="h-px bg-teal-50 my-1 mx-2" />
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 text-rose-500 hover:bg-rose-50 font-black transition text-left"
                  >
                    <BiLogOut size={20} /> Sign Out
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Mobile Toggle Button */}
        <button className="md:hidden text-teal-700 p-2 hover:bg-teal-50 rounded-xl transition-colors" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <HiX size={28} /> : <HiMenuAlt3 size={28} />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white border-t border-teal-50 shadow-2xl px-6 py-8 space-y-8 animate-in slide-in-from-top-4 duration-300">
          <div className="flex flex-col gap-6">
            {navLinks.map((link) => (
              <Link key={link.name} to={link.path} onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-4 text-xl font-bold text-slate-800 hover:text-teal-600">
                <span className="text-teal-500 bg-teal-50 p-2 rounded-lg">{link.icon}</span>
                {link.name}
              </Link>
            ))}
          </div>

          <div className="h-px bg-teal-50" />

          <div className="flex flex-col gap-4">
            {!isAuthenticated ? (
              <>
                <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="w-full text-center py-4 text-teal-800 font-black border-2 border-teal-100 rounded-2xl">
                  Log In
                </Link>
                <Link to="/signin" onClick={() => setIsMobileMenuOpen(false)} className="w-full text-center py-4 bg-teal-600 text-white font-black rounded-2xl shadow-lg shadow-teal-600/20">
                  Join Community
                </Link>
              </>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl">
                  <div className="h-14 w-14 rounded-full bg-emerald-500 flex items-center justify-center text-white font-black text-2xl shadow-inner overflow-hidden">
                    {user?.profile_picture ? (
                      <img src={user.profile_picture} alt="profile" className="h-full w-full object-cover" />
                    ) : (
                      user?.userName?.charAt(0).toUpperCase()
                    )}
                  </div>
                  <div>
                    <p className="font-black text-xl text-teal-900">{user?.userName}</p>
                    <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest">{userType?.replace('_', ' ')}</p>
                  </div>
                </div>

                <Link
                  to={getDashboardBase()}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-4 w-full px-6 py-4 bg-teal-600 text-white font-black rounded-2xl shadow-lg shadow-teal-600/20"
                >
                  <BiLayout size={24} /> Go to Dashboard
                </Link>

                <button onClick={handleLogout} className="w-full flex items-center justify-center gap-3 py-4 bg-rose-50 text-rose-600 font-black rounded-2xl">
                  <BiLogOut size={24} /> Logout
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};