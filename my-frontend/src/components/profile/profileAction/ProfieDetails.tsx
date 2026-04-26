import { memo } from 'react';
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaLock, FaShieldAlt, FaFire } from 'react-icons/fa';
import { type UserProfile } from '../../../types/auth';

type Props = {
  userDetails: UserProfile | null;
  onPasswordClick: () => void;
};

const ProfileDetails = ({ userDetails, onPasswordClick }: Props) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Identity Card: Clean, light design for personal info */}
      <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 bg-emerald-50 rounded-2xl text-emerald-600">
            <FaUser size={20} />
          </div>
          <h3 className="text-xl font-black text-slate-800 tracking-tight">Identity Details</h3>
        </div>

        <div className="space-y-6">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-black text-slate-300 tracking-widest mb-1.5">Full Name</span>
            <p className="text-slate-900 font-bold text-lg">{userDetails?.userName || 'Not provided'}</p>
          </div>

          <div className="flex flex-col border-t border-slate-50 pt-5">
            <span className="text-[10px] uppercase font-black text-slate-300 tracking-widest mb-1.5">Email Address</span>
            <div className="flex items-center gap-2.5 text-slate-600">
              <FaEnvelope size={14} className="text-emerald-500" />
              <p className="font-bold">{userDetails?.email}</p>
            </div>
          </div>

          <div className="flex flex-col border-t border-slate-50 pt-5">
            <span className="text-[10px] uppercase font-black text-slate-300 tracking-widest mb-1.5">Contact Phone</span>
            <div className="flex items-center gap-2.5 text-slate-600">
              <FaPhone size={14} className="text-emerald-500" />
              <p className="font-bold">{userDetails?.contactPhone || 'No phone linked'}</p>
            </div>
          </div>

          <div className="flex flex-col border-t border-slate-50 pt-5">
            <span className="text-[10px] uppercase font-black text-slate-300 tracking-widest mb-1.5">Location / Address</span>
            <div className="flex items-center gap-2.5 text-slate-600">
              <FaMapMarkerAlt size={14} className="text-emerald-500" />
              <p className="font-bold">{userDetails?.address || 'Not specified'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Action Column: Engagement and Security */}
      <div className="flex flex-col gap-6">

        {/* Engagement Card: Vibrant gradient for motivation */}
        <div className="bg-gradient-to-br from-orange-500 to-rose-600 rounded-[2.5rem] p-8 text-white shadow-xl shadow-orange-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] opacity-80 mb-1">Current Streak</p>
              <h4 className="text-5xl font-black">{userDetails?.streak_days || 0} Days</h4>
            </div>
            <div className="p-4 bg-white/10 rounded-3xl backdrop-blur-md">
              <FaFire size={42} className="animate-pulse text-orange-200" />
            </div>
          </div>
          <div className="mt-6 pt-6 border-t border-white/10 flex justify-between items-center">
            <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Personal Best</p>
            <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-bold">{userDetails?.longest_streak || 0} Days</span>
          </div>
        </div>

        {/* Security Vault: Dark, modern design for protection */}
        <div className="bg-slate-900 rounded-[2.5rem] p-8 shadow-2xl shadow-emerald-900/20 relative overflow-hidden flex-1">
          {/* Subtle Glow Effect */}
          <div className="absolute -top-12 -right-12 w-48 h-48 bg-emerald-500/10 rounded-full blur-[60px]"></div>

          <div className="flex items-center gap-4 mb-8 relative z-10">
            <div className="p-3 bg-emerald-500/10 rounded-2xl text-emerald-400">
              <FaShieldAlt size={22} />
            </div>
            <h3 className="text-xl font-black text-white tracking-tight">Security Vault</h3>
          </div>

          <div className="space-y-6 relative z-10">
            <div className="bg-white/5 border border-white/5 rounded-[2rem] p-6 backdrop-blur-sm">
              <div className="flex justify-between items-center mb-3">
                <span className="text-[10px] uppercase font-black text-emerald-400 tracking-widest">Master Password</span>
                <span className="text-[9px] text-emerald-400 font-black bg-emerald-400/10 px-2 py-0.5 rounded-md border border-emerald-400/20 uppercase">Encrypted</span>
              </div>
              <div className="flex items-center gap-3 text-white/20 mb-6">
                <FaLock size={14} />
                <p className="tracking-[0.4em] font-black text-sm">••••••••••••</p>
              </div>

              <button
                onClick={onPasswordClick}
                className="w-full py-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-2xl transition-all shadow-lg shadow-emerald-500/10 transform active:scale-[0.98] flex items-center justify-center gap-3"
              >
                Update Security Credentials
              </button>
            </div>

            <p className="text-[11px] text-slate-500 leading-relaxed font-medium px-2">
              Keep your credentials secure. Regular updates help maintain the integrity of your recovery data within the <span className="text-emerald-400/80">Drug-Revive</span> ecosystem.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Memo prevents unnecessary re-renders when the parent state updates 
// (like during profile picture uploads)
export default memo(ProfileDetails);