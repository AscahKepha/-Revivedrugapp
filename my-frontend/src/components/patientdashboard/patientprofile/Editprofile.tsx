import React from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { X, Save, User, Phone, Info } from 'lucide-react';
import { Button } from '../../ui/button';
import { toast } from 'sonner';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  userDetails: any; // Using any to handle mixed Patient/Partner fields
  userId: number;
  // Using the API mutation from your userApi
  updateUserProfile: any; 
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({
  isOpen,
  onClose,
  userDetails,
  userId,
  updateUserProfile,
}) => {
  // Determine if we are editing a Partner based on the existence of partnerName
  const isPartner = !!userDetails?.partnerName;

  const { register, handleSubmit, formState: { isSubmitting } } = useForm({
    defaultValues: {
      // Patient Field
      userName: userDetails?.userName || "",
      // Partner Fields
      partnerName: userDetails?.partnerName || "",
      contactInfo: userDetails?.contactInfo || "",
      relationship: userDetails?.relationship || "",
    }
  });

  const onSubmit: SubmitHandler<any> = async (data) => {
    try {
      // Filter out empty fields to avoid overwriting with nulls
      const payload = isPartner 
        ? { partnerName: data.partnerName, contactInfo: data.contactInfo, userId }
        : { userName: data.userName, userId };

      await updateUserProfile(payload).unwrap();
      toast.success("Profile updated successfully");
      onClose();
    } catch (err) {
      toast.error("Failed to update identity data");
      console.error("Update Error:", err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex justify-center items-center z-[100] p-4">
      <div className="bg-white rounded-[2.5rem] shadow-2xl max-w-lg w-full overflow-hidden border border-gray-100 animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-gray-50 px-8 py-6 border-b border-gray-100 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-black text-gray-900 tracking-tighter">EDIT IDENTITY</h2>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600">Update Platform Credentials</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-xl transition-colors">
            <X size={20} className="text-gray-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-6">
          
          {/* Section: Basic Info */}
          <div className="space-y-4">
            {isPartner ? (
              <>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Partner Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-3.5 text-gray-400" size={18} />
                    <input
                      type="text"
                      {...register('partnerName', { required: true })}
                      className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all font-bold text-gray-900"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Contact Info</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-3.5 text-gray-400" size={18} />
                    <input
                      type="text"
                      {...register('contactInfo', { required: true })}
                      className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all font-bold text-gray-900"
                    />
                  </div>
                </div>
              </>
            ) : (
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Username</label>
                <div className="relative">
                  <User className="absolute left-4 top-3.5 text-gray-400" size={18} />
                  <input
                    type="text"
                    {...register('userName', { required: true })}
                    className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all font-bold text-gray-900"
                  />
                </div>
              </div>
            )}

            <div className="p-4 bg-blue-50 rounded-2xl flex gap-3 items-start border border-blue-100">
              <Info className="text-blue-500 shrink-0" size={18} />
              <p className="text-[10px] leading-relaxed text-blue-700 font-bold uppercase tracking-tight">
                Email addresses are linked to your core authentication and cannot be changed here. Contact admin for security updates.
              </p>
            </div>
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
              <Save size={18} className="mr-2" /> {isSubmitting ? 'Saving...' : 'Confirm'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfileModal;