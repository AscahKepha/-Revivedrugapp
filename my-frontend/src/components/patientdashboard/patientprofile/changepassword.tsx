import React from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { X, Lock, ShieldCheck, Save } from 'lucide-react';
import { Button } from '../../ui/button';
import { toast } from 'sonner';

interface ChangePasswordFormValues {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: number;
  changePassword: any; // Using the mutation from your userApi
}

const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({
  isOpen,
  onClose,
  userId,
  changePassword,
}) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
    reset
  } = useForm<ChangePasswordFormValues>();

  const onSubmit: SubmitHandler<ChangePasswordFormValues> = async (data) => {
    try {
      await changePassword({
        userId,
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      }).unwrap();
      
      toast.success("Security credentials updated");
      reset();
      onClose();
    } catch (err) {
      toast.error("Failed to update password. Check your current password.");
      console.error("Auth Error:", err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex justify-center items-center z-[100] p-4">
      <div className="bg-white rounded-[2.5rem] shadow-2xl max-w-md w-full overflow-hidden border border-gray-100 animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-gray-50 px-8 py-6 border-b border-gray-100 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-black text-gray-900 tracking-tighter uppercase">Security</h2>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600">Update Access Protocol</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-xl transition-colors">
            <X size={20} className="text-gray-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-5">
          
          {/* Current Password */}
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Current Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-3.5 text-gray-400" size={18} />
              <input
                type="password"
                {...register('currentPassword', { required: "Required" })}
                className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all font-bold"
                placeholder="••••••••"
              />
            </div>
            {errors.currentPassword && <p className="text-[10px] text-red-500 font-bold ml-1 uppercase tracking-tighter">{errors.currentPassword.message}</p>}
          </div>

          <div className="h-[1px] bg-gray-100 my-2" />

          {/* New Password */}
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">New Password</label>
            <div className="relative">
              <ShieldCheck className="absolute left-4 top-3.5 text-emerald-500" size={18} />
              <input
                type="password"
                {...register('newPassword', { 
                  required: "Required", 
                  minLength: { value: 6, message: "Min 6 characters" } 
                })}
                className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all font-bold"
                placeholder="••••••••"
              />
            </div>
            {errors.newPassword && <p className="text-[10px] text-red-500 font-bold ml-1 uppercase tracking-tighter">{errors.newPassword.message}</p>}
          </div>

          {/* Confirm Password */}
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Confirm New Password</label>
            <div className="relative">
              <ShieldCheck className="absolute left-4 top-3.5 text-emerald-500" size={18} />
              <input
                type="password"
                {...register('confirmNewPassword', {
                  required: "Required",
                  validate: val => val === watch('newPassword') || "Passwords don't match",
                })}
                className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all font-bold"
                placeholder="••••••••"
              />
            </div>
            {errors.confirmNewPassword && <p className="text-[10px] text-red-500 font-bold ml-1 uppercase tracking-tighter">{errors.confirmNewPassword.message}</p>}
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose} 
              className="flex-1 h-14 rounded-2xl font-black uppercase text-xs tracking-widest border-gray-100 text-gray-400 hover:bg-gray-50"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="flex-1 h-14 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl shadow-emerald-100 active:scale-95 transition-all"
            >
              <Save size={18} className="mr-2" /> {isSubmitting ? 'Syncing...' : 'Update'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePasswordModal;