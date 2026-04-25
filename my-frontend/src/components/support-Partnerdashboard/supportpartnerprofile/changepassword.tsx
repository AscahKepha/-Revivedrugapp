import React from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { toast } from "sonner";
import { KeyRound, ShieldCheck } from "lucide-react";

// Import your custom UI components
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../../ui/dialog";
import { Input } from "../../ui/input";
import { Button } from "../../ui/button";
import { userApi } from "../../../features/api/userApi";

interface ChangePasswordFormValues {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

type Props = {
  userId: number;
  isOpen: boolean; // Changed to match Dialog logic
  onClose: () => void;
};

const ChangePasswordModal: React.FC<Props> = ({ userId, isOpen, onClose }) => {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ChangePasswordFormValues>();

  const [changePassword] = userApi.useChangePasswordMutation();

  const onSubmit: SubmitHandler<ChangePasswordFormValues> = async (data) => {
    const toastId = toast.loading("Updating security credentials...");
    try {
      await changePassword({ 
        userId, 
        currentPassword: data.currentPassword, 
        newPassword: data.newPassword 
      }).unwrap();
      
      toast.success("Password updated successfully", { id: toastId });
      reset();
      onClose();
    } catch (error: any) {
      toast.error(error?.data?.message || "Verification failed", { id: toastId });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2 text-emerald-600 mb-1">
            <ShieldCheck size={20} />
            <span className="text-xs font-black uppercase tracking-widest">Security Protocol</span>
          </div>
          <DialogTitle>Change Password</DialogTitle>
          <DialogDescription>
            Support Partners must maintain strong security to protect patient data.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
          {/* Current Password */}
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase text-gray-500 ml-1">Current Password</label>
            <Input 
              type="password" 
              variant="support"
              placeholder="••••••••"
              error={!!errors.currentPassword}
              {...register('currentPassword', { required: 'Please enter your current password' })} 
            />
            {errors.currentPassword && <p className="text-red-500 text-[10px] font-bold ml-1 uppercase">{errors.currentPassword.message}</p>}
          </div>

          {/* New Password */}
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase text-gray-500 ml-1">New Password</label>
            <Input 
              type="password" 
              variant="support"
              placeholder="••••••••"
              error={!!errors.newPassword}
              {...register('newPassword', { 
                required: 'New password required', 
                minLength: { value: 8, message: 'Minimum 8 characters' } 
              })} 
            />
            {errors.newPassword && <p className="text-red-500 text-[10px] font-bold ml-1 uppercase">{errors.newPassword.message}</p>}
          </div>

          {/* Confirm Password */}
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase text-gray-500 ml-1">Verify New Password</label>
            <Input 
              type="password" 
              variant="support"
              placeholder="••••••••"
              error={!!errors.confirmNewPassword}
              {...register('confirmNewPassword', {
                required: 'Please confirm your password',
                validate: (val) => val === watch('newPassword') || 'Passwords do not match'
              })} 
            />
            {errors.confirmNewPassword && <p className="text-red-500 text-[10px] font-bold ml-1 uppercase">{errors.confirmNewPassword.message}</p>}
          </div>

          <div className="flex gap-3 pt-4">
            <Button 
              type="button" 
              variant="ghost" 
              className="flex-1" 
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              variant="support" 
              className="flex-1 shadow-emerald-200 shadow-lg"
              disabled={isSubmitting}
            >
              <KeyRound size={16} className="mr-2" />
              {isSubmitting ? "Updating..." : "Update"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ChangePasswordModal;