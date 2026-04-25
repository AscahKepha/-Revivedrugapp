import { useState } from "react";
import { Link } from "react-router-dom";
import { BiHome } from "react-icons/bi";
import { MdOutlineMedicalServices, MdContactSupport } from "react-icons/md";
import { FaLocationDot } from "react-icons/fa6";
import { HiMenuAlt3, HiX } from "react-icons/hi"; // Added for mobile responsiveness
import logo from "../../assets/Screenshot 2026-04-23 111622.png";

export const NavbarH = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: "Home", path: "/", icon: <BiHome size={20} /> },
    { name: "Services", path: "/services", icon: <MdOutlineMedicalServices size={20} /> },
    { name: "Locations", path: "/location", icon: <FaLocationDot size={18} /> },
    { name: "Support", path: "/contact", icon: <MdContactSupport size={20} /> },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-teal-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-3 flex justify-between items-center">
        
        {/* Brand Identity */}
        <Link to="/" className="flex items-center gap-2 group shrink-0">
          <img 
            src={logo} 
            alt="Drug-Revive" 
            className="h-10 w-auto group-hover:rotate-12 transition-transform duration-300" 
          />
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
            <Link
              key={link.name}
              to={link.path}
              className="flex items-center gap-1.5 hover:text-emerald-600 transition-colors group"
            >
              <span className="text-teal-500 group-hover:scale-110 transition-transform">
                {link.icon}
              </span>
              {link.name}
            </Link>
          ))}
        </div>

        {/* Desktop Auth Actions */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            to="/login"
            className="text-teal-800 hover:text-emerald-600 font-black px-4 py-2 transition"
          >
            Log In
          </Link>
          <Link
            to="/signin"
            className="bg-teal-600 hover:bg-teal-700 text-white font-black px-6 py-2.5 rounded-full shadow-lg shadow-teal-100 transform hover:-translate-y-0.5 transition-all active:scale-95"
          >
            Join Community
          </Link>
        </div>

        {/* Mobile Toggle Button */}
        <button 
          className="md:hidden text-teal-700 p-2"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <HiX size={28} /> : <HiMenuAlt3 size={28} />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-teal-50 px-4 py-6 space-y-4 animate-in slide-in-from-top duration-300">
          <div className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-3 text-lg font-bold text-gray-700 hover:text-teal-600"
              >
                <span className="text-teal-500">{link.icon}</span>
                {link.name}
              </Link>
            ))}
          </div>
          
          <hr className="border-teal-50" />
          
          <div className="flex flex-col gap-3">
            <Link
              to="/login"
              onClick={() => setIsMobileMenuOpen(false)}
              className="w-full text-center py-3 text-teal-800 font-black border border-teal-100 rounded-2xl"
            >
              Log In
            </Link>
            <Link
              to="/signin"
              onClick={() => setIsMobileMenuOpen(false)}
              className="w-full text-center py-3 bg-teal-600 text-white font-black rounded-2xl shadow-md"
            >
              Join Community
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};