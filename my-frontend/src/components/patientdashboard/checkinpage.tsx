import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { useCreateCheckinMutation, useGetCheckinStatsQuery } from '../../features/api/checkinsApi';
import { type RootState } from '../../app/types';
import {
  Brain,
  ShieldCheck,
  Flame,
  MessageSquare,
  History,
  TrendingUp,
  CheckCircle2,
  Quote,
  Clock
} from 'lucide-react';
import { Button } from '../ui/button';
import { toast } from 'react-hot-toast';

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

  // 1. Fetch real stats from the backend
  const { data: stats, isLoading: statsLoading, refetch } = useGetCheckinStatsQuery(user?.userId as number, {
    skip: !user?.userId,
  });

  const [createCheckin, { isLoading: isSubmitting }] = useCreateCheckinMutation();

  // 2. Monitoring Stats & User State
  useEffect(() => {
    console.log('🔄 [CheckinPage]: Component Mounted/Updated');
    if (user) console.log('👤 [CheckinPage]: Current User Data:', user);
    if (stats) console.log('📊 [CheckinPage]: API Stats Received:', stats);
  }, [stats, user]);

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

  const calculateLiveRisk = () => {
    const score = Number(watchedValues.cravings) +
      (10 - Number(watchedValues.control)) +
      (10 - Number(watchedValues.selfEfficacy)) +
      (watchedValues.consequences ? 5 : 0);

    if (score >= 18) return { label: "High Risk", color: "text-rose-600 bg-rose-50", border: "border-rose-100" };
    if (score >= 10) return { label: "Medium Risk", color: "text-amber-600 bg-amber-50", border: "border-amber-100" };
    return { label: "Stable", color: "text-emerald-600 bg-emerald-50", border: "border-emerald-100" };
  };

  const risk = calculateLiveRisk();

  const onSubmit = async (data: CheckinForm) => {
    console.log('🚀 [CheckinPage]: Form Submit Triggered', data);
    const toastId = toast.loading("Syncing check-in data...");

    const payload = {
      ...data,
      userId: user?.userId as number,
      cravings: Number(data.cravings),
      control: Number(data.control),
      selfEfficacy: Number(data.selfEfficacy),
      copingUsed: data.copingUsed ? "Used Skills" : "None", // Converting boolean to string for DB
      consequences: data.consequences
    };

    try {
      const response = await createCheckin(payload).unwrap();
      console.log('✅ [CheckinPage]: Submission Success:', response);

      toast.success(response.message || "Progress saved!", { id: toastId });
      reset();
      // Refetch is handled by RTK tags, but explicit refetch ensures UI updates
      refetch();
    } catch (err: any) {
      console.error('❌ [CheckinPage]: Submission Failed:', err);
      toast.error(err.data?.message || "Failed to sync", { id: toastId });
    }
  };

  return (
    <div className="space-y-10 pb-16 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-2">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase">Daily Check-In</h1>
          <p className="text-slate-500 font-medium italic">Cherishing the way you check up on yourself today.</p>
        </div>
        <div className={`px-6 py-3 rounded-[1.5rem] border font-black text-xs uppercase tracking-widest transition-all shadow-sm ${risk.color} ${risk.border}`}>
          Current Status: {risk.label}
        </div>
      </header>

      {/* Recovery Pulse */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <OverviewCard
          icon={<Flame className="text-orange-500" />}
          label="Current Streak"
          // FIX: Use userStreak from stats API (live from DB) instead of stale auth state
          value={statsLoading ? "..." : `${stats?.userStreak ?? 0} Days`}
          subtext="Consecutive logs"
        />
        <OverviewCard
          icon={<TrendingUp className="text-blue-500" />}
          label="Avg. Self-Efficacy"
          // Show historical average if available, otherwise current slider value
          value={stats?.averageSelfEfficacy ? `${stats.averageSelfEfficacy * 10}%` : `${watchedValues.selfEfficacy * 10}%`}
          subtext="Confidence level"
        />
        <OverviewCard
          icon={<History className="text-emerald-500" />}
          label="Total Logs"
          value={statsLoading ? "..." : (stats?.totalLogs || 0).toString()}
          subtext={stats?.lastWeekCount ? `+${stats.lastWeekCount} this week` : "Lifetime check-ins"}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
        <div className="lg:col-span-3 space-y-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm space-y-8">
              <h3 className="text-lg font-black uppercase tracking-tight flex items-center gap-2 text-slate-800">
                <Brain className="text-emerald-600" size={20} /> Urge Assessment
              </h3>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Craving Intensity</label>
                  <span className={`text-xl font-black ${Number(watchedValues.cravings) > 7 ? 'text-rose-500' : 'text-emerald-600'}`}>
                    {watchedValues.cravings}/10
                  </span>
                </div>
                <input type="range" min="0" max="10" {...register('cravings')} className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-emerald-600" />
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Perceived Control</label>
                  <span className="text-xl font-black text-emerald-600">{watchedValues.control}/10</span>
                </div>
                <input type="range" min="0" max="10" {...register('control')} className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-emerald-600" />
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Confidence Score</label>
                  <span className="text-xl font-black text-blue-600">{watchedValues.selfEfficacy}/10</span>
                </div>
                <input type="range" min="0" max="10" {...register('selfEfficacy')} className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ToggleButton label="Recent Slip-up" icon={<Flame />} active={watchedValues.consequences} activeColor="text-rose-600 bg-rose-500" register={register('consequences')} />
              <ToggleButton label="Coping Skills" icon={<ShieldCheck />} active={watchedValues.copingUsed} activeColor="text-emerald-600 bg-emerald-500" register={register('copingUsed')} />
            </div>

            <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <MessageSquare className="text-emerald-600" size={20} />
                <h3 className="text-lg font-black uppercase tracking-tight text-slate-800">Personal Journal</h3>
              </div>
              <textarea
                {...register('notes')}
                placeholder="How are you checking up on your mental state today?"
                className="w-full h-32 p-6 bg-slate-50/50 border border-transparent rounded-[2rem] focus:bg-white focus:border-emerald-100 focus:ring-4 focus:ring-emerald-500/5 outline-none transition-all font-medium text-slate-700"
              />
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-16 bg-slate-900 hover:bg-black text-white rounded-[2rem] font-black uppercase text-xs tracking-[0.2em] shadow-xl active:scale-[0.98] transition-all disabled:opacity-50"
            >
              {isSubmitting ? 'Securing Entry...' : 'Submit Daily Check-in'}
            </Button>
          </form>

          {/* --- JOURNAL HISTORY SECTION --- */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <JournalCard
              title="Today's Note"
              content={stats?.todayNote || "No logs submitted yet today."}
              isToday
            />
            <JournalCard
              title="Previous Note"
              content={stats?.previousNote || "Start logging to see your history."}
            />
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-emerald-600 rounded-[2.5rem] p-8 text-white shadow-xl shadow-emerald-100/50">
            <h3 className="text-xl font-black uppercase tracking-tight mb-4">The Power of Logging</h3>
            <p className="text-emerald-50 text-sm leading-relaxed mb-6 font-medium">
              Daily check-ins help us identify patterns. You currently have <b>{stats?.totalLogs || 0}</b> logs in the vault.
            </p>
            <div className="bg-white/10 p-4 rounded-2xl border border-white/10">
              <p className="text-[10px] font-black uppercase tracking-widest mb-1 text-emerald-200">System Status</p>
              <p className="text-xs font-bold">API Connected & Syncing</p>
            </div>
          </div>

          <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm">
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-6">Today's Checklist</h3>
            <div className="space-y-4">
              <CheckItem label="Morning Reflection" completed />
              <CheckItem label="Hydration Goal" completed />
              {/* This item dynamically updates based on the API status */}
              <CheckItem label="Daily Check-in Log" completed={stats?.isTodayLogged} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Sub-components remain the same...
const JournalCard = ({ title, content, isToday }: { title: string; content: string; isToday?: boolean }) => (
  <div className={`p-6 rounded-[2rem] border transition-all ${isToday ? 'bg-emerald-50/50 border-emerald-100' : 'bg-white border-slate-100'}`}>
    <div className="flex items-center justify-between mb-3">
      <div className="flex items-center gap-2">
        <Clock size={14} className="text-slate-400" />
        <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">{title}</h4>
      </div>
      <Quote size={14} className={isToday ? 'text-emerald-400' : 'text-slate-200'} />
    </div>
    <p className="text-sm font-medium text-slate-600 italic leading-relaxed">
      "{content}"
    </p>
  </div>
);

const OverviewCard = ({ icon, label, value, subtext }: any) => (
  <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm transition-all hover:shadow-md">
    <div className="flex items-center gap-4 mb-4">
      <div className="p-3 bg-slate-50 rounded-2xl">{icon}</div>
      <div>
        <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{label}</p>
        <p className="text-2xl font-black text-slate-900">{value}</p>
      </div>
    </div>
    <p className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1 italic">
      {subtext}
    </p>
  </div>
);

const ToggleButton = ({ label, icon, active, activeColor, register }: any) => (
  <label className={`cursor-pointer flex items-center justify-between p-6 rounded-[2rem] border transition-all duration-300 ${active ? 'bg-slate-50 border-emerald-100 shadow-inner' : 'bg-white border-slate-100'}`}>
    <div className="flex items-center gap-4">
      <div className={`p-3 rounded-xl transition-all ${active ? activeColor.split(' ')[1] + ' text-white' : 'bg-slate-100 text-slate-400'}`}>
        {icon}
      </div>
      <span className="text-sm font-black uppercase tracking-tight text-slate-800">{label}</span>
    </div>
    <div className="relative">
      <input type="checkbox" {...register} className="sr-only peer" />
      <div className="w-10 h-6 bg-slate-200 rounded-full peer peer-checked:bg-emerald-500 transition-colors after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-4"></div>
    </div>
  </label>
);

const CheckItem = ({ label, completed }: any) => (
  <div className="flex items-center gap-3">
    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${completed ? 'bg-emerald-500 border-emerald-500 scale-110' : 'border-slate-200'}`}>
      {completed && <CheckCircle2 size={12} className="text-white" />}
    </div>
    <span className={`text-sm font-bold ${completed ? 'text-slate-300 line-through' : 'text-slate-600'}`}>{label}</span>
  </div>
);

export default CheckinPage;