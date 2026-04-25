import React from "react";
import { useForm, useFieldArray, type SubmitHandler } from "react-hook-form";
import { toast } from "sonner";
import { Save, X, Plus, Trash2, UserCircle, CalendarClock } from "lucide-react";

// Custom UI Components
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../../ui/dialog";
import { Input } from "../../ui/input";
import { Button } from "../../ui/button";
import { userApi } from "../../../features/api/userApi";

interface AvailabilityItem {
  day: string;
  start: string;
  end: string;
}

interface ProfileFormValues {
  firstName: string;
  lastName: string;
  email: string;
  specialization?: string;
  contactPhone?: string;
  isAvailable: string; // Kept as string for the select component
  bio?: string;
  availability?: AvailabilityItem[];
}

type Props = {
  userId: number;
  userDetails: any;
  isOpen: boolean;
  onClose: () => void;
};

const EditProfileModal: React.FC<Props> = ({ userId, userDetails, isOpen, onClose }) => {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProfileFormValues>({
    defaultValues: {
      firstName: userDetails.firstName,
      lastName: userDetails.lastName,
      email: userDetails.email,
      specialization: userDetails.specialization,
      contactPhone: userDetails.contactPhone,
      isAvailable: String(userDetails.isAvailable),
      bio: userDetails.bio || "",
      availability: userDetails.availability || [{ day: "Monday", start: "09:00", end: "17:00" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "availability",
  });

  const [updateUserProfile] = userApi.useUpdateUserMutation();

  const onSubmit: SubmitHandler<ProfileFormValues> = async (data) => {
    const payload = {
      ...data,
      userId,
      isAvailable: data.isAvailable === "true",
      role: userDetails.role || "support_partner",
    };

    const toastId = toast.loading("Syncing profile changes...");
    try {
      const res = await updateUserProfile(payload).unwrap();
      toast.success("Partner profile synchronized", { id: toastId });
      onClose();
    } catch (error: any) {
      toast.error(error?.data?.error || "Update failed", { id: toastId });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2 text-emerald-600 mb-1">
            <UserCircle size={20} />
            <span className="text-xs font-black uppercase tracking-widest">Partner Identity</span>
          </div>
          <DialogTitle>Edit Partner Profile</DialogTitle>
          <DialogDescription>
            Update your professional details and availability for the Drug-Revive network.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 pt-2">
          {/* Section: Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-gray-500 ml-1">First Name</label>
              <Input variant="support" {...register("firstName", { required: "Required" })} error={!!errors.firstName} />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-gray-500 ml-1">Last Name</label>
              <Input variant="support" {...register("lastName", { required: "Required" })} error={!!errors.lastName} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Email (System Fixed)</label>
              <Input disabled {...register("email")} className="bg-gray-50 opacity-60" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-gray-500 ml-1">Phone Number</label>
              <Input variant="support" {...register("contactPhone")} placeholder="+254..." />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-gray-500 ml-1">Specialization</label>
              <Input variant="support" {...register("specialization")} placeholder="e.g. Addiction Counselor" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-gray-500 ml-1">Active Status</label>
              <select 
                {...register("isAvailable")} 
                className="w-full h-11 rounded-xl border border-gray-200 px-4 text-sm font-bold focus:ring-2 focus:ring-emerald-100 focus:border-emerald-600 outline-none transition-all"
              >
                <option value="true">Ready for Assignment</option>
                <option value="false">Currently Offline</option>
              </select>
            </div>
          </div>

          {/* Section: Availability Schedule */}
          <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
            <div className="flex items-center gap-2 mb-4 text-gray-700">
              <CalendarClock size={18} className="text-emerald-600" />
              <h4 className="text-sm font-black uppercase tracking-tighter">Availability Schedule</h4>
            </div>
            
            <div className="space-y-3">
              {fields.map((field, index) => (
                <div key={field.id} className="flex flex-wrap md:flex-nowrap gap-2 items-center bg-white p-2 rounded-xl border border-gray-100 shadow-sm">
                  <Input 
                    className="h-9 md:w-[35%]" 
                    placeholder="Day" 
                    {...register(`availability.${index}.day` as const, { required: true })} 
                  />
                  <Input 
                    type="time" 
                    className="h-9 md:w-[25%]" 
                    {...register(`availability.${index}.start` as const, { required: true })} 
                  />
                  <Input 
                    type="time" 
                    className="h-9 md:w-[25%]" 
                    {...register(`availability.${index}.end` as const, { required: true })} 
                  />
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => remove(index)} 
                    className="text-red-500 hover:bg-red-50 ml-auto"
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              ))}
              <Button 
                type="button" 
                variant="outline" 
                size="sm" 
                onClick={() => append({ day: "", start: "", end: "" })}
                className="w-full border-dashed border-2 border-emerald-200 text-emerald-600 hover:bg-emerald-50 mt-2"
              >
                <Plus size={14} className="mr-2" /> Add Time Slot
              </Button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="ghost" className="flex-1" onClick={onClose}>
              Discard
            </Button>
            <Button 
              type="submit" 
              variant="support" 
              className="flex-1 shadow-lg shadow-emerald-100" 
              disabled={isSubmitting}
            >
              <Save size={18} className="mr-2" />
              {isSubmitting ? "Syncing..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditProfileModal;