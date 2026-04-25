import React from 'react';
import { Shield, Activity, HelpCircle, FileText, MapPin } from 'lucide-react';

const AdminFooter: React.FC = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="w-full bg-white border-t border-gray-200 py-6 px-8 mt-auto">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
                
                {/* Brand & Location Section */}
                <div className="flex flex-col items-center md:items-start">
                    <div className="flex items-center gap-2 text-red-600 font-bold mb-1">
                        <Shield size={18} />
                        <span>Drug-Revive Admin</span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-500 text-xs">
                        <MapPin size={12} />
                        <span>Nakuru Hub, Kenya</span>
                    </div>
                </div>

                {/* Status Indicator Section */}
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                        <div className="relative flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                        </div>
                        <span className="text-xs font-medium text-gray-600 uppercase tracking-tighter">System: Operational</span>
                    </div>
                    <div className="h-4 w-[1px] bg-gray-300 hidden md:block"></div>
                    <div className="flex items-center gap-2 text-gray-600 hover:text-red-600 cursor-pointer transition-colors">
                        <Activity size={16} />
                        <span className="text-xs font-medium">Server Logs</span>
                    </div>
                </div>

                {/* Quick Links Section */}
                <div className="flex items-center gap-4 text-gray-500 text-xs font-semibold uppercase">
                    <a href="#" className="hover:text-red-500 flex items-center gap-1 transition-colors">
                        <FileText size={14} /> Documentation
                    </a>
                    <a href="#" className="hover:text-red-500 flex items-center gap-1 transition-colors">
                        <HelpCircle size={14} /> Support
                    </a>
                </div>
            </div>

            {/* Bottom Copyright Bar */}
            <div className="max-w-7xl mx-auto border-t border-gray-100 mt-6 pt-4 flex flex-col sm:flex-row justify-between text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                <p>&copy; {currentYear} Drug-Revive. Built by Ascah Moraa Kepha.</p>
                <p className="mt-2 sm:mt-0">TREN Stack v1.0.4 • Millennium Fellowship Standard</p>
            </div>
        </footer>
    );
};

export default AdminFooter;