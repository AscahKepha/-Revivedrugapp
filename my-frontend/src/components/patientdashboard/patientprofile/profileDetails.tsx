import React from 'react';
import { User, Mail, MapPin, Phone, Lock, HeartHandshake, Info } from 'lucide-react';
import { Button } from '../../ui/button';

interface ProfileDetailsProps {
  // Using 'any' here temporarily to handle the transition between Patient and Partner data
  userDetails: any; 
  onPasswordClick: () => void;
}

const ProfileDetails: React.FC<ProfileDetailsProps> = ({ userDetails, onPasswordClick }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2">
      
      {/* Column 1: Identity & Contact */}
      <div className="p-8 md:p-10 space-y-8 border-b lg:border-b-0 lg:border-r border-gray-100">
        <div>
          <h3 className="text-xs font-black uppercase tracking-[0.2em] text-emerald-600 mb-6 flex items-center gap-2">
            <Info size={14} /> Profile Information
          </h3>
          
          <div className="space-y-6">
            {/* Name - Handles both 'userName' (Patient) and 'partnerName' (Partner) */}
            <DetailItem 
              icon={<User size={18} />} 
              label="Full Name" 
              value={userDetails?.partnerName || userDetails?.userName || "Not Set"} 
            />

            {/* Email - Usually from the joined userTable */}
            <DetailItem 
              icon={<Mail size={18} />} 
              label="Email Address" 
              value={userDetails?.email || "No email provided"} 
            />

            {/* Contact/Phone - Handles 'contactInfo' (Partner) or 'contactPhone' (Patient) */}
            <DetailItem 
              icon={<Phone size={18} />} 
              label="Contact Number" 
              value={userDetails?.contactInfo || userDetails?.contactPhone || "Not Provided"} 
            />

            {/* Relationship - Only shows if it's a Support Partner */}
            {userDetails?.relationship && (
              <DetailItem 
                icon={<HeartHandshake size={18} />} 
                label="Assigned Role" 
                value={userDetails.relationship} 
              />
            )}
          </div>
        </div>
      </div>

      {/* Column 2: Security & Platform Status */}
      <div className="p-8 md:p-10 bg-gray-50/50 space-y-8">
        <div>
          <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 mb-6 flex items-center gap-2">
            <Lock size={14} /> Security & Access
          </h3>
          
          <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-1">Account Password</p>
                <p className="font-bold text-gray-900">••••••••••••</p>
              </div>
              <Button 
                onClick={onPasswordClick}
                variant="outline"
                className="border-emerald-100 text-emerald-700 hover:bg-emerald-50 font-black uppercase text-[10px] tracking-widest rounded-xl"
              >
                Update
              </Button>
            </div>
          </div>

          <div className="mt-8">
             <p className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em] mb-4">Account Status</p>
             <div className="flex items-center gap-2 text-emerald-600 font-bold text-sm">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Active & Verified
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* Reusable Row Component for cleanliness */
const DetailItem = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) => (
  <div className="flex items-start gap-4">
    <div className="mt-1 text-emerald-600 bg-emerald-50 p-2 rounded-xl">
      {icon}
    </div>
    <div>
      <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest leading-none mb-1">
        {label}
      </p>
      <p className="text-sm font-bold text-gray-900 leading-tight">
        {value}
      </p>
    </div>
  </div>
);

export default ProfileDetails;