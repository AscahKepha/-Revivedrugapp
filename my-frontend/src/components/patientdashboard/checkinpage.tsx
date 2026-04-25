import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { useCreateCheckinMutation } from '../../features/api/checkinsApi';
import { type RootState } from '../../app/types';
import { 
  Brain, 
  ShieldCheck, 
  Flame, 
  MessageSquare, 
  HeartPulse, 
  History, 
  TrendingUp,
  Clock,
  CheckCircle2
} from 'lucide-react';
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

  const { register, handleSubmit, watch, reset } = useForm<CheckinForm>({
    defaultValues: {
      cravings: 5,
      control: 5,
      selfEfficacy: 5,
      consequences: false,
      copingUsed: false,
      notes: ""
    }
  });

  const watchedValues = watch();
  
  // Risk calculation for live UI feedback
  const calculateLiveRisk = () => {
    const score = Number(watchedValues.cravings) + 
                  (10 - Number(watchedValues.control)) + 
                  (10 - Number(watchedValues.selfEfficacy)) + 
                  (watchedValues.consequences ? 5 : 0);
    if (score >= 18) return { label: "High Risk", color: "text-red-600 bg-red-50", border: "border-red-100" };
    if (score >= 10) return { label: "Medium Risk", color: "text-amber-600 bg-amber-50", border: "border-amber-100" };
    return { label: "Stable", color: "text-emerald-600 bg-emerald-50", border: "border-emerald-100" };
  };

  const risk = calculateLiveRisk();

  const onSubmit = async (data: CheckinForm) => {
    try {
      const response = await createCheckin({
        ...data,
        userId: user?.userId as number,
        cravings: Number(data.cravings),
        control: Number(data.control),
        selfEfficacy: Number(data.selfEfficacy)
      }).unwrap();

      toast.success(response.message || "Check-in synced successfully");
      reset();
    } catch (err: any) {
      toast.error(err.data?.error || "Submission failed");
    }
  };

  return (
    <div className="space-y-10 pb-16">
      {/* 1. Header & Quick Stats */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-2">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tighter uppercase">Daily Check-In</h1>
          <p className="text-gray-500 font-medium">Step by step. How are you checking up on yourself today?</p>
        </div>
        <div className={`px-6 py-3 rounded-[1.5rem] border font-black text-xs uppercase tracking-widest transition-all shadow-sm ${risk.color} ${risk.border}`}>
          Current Status: {risk.label}
        </div>
      </header>

      {/* 2. Recovery Pulse (Visual Overview) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <OverviewCard 
          icon={<Flame className="text-orange-500" />} 
          label="Sober Streak" 
          value="24 Days" 
          subtext="+2 from last week" 
        />
        <OverviewCard 
          icon={<TrendingUp className="text-blue-500" />} 
          label="Self-Efficacy" 
          value={`${watchedValues.selfEfficacy * 10}%`} 
          subtext="Confidence level" 
        />
        <OverviewCard 
          icon={<History className="text-emerald-500" />} 
          label="Check-ins" 
          value="128" 
          subtext="Total lifetime logs" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
        {/* 3. The Check-in Form (Takes 3 columns) */}
        <form onSubmit={handleSubmit(onSubmit)} className="lg:col-span-3 space-y-6">
          
          {/* Urge Assessment */}
          <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm space-y-8">
            <h3 className="text-lg font-black uppercase tracking-tight flex items-center gap-2">
              <Brain className="text-emerald-600" size={20} /> Urge Assessment
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
            </div>
          </div>

          {/* Behavior Toggles */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ToggleButton 
              label="Recent Slip-up" 
              icon={<Flame />} 
              active={watchedValues.consequences} 
              activeColor="bg-red-500 border-red-100 text-red-600"
              register={register('consequences')}
            />
            <ToggleButton 
              label="Coping Skills Used" 
              icon={<ShieldCheck />} 
              active={watchedValues.copingUsed} 
              activeColor="bg-emerald-500 border-emerald-100 text-emerald-600"
              register={register('copingUsed')}
            />
          </div>

          {/* Notes */}
          <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm space-y-4">
             <div className="flex items-center gap-2 mb-2">
                <MessageSquare className="text-emerald-600" size={20} />
                <h3 className="text-lg font-black uppercase tracking-tight">Personal Journal</h3>
             </div>
             <textarea 
               {...register('notes')}
               placeholder="Write about your triggers, victories, or just how you're feeling..."
               className="w-full h-32 p-6 bg-gray-50 border border-transparent rounded-[2rem] focus:bg-white focus:border-emerald-100 focus:ring-4 focus:ring-emerald-50 outline-none transition-all font-medium text-gray-700"
             />
          </div>

          <Button 
            type="submit" 
            disabled={isLoading}
            className="w-full h-16 bg-gray-900 hover:bg-black text-white rounded-[2rem] font-black uppercase text-sm tracking-[0.2em] shadow-xl active:scale-[0.98] transition-all"
          >
            {isLoading ? 'Processing...' : 'Submit Daily Check-in'}
          </Button>
        </form>

        {/* 4. Sidebar Content (Takes 2 columns) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-emerald-600 rounded-[2.5rem] p-8 text-white shadow-xl shadow-emerald-100">
            <h3 className="text-xl font-black uppercase tracking-tight mb-4">Why we check-in?</h3>
            <p className="text-emerald-50 text-sm leading-relaxed mb-6">
              Daily check-ins help identify patterns in your cravings before they lead to a slip. 
              By logging your mood, you're building a "check-up" habit that saves lives.
            </p>
            <div className="bg-white/10 rounded-2xl p-4 border border-white/10">
              <p className="text-xs font-bold uppercase tracking-widest text-emerald-200 mb-1">Weekly Tip</p>
              <p className="text-sm font-bold italic">"Triggers are just data points, not destiny."</p>
            </div>
          </div>

          <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm">
            <h3 className="text-sm font-black uppercase tracking-widest text-gray-400 mb-6">Action Checklist</h3>
            <div className="space-y-4">
              <CheckItem label="10-min Meditation" completed />
              <CheckItem label="Call Support Partner" />
              <CheckItem label="Log Evening Mood" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Sub-components ---

const OverviewCard = ({ icon, label, value, subtext }: any) => (
  <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm">
    <div className="flex items-center gap-4 mb-4">
      <div className="p-3 bg-gray-50 rounded-2xl">{icon}</div>
      <div>
        <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest">{label}</p>
        <p className="text-2xl font-black text-gray-900">{value}</p>
      </div>
    </div>
    <p className="text-[10px] font-bold text-gray-500 uppercase flex items-center gap-1 italic">
       {subtext}
    </p>
  </div>
);

const ToggleButton = ({ label, icon, active, activeColor, register }: any) => (
  <label className={`cursor-pointer flex items-center justify-between p-6 rounded-[2rem] border transition-all ${active ? 'bg-gray-50 border-emerald-100' : 'bg-white border-gray-100'}`}>
    <div className="flex items-center gap-4">
      <div className={`p-3 rounded-xl transition-colors ${active ? activeColor.replace('border-', 'bg-').split(' ')[0] + ' text-white' : 'bg-gray-100 text-gray-400'}`}>
        {icon}
      </div>
      <span className="text-sm font-black uppercase tracking-tight text-gray-900">{label}</span>
    </div>
    <input type="checkbox" {...register} className="w-5 h-5 accent-emerald-600 rounded-lg" />
  </label>
);

const CheckItem = ({ label, completed }: any) => (
  <div className="flex items-center gap-3">
    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${completed ? 'bg-emerald-500 border-emerald-500' : 'border-gray-200'}`}>
      {completed && <CheckCircle2 size={12} className="text-white" />}
    </div>
    <span className={`text-sm font-bold ${completed ? 'text-gray-400 line-through' : 'text-gray-700'}`}>{label}</span>
  </div>
);

export default CheckinPage;