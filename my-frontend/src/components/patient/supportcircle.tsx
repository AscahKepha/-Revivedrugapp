import { useSelector } from 'react-redux';
import { 
  HeartHandshake, 
  Phone, 
  ShieldAlert, 
  CheckCircle2, 
  MessageCircle, 
  ArrowRight,
  Loader2 
} from 'lucide-react';
import { type RootState } from '../../app/types';
import { Button } from '../ui/button';

// API Hooks
import { useGetSupportPartnerByIdQuery } from '../../features/api/partnerApi';
import { useGetActionsQuery, useCreateActionMutation, useUpdateActionMutation } from '../../features/api/actionsApi';

const SupportCircle = () => {
  // 1. Auth Context
  const { user } = useSelector((state: RootState) => state.auth);
  const userId = user?.userId;

  // 2. Fetch Partner Data (Relationship, Name, Phone)
  const { data: partner, isLoading: partnerLoading } = useGetSupportPartnerByIdQuery(userId as number, { 
    skip: !userId 
  });

  // 3. Fetch Action Plan (Current tasks for the patient)
  const { data: actions, isLoading: actionsLoading } = useGetActionsQuery();

  // 4. Mutations for User Interaction
  const [triggerSOS, { isLoading: isSendingSOS }] = useCreateActionMutation();
  const [completeAction] = useUpdateActionMutation();

  // Handle Emergency Signal
  const handleSOS = async () => {
    if (!userId || !partner) return;
    try {
      await triggerSOS({
        userId,
        partnerId: partner.partnerId,
        success: false, 
        actionDescription: "EMERGENCY: SOS Signal activated from Support Circle"
      }).unwrap();
      alert("SOS Signal Sent. Your partner has been notified.");
    } catch (err) {
      console.error("SOS activation failed:", err);
    }
  };

  // Handle Task Completion (The Arrow button)
  const handleResolveAction = async (id: number) => {
    try {
      await completeAction({ id, data: { success: true } }).unwrap();
    } catch (err) {
      console.error("Failed to update task:", err);
    }
  };

  if (partnerLoading || actionsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 animate-spin text-emerald-500" />
          <p className="font-black uppercase tracking-widest text-gray-400">Loading Support Circle...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 py-12 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Header: Support Partner Details */}
        <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 p-8 md:p-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="w-24 h-24 rounded-[2rem] bg-emerald-100 flex items-center justify-center text-emerald-600 shadow-inner">
                <HeartHandshake size={40} />
              </div>
              <div className="text-center md:text-left">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-600 mb-1">Your Support Partner</p>
                <h1 className="text-3xl font-black text-gray-900 tracking-tighter">
                  {partner?.partnerName || "No Partner Assigned"}
                </h1>
                <div className="flex items-center gap-4 mt-3 justify-center md:justify-start">
                  <span className="flex items-center gap-1.5 text-xs font-bold text-gray-500">
                    <Phone size={14} className="text-emerald-500" /> {partner?.contactInfo || "--- --- ---"}
                  </span>
                  <span className="bg-emerald-50 text-emerald-700 text-[10px] font-black px-3 py-1 rounded-full uppercase">
                    {partner?.relationship || "Primary Support"}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex gap-3 w-full md:w-auto">
              <Button className="flex-1 md:flex-none bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl h-14 px-8 font-black uppercase text-xs tracking-widest transition-all shadow-lg shadow-emerald-100">
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
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Live Updates</span>
            </div>

            <div className="space-y-4">
              {actions && actions.length > 0 ? (
                actions.map((action) => (
                  <ActionCard 
                    key={action.actionId}
                    title={action.actionDescription} 
                    time={new Date(action.createdAt!).toLocaleDateString()}
                    isCompleted={action.success}
                    onResolve={() => handleResolveAction(action.actionId)}
                  />
                ))
              ) : (
                <div className="p-12 bg-white rounded-[2rem] border border-dashed text-center text-gray-400 font-bold italic">
                  No actions currently assigned.
                </div>
              )}
            </div>
          </div>

          {/* Emergency / SOS Sidebar */}
          <div className="space-y-6">
             <div className="bg-gray-900 rounded-[2.5rem] p-8 text-white shadow-xl relative overflow-hidden group">
                <div className="absolute top-[-20px] right-[-20px] w-32 h-32 bg-red-500/10 rounded-full blur-3xl group-hover:bg-red-500/20 transition-all"></div>
                <ShieldAlert className="text-red-500 mb-4" size={32} />
                <h3 className="text-xl font-black uppercase tracking-tight mb-2">SOS Intervention</h3>
                <p className="text-gray-400 text-xs font-medium leading-relaxed mb-6">
                  Feeling overwhelmed? Click below to notify {partner?.partnerName || 'your partner'} immediately.
                </p>
                <Button 
                  onClick={handleSOS}
                  disabled={isSendingSOS}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white h-14 rounded-2xl font-black uppercase text-xs tracking-widest shadow-lg shadow-emerald-900/20 disabled:bg-gray-800"
                >
                  {isSendingSOS ? "Signaling..." : "Signal for Help"}
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

// Internal Sub-components
const ActionCard = ({ title, time, isCompleted, onResolve }: any) => (
  <div className={`p-6 rounded-[2rem] border transition-all ${isCompleted ? 'bg-emerald-50/30 border-emerald-100 opacity-60' : 'bg-white border-gray-100 hover:shadow-md'}`}>
    <div className="flex items-start justify-between gap-4">
      <div className="flex items-start gap-4">
        <div className={`mt-1 ${isCompleted ? 'text-emerald-500' : 'text-gray-300'}`}>
          <CheckCircle2 size={24} />
        </div>
        <div>
          <h4 className={`font-black text-lg ${isCompleted ? 'text-emerald-900 line-through' : 'text-gray-900'}`}>{title}</h4>
          <div className="mt-3 inline-block px-3 py-1 bg-gray-50 rounded-lg border border-gray-100 text-[10px] font-black text-gray-400 uppercase">
            {time}
          </div>
        </div>
      </div>
      {!isCompleted && (
        <button 
          onClick={onResolve}
          className="p-2 bg-gray-50 rounded-xl text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 transition-colors"
        >
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

export default SupportCircle;