import { FaUserEdit } from "react-icons/fa";
import { SaveIcon } from "lucide-react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useEffect } from "react";
import { toast } from "react-hot-toast"; // Unified with main.tsx
import { userApi } from "../../../features/api/userApi";
import { type UserProfile } from "../../../types/auth";

interface ProfileFormValues {
  userName: string;
  email: string;
  contactPhone: string;
  address: string;
}

interface EditProfileModalProps {
  userId: number;
  userDetails: UserProfile | null;
  onClose: () => void;
}

// Plain function export for better Vite HMR performance
export default function EditProfileModal({ userId, userDetails, onClose }: EditProfileModalProps) {
  
  // Initialize useForm with current user values
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<ProfileFormValues>({
    defaultValues: {
      userName: userDetails?.userName || "",
      email: userDetails?.email || "",
      contactPhone: userDetails?.contactPhone || "",
      address: userDetails?.address || "",
    },
  });

  const [updateUserProfile, { isLoading }] = userApi.useUpdateUserMutation();

  // Keep form in sync if userDetails updates in the background
  useEffect(() => {
    if (userDetails) {
      reset({
        userName: userDetails.userName,
        email: userDetails.email,
        contactPhone: userDetails.contactPhone,
        address: userDetails.address || "",
      });
    }
  }, [userDetails, reset]);

  const onSubmit: SubmitHandler<ProfileFormValues> = async (data) => {
    // Using react-hot-toast loading state
    const toastId = toast.loading("Saving changes to your identity...");
    try {
      await updateUserProfile({ userId, ...data } as any).unwrap();
      toast.success("Profile synchronized successfully!", { id: toastId });
      onClose();
    } catch (error: any) {
      toast.error(error?.data?.message || "Update failed. Please try again.", { id: toastId });
    }
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
      {/* Backdrop with premium blur */}
      <div
        className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative bg-white rounded-[2.5rem] shadow-2xl p-8 max-w-lg w-full border border-emerald-50 animate-in zoom-in-95 duration-200">

        {/* Header Section */}
        <div className="flex items-center gap-4 mb-8">
          <div className="p-4 bg-emerald-50 rounded-2xl text-emerald-600 shadow-sm">
            <FaUserEdit size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-800 tracking-tight">Edit Your Profile</h2>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Drug-Revive Identity</p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Full Name Field */}
          <div className="space-y-2">
            <label className="block text-[10px] font-black text-slate-500 ml-1 uppercase tracking-wider">Full Name</label>
            <input
              {...register('userName', { required: 'Full name is required' })}
              className="w-full px-5 py-3.5 rounded-2xl border border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all outline-none text-slate-900 font-medium bg-slate-50/30"
              placeholder="Your full name"
            />
            {errors.userName && <p className="text-rose-500 text-[10px] font-bold ml-1 mt-1">{errors.userName.message}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Phone Number Field */}
            <div className="space-y-2">
              <label className="block text-[10px] font-black text-slate-500 ml-1 uppercase tracking-wider">Phone Number</label>
              <input
                {...register('contactPhone', { required: 'Phone number is required' })}
                className="w-full px-5 py-3.5 rounded-2xl border border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all outline-none text-slate-900 font-medium bg-slate-50/30"
                placeholder="+254..."
              />
              {errors.contactPhone && <p className="text-rose-500 text-[10px] font-bold ml-1 mt-1">{errors.contactPhone.message}</p>}
            </div>

            {/* Location Field */}
            <div className="space-y-2">
              <label className="block text-[10px] font-black text-slate-500 ml-1 uppercase tracking-wider">Location</label>
              <input
                {...register('address')}
                className="w-full px-5 py-3.5 rounded-2xl border border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all outline-none text-slate-900 font-medium bg-slate-50/30"
                placeholder="City, Country"
              />
            </div>
          </div>

          {/* Email Address (Locked for security) */}
          <div className="pt-2">
            <label className="block text-[10px] font-black text-slate-300 ml-1 uppercase tracking-wider">Email Address (Primary)</label>
            <div className="w-full px-5 py-3.5 rounded-2xl border border-slate-100 bg-slate-50 text-slate-400 font-medium cursor-not-allowed select-none mt-2 flex items-center justify-between">
              <span>{userDetails?.email}</span>
              <span className="text-[9px] bg-slate-200 text-slate-500 px-2 py-0.5 rounded-md font-black">LOCKED</span>
            </div>
          </div>

          {/* Action Footer */}
          <div className="flex gap-4 pt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-4 text-slate-500 font-bold hover:bg-slate-50 rounded-2xl transition-all border border-transparent hover:border-slate-100"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-[1.5] py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-2xl transition-all shadow-xl shadow-emerald-100 flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Syncing...</span>
                </div>
              ) : (
                <>
                  <SaveIcon size={20} />
                  <span>Update Profile</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}