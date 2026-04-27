import { useMemo } from 'react';
import { 
  Users, 
  AlertCircle, 
  Calendar, 
  MessageSquare, 
  ArrowUpRight, 
  Activity,
  Loader2 
} from 'lucide-react';
import { Button } from '../ui/button';
import { useGetAllUsersProfilesQuery } from '../../features/api/userApi';
import { useGetActionsQuery } from '../../features/api/actionsApi';
import { formatDistanceToNow } from 'date-fns';

const PartnerDashboard = () => {
  // 1. Fetch Patients (Your backend already filters these by partnerId)
  const { 
    data: patients = [], 
    isLoading: loadingPatients  } = useGetAllUsersProfilesQuery();

  // 2. Fetch Intervention Logs/Tasks
  const { 
    data: actions = [], 
    isLoading: loadingActions 
  } = useGetActionsQuery();

  // 3. Derived Stats Calculations
  const stats = useMemo(() => {
    const total = patients.length;
    
    // Count patients with "high" risk scores
    const critical = patients.filter(p => 
      p.riskScores && p.riskScores[0]?.riskLevel === 'high'
    ).length;

    // Count check-ins submitted today
    const today = new Date().toDateString();
    const activeToday = patients.filter(p => 
      p.checkins && 
      p.checkins[0] && 
      new Date(p.checkins[0].createdAt).toDateString() === today
    ).length;

    return { total, critical, activeToday };
  }, [patients]);

  // Loading State
  if (loadingPatients || loadingActions) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="animate-spin text-emerald-600" size={40} />
          <p className="text-gray-500 font-bold animate-pulse uppercase tracking-widest text-xs">Loading Hub...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 p-6 md:p-10">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Header Section */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-black text-gray-900 tracking-tighter uppercase">Partner Hub</h1>
            <p className="text-gray-500 font-medium">Monitoring recovery progress for assigned patients.</p>
          </div>
          <div className="flex gap-3">
            <Button className="bg-white text-gray-900 border border-gray-200 hover:bg-gray-50 rounded-2xl shadow-sm">
              <Calendar size={18} className="mr-2 text-emerald-600" /> Schedule
            </Button>
            <Button className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl shadow-lg shadow-emerald-100">
              <MessageSquare size={18} className="mr-2" /> Broadcast Alert
            </Button>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard 
            icon={<Users />} 
            label="Assigned Patients" 
            value={stats.total.toString().padStart(2, '0')} 
            color="bg-blue-500" 
          />
          <StatCard 
            icon={<AlertCircle />} 
            label="Critical Alerts" 
            value={stats.critical.toString().padStart(2, '0')} 
            color="bg-red-500" 
          />
          <StatCard 
            icon={<Activity />} 
            label="Check-ins Today" 
            value={stats.activeToday.toString().padStart(2, '0')} 
            color="bg-emerald-500" 
          />
        </div>

        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Patient Watchlist */}
          <div className="lg:col-span-2 bg-white rounded-[2.5rem] shadow-sm border border-gray-100 p-8">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight">Active Watchlist</h3>
              <button className="text-emerald-600 font-bold text-xs uppercase tracking-widest hover:underline">View All</button>
            </div>
            
            <div className="space-y-4">
              {patients.length > 0 ? (
                patients.map((patient) => {
                  const latestRisk = patient.riskScores?.[0];
                  const latestCheckin = patient.checkins?.[0];
                  
                  return (
                    <PatientRow 
                      key={patient.userId}
                      name={patient.userName} 
                      status={latestRisk?.riskLevel === 'high' ? 'High Risk' : 'Stable'} 
                      lastSeen={latestCheckin ? formatDistanceToNow(new Date(latestCheckin.createdAt)) + ' ago' : 'No Data'} 
                      isAlert={latestRisk?.riskLevel === 'high'} 
                    />
                  );
                })
              ) : (
                <div className="text-center py-10 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
                  <p className="text-gray-400 font-bold uppercase text-xs tracking-widest">No patients found</p>
                </div>
              )}
            </div>
          </div>

          {/* Quick Intervention / Tasks */}
          <div className="bg-gray-900 rounded-[2.5rem] p-8 text-white shadow-xl">
            <h3 className="text-xl font-black uppercase tracking-tight mb-6">Intervention Queue</h3>
            <div className="space-y-6">
              {actions.length > 0 ? (
                actions.slice(0, 3).map((action: any) => (
                  <TaskItem 
                    key={action.actionId}
                    title={action.actionDescription || "Logged Interaction"} 
                    time={action.createdAt ? new Date(action.createdAt).toLocaleDateString() : 'Pending'} 
                    type={action.success ? "Success" : "Logged"} 
                  />
                ))
              ) : (
                <div className="opacity-50">
                  <TaskItem title="No pending actions" time="Queue Clear" type="Status" />
                </div>
              )}
              
              <div className="pt-6 border-t border-white/10 mt-6">
                 <p className="text-[10px] font-black uppercase text-emerald-400 mb-4 tracking-[0.2em]">Resource Quick-Access</p>
                 <div className="grid grid-cols-2 gap-3">
                   <button className="bg-white/5 hover:bg-white/10 p-3 rounded-2xl text-xs font-bold transition-all text-left">Counseling PDF</button>
                   <button className="bg-white/5 hover:bg-white/10 p-3 rounded-2xl text-xs font-bold transition-all text-left">Emergency Protocol</button>
                 </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

// --- Helper Components ---

const StatCard = ({ icon, label, value, color }: any) => (
  <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 flex items-center gap-5">
    <div className={`${color} p-4 rounded-2xl text-white shadow-lg`}>{icon}</div>
    <div>
      <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest">{label}</p>
      <p className="text-3xl font-black text-gray-900">{value}</p>
    </div>
  </div>
);

const PatientRow = ({ name, status, lastSeen, isAlert }: any) => (
  <div className={`flex items-center justify-between p-5 rounded-3xl border transition-all hover:shadow-md ${isAlert ? 'bg-red-50 border-red-100' : 'bg-gray-50 border-gray-100'}`}>
    <div className="flex items-center gap-4">
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black ${isAlert ? 'bg-red-500 text-white' : 'bg-emerald-100 text-emerald-700'}`}>
        {name.charAt(0)}
      </div>
      <div>
        <p className="font-bold text-gray-900">{name}</p>
        <p className={`text-xs font-bold uppercase tracking-tighter ${isAlert ? 'text-red-600' : 'text-gray-400'}`}>{status}</p>
      </div>
    </div>
    <div className="text-right hidden md:block">
      <p className="text-xs font-black text-gray-400 uppercase">Last Sync</p>
      <p className="font-bold text-gray-900 text-sm">{lastSeen}</p>
    </div>
    <Button variant="ghost" size="sm" className="rounded-xl hover:bg-white/50"><ArrowUpRight size={18} /></Button>
  </div>
);

const TaskItem = ({ title, time, type }: any) => (
  <div className="group cursor-pointer">
    <div className="flex justify-between items-start mb-1">
      <p className="font-bold text-sm group-hover:text-emerald-400 transition-colors">{title}</p>
      <span className="text-[10px] font-black text-emerald-500 uppercase">{type}</span>
    </div>
    <p className="text-xs text-gray-500">{time}</p>
  </div>
);

export default PartnerDashboard;