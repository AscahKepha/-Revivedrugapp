import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { useCreateCheckinMutation } from '../../features/api/checkinsApi';
import { type RootState } from '../../app/types';
import { Brain, ShieldCheck, Flame, MessageSquare, Save, HeartPulse, History } from 'lucide-react';
import { Button } from '../ui/button';
import { toast } from 'sonner';

interface CheckinForm {
  cravings: number;
  control: number;
  selfEfficacy: number;
  consequences: boolean;
  copingUsed: boolean;
  notes: string;
}

const CheckinPage = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [createCheckin, { isLoading }] = useCreateCheckinMutation();
  const [riskPreview, setRiskPreview] = useState<string | null>(null);

  const { register, handleSubmit, control, watch, reset } = useForm<CheckinForm>({
    defaultValues: {
      cravings: 5,
      control: 5,
      selfEfficacy: 5,
      consequences: false,
      copingUsed: false,
      notes: ""
    }
  });

  // Watch values for live risk calculation preview (matching your controller logic)
  const watchedValues = watch();
  
  const calculateLiveRisk = () => {
    const score = Number(watchedValues.cravings) + 
                  (10 - Number(watchedValues.control)) + 
                  (10 - Number(watchedValues.selfEfficacy)) + 
                  (watchedValues.consequences ? 5 : 0);
    if (score >= 18) return { label: "High Risk", color: "text-red-600 bg-red-50" };
    if (score >= 10) return { label: "Medium Risk", color: "text-amber-600 bg-amber-50" };
    return { label: "Stable/Low Risk", color: "text-emerald-600 bg-emerald-50" };
  };

  const risk = calculateLiveRisk();

  const onSubmit = async (data: CheckinForm) => {
    try {
      const response = await createCheckin({
        ...data,
        userId: user?.userId as number,
        // Ensure values are numbers for the backend
        cravings: Number(data.cravings),
        control: Number(data.control),
        selfEfficacy: Number(data.selfEfficacy)
      }).unwrap();

      toast.success(response.message);
      reset();
    } catch (err: any) {
      toast.error(err.data?.error || "Submission failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50 py-12 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-8 px-2">
          <div>
            <h1 className="text-4xl font-black text-gray-900 tracking-tighter uppercase">Daily Check-In</h1>
            <p className="text-xs font-bold text-gray-400 mt-1 uppercase tracking-widest">Protocol for self-regulation and risk assessment</p>
          </div>
          <div className={`px-4 py-2 rounded-2xl border font-black text-[10px] uppercase tracking-widest transition-all ${risk.color}`}>
            Current Status: {risk.label}
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          
          {/* Section 1: Urge Assessment */}
          <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm space-y-8">
            <h3 className="text-lg font-black uppercase tracking-tight flex items-center gap-2">
              <Brain className="text-emerald-600" size={20} /> Cognitive Load & Urges
            </h3>

            {/* Cravings Slider */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-xs font-black uppercase text-gray-400 tracking-widest">Craving Intensity</label>
                <span className={`text-xl font-black ${watchedValues.cravings > 7 ? 'text-red-500' : 'text-emerald-600'}`}>
                  {watchedValues.cravings}/10
                </span>
              </div>
              <input 
                type="range" min="0" max="10" 
                {...register('cravings')}
                className="w-full h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-emerald-600"
              />
              <div className="flex justify-between text-[10px] font-bold text-gray-300 uppercase">
                <span>None</span>
                <span>Extreme</span>
              </div>
            </div>

            {/* Control Slider */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-xs font-black uppercase text-gray-400 tracking-widest">Perceived Control</label>
                <span className="text-xl font-black text-emerald-600">{watchedValues.control}/10</span>
              </div>
              <input 
                type="range" min="0" max="10" 
                {...register('control')}
                className="w-full h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-emerald-600"
              />
              <div className="flex justify-between text-[10px] font-bold text-gray-300 uppercase">
                <span>Powerless</span>
                <span>Absolute</span>
              </div>
            </div>
          </div>

          {/* Section 2: Behavior Checkbox Group */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <label className={`cursor-pointer flex items-center justify-between p-6 rounded-[2rem] border transition-all ${watchedValues.consequences ? 'bg-red-50 border-red-100' : 'bg-white border-gray-100'}`}>
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl ${watchedValues.consequences ? 'bg-red-500 text-white' : 'bg-gray-100 text-gray-400'}`}>
                  <Flame size={20} />
                </div>
                <span className="text-sm font-black uppercase tracking-tight">Recent Slip-up</span>
              </div>
              <input type="checkbox" {...register('consequences')} className="w-5 h-5 accent-red-600" />
            </label>

            <label className={`cursor-pointer flex items-center justify-between p-6 rounded-[2rem] border transition-all ${watchedValues.copingUsed ? 'bg-emerald-50 border-emerald-100' : 'bg-white border-gray-100'}`}>
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl ${watchedValues.copingUsed ? 'bg-emerald-500 text-white' : 'bg-gray-100 text-gray-400'}`}>
                  <ShieldCheck size={20} />
                </div>
                <span className="text-sm font-black uppercase tracking-tight">Used Coping Skills</span>
              </div>
              <input type="checkbox" {...register('copingUsed')} className="w-5 h-5 accent-emerald-600" />
            </label>
          </div>

          {/* Section 3: Reflection */}
          <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm space-y-4">
             <div className="flex items-center gap-2 mb-2">
                <MessageSquare className="text-emerald-600" size={20} />
                <h3 className="text-lg font-black uppercase tracking-tight">Daily Reflection</h3>
             </div>
             <textarea 
               {...register('notes', { required: true })}
               placeholder="How was your day? Any specific triggers or victories?"
               className="w-full h-32 p-6 bg-gray-50 border border-gray-100 rounded-[2rem] focus:ring-2 focus:ring-emerald-500 outline-none transition-all font-medium text-gray-700 italic"
             />
          </div>

          {/* Action Button */}
          <Button 
            type="submit" 
            disabled={isLoading}
            className="w-full h-16 bg-emerald-600 hover:bg-emerald-700 text-white rounded-[2rem] font-black uppercase text-sm tracking-[0.2em] shadow-xl shadow-emerald-100 active:scale-[0.98] transition-all"
          >
            {isLoading ? 'Syncing with Server...' : 'Complete Daily Check-in'}
          </Button>

        </form>
      </div>
    </div>
  );
};

export default CheckinPage;