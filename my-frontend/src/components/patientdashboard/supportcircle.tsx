import React from 'react';
import { useSelector } from 'react-redux';
import { HeartHandshake, Phone, ShieldAlert, CheckCircle2, MessageCircle, ArrowRight } from 'lucide-react';
import { userApi } from '../../features/api/userApi';
import { type RootState } from '../../app/types';
import { Button } from '../ui/button';

const SupportCircle = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const userId = user?.userId;

  // 1. Fetching the data - this should return the joined partner details
  const { data: userDetails, isLoading } = userApi.useGetUserByIdQuery(userId as number, { skip: !userId });

  return (
    <div className="min-h-screen bg-gray-50/50 py-12 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Header: Your Guardian / Support Partner */}
        <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 p-8 md:p-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="w-24 h-24 rounded-[2rem] bg-emerald-100 flex items-center justify-center text-emerald-600 shadow-inner">
                <HeartHandshake size={40} />
              </div>
              <div className="text-center md:text-left">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-600 mb-1">Your Support Partner</p>
                <h1 className="text-3xl font-black text-gray-900 tracking-tighter">
                  {userDetails?.partnerName || "Assigning Partner..."}
                </h1>
                <div className="flex items-center gap-4 mt-3 justify-center md:justify-start">
                  <span className="flex items-center gap-1.5 text-xs font-bold text-gray-500">
                    <Phone size={14} className="text-emerald-500" /> {userDetails?.contactPhone || "--- --- ---"}
                  </span>
                  <span className="bg-emerald-50 text-emerald-700 text-[10px] font-black px-3 py-1 rounded-full uppercase">
                    {userDetails?.relationship || "Primary Support"}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex gap-3 w-full md:w-auto">
              <Button className="flex-1 md:flex-none bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl h-14 px-8 font-black uppercase text-xs tracking-widest">
                <MessageCircle size={18} className="mr-2" /> Message
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Action Plan Column */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between px-2">
              <h3 className="text-xl font-black text-gray-900 tracking-tight uppercase">Assigned Action Plan</h3>
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Updated Today</span>
            </div>

            {/* List of Actions from the Partner */}
            <div className="space-y-4">
              <ActionCard 
                title="Morning Reflection" 
                desc="Log your mood and energy levels before 9:00 AM."
                time="Daily"
                isCompleted={true}
              />
              <ActionCard 
                title="Hydration & Nutrition" 
                desc="Ensure 3L water intake and balanced meals to stabilize brain chemistry."
                time="On-going"
              />
              <ActionCard 
                title="Weekly Counseling" 
                desc="Virtual session with your support partner via Zoom."
                time="Friday, 4PM"
              />
            </div>
          </div>

          {/* Emergency / Support sidebar */}
          <div className="space-y-6">
             <div className="bg-gray-900 rounded-[2.5rem] p-8 text-white shadow-xl relative overflow-hidden group">
                <div className="absolute top-[-20px] right-[-20px] w-32 h-32 bg-red-500/10 rounded-full blur-3xl group-hover:bg-red-500/20 transition-all"></div>
                <ShieldAlert className="text-red-500 mb-4" size={32} />
                <h3 className="text-xl font-black uppercase tracking-tight mb-2">SOS Intervention</h3>
                <p className="text-gray-400 text-xs font-medium leading-relaxed mb-6">
                  Feeling overwhelmed or experiencing a high craving? Activate the alert to notify your partner immediately.
                </p>
                <Button className="w-full bg-red-600 hover:bg-red-700 text-white h-14 rounded-2xl font-black uppercase text-xs tracking-widest shadow-lg shadow-red-900/20">
                  Signal for Help
                </Button>
             </div>

             <div className="bg-white rounded-[2.5rem] border border-gray-100 p-8 shadow-sm">
                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Quick Resources</h4>
                <div className="space-y-3">
                   <ResourceLink label="Breathing Exercises" />
                   <ResourceLink label="Cravings Log" />
                   <ResourceLink label="Community Chat" />
                </div>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
};

// Sub-components
const ActionCard = ({ title, desc, time, isCompleted }: any) => (
  <div className={`p-6 rounded-[2rem] border transition-all ${isCompleted ? 'bg-emerald-50/30 border-emerald-100' : 'bg-white border-gray-100 hover:shadow-md'}`}>
    <div className="flex items-start justify-between gap-4">
      <div className="flex items-start gap-4">
        <div className={`mt-1 ${isCompleted ? 'text-emerald-500' : 'text-gray-300'}`}>
          <CheckCircle2 size={24} />
        </div>
        <div>
          <h4 className={`font-black text-lg ${isCompleted ? 'text-emerald-900 line-through' : 'text-gray-900'}`}>{title}</h4>
          <p className="text-gray-500 text-xs font-medium mt-1 leading-relaxed">{desc}</p>
          <div className="mt-3 inline-block px-3 py-1 bg-gray-50 rounded-lg border border-gray-100 text-[10px] font-black text-gray-400 uppercase">
            {time}
          </div>
        </div>
      </div>
      {!isCompleted && (
        <button className="p-2 bg-gray-50 rounded-xl text-gray-400 hover:text-emerald-600 transition-colors">
          <ArrowRight size={18} />
        </button>
      )}
    </div>
  </div>
);

const ResourceLink = ({ label }: { label: string }) => (
  <button className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-emerald-50 rounded-2xl group transition-all">
    <span className="text-xs font-bold text-gray-600 group-hover:text-emerald-700">{label}</span>
    <ArrowRight size={14} className="text-gray-300 group-hover:text-emerald-500" />
  </button>
);

export default SupportCircle