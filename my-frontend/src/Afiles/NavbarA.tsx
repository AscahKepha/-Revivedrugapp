import { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { 
  Shield, 
  LayoutDashboard, 
  Swords, 
  Users, 
  History, 
  BarChart3, 
  Menu, 
  X,
  Activity
} from 'lucide-react';
import Logout from '../components/Logout';

const NavbarA: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);

    const navItems = [
        { name: 'Hub', path: '/admin/hub', icon: <LayoutDashboard size={18} /> },
        { name: 'War Room', path: '/war-room', icon: <Swords size={18} /> },
        { name: 'Patients', path: '/admin/patients', icon: <Users size={18} /> },
        { name: 'History', path: '/admin/history', icon: <History size={18} /> },
        { name: 'Analytics', path: '/admin/charts', icon: <BarChart3 size={18} /> },
    ];

    return (
        <nav className="bg-white border-b border-slate-200 fixed top-0 w-full z-[60] h-20 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
                <div className="flex justify-between items-center h-full">
                    
                    {/* 1. Logo Section */}
                    <div className="flex items-center">
                        <Link to="/admin/hub" className="flex-shrink-0 flex items-center gap-2 group">
                            <div className="bg-slate-900 p-2 rounded-xl shadow-lg shadow-slate-100 group-hover:bg-red-600 transition-colors duration-300">
                                <Shield className="text-white" size={22} />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xl font-black tracking-tighter text-slate-900 uppercase leading-none">
                                    ADMIN<span className="text-red-600">CONTROL</span>
                                </span>
                                <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1">
                                    System Oversight
                                </span>
                            </div>
                        </Link>

                        {/* Desktop Navigation Links */}
                        <div className="hidden lg:ml-10 lg:flex lg:space-x-1">
                            {navItems.map((item) => (
                                <NavLink
                                    key={item.name}
                                    to={item.path}
                                    className={({ isActive }) => `
                                        flex items-center gap-2 px-4 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-wider transition-all
                                        ${isActive 
                                            ? 'bg-red-50 text-red-600 border border-red-100' 
                                            : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}
                                    `}
                                >
                                    {item.icon}
                                    {item.name}
                                </NavLink>
                            ))}
                        </div>
                    </div>

                    {/* 2. Desktop Profile & Logout Section */}
                    <div className="hidden md:flex items-center gap-6">
                        <div className="flex items-center gap-3 pr-4 border-r border-slate-100">
                            <div className="flex flex-col items-end">
                                <span className="text-[11px] font-black text-slate-900 uppercase tracking-tight">Ascah Moraa</span>
                                <div className="flex items-center gap-1">
                                    <Activity size={10} className="text-purple-500" />
                                    <span className="text-[9px] text-purple-600 font-bold uppercase tracking-widest">
                                        Super Admin
                                    </span>
                                </div>
                            </div>
                            <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-white font-black text-xs shadow-inner">
                                AM
                            </div>
                        </div>
                        
                        {/* Specialized Logout Component */}
                        <Logout 
                            variant="ghost" 
                            className="p-2.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all" 
                        />
                    </div>

                    {/* 3. Mobile Menu Toggle */}
                    <div className="flex items-center lg:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="p-2.5 rounded-xl text-slate-600 bg-slate-50 hover:bg-slate-100 transition-colors"
                        >
                            {isOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* 4. Mobile Navigation Menu Overlay */}
            {isOpen && (
                <div className="lg:hidden absolute top-20 left-0 w-full bg-white border-b border-slate-200 p-4 space-y-2 shadow-2xl animate-in fade-in slide-in-from-top-2 duration-300">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.name}
                            to={item.path}
                            onClick={() => setIsOpen(false)}
                            className={({ isActive }) => `
                                flex items-center gap-4 px-5 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-colors
                                ${isActive ? 'bg-red-600 text-white' : 'text-slate-600 bg-slate-50 hover:bg-slate-100'}
                            `}
                        >
                            {item.icon}
                            {item.name}
                        </NavLink>
                    ))}
                    <div className="pt-4 border-t border-slate-100 mt-4 space-y-3">
                         <div className="flex items-center gap-3 px-5 py-2">
                            <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center text-white text-[10px] font-bold">
                                AM
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xs font-black text-slate-900 uppercase">Ascah Moraa</span>
                                <span className="text-[9px] text-purple-600 font-bold uppercase">Super Admin</span>
                            </div>
                        </div>
                        <Logout className="w-full justify-center h-14 rounded-2xl font-black uppercase text-[11px] tracking-widest bg-red-50 text-red-600 border border-red-100" />
                    </div>
                </div>
            )}
        </nav>
    );
};

export default NavbarA;