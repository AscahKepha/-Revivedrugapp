import React from 'react';
import { User, ShieldCheck, Mail, Phone, MapPin, Briefcase, HeartHandshake, Key, Info } from 'lucide-react';
import { Button } from '../../ui/button'; // Adjusted to your common path

// 1. Interface strictly matching your Drizzle Schema
interface SupportPartnerDetails {
  partnerId: number;
  userId: number;
  partnerName: string;
  contactInfo: string;
  relationship: string;
  createdAt?: string;
  updatedAt?: string;
}

type Props = {
  userDetails: SupportPartnerDetails;
  onPasswordClick: () => void;
};

const ProfileDetails: React.FC<Props> = ({ userDetails, onPasswordClick }) => (
  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-white p-2">
    
    {/* Section 1: Core Identity */}
    <div className="lg:col-span-2 bg-gradient-to-br from-emerald-600 to-teal-700 rounded-3xl p-8 shadow-xl">
      <div className="flex items-center gap-3 mb-8">
        <HeartHandshake size={32} className="text-emerald-200" />
        <h3 className="text-2xl font-black uppercase tracking-tight">Partner Credentials</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
        <DetailItem 
          icon={<User size={18}/>} 
          label="Legal Name" 
          value={userDetails.partnerName} 
        />
        <DetailItem 
          icon={<Briefcase size={18}/>} 
          label="Role / Relationship" 
          value={userDetails.relationship} 
        />
        <DetailItem 
          icon={<Phone size={18}/>} 
          label="Contact Channel" 
          value={userDetails.contactInfo} 
        />
        <DetailItem 
          icon={<MapPin size={18}/>} 
          label="Service Region" 
          value="Nakuru, Kenya" // Hardcoded for now as it's not in schema
        />
        
        {/* Status Indicator - Fallback since isAvailable isn't in schema yet */}
        <div className="flex items-center gap-4 p-4 bg-white/10 rounded-2xl border border-white/5">
          <div className="h-3 w-3 rounded-full bg-green-400 animate-pulse" />
          <div>
            <p className="text-[10px] uppercase font-black text-emerald-200 tracking-widest">Network Status</p>
            <p className="font-bold text-sm text-white">Active & Verified</p>
          </div>
        </div>
      </div>
      
      <div className="mt-8 p-5 bg-black/10 rounded-2xl border border-white/5">
        <div className="flex items-center gap-2 mb-2">
          <Info size={14} className="text-emerald-200" />
          <p className="text-[10px] font-black uppercase text-emerald-200 tracking-wider">System Log</p>
        </div>
        <p className="text-xs text-emerald-50 opacity-80 leading-relaxed">
          Partner record established via Drug-Revive protocol. Authorized to provide 
          intervention support and monitor patient cravings. 
        </p>
      </div>
    </div>

    {/* Section 2: Security & Quick Actions */}
    <div className="bg-gray-900 rounded-3xl p-8 shadow-xl flex flex-col justify-between border border-emerald-500/10">
      <div>
        <div className="flex items-center gap-3 mb-6">
          <ShieldCheck size={32} className="text-emerald-500" />
          <h3 className="text-2xl font-black uppercase tracking-tight">Security</h3>
        </div>
        
        <div className="space-y-4">
          <p className="text-gray-400 text-xs leading-relaxed">
            Support Partners handle sensitive recovery data. Ensure your security 
            credentials are updated regularly.
          </p>
          
          <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
            <div className="flex items-center gap-3">
              <Key size={18} className="text-gray-500" />
              <span className="text-sm font-bold">Password</span>
            </div>
            <span className="text-emerald-500 tracking-tighter">••••••••</span>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <Button 
          variant="outline" 
          onClick={onPasswordClick} 
          className="w-full h-12 rounded-2xl border-emerald-500/50 text-emerald-500 hover:bg-emerald-500 hover:text-white transition-all font-bold uppercase text-xs tracking-widest"
        >
          Reset Credentials
        </Button>
      </div>
    </div>
  </div>
);

// Helper component for clean mapping
const DetailItem = ({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) => (
  <div className="flex items-start gap-4">
    <div className="mt-1 text-emerald-300 bg-white/5 p-2 rounded-lg">{icon}</div>
    <div>
      <p className="text-[10px] uppercase font-black text-emerald-200 tracking-widest mb-0.5">{label}</p>
      <p className="font-bold text-base text-white">{value}</p>
    </div>
  </div>
);

export default ProfileDetails;