import { FaTimes, FaUserEdit } from "react-icons/fa";
import { SaveIcon } from "lucide-react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { toast } from "sonner";
import { userApi } from "../../../features/api/userApi";

type Props = {
  userId: number;
  userDetails: any;
  onClose: () => void;
};

interface ProfileFormValues {
  userName: string;
  email: string;
  contactPhone: string;
}

const EditProfileModal: React.FC<Props> = ({ userId, userDetails, onClose }) => {
  const { register, handleSubmit, formState: { errors } } = useForm<ProfileFormValues>({
    defaultValues: {
      userName: userDetails?.userName || "",
      email: userDetails?.email || "",
      contactPhone: userDetails?.contactPhone || "",
    },
  });

  const [updateUserProfile] = userApi.useUpdateUserMutation(); // Using the standard update hook

  const onSubmit: SubmitHandler<ProfileFormValues> = async (data) => {
    const toastId = toast.loading("Saving changes to your profile...");
    try {
      // Sending data to backend
      const res = await updateUserProfile({ userId, ...data }).unwrap();
      toast.success(res.message || "Profile updated successfully!", { id: toastId });
      onClose();
    } catch (error: any) {
      toast.error(error?.data?.message || "Update failed. Please try again.", { id: toastId });
    }
  };

  return (
    <div className="modal modal-open bg-slate-900/60 backdrop-blur-sm">
      <div className="modal-box bg-white rounded-[2rem] border border-teal-50 shadow-2xl p-8 max-w-lg">
        
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 bg-emerald-100 rounded-2xl text-emerald-600">
            <FaUserEdit size={22} />
          </div>
          <h2 className="text-2xl font-black text-teal-900 tracking-tight">Edit Admin Profile</h2>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* User Name Field */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">Full Name / Username</label>
            <input 
              {...register('userName', { required: 'Full name is required' })} 
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all outline-none text-teal-900 font-medium" 
            />
            {errors.userName && <p className="text-red-500 text-xs mt-1 ml-1">{errors.userName.message}</p>}
          </div>

          {/* Contact Phone Field */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">Contact Phone</label>
            <input 
              {...register('contactPhone')} 
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all outline-none text-teal-900 font-medium"
              placeholder="+254..." 
            />
          </div>

          {/* Email Field (Disabled to prevent auth issues) */}
          <div>
            <label className="block text-sm font-bold text-gray-400 mb-2 ml-1">Email Address (Read-only)</label>
            <input 
              type="email" 
              disabled 
              {...register('email')} 
              className="w-full px-4 py-3 rounded-xl border border-gray-100 bg-gray-50 text-gray-400 cursor-not-allowed font-medium" 
            />
            <p className="text-[10px] text-gray-400 mt-2 ml-1 italic">Contact system support to change your registered email.</p>
          </div>

          {/* Actions */}
          <div className="flex gap-4 pt-4">
            <button 
              type="button" 
              className="flex-1 py-3 px-4 rounded-xl border border-gray-200 text-gray-600 font-bold hover:bg-gray-50 transition-all flex items-center justify-center gap-2" 
              onClick={onClose}
            >
              <FaTimes /> Cancel
            </button>
            <button 
              type="submit" 
              className="flex-1 py-3 px-4 rounded-xl bg-teal-800 hover:bg-black text-white font-bold transition-all shadow-lg shadow-teal-900/20 flex items-center justify-center gap-2"
            >
              <SaveIcon size={18} /> Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfileModal;