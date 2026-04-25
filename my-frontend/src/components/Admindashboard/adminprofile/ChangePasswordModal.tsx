import { FaTimes, FaLock } from "react-icons/fa";
import { SaveIcon } from "lucide-react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { toast } from "sonner";
import { userApi } from "../../../features/api/userApi";

interface ChangePasswordFormValues {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

type Props = {
  userId: number;
  onClose: () => void;
};

const ChangePasswordModal: React.FC<Props> = ({ userId, onClose }) => {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<ChangePasswordFormValues>();

  const [changePassword] = userApi.useChangePasswordMutation();

  const onSubmit: SubmitHandler<ChangePasswordFormValues> = async (data) => {
    const toastId = toast.loading("Updating security credentials...");
    try {
      const res = await changePassword({ 
        userId, 
        currentPassword: data.currentPassword, 
        newPassword: data.newPassword 
      }).unwrap();
      
      toast.success(res.message || "Password updated successfully", { id: toastId });
      reset();
      onClose();
    } catch (error: any) {
      toast.error(error?.data?.message || "Verification failed. Check your current password.", { id: toastId });
    }
  };

  return (
    <div className="modal modal-open bg-slate-900/60 backdrop-blur-sm">
      <div className="modal-box bg-white rounded-3xl border border-teal-50 shadow-2xl p-8 max-w-md">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-teal-100 rounded-2xl text-teal-600">
            <FaLock size={20} />
          </div>
          <h2 className="text-2xl font-black text-teal-900 tracking-tight">Security Update</h2>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Current Password */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1.5 ml-1">Current Password</label>
            <input 
              type="password" 
              {...register('currentPassword', { required: 'Please enter your current password' })} 
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 transition-all outline-none text-teal-900" 
              placeholder="••••••••"
            />
            {errors.currentPassword && <p className="text-red-500 text-xs mt-1 ml-1">{errors.currentPassword.message}</p>}
          </div>

          {/* New Password */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1.5 ml-1">New Password</label>
            <input 
              type="password" 
              {...register('newPassword', { 
                required: 'A new password is required', 
                minLength: { value: 6, message: 'Must be at least 6 characters' } 
              })} 
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 transition-all outline-none text-teal-900" 
              placeholder="Min. 6 characters"
            />
            {errors.newPassword && <p className="text-red-500 text-xs mt-1 ml-1">{errors.newPassword.message}</p>}
          </div>

          {/* Confirm New Password */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1.5 ml-1">Confirm New Password</label>
            <input 
              type="password" 
              {...register('confirmNewPassword', {
                required: 'Please confirm your new password',
                validate: (val) => val === watch('newPassword') || 'The passwords do not match'
              })} 
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 transition-all outline-none text-teal-900" 
              placeholder="Re-type new password"
            />
            {errors.confirmNewPassword && <p className="text-red-500 text-xs mt-1 ml-1">{errors.confirmNewPassword.message}</p>}
          </div>

          <div className="flex gap-3 pt-4">
            <button 
              type="button" 
              onClick={onClose} 
              className="flex-1 py-3 px-4 rounded-xl border border-gray-200 text-gray-600 font-bold hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
            >
              <FaTimes /> Cancel
            </button>
            <button 
              type="submit" 
              className="flex-1 py-3 px-4 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold transition-all shadow-lg shadow-teal-200 flex items-center justify-center gap-2"
            >
              <SaveIcon size={18} /> Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePasswordModal;