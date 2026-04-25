import { Link } from "react-router-dom";
import { BiHome } from "react-icons/bi";
import { MdOutlineMedicalServices, MdContactSupport } from "react-icons/md";
import { FaLocationDot } from "react-icons/fa6";
import logo from "../../assets/Screenshot 2026-04-23 111622.png";

export const NavbarH = () => {
  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-teal-100 shadow-sm px-4 md:px-8 py-3 flex justify-between items-center">
      
      {/* Brand Identity */}
      <Link to="/" className="flex items-center gap-2 group">
        <img src={logo} alt="Drug-Revive" className="h-10 w-auto group-hover:rotate-12 transition-transform duration-300" />
        <div className="flex flex-col leading-none">
          <span className="font-black text-2xl tracking-tighter text-teal-900">
            Drug-<span className="text-emerald-500">Revive</span>
          </span>
          <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-teal-600/60">
            Recovery Companion
          </span>
        </div>
      </Link>

      {/* Navigation Links */}
      <div className="hidden md:flex items-center gap-8 font-semibold text-gray-600">
        <Link to="/" className="flex items-center gap-1 hover:text-emerald-600 transition-colors">
          <BiHome size={20} className="text-teal-500" /> Home
        </Link>
        <Link to="/services" className="flex items-center gap-1 hover:text-emerald-600 transition-colors">
          <MdOutlineMedicalServices size={20} className="text-teal-500" /> Services
        </Link>
        <Link to="/location" className="flex items-center gap-1 hover:text-emerald-600 transition-colors">
          <FaLocationDot size={18} className="text-teal-500" /> Locations
        </Link>
        <Link to="/contact" className="flex items-center gap-1 hover:text-emerald-600 transition-colors">
          <MdContactSupport size={20} className="text-teal-500" /> Support
        </Link>
      </div>

      {/* Auth Actions */}
      <div className="flex items-center gap-3">
        <Link
          to="/login"
          className="text-teal-800 hover:text-emerald-600 font-bold px-4 py-2 transition"
        >
          Log In
        </Link>
        <Link
          to="/signin"
          className="bg-teal-600 hover:bg-teal-700 text-white font-bold px-6 py-2.5 rounded-full shadow-md shadow-teal-200 transform hover:-translate-y-0.5 transition-all active:scale-95"
        >
          Join Community
        </Link>
      </div>
    </nav>
  );
};