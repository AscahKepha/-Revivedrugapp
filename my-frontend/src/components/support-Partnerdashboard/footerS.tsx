import React from 'react';
import { HeartHandshake, ShieldCheck, LifeBuoy, FileText, ExternalLink } from 'lucide-react';

const FooterS = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-100 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          
          {/* Brand Column */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-emerald-600 p-1.5 rounded-lg shadow-sm">
                <HeartHandshake className="text-white" size={18} />
              </div>
              <span className="text-lg font-black tracking-tighter text-gray-900">
                DRUG-REVIVE
              </span>
            </div>
            <p className="text-gray-500 text-xs leading-relaxed font-medium">
              A specialized digital intervention platform designed to bridge the gap between patients and support networks.
            </p>
            <div className="mt-6 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 w-fit px-3 py-1.5 rounded-lg">
              <ShieldCheck size={12} />
              Data Encrypted
            </div>
          </div>

          {/* Partner Resources */}
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-6">Resources</h4>
            <ul className="space-y-4">
              <li><FooterLink icon={<LifeBuoy size={14} />} label="Support Center" /></li>
              <li><FooterLink icon={<FileText size={14} />} label="Counseling Guide" /></li>
              <li><FooterLink icon={<ExternalLink size={14} />} label="UoN ICT Portal" /></li>
            </ul>
          </div>

          {/* Legal / Protocol */}
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-6">Compliance</h4>
            <ul className="space-y-4">
              <li className="text-gray-500 text-xs font-bold hover:text-emerald-600 cursor-pointer transition-colors">Privacy Protocol</li>
              <li className="text-gray-500 text-xs font-bold hover:text-emerald-600 cursor-pointer transition-colors">Terms of Intervention</li>
              <li className="text-gray-500 text-xs font-bold hover:text-emerald-600 cursor-pointer transition-colors">Ethics Standards</li>
            </ul>
          </div>

          {/* Emergency Quick Contact */}
          <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100">
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-red-500 mb-3">Emergency</h4>
            <p className="text-[10px] text-gray-500 font-medium mb-4 leading-snug">
              If a patient is in immediate danger, follow the standard emergency procedure.
            </p>
            <button className="w-full bg-white border border-red-100 text-red-600 text-[10px] font-black uppercase py-2.5 rounded-xl hover:bg-red-50 transition-all">
              View Protocols
            </button>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-50 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
            &copy; {currentYear} Drug-Revive Digital Companion. All Rights Reserved.
          </p>
          <div className="flex items-center gap-6">
             <span className="text-[10px] font-black text-gray-400 hover:text-emerald-600 cursor-pointer transition-colors">V1.0.4-STABLE</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

// Helper Link Component
const FooterLink = ({ icon, label }: { icon: React.ReactNode; label: string }) => (
  <button className="flex items-center gap-2 text-gray-500 hover:text-emerald-600 transition-all group">
    <span className="text-gray-300 group-hover:text-emerald-500 transition-colors">{icon}</span>
    <span className="text-xs font-bold">{label}</span>
  </button>
);

export default FooterS;