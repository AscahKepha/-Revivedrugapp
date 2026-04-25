import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Shield, 
  LayoutDashboard, 
  Swords, 
  Users, 
  History, 
  BarChart3, 
  Menu, 
  X 
} from 'lucide-react';
import Logout from '../../components/Logout';

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
        <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    
                    {/* 1. Logo Section */}
                    <div className="flex items-center">
                        <div className="flex-shrink-0 flex items-center gap-2">
                            <div className="bg-red-600 p-1.5 rounded-lg shadow-sm">
                                <Shield className="text-white" size={20} />
                            </div>
                            <span className="text-xl font-black tracking-tighter text-gray-900">
                                DRUG<span className="text-red-600">-REVIVE</span>
                            </span>
                        </div>

                        {/* Desktop Navigation Links */}
                        <div className="hidden md:ml-8 md:flex md:space-x-4">
                            {navItems.map((item) => (
                                <NavLink
                                    key={item.name}
                                    to={item.path}
                                    className={({ isActive }) => `
                                        flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-bold transition-all
                                        ${isActive 
                                            ? 'bg-red-50 text-red-600 shadow-sm' 
                                            : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'}
                                    `}
                                >
                                    {item.icon}
                                    {item.name}
                                </NavLink>
                            ))}
                        </div>
                    </div>

                    {/* 2. Desktop Profile & Logout Section */}
                    <div className="hidden md:flex items-center gap-4">
                        <div className="flex flex-col items-end mr-2">
                            <span className="text-xs font-black text-gray-900 uppercase">Ascah Moraa</span>
                            <span className="text-[10px] text-purple-600 font-bold uppercase tracking-widest">
                                Super Admin
                            </span>
                        </div>
                        
                        {/* Specialized Logout Component */}
                        <Logout />
                    </div>

                    {/* 3. Mobile Menu Toggle */}
                    <div className="flex items-center md:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="text-gray-500 hover:text-gray-700 focus:outline-none"
                        >
                            {isOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* 4. Mobile Navigation Menu Overlay */}
            {isOpen && (
                <div className="md:hidden bg-white border-t border-gray-100 px-2 pt-2 pb-3 space-y-1 shadow-lg">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.name}
                            to={item.path}
                            onClick={() => setIsOpen(false)}
                            className={({ isActive }) => `
                                flex items-center gap-3 px-4 py-3 rounded-xl text-base font-bold
                                ${isActive ? 'bg-red-50 text-red-600' : 'text-gray-500 hover:bg-gray-50'}
                            `}
                        >
                            {item.icon}
                            {item.name}
                        </NavLink>
                    ))}
                    <div className="pt-4 border-t border-gray-100 mt-2 px-2">
                        <Logout className="w-full justify-center" />
                    </div>
                </div>
            )}
        </nav>
    );
};

export default NavbarA;