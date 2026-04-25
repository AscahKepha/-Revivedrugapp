import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { User, ShieldCheck, Mail, Calendar, Settings, Camera, LogOut } from 'lucide-react';
import { userApi } from '../../features/api/userApi';
import { type RootState } from '../../app/types';
import { Button } from '../ui/button';
import EditProfileModal from './patientprofile/Editprofile';
import ChangePasswordModal from './patientprofile/changepassword';

const PatientProfile = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const userId = user?.userId;

  // 1. Fetch live user data
  const { data: userDetails, isLoading } = userApi.useGetUserByIdQuery(userId as number, { skip: !userId });
  
  // 2. Local State for Modals
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [isPassModalOpen, setPassModalOpen] = useState(false);

  // 3. API Mutations (assuming these exist in your userApi)
  const [updateUserProfile] = userApi.useUpdateUserMutation();
  const [changePassword] = userApi.useChangePasswordMutation();

  if (isLoading) return <div className="p-20 text-center font-black animate-pulse text-emerald-600">LOADING PROFILE...</div>;

  return (
    <div className="min-h-screen bg-gray-50/50 py-12 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header / Avatar Section */}
        <div className="bg-white rounded-[3rem] shadow-sm border border-gray-100 p-10 overflow-hidden relative">
          <div className="absolute top-0 right-0 p-8">
            <Button 
              variant="outline" 
              onClick={() => setEditModalOpen(true)}
              className="rounded-2xl border-gray-100 font-black uppercase text-[10px] tracking-widest hover:bg-emerald-50 hover:text-emerald-600 transition-all"
            >
              <Settings size={14} className="mr-2" /> Edit Profile
            </Button>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="relative group">
              <div className="w-32 h-32 rounded-[2.5rem] bg-emerald-100 flex items-center justify-center text-emerald-600 shadow-inner overflow-hidden border-4 border-white">
                {userDetails?.profile_picture ? (
                  <img src={userDetails.profile_picture} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <User size={48} />
                )}
              </div>
              <button className="absolute bottom-0 right-0 p-2 bg-gray-900 text-white rounded-xl shadow-lg hover:scale-110 transition-transform">
                <Camera size={14} />
              </button>
            </div>

            <div className="text-center md:text-left">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-600 mb-1">Authenticated Account</p>
              <h1 className="text-4xl font-black text-gray-900 tracking-tighter">
                {userDetails?.userName || "Accessing Identity..."}
              </h1>
              <div className="flex items-center gap-4 mt-3 justify-center md:justify-start">
                <span className="flex items-center gap-1.5 text-xs font-bold text-gray-500">
                  <Mail size={14} className="text-emerald-500" /> {userDetails?.email}
                </span>
                <span className="bg-gray-100 text-gray-600 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-tighter">
                  ID: {userDetails?.userId}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Account Security Sidebar */}
          <div className="space-y-6">
            <div className="bg-gray-900 rounded-[2.5rem] p-8 text-white shadow-xl">
              <ShieldCheck className="text-emerald-500 mb-4" size={32} />
              <h3 className="text-xl font-black uppercase tracking-tight mb-2">Security</h3>
              <p className="text-gray-400 text-[10px] font-bold leading-relaxed mb-6 uppercase tracking-wider">
                Manage your credentials and session security
              </p>
              <Button 
                onClick={() => setPassModalOpen(true)}
                className="w-full bg-white/10 hover:bg-white/20 text-white border border-white/10 h-14 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all"
              >
                Change Password
              </Button>
            </div>

            <Button variant="ghost" className="w-full h-14 rounded-2xl font-black uppercase text-[10px] tracking-widest text-red-500 hover:bg-red-50 hover:text-red-600">
              <LogOut size={16} className="mr-2" /> Sign Out
            </Button>
          </div>

          {/* Details Section */}
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white rounded-[2.5rem] border border-gray-100 p-8 shadow-sm">
               <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-6">Identity Breakdown</h3>
               
               <div className="space-y-6">
                 <DetailRow label="Username" value={userDetails?.userName} />
                 <DetailRow label="Email Address" value={userDetails?.email} />
                 <DetailRow label="Account Created" value={new Date(userDetails?.createdAt || Date.now()).toLocaleDateString()} />
               </div>
            </div>
          </div>
        </div>

        {/* Modals */}
        <EditProfileModal 
          isOpen={isEditModalOpen} 
          onClose={() => setEditModalOpen(false)} 
          userDetails={userDetails}
          userId={userId as number}
          updateUserProfile={updateUserProfile}
        />

        <ChangePasswordModal 
          isOpen={isPassModalOpen} 
          onClose={() => setPassModalOpen(false)} 
          userId={userId as number}
          changePassword={changePassword}
        />

      </div>
    </div>
  );
};

// Sub-component for clean rows
const DetailRow = ({ label, value }: { label: string, value?: string }) => (
  <div className="flex justify-between items-center border-b border-gray-50 pb-4">
    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{label}</span>
    <span className="text-sm font-black text-gray-900 tracking-tight">{value || "---"}</span>
  </div>
);

export default PatientProfile;