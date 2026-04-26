import { 
  Heart, 
  Flame, 
  MessageCircle, 
  CheckCircle2, 
  Clock, 
  TrendingUp, 
  BookOpen 
} from 'lucide-react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../app/store'; 

// API Hooks
import { useGetUserByIdQuery } from '../../features/api/userApi';
import { useGetActionsQuery, useCreateActionMutation } from '../../features/api/actionsApi';
import { useGetSupportPartnerByIdQuery } from '../../features/api/partnerApi';

import { Button } from '../ui/button';

const PatientDashboard = () => {
  // 1. Get logged-in user context from Auth State
  // Removed 'token' to fix ts(6133) unused variable error
  const { user } = useSelector((state: RootState) => state.auth);
  const userId = user?.userId;

  // 2. Fetch Data using RTK Query
  const { data: profile, isLoading: profileLoading } = useGetUserByIdQuery(userId as number, { skip: !userId });
  const { data: actions, isLoading: actionsLoading } = useGetActionsQuery();
  const { data: partner } = useGetSupportPartnerByIdQuery(userId as number, { skip: !userId });
  
  // 3. Mutations
  const [triggerSOS, { isLoading: isSosSending }] = useCreateActionMutation();

  // Handle SOS Logic
  const handleActivateSOS = async () => {
    if (!userId) return;
    try {
      await triggerSOS({
        userId,
        partnerId: partner?.partnerId || 0,
        success: false,
        actionDescription: "URGENT: Patient activated SOS from Dashboard"
      }).unwrap();
      alert("Alert sent to your Support Partner.");
    } catch (err) {
      console.error("SOS failed:", err);
    }
  };

  if (profileLoading || actionsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <p className="text-xl font-black animate-pulse uppercase tracking-widest text-emerald-600">
          Loading Your Journey...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 p-6 md:p-10">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Header Section */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-black text-gray-900 tracking-tighter uppercase">
              {profile?.userName}'s Journey
            </h1>
            <p className="text-gray-500 font-medium">One day at a time. You've got this.</p>
          </div>
          <div className="flex gap-3">
            <Button className="bg-white text-gray-900 border border-gray-200 hover:bg-gray-50 rounded-2xl shadow-sm">
              <BookOpen size={18} className="mr-2 text-blue-600" /> Journal
            </Button>
            <Button className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl shadow-lg">
              <MessageCircle size={18} className="mr-2" /> Message {partner?.partnerName || 'Partner'}
            </Button>
          </div>
        </header>

        {/* Health & Progress Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <HighlightCard 
            icon={<Flame />} 
            label="Sober Streak" 
            value={`${profile?.streak_days || 0} Days`} 
            color="bg-orange-500" 
            subtext={`Best: ${profile?.longest_streak || 0} days`} 
          />
          <HighlightCard 
            icon={<Heart />} 
            label="Risk Status" 
            value={profile?.userType === 'patient' ? "Monitored" : "Active"} 
            color="bg-rose-500" 
            subtext="Check-ins up to date"
          />
          <HighlightCard 
            icon={<CheckCircle2 />} 
            label="Profile ID" 
            value={`#${profile?.userId}`} 
            color="bg-emerald-500" 
            subtext={profile?.email || ""}
          />
        </div>

        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Recent Support Actions */}
          <div className="lg:col-span-2 bg-white rounded-[2.5rem] shadow-sm border border-gray-100 p-8">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight">Recent Interventions</h3>
              <p className="text-xs font-black text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full uppercase">
                {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </p>
            </div>
            
            <div className="space-y-4">
              {actions && actions.length > 0 ? (
                actions.slice(0, 4).map((action) => (
                  <TodoItem 
                    key={action.actionId}
                    task={action.actionDescription} 
                    time={new Date(action.createdAt!).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} 
                    completed={action.success} 
                  />
                ))
              ) : (
                <p className="text-gray-400 font-medium py-10 text-center">No recent actions logged.</p>
              )}
            </div>
          </div>

          {/* Quick Actions & Emergency */}
          <div className="space-y-6">
            {/* SOS / Support Card */}
            <div className="bg-red-600 rounded-[2.5rem] p-8 text-white shadow-xl shadow-red-100">
              <h3 className="text-xl font-black uppercase tracking-tight mb-2">Need Support?</h3>
              <p className="text-red-100 text-sm mb-6 font-medium">Feeling overwhelmed? Reach out to your circle immediately.</p>
              <button 
                onClick={handleActivateSOS}
                disabled={isSosSending}
                className="w-full bg-white text-red-600 font-black py-4 rounded-2xl hover:bg-red-50 disabled:bg-gray-200 transition-colors uppercase text-sm tracking-widest"
              >
                {isSosSending ? "Sending Alert..." : "Activate SOS"}
              </button>
            </div>

            {/* Weekly Insights Mini-Card */}
            <div className="bg-gray-900 rounded-[2.5rem] p-8 text-white">
              <div className="flex items-center gap-3 mb-6">
                 <TrendingUp className="text-emerald-400" />
                 <h3 className="text-lg font-black uppercase tracking-tight">Recovery Progress</h3>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
                You have maintained your streak for <span className="text-white font-bold">{profile?.streak_days} days</span>. Keep engaging with your partner to stay on track.
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

// Sub-components
const HighlightCard = ({ icon, label, value, color, subtext }: any) => (
  <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100">
    <div className="flex items-center gap-5 mb-4">
      <div className={`${color} p-3 rounded-2xl text-white shadow-lg`}>{icon}</div>
      <div>
        <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest">{label}</p>
        <p className="text-2xl font-black text-gray-900">{value}</p>
      </div>
    </div>
    <div className="pt-4 border-t border-gray-50">
      <p className="text-xs font-medium text-gray-500 flex items-center gap-1">
        <Clock size={14} className="text-gray-300" /> {subtext}
      </p>
    </div>
  </div>
);

const TodoItem = ({ task, time, completed }: any) => (
  <div className={`flex items-center justify-between p-5 rounded-3xl border transition-all ${completed ? 'bg-gray-50/50 border-gray-100 opacity-60' : 'bg-white border-gray-200 shadow-sm'}`}>
    <div className="flex items-center gap-4">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${completed ? 'bg-emerald-100 text-emerald-600' : 'bg-gray-100 text-gray-400'}`}>
        <CheckCircle2 size={20} />
      </div>
      <div>
        <p className={`font-bold ${completed ? 'text-gray-500 line-through' : 'text-gray-900'}`}>{task}</p>
        <p className="text-xs font-bold text-gray-400 uppercase">{time}</p>
      </div>
    </div>
    {!completed && (
      <Button variant="outline" size="sm" className="rounded-xl border-emerald-200 text-emerald-600 hover:bg-emerald-50">
        Resolve
      </Button>
    )}
  </div>
);

export default PatientDashboard;