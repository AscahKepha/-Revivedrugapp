import React from 'react';
import { useSelector } from 'react-redux';
import { 
    Shield, HeartHandshake, MapPin, Activity, 
    FileText, LifeBuoy, ShieldCheck 
} from 'lucide-react';
import type { RootState } from '../../app/store';

const UnifiedFooter: React.FC = () => {
    const { userType } = useSelector((state: RootState) => state.auth);
    const isAdmin = userType === 'admin';
    const currentYear = new Date().getFullYear();

    // Theme logic to match your UnifiedLayout
    const theme = {
        primary: isAdmin ? 'text-red-600' : 'text-emerald-700',
        iconBg: isAdmin ? 'bg-red-600' : 'bg-emerald-600',
        hover: isAdmin ? 'hover:text-red-500' : 'hover:text-emerald-600',
        border: 'border-slate-200'
    };

    return (
        <footer className="w-full bg-white border-t border-slate-200 pt-12 pb-6 px-4 md:px-8 mt-auto">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
                    
                    {/* Brand & Identity */}
                    <div className="md:col-span-1">
                        <div className="flex items-center gap-2 mb-4">
                            <div className={`${theme.iconBg} p-1.5 rounded-lg shadow-sm`}>
                                {isAdmin ? <Shield className="text-white" size={18} /> : <HeartHandshake className="text-white" size={18} />}
                            </div>
                            <span className="text-lg font-black tracking-tighter text-slate-900 uppercase">
                                Drug-Revive <span className={theme.primary}>{isAdmin ? 'Admin' : 'Guardian'}</span>
                            </span>
                        </div>
                        <p className="text-slate-500 text-[11px] leading-relaxed font-medium mb-4">
                            {isAdmin 
                                ? "System oversight and global analytics for the Drug-Revive behavioral health recovery platform."
                                : "Bridging the gap between patients and specialized support networks through AI-augmented digital companionship."}
                        </p>
                        <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                            <MapPin size={12} />
                            <span>Nakuru Hub, Kenya</span>
                        </div>
                    </div>

                    {/* Resources & Compliance */}
                    <div>
                        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-6">Platform</h4>
                        <ul className="space-y-3">
                            <FooterLink theme={theme} icon={<FileText size={14} />} label="System Documentation" />
                            <FooterLink theme={theme} icon={<LifeBuoy size={14} />} label={isAdmin ? "Developer Portal" : "Counseling Guide"} />
                            <FooterLink theme={theme} icon={<ShieldCheck size={14} />} label="Privacy Protocol" />
                        </ul>
                    </div>

                    {/* System Status - Logic Shared */}
                    <div>
                        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-6">Live Status</h4>
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100">
                                <div className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                                </div>
                                <span className="text-[10px] font-black text-slate-600 uppercase tracking-tight">System Operational</span>
                            </div>
                            <div className={`flex items-center gap-2 ${theme.hover} cursor-pointer transition-colors`}>
                                <Activity size={14} className="text-slate-400" />
                                <span className="text-[10px] font-bold uppercase">Real-time Metrics</span>
                            </div>
                        </div>
                    </div>

                    {/* Certification / Fellowship */}
                    <div className="bg-slate-900 p-6 rounded-3xl text-white shadow-xl shadow-slate-200">
                        <h4 className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">Academic Standard</h4>
                        <p className="text-[10px] text-slate-300 font-medium leading-relaxed mb-4">
                            Built in alignment with Millennium Fellowship standards for social impact and digital health.
                        </p>
                        <div className="flex items-center gap-2 text-[9px] font-black bg-white/10 w-fit px-3 py-1.5 rounded-lg border border-white/5">
                            <ShieldCheck size={12} className="text-emerald-400" />
                            SECURE ACCESS V1.0.4
                        </div>
                    </div>
                </div>

                {/* Bottom Copyright Bar */}
                <div className="pt-8 border-t border-slate-100 flex flex-col sm:flex-row justify-between text-[10px] text-slate-400 font-bold uppercase tracking-[0.15em]">
                    <p>&copy; {currentYear} Drug-Revive. Engineered by Ascah Moraa Kepha.</p>
                    <p className="mt-2 sm:mt-0">Laikipia University • BSCS Final Project</p>
                </div>
            </div>
        </footer>
    );
};

// Reusable Link Component
const FooterLink = ({ icon, label, theme }: { icon: React.ReactNode; label: string; theme: any }) => (
    <li className={`flex items-center gap-2 text-slate-500 ${theme.hover} cursor-pointer transition-all group`}>
        <span className="text-slate-300 group-hover:scale-110 transition-transform">{icon}</span>
        <span className="text-[11px] font-bold">{label}</span>
    </li>
);

export default UnifiedFooter;