import React from 'react';
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaLock, FaShieldAlt } from 'react-icons/fa';

type Props = {
  userDetails: any;
  onPasswordClick: () => void;
};

const ProfileDetails: React.FC<Props> = ({ userDetails, onPasswordClick }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
    {/* Personal Information Section */}
    <div className="bg-white rounded-3xl p-8 border border-teal-50 shadow-sm transition-hover hover:shadow-md">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2.5 bg-teal-100 rounded-xl text-teal-600">
          <FaUser size={18} />
        </div>
        <h3 className="text-xl font-black text-teal-900 tracking-tight">Identity Details</h3>
      </div>
      
      <div className="space-y-4">
        <div className="flex flex-col">
          <span className="text-[10px] uppercase font-black text-gray-400 tracking-widest mb-1">Full Name</span>
          <p className="text-teal-950 font-bold">{userDetails?.userName || 'Not provided'}</p> 
        </div>

        <div className="flex flex-col border-t border-slate-50 pt-3">
          <span className="text-[10px] uppercase font-black text-gray-400 tracking-widest mb-1">Email Address</span>
          <div className="flex items-center gap-2 text-slate-600">
            <FaEnvelope size={12} className="text-teal-400" />
            <p className="font-medium">{userDetails?.email}</p>
          </div>
        </div>

        <div className="flex flex-col border-t border-slate-50 pt-3">
          <span className="text-[10px] uppercase font-black text-gray-400 tracking-widest mb-1">Contact Phone</span>
          <div className="flex items-center gap-2 text-slate-600">
            <FaPhone size={12} className="text-teal-400" />
            <p className="font-medium">{userDetails?.contactPhone || 'No phone linked'}</p>
          </div>
        </div>

        <div className="flex flex-col border-t border-slate-50 pt-3">
          <span className="text-[10px] uppercase font-black text-gray-400 tracking-widest mb-1">Residential Office</span>
          <div className="flex items-center gap-2 text-slate-600">
            <FaMapMarkerAlt size={12} className="text-teal-400" />
            <p className="font-medium">{userDetails?.address || 'Nakuru, Kenya'}</p>
          </div>
        </div>
      </div>
    </div>

    {/* Security Settings Section */}
    <div className="bg-slate-900 rounded-3xl p-8 shadow-xl shadow-teal-900/10 relative overflow-hidden">
      {/* Decorative background element */}
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl"></div>
      
      <div className="flex items-center gap-3 mb-6 relative z-10">
        <div className="p-2.5 bg-emerald-500/20 rounded-xl text-emerald-400">
          <FaShieldAlt size={18} />
        </div>
        <h3 className="text-xl font-black text-white tracking-tight">Security & Privacy</h3>
      </div>
      
      <div className="space-y-6 relative z-10">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
          <div className="flex justify-between items-center mb-2">
            <span className="text-[10px] uppercase font-black text-teal-300 tracking-widest">Account Password</span>
            <span className="text-xs text-emerald-400 font-bold bg-emerald-400/10 px-2 py-0.5 rounded">Active</span>
          </div>
          <div className="flex items-center gap-2 text-white/40 mb-4">
            <FaLock size={12} />
            <p className="tracking-[0.3em] font-black">••••••••••••</p>
          </div>
          
          <button 
            onClick={onPasswordClick} 
            className="w-full py-3 px-4 bg-emerald-500 hover:bg-emerald-400 text-teal-950 font-black rounded-xl transition-all shadow-lg shadow-emerald-500/20 active:scale-95 flex items-center justify-center gap-2"
          >
            Update Security Credentials
          </button>
        </div>

        <div className="pt-2">
          <p className="text-[11px] text-teal-100/50 leading-relaxed italic">
            Keep your admin credentials secure. We recommend updating your password every 90 days to maintain platform integrity.
          </p>
        </div>
      </div>
    </div>
  </div>
);

export default ProfileDetails;