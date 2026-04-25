import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { useEffect, useState } from 'react';
import { Camera, UserCog, Mail, ShieldCheck, HeartHandshake } from 'lucide-react';
import { userApi } from '../../features/api/userApi';
import { type RootState } from '../../app/types';
import EditProfileModal from './supportpartnerprofile/Editprofile';
import ChangePasswordModal from './supportpartnerprofile/changepassword';
import ProfileDetails from './supportpartnerprofile/profiledetails';
import { Button } from '../ui/button';
import { toast } from 'sonner';
import axios from 'axios';

// This matches your Drizzle Schema perfectly
interface SupportPartnerDetails {
  partnerId: number;
  userId: number;
  partnerName: string;
  contactInfo: string;
  relationship: string;
  email: string;
  profile_picture?: string;
}

const PartnerProfile = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, userType } = useSelector((state: RootState) => state.auth);
  const userId = user?.userId;

  // FIX: Explicitly cast the query result to SupportPartnerDetails to clear TS errors
  const { data, isLoading, isError } = userApi.useGetUserByIdQuery(userId as number, { 
    skip: !userId 
  });
  
  // This line is the magic fix for your red underlines
  const userDetails = data as unknown as SupportPartnerDetails;

  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [imageProfile, setImageProfile] = useState<string | undefined>(undefined);

  const displayProfilePicture = imageProfile || userDetails?.profile_picture || 
    `https://ui-avatars.com/api/?name=${encodeURIComponent(userDetails?.partnerName || 'Partner')}&background=059669&color=fff&size=128`;

  useEffect(() => {
    if (!isAuthenticated) navigate('/login');
    else if (userType && userType !== 'support_partner') {
      navigate('/admin/hub'); 
    }
  }, [isAuthenticated, userType, navigate]);

  const handleFileImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "user-images");

    const toastId = toast.loading("Syncing profile picture...");
    try {
      const res = await axios.post(`https://api.cloudinary.com/v1_1/dksycyruq/image/upload`, formData);
      const url = res.data.secure_url;
      setImageProfile(url);
      toast.success("Identity image updated", { id: toastId });
    } catch (error) {
      toast.error("Upload failed", { id: toastId });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6">
      {isLoading && (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
        </div>
      )}
      
      {isError && (
        <div className="max-w-xl mx-auto p-8 bg-red-50 rounded-3xl border border-red-100 text-center">
           <p className="text-red-500 font-black uppercase tracking-widest text-sm">Protocol Error: Identity Sync Failed</p>
        </div>
      )}

      {userDetails && (
        <div className="max-w-5xl mx-auto space-y-8">
          
          <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 p-8 md:p-10">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              
              <div className="flex flex-col md:flex-row items-center gap-8 text-center md:text-left">
                <div className="relative group">
                  <div className="w-40 h-40 rounded-[2rem] overflow-hidden border-8 border-emerald-50 shadow-inner">
                    <img
                      src={displayProfilePicture}
                      alt="Partner Identity"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  </div>
                  <label className="absolute -bottom-2 -right-2 bg-emerald-600 hover:bg-emerald-700 text-white p-3 rounded-2xl cursor-pointer shadow-xl transition-all active:scale-90 ring-4 ring-white">
                    <Camera size={20} />
                    <input type="file" className="hidden" onChange={handleFileImage} />
                  </label>
                </div>

                <div>
                  <div className="flex items-center gap-3 justify-center md:justify-start mb-2">
                    <h2 className="text-4xl font-black text-gray-900 tracking-tighter">
                      {/* Uses partnerName from the casted userDetails */}
                      {userDetails.partnerName}
                    </h2>
                    <ShieldCheck className="text-emerald-500" size={28} />
                  </div>
                  
                  <div className="flex flex-col gap-3 mt-1">
                    <div className="flex items-center gap-2 text-gray-500 font-bold justify-center md:justify-start text-sm bg-gray-50 px-4 py-2 rounded-xl border border-gray-100">
                      <HeartHandshake size={16} className="text-emerald-600" />
                      {userDetails.relationship}
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-600 px-1 mx-auto md:mx-0">
                      Authorized Support Personnel
                    </span>
                  </div>
                </div>
              </div>

              <Button 
                onClick={() => setIsProfileModalOpen(true)}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-black uppercase text-xs tracking-widest px-8 h-14 rounded-2xl shadow-emerald-100 shadow-2xl transition-all active:scale-95"
              >
                <UserCog size={18} className="mr-3" /> Edit Profile
              </Button>
            </div>
          </div>

          <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
             <ProfileDetails 
                userDetails={userDetails} 
                onPasswordClick={() => setIsPasswordModalOpen(true)} 
             />
          </div>
        </div>
      )}

      {isProfileModalOpen && (
        <EditProfileModal
          userId={userId as number}
          userDetails={userDetails}
          isOpen={isProfileModalOpen}
          onClose={() => setIsProfileModalOpen(false)}
        />
      )}

      {isPasswordModalOpen && (
        <ChangePasswordModal
          userId={userId as number}
          isOpen={isPasswordModalOpen}
          onClose={() => setIsPasswordModalOpen(false)}
        />
      )}
    </div>
  );
};

export default PartnerProfile;