import { useState } from 'react';
import { NavLink, Outlet, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
    LayoutDashboard, Users, Settings, ShieldCheck, BarChart3,
    FileText, Activity, Menu, Shield, Swords, History,
    HeartHandshake, UserCog, ChevronRight, Network
} from 'lucide-react';

import type { RootState } from '../app/store';
import { NavbarH } from '../components/Home/Navbarhome';
import UnifiedFooter from '../components/shared/footer';
import Logout from '../components/Logout';

const UnifiedDashboardLayout: React.FC = () => {
    const [isSidebarOpen, setSidebarOpen] = useState(false);

    // Connect to Redux Auth State
    const { user, userType } = useSelector((state: RootState) => state.auth);

    /**
     * 1. Define Role-Based Navigation
     * Paths here are updated to match the 'adminRoutes' and 'supportPartnerRoutes' exactly.
     */
    const adminNav = [
        { to: '/admin/hub', icon: <LayoutDashboard size={20} />, label: 'Hub Overview' },
        { to: '/admin/patients', icon: <Users size={20} />, label: 'Patient Management' },
        { to: '/admin/partners', icon: <HeartHandshake size={20} />, label: 'All Partners' },
        { to: '/admin/network', icon: <Network size={20} />, label: 'Support Network' },
        { to: '/admin/checkin-history', icon: <History size={20} />, label: 'Check-in History' },
        { to: '/admin/logs', icon: <FileText size={20} />, label: 'Action Logs' },
        // { to: '/admin/charts', icon: <BarChart3 size={20} />, label: 'Analytics' },
        { to: '/admin/profile', icon: <UserCog size={20} />, label: 'Admin Profile' },
    ];

    const partnerNav = [
        { to: '/partner/dashboard', icon: <Activity size={20} />, label: 'Partner Overview' },
        { to: '/partner/my-patients', icon: <Users size={20} />, label: 'My Patients' },
        { to: '/partner/action-center', icon: <ShieldCheck size={20} />, label: 'Action Center' },
        { to: '/partner/patient-history', icon: <History size={20} />, label: 'Recovery Logs' },
        { to: '/partner/profile', icon: <UserCog size={20} />, label: 'Account Settings' },
    ];

    const isAdmin = userType === 'admin';
    const currentNav = isAdmin ? adminNav : partnerNav;

    // Theme configuration based on role
    const theme = {
        primary: isAdmin ? 'text-red-600' : 'text-emerald-700',
        bgLight: isAdmin ? 'bg-red-50' : 'bg-emerald-50/80',
        border: isAdmin ? 'border-red-100' : 'border-emerald-100',
        iconBg: isAdmin ? 'bg-slate-900' : 'bg-emerald-700',
        brandText: isAdmin ? 'ADMIN' : 'GUARDIAN',
        brandSub: isAdmin ? 'CONTROL' : 'LINK'
    };

    const getInitials = (name: string) => {
        return name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'US';
    };

    return (
        <div className="flex flex-col h-screen overflow-hidden">
            <NavbarH />

            <div className="flex flex-1 overflow-hidden">
                {/* Mobile Sidebar Overlay */}
                {isSidebarOpen && (
                    <div
                        className="fixed inset-0 bg-slate-900/50 z-40 md:hidden backdrop-blur-sm"
                        onClick={() => setSidebarOpen(false)}
                    />
                )}

                {/* Unified Sidebar */}
                <aside className={`
                    fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-slate-200 
                    transform transition-transform duration-300 ease-in-out flex flex-col
                    md:relative md:translate-x-0
                    ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
                `}>

                    {/* Branding Area */}
                    <div className="p-8">
                        <Link to={isAdmin ? "/admin/hub" : "/partner/dashboard"} className="flex items-center gap-3 group">
                            <div className={`${theme.iconBg} p-2 rounded-xl shadow-lg transition-all duration-300 group-hover:scale-110`}>
                                {isAdmin ? <Shield className="text-white" size={24} /> : <HeartHandshake className="text-white" size={24} />}
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xl font-black tracking-tighter text-slate-900 uppercase leading-none">
                                    {theme.brandText}<span className={theme.primary}>{theme.brandSub}</span>
                                </span>
                                <span className={`text-[9px] font-black uppercase tracking-[0.2em] mt-1 ${isAdmin ? 'text-slate-400' : 'text-emerald-600'}`}>
                                    {userType?.replace('_', ' ') || 'System Access'}
                                </span>
                            </div>
                        </Link>
                    </div>

                    {/* Shared Profile Section */}
                    <div className="px-8 pb-6 mb-6 border-b border-slate-100">
                        <Link
                            to={isAdmin ? "/admin/profile" : "/partner/profile"}
                            className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-colors group"
                        >
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white font-black text-xs shadow-inner ${isAdmin ? 'bg-slate-900' : 'bg-emerald-600'}`}>
                                {user?.profile_picture ? (
                                    <img src={user.profile_picture} alt="Avatar" className="w-full h-full object-cover rounded-xl" />
                                ) : getInitials(user?.userName || 'User')}
                            </div>
                            <div className="flex-1 min-w-0">
                                <span className="text-xs font-black text-slate-900 uppercase tracking-tight truncate block">
                                    {user?.userName || 'Loading...'}
                                </span>
                                <div className="flex items-center gap-1">
                                    <Activity size={10} className={isAdmin ? "text-red-500" : "text-emerald-500"} />
                                    <span className={`text-[9px] font-bold uppercase tracking-widest ${isAdmin ? 'text-red-600' : 'text-emerald-600'}`}>
                                        {isAdmin ? 'System Root' : 'Verified Partner'}
                                    </span>
                                </div>
                            </div>
                            <ChevronRight size={14} className="text-slate-300 group-hover:translate-x-1 transition-all" />
                        </Link>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 overflow-y-auto px-4 space-y-1.5 custom-scrollbar">
                        {currentNav.map((item) => (
                            <NavLink
                                key={item.to}
                                to={item.to}
                                onClick={() => setSidebarOpen(false)}
                                className={({ isActive }) =>
                                    `flex items-center gap-4 px-5 py-3.5 rounded-2xl transition-all text-[11px] font-black uppercase tracking-widest ${isActive
                                        ? `${theme.primary} ${theme.bgLight} border ${theme.border} shadow-sm`
                                        : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                                    }`
                                }
                            >
                                <span className="opacity-80">{item.icon}</span>
                                {item.label}
                            </NavLink>
                        ))}
                    </nav>

                    {/* Logout */}
                    <div className="p-6 mt-auto border-t border-slate-100">
                        <Logout
                            variant="ghost"
                            className="w-full justify-start px-5 py-4 h-auto rounded-2xl font-black uppercase text-[11px] tracking-widest text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                        />
                    </div>
                </aside>

                {/* Main Content Area */}
                <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                    <header className="md:hidden flex items-center justify-between p-4 bg-white border-b border-slate-200">
                        <div className="flex items-center gap-2">
                            <Shield className={theme.primary} size={20} />
                            <span className="font-black text-xs uppercase tracking-tighter">{theme.brandText}{theme.brandSub}</span>
                        </div>
                        <button onClick={() => setSidebarOpen(true)} className="p-2 text-slate-600 bg-slate-50 rounded-lg">
                            <Menu size={20} />
                        </button>
                    </header>

                    <main className="flex-1 overflow-y-auto bg-slate-50/50">
                        <div className="max-w-7xl mx-auto px-4 md:px-10 py-8 min-h-[calc(100vh-12rem)]">
                            <Outlet />
                        </div>
                        <div className="px-4 md:px-10 pb-10">
                            <UnifiedFooter />
                        </div>
                    </main>
                </div>
            </div>

            <style>{`
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
            `}</style>
        </div>
    );
};

export default UnifiedDashboardLayout;