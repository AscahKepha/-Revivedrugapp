import { useEffect } from 'react';
import { useGetActionsQuery } from '../../features/api/actionsApi'; 
import { Target, TrendingUp, AlertCircle, CheckCircle2, History } from 'lucide-react';
import { Button } from '../ui/button';

const ScorePage = () => {
  // 1. Fetch data from the supportActionsApi
  const { data: actions, isLoading, isError, error } = useGetActionsQuery();

  // 2. Lifecycle Logging to match backend activity
  useEffect(() => {
    if (isLoading) {
      console.log('📡 [ScorePage]: Initiating fetch from /api/actions...');
    }
    if (actions) {
      console.log('✅ [ScorePage]: Data Received Successfully', {
        count: actions.length,
        sample: actions[0],
      });
    }
    if (isError) {
      console.error('❌ [ScorePage]: Fetch Failed', error);
    }
  }, [actions, isLoading, isError, error]);

  // 3. Logic to handle metrics calculation
  const totalActions = actions?.length || 0;
  const successfulActions = actions?.filter(action => action.success).length || 0;
  const failedActions = totalActions - successfulActions;
  
  // Calculate aggregate success rate
  const score = totalActions > 0 ? Math.round((successfulActions / totalActions) * 100) : 0;

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
        <p className="font-black text-slate-400 uppercase tracking-widest animate-pulse">Calculating Score...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-20 text-center">
        <AlertCircle className="mx-auto text-rose-500 mb-4" size={48} />
        <h2 className="text-xl font-black uppercase text-slate-800">Connection Error</h2>
        <p className="text-slate-500 font-medium italic">Could not sync with the intervention vault.</p>
        <p className="text-[10px] text-rose-400 mt-2 font-mono">
          {/* @ts-ignore */}
          {error?.status === 403 ? 'ACCESS DENIED: Check Role Permissions' : 'SERVER UNREACHABLE'}
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 py-12 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header Section */}
        <header className="flex flex-col md:flex-row justify-between items-end gap-4 px-2">
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase">Intervention Score</h1>
            <p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-widest">Performance analytics for support actions</p>
          </div>
          <div className="bg-white px-4 py-2 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-black uppercase text-slate-600">Intervention Vault Active</span>
          </div>
        </header>

        {/* Hero Score Card */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 bg-slate-900 rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden group">
            <div className="absolute top-[-50px] right-[-50px] w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl group-hover:bg-emerald-500/20 transition-all duration-700" />
            
            <div className="relative z-10 space-y-6">
              <div className="bg-emerald-500/20 w-fit p-3 rounded-2xl">
                <Target className="text-emerald-400" size={32} />
              </div>
              <div>
                <p className="text-emerald-400 text-[10px] font-black uppercase tracking-[0.3em]">Success Rate</p>
                <div className="flex items-baseline gap-2">
                  <h2 className="text-8xl font-black tracking-tighter">{score}</h2>
                  <span className="text-4xl font-black text-emerald-500">%</span>
                </div>
              </div>
              <p className="text-slate-400 text-xs font-medium leading-relaxed">
                Reflects the ratio of successful interventions logged by your Support Partner to assist your recovery.
              </p>
            </div>
          </div>

          {/* Metric Stats */}
          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
            <StatCard 
              icon={<CheckCircle2 className="text-emerald-500" />} 
              label="Successful" 
              value={successfulActions} 
              bgColor="bg-emerald-50" 
            />
            <StatCard 
              icon={<AlertCircle className="text-amber-500" />} 
              label="Unsuccessful" 
              value={failedActions} 
              bgColor="bg-amber-50" 
            />
            <StatCard 
              icon={<History className="text-blue-500" />} 
              label="Total Interventions" 
              value={totalActions} 
              bgColor="bg-blue-50" 
            />
            <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 flex items-center gap-6">
               <div className="p-4 bg-emerald-50 rounded-2xl">
                  <TrendingUp className="text-emerald-600" />
               </div>
               <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Platform Average</p>
                  <p className="text-xl font-black text-slate-900">84%</p>
               </div>
            </div>
          </div>
        </div>

        {/* Detailed Logs Table */}
        <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-8 border-b border-slate-50 flex justify-between items-center">
             <h3 className="text-xl font-black text-slate-900 tracking-tight uppercase">Intervention History</h3>
             <Button variant="outline" className="rounded-xl text-[10px] font-black uppercase tracking-widest border-slate-100">Export Report</Button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Description</th>
                  <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                  <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Date Logged</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {actions?.map((action) => (
                  <tr key={action.actionId} className="hover:bg-slate-50/30 transition-colors">
                    <td className="px-8 py-6">
                      <p className="text-sm font-bold text-slate-900">{action.actionDescription}</p>
                    </td>
                    <td className="px-8 py-6">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${
                        action.success ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                      }`}>
                        {action.success ? 'Success' : 'Unsuccessful'}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">
                        {action.createdAt ? new Date(action.createdAt).toLocaleDateString(undefined, {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        }) : 'N/A'}
                      </p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {totalActions === 0 && (
              <div className="p-20 text-center text-slate-400 italic font-medium">
                No interventions found for your profile.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon, label, value, bgColor }: any) => (
  <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm flex flex-col justify-between">
    <div className={`p-3 ${bgColor} w-fit rounded-xl mb-4`}>
      {icon}
    </div>
    <div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
      <p className="text-4xl font-black text-slate-900 leading-none">{value}</p>
    </div>
  </div>
);

export default ScorePage;