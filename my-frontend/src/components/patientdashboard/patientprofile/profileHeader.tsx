import React from 'react';
import { Camera, UserCog, Mail, ShieldCheck } from 'lucide-react'; // Using Lucide for consistency
import { Button } from '../../ui/button';

interface ProfileHeaderProps {
  displayProfilePicture: string;
  // Updated to include userName to match your current UserProfile type
  userDetails: { userName: string; email: string }; 
  handleFileImage: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onEditClick: () => void;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ 
  displayProfilePicture, 
  userDetails, 
  handleFileImage, 
  onEditClick 
}) => {
  return (
    <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 p-8 md:p-10 mb-8">
      <div className="flex flex-col md:flex-row items-center justify-between gap-8">
        
        <div className="flex flex-col md:flex-row items-center gap-8 text-center md:text-left">
          {/* Profile Image with modern Squircle shape */}
          <div className="relative group">
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-[2rem] overflow-hidden border-8 border-emerald-50 shadow-inner">
              <img
                src={displayProfilePicture}
                alt="Identity"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
            </div>
            <label className="absolute -bottom-2 -right-2 bg-emerald-600 hover:bg-emerald-700 text-white p-3 rounded-2xl cursor-pointer shadow-xl transition-all active:scale-90 ring-4 ring-white">
              <Camera size={20} />
              <input type="file" className="hidden" onChange={handleFileImage} />
            </label>
          </div>

          {/* Name and Identity Details */}
          <div>
            <div className="flex items-center gap-3 justify-center md:justify-start mb-2">
              <h2 className="text-4xl font-black text-gray-900 tracking-tighter">
                {userDetails.userName}
              </h2>
              <ShieldCheck className="text-emerald-500" size={28} />
            </div>
            
            <div className="flex flex-col gap-1">
              <p className="flex items-center gap-2 text-gray-500 font-medium justify-center md:justify-start text-sm">
                <Mail size={14} className="text-emerald-600" /> {userDetails.email}
              </p>
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full w-fit mx-auto md:mx-0 mt-2">
                Patient Member
              </span>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <Button 
          onClick={onEditClick}
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-black uppercase text-xs tracking-widest px-8 h-14 rounded-2xl shadow-emerald-100 shadow-2xl transition-all active:scale-95"
        >
          <UserCog size={18} className="mr-3" /> Edit Profile
        </Button>
      </div>
    </div>
  );
};

export default ProfileHeader;