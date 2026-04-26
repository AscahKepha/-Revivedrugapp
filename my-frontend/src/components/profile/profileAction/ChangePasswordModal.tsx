import { FaTimes, FaLock } from "react-icons/fa";
import { SaveIcon } from "lucide-react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { toast } from "react-hot-toast"; // Unified with main.tsx
import { userApi } from "../../../features/api/userApi";

interface ChangePasswordFormValues {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

interface Props {
  userId: number;
  onClose: () => void;
}

export default function ChangePasswordModal({ userId, onClose }: Props) {
  // 1. Initialize useForm with strict validation and live feedback
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<ChangePasswordFormValues>({
    mode: "onChange",
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: ""
    }
  });

  const [updateUser, { isLoading }] = userApi.useUpdateUserMutation();

  const onSubmit: SubmitHandler<ChangePasswordFormValues> = async (data) => {
    // Use react-hot-toast loading state
    const toastId = toast.loading("Securing your account...");

    try {
      // Using the generic update mutation for password reset
      await updateUser({
        userId,
        password: data.newPassword
      } as any).unwrap();

      toast.success("Security credentials updated!", { id: toastId });
      reset();
      onClose();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update password", { id: toastId });
    }
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
      {/* Backdrop with blur for that high-end 'Vault' feel */}
      <div
        className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl p-8 border border-slate-100 animate-in zoom-in-95 duration-200">

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-8 right-8 text-slate-300 hover:text-rose-500 transition-colors p-2"
        >
          <FaTimes size={20} />
        </button>

        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="p-4 bg-emerald-50 rounded-2xl text-emerald-600 shadow-sm">
            <FaLock size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-800 tracking-tight">Security Update</h2>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Drug-Revive Vault</p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Current Password Field */}
          <div>
            <label className="block text-[10px] font-black text-slate-500 mb-2 ml-1 uppercase tracking-wider">Current Password</label>
            <input
              type="password"
              {...register('currentPassword', { required: 'Verification required' })}
              className="w-full px-5 py-3.5 rounded-2xl border border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all outline-none text-slate-900 font-medium bg-slate-50/30"
              placeholder="••••••••"
            />
            {errors.currentPassword && <p className="text-rose-500 text-[10px] mt-2 ml-1 font-bold">{errors.currentPassword.message}</p>}
          </div>

          <div className="py-2 flex items-center gap-2">
            <div className="h-px bg-slate-100 flex-1"></div>
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-200"></div>
            <div className="h-px bg-slate-100 flex-1"></div>
          </div>

          {/* New Password Field */}
          <div>
            <label className="block text-[10px] font-black text-slate-500 mb-2 ml-1 uppercase tracking-wider">New Password</label>
            <input
              type="password"
              {...register('newPassword', {
                required: 'New password is required',
                minLength: { value: 6, message: 'Minimum 6 characters' }
              })}
              className="w-full px-5 py-3.5 rounded-2xl border border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all outline-none text-slate-900 font-medium bg-slate-50/30"
              placeholder="Min. 6 characters"
            />
            {errors.newPassword && <p className="text-rose-500 text-[10px] mt-2 ml-1 font-bold">{errors.newPassword.message}</p>}
          </div>

          {/* Confirm Password Field */}
          <div>
            <label className="block text-[10px] font-black text-slate-500 mb-2 ml-1 uppercase tracking-wider">Confirm Password</label>
            <input
              type="password"
              {...register('confirmNewPassword', {
                required: 'Please confirm password',
                validate: (val) => val === watch('newPassword') || 'Passwords do not match'
              })}
              className="w-full px-5 py-3.5 rounded-2xl border border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all outline-none text-slate-900 font-medium bg-slate-50/30"
              placeholder="Match new password"
            />
            {errors.confirmNewPassword && <p className="text-rose-500 text-[10px] mt-2 ml-1 font-bold">{errors.confirmNewPassword.message}</p>}
          </div>

          {/* Action Buttons */}
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
              className="flex-[1.5] py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-2xl transition-all shadow-xl shadow-emerald-100 disabled:opacity-50 flex items-center justify-center gap-2 active:scale-95"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Securing...</span>
                </div>
              ) : (
                <>
                  <SaveIcon size={20} />
                  <span>Update Password</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}