import { useState } from 'react';
import { NavLink, Outlet, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { 
  LayoutDashboard, 
  Users, 
  Settings, 
  ShieldCheck, 
  BarChart3, 
  FileText,
  Activity,
  Menu,
  Shield,
  Swords,
  History
} from 'lucide-react';

import type { RootState } from '../app/store';
import { NavbarH } from '../components/Home/Navbarhome'; // Integrated your main navbar
import FooterA from '../components/Admindashboard/footerA';
import Logout from '../components/Logout';

const navItems = [
  { to: '/admin/hub', icon: <LayoutDashboard size={20} />, label: 'Hub Overview' },
  { to: '/war-room', icon: <Swords size={20} />, label: 'War Room' },
  { to: '/admin/patients', icon: <Users size={20} />, label: 'Patient Management' },
  { to: '/admin/history', icon: <History size={20} />, label: 'System History' },
  { to: '/admin/charts', icon: <BarChart3 size={20} />, label: 'Analytics' },
  { to: '/admin/audit-logs', icon: <FileText size={20} />, label: 'Audit Logs' },
  { to: '/admin/security', icon: <ShieldCheck size={20} />, label: 'Security Center' },
  { to: '/admin/settings', icon: <Settings size={20} />, label: 'Global Settings' },
];

const AdminLayout: React.FC = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  
  // Connect to Redux Auth State
  const { user, userType } = useSelector((state: RootState) => state.auth);

  // Generate initials for the avatar (e.g., "John Doe" -> "JD")
  const getInitials = (name: string) => {
    return name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'AD';
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      {/* 1. Persistent Top Navbar */}
      <NavbarH />

      <div className="flex flex-1 overflow-hidden">
        {/* Mobile Sidebar Overlay */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-slate-900/50 z-40 md:hidden backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* 2. Sidebar Navigation */}
        <aside className={`
          fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-slate-200 
          transform transition-transform duration-300 ease-in-out flex flex-col
          md:relative md:translate-x-0
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}>
          {/* Sidebar Header */}
          <div className="p-8">
            <Link to="/admin/hub" className="flex items-center gap-3 group">
              <div className="bg-slate-900 p-2 rounded-xl shadow-lg shadow-slate-100 group-hover:bg-red-600 transition-colors duration-300">
                <Shield className="text-white" size={24} />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-black tracking-tighter text-slate-900 uppercase leading-none">
                  ADMIN<span className="text-red-600">CONTROL</span>
                </span>
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1">
                  {userType || 'System Oversight'}
                </span>
              </div>
            </Link>
          </div>

          {/* Dynamic User Profile Card */}
          <div className="px-8 pb-6 mb-6 border-b border-slate-100">
            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl">
              <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-white font-black text-xs shadow-inner">
                {getInitials(user?.userName || 'Admin')}
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-black text-slate-900 uppercase tracking-tight truncate w-32">
                  {user?.userName || 'Loading...'}
                </span>
                <div className="flex items-center gap-1">
                  <Activity size={10} className="text-purple-500" />
                  <span className="text-[9px] text-purple-600 font-bold uppercase tracking-widest">
                    {userType?.replace('_', ' ') || 'Super Admin'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Navigation */}
          <nav className="flex-1 overflow-y-auto px-4 custom-scrollbar">
            <ul className="space-y-1.5">
              {navItems.map((item) => (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    onClick={() => setSidebarOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-4 px-5 py-3.5 rounded-2xl transition-all text-[11px] font-black uppercase tracking-widest ${
                        isActive
                          ? 'text-red-600 bg-red-50 border border-red-100 shadow-sm'
                          : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                      }`
                    }
                  >
                    <span className="opacity-80">{item.icon}</span>
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          {/* Logout Section */}
          <div className="p-6 mt-auto border-t border-slate-100">
            <Logout 
              variant="ghost" 
              className="w-full justify-start px-5 py-4 h-auto rounded-2xl font-black uppercase text-[11px] tracking-widest text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors" 
            />
          </div>
        </aside>

        {/* 3. Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          {/* Mobile Sidebar Toggle (Hidden on Desktop) */}
          <header className="md:hidden flex items-center justify-between p-4 bg-white border-b border-slate-200">
            <div className="flex items-center gap-2">
              <Shield className="text-red-600" size={20} />
              <span className="font-black text-xs uppercase tracking-tighter">AdminControl</span>
            </div>
            <button 
              onClick={() => setSidebarOpen(true)}
              className="p-2 text-slate-600 bg-slate-50 rounded-lg"
            >
              <Menu size={20} />
            </button>
          </header>

          {/* Scrollable Page Content */}
          <main className="flex-1 overflow-y-auto bg-slate-50/50">
            <div className="max-w-7xl mx-auto px-4 md:px-10 py-8 min-h-[calc(100vh-12rem)]">
              <Outlet />
            </div>
            
            <div className="px-4 md:px-10 pb-10">
              <FooterA />
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

export default AdminLayout;