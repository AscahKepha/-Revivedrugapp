import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState, useMemo } from 'react';
import { FaCamera, FaEdit, FaUserCircle, FaCheckCircle } from 'react-icons/fa';
import { userApi } from '../../features/api/userApi';
import { type RootState } from '../../app/types';
import EditProfileModal from './profileAction/EditProfileModal';
import ChangePasswordModal from './profileAction/ChangePasswordModal';
import ProfileDetails from './profileAction/ProfieDetails';
import { toast } from 'react-hot-toast'; 
import axios from 'axios';

const UserProfilePage = () => {
    console.log("[UserProfilePage] Render Cycle Initiated");
    
    const navigate = useNavigate();
    const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
    const userId = user?.userId;

    // Fetch user details
    const { 
        data: userDetails, 
        isLoading, 
        isError, 
        refetch 
    } = userApi.useGetUserByIdQuery(userId as number, { skip: !userId });

    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
    const [imageProfile, setImageProfile] = useState<string | undefined>(undefined);

    // Logging data state to check for 'null' before modal mount
    useEffect(() => {
        console.log("[UserProfilePage] Data Sync Check:", { 
            userId, 
            hasUserDetails: !!userDetails, 
            isModalOpen: isProfileModalOpen 
        });
    }, [userId, userDetails, isProfileModalOpen]);

    const displayProfilePicture = useMemo(() => {
        return imageProfile || userDetails?.profile_picture || user?.profile_picture || 
        `https://ui-avatars.com/api/?name=${encodeURIComponent(userDetails?.userName || user?.userName || 'User')}&background=10b981&color=fff&size=128`;
    }, [imageProfile, userDetails, user]);

    useEffect(() => {
        if (!isAuthenticated) {
            console.warn("[UserProfilePage] Unauthorized access, redirecting...");
            navigate('/login');
        }
    }, [isAuthenticated, navigate]);

    const handleFileImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !userId) return;

        if (!file.type.startsWith('image/')) {
            toast.error("Please upload a valid image file.");
            return;
        }

        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", "user-images");

        const loadingToast = toast.loading("Uploading to Cloudinary...");
        
        try {
            const res = await axios.post(`https://api.cloudinary.com/v1_1/dksycyruq/image/upload`, formData);
            const url = res.data.secure_url;
            setImageProfile(url);
            toast.success("Profile picture updated!", { id: loadingToast });
            refetch();
        } catch (error) {
            console.error("[UserProfilePage] Upload Error:", error);
            toast.error("Upload failed. Please check your connection.", { id: loadingToast });
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-900">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin"></div>
                    <p className="text-emerald-500 font-black tracking-widest uppercase text-xs">Accessing Vault...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-900 text-white py-10 px-5">
            <div className="max-w-4xl mx-auto">
                {isError && (
                    <div className="bg-rose-500/10 border border-rose-500/50 text-rose-500 p-4 rounded-2xl mb-6 text-center font-bold text-sm">
                        Unable to synchronize profile data. Please refresh.
                    </div>
                )}

                {userDetails && (
                    <div className="bg-slate-800/50 rounded-[3rem] shadow-2xl overflow-hidden border border-slate-700/50 backdrop-blur-md">
                        <div className="h-40 bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-400 opacity-90 relative">
                             <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
                        </div>
                        
                        <div className="px-8 pb-10">
                            <div className="relative flex flex-col md:flex-row items-end -mt-16 gap-6 mb-10">
                                <div className="relative group self-center md:self-auto">
                                    <img
                                        src={displayProfilePicture}
                                        alt="profile"
                                        className="w-40 h-40 rounded-[2.5rem] object-cover border-8 border-slate-800 shadow-2xl bg-slate-700 transition-transform duration-500 group-hover:scale-[1.02]"
                                    />
                                    <label className="absolute -bottom-2 -right-2 bg-emerald-500 hover:bg-emerald-400 p-3.5 rounded-2xl cursor-pointer shadow-xl transition-all hover:scale-110 active:scale-90">
                                        <FaCamera className="text-slate-950 text-lg" />
                                        <input type="file" className="hidden" onChange={handleFileImage} accept="image/*" />
                                    </label>
                                </div>

                                <div className="flex-1 pb-2 text-center md:text-left">
                                    <div className="flex items-center justify-center md:justify-start gap-3">
                                        <h2 className="text-4xl font-black tracking-tight text-white">{userDetails.userName}</h2>
                                        <FaCheckCircle className="text-emerald-400 text-2xl drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]" />
                                    </div>
                                    <p className="text-emerald-400 font-black uppercase text-[10px] tracking-[0.3em] mt-2 bg-emerald-400/10 w-fit px-3 py-1 rounded-lg mx-auto md:mx-0">
                                        {userDetails.userType?.replace('_', ' ')} • Verified Member
                                    </p>
                                </div>

                                <button 
                                    className="flex items-center gap-2 bg-white/5 hover:bg-white/10 text-white px-6 py-3 rounded-2xl font-black text-sm transition-all border border-white/10 backdrop-blur-md active:scale-95"
                                    onClick={() => {
                                        console.log("[UserProfilePage] Opening Edit Modal...");
                                        setIsProfileModalOpen(true);
                                    }}
                                >
                                    <FaEdit className="text-emerald-400" /> Edit Profile
                                </button>
                            </div>

                            <div className="grid grid-cols-1 gap-6">
                                <div className="bg-slate-900/40 p-1 rounded-[2.5rem] border border-white/5">
                                    <div className="p-8">
                                        <div className="flex items-center gap-3 mb-8">
                                            <FaUserCircle className="text-3xl text-emerald-500" />
                                            <h3 className="text-2xl font-black text-white tracking-tight">Account Overview</h3>
                                        </div>
                                        
                                        <ProfileDetails 
                                            userDetails={userDetails ?? null} 
                                            onPasswordClick={() => setIsPasswordModalOpen(true)} 
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Modal Components */}
            {isProfileModalOpen && userId && (
                <EditProfileModal
                    userId={userId as number}
                    userDetails={userDetails ?? null}
                    onClose={() => {
                        console.log("[UserProfilePage] Closing Edit Modal...");
                        setIsProfileModalOpen(false);
                        refetch();
                    }}
                />
            )}

            {isPasswordModalOpen && userId && (
                <ChangePasswordModal
                    userId={userId as number}
                    onClose={() => setIsPasswordModalOpen(false)}
                />
            )}
        </div>
    );
};

export default UserProfilePage;