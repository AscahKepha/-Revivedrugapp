import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useGetActionsQuery, useCreateActionMutation } from '../../features/api/actionsApi';
import { Activity, ClipboardList, Send, AlertTriangle, CheckCircle2, RefreshCcw, History, User } from 'lucide-react';
import { Button } from '../ui/button';
import { toast } from 'react-hot-toast';
import type { RootState } from '../../app/store';
import type { CreateActionRequest } from '../../types';

const ActionCenter: React.FC = () => {
  // 1. Context & Auth State
  const { user, userType, token } = useSelector((state: RootState) => state.auth);
  const isAdmin = userType === 'admin';

  // 2. API Hooks
  const { data: actions, isLoading, error: fetchError, refetch } = useGetActionsQuery();
  const [createAction, { isLoading: isCreating }] = useCreateActionMutation();

  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const [actionText, setActionText] = useState("");

  // Monitor Auth Context on Load
  useEffect(() => {
    console.log("🌐 [ActionCenter] Auth Context Updated:", {
      userType,
      userId: user?.userId,
      userName: user?.userName,
      hasToken: !!token
    });
  }, [userType, user, token]);

  // Monitor API Fetch Status
  useEffect(() => {
    if (fetchError) {
      console.error("❌ [ActionCenter] Fetch Error (GET /api/actions):", fetchError);
    }
  }, [fetchError]);

  // Theme logic
  const themeColor = isAdmin ? 'text-red-600' : 'text-emerald-600';
  const themeBg = isAdmin ? 'bg-red-50' : 'bg-emerald-50';
  const themeBorder = isAdmin ? 'border-red-500' : 'border-emerald-500';

  // Mock cravings data
  const recentCravings = [
    { id: 4, patientName: "Patient #4", level: "High", trigger: "Stress", time: "10 mins ago" },
    { id: 5, patientName: "Jane Smith", level: "Medium", trigger: "Social Setting", time: "1 hour ago" },
  ];

  const handleCreateAction = async () => {
    if (!user?.userId) {
      toast.error("Session missing. Please log in again.");
      return;
    }

    if (!selectedPatient || !actionText.trim()) {
      toast.error("Select a patient and provide a description.");
      return;
    }

    const payload: CreateActionRequest = {
      partnerId: user.userId,
      userId: Number(selectedPatient.id),
      actionDescription: actionText.trim(),
      success: true,
    };

    try {
      await createAction(payload).unwrap();
      toast.success(`Action logged for ${selectedPatient.patientName}`);
      setActionText("");
      setSelectedPatient(null);
      refetch();
    } catch (err: any) {
      console.error("❌ [ActionCenter] POST Error:", err);
      const errorMsg = err.data?.error || err.data?.message || "Internal Server Error";
      toast.error(`Failed to log: ${errorMsg}`);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

      {/* Left Column: Live Patient Feed */}
      <div className="lg:col-span-1 space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <Activity className={themeColor} size={24} />
          <h2 className="text-xl font-black uppercase tracking-tight text-slate-900">
            {isAdmin ? "Global Alerts" : "My Live Feed"}
          </h2>
        </div>

        {recentCravings.map((craving) => (
          <div
            key={craving.id}
            onClick={() => setSelectedPatient(craving)}
            className={`p-4 rounded-2xl border-2 transition-all cursor-pointer ${selectedPatient?.id === craving.id
                ? `${themeBorder} ${themeBg} shadow-md`
                : 'border-white bg-white hover:border-slate-200 shadow-sm'
              }`}
          >
            <div className="flex justify-between items-start mb-2">
              <span className="font-bold text-slate-900">{craving.patientName}</span>
              <span className={`text-[10px] px-2 py-1 rounded-full font-black uppercase ${craving.level === 'High' ? 'bg-red-100 text-red-600' : 'bg-orange-100 text-orange-600'
                }`}>
                {craving.level}
              </span>
            </div>
            <p className="text-xs text-slate-500 mb-2">Trigger: <span className="font-medium text-slate-700">{craving.trigger}</span></p>
            <p className="text-[10px] text-slate-400 italic">{craving.time}</p>
          </div>
        ))}
      </div>

      {/* Right Column: Intervention Creator & History */}
      <div className="lg:col-span-2 space-y-6">

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <div className="flex items-center gap-2 mb-6">
            <ClipboardList className={themeColor} size={24} />
            <h2 className="text-xl font-black uppercase tracking-tight text-slate-900">Intervention Log</h2>
          </div>

          {selectedPatient ? (
            <div className="space-y-4">
              <div className={`p-3 rounded-xl border ${isAdmin ? 'bg-red-50 border-red-100' : 'bg-emerald-50 border-emerald-100'}`}>
                <p className={`text-sm font-bold ${isAdmin ? 'text-red-800' : 'text-emerald-800'}`}>
                  Logging action for {selectedPatient.patientName}.
                </p>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-slate-500 ml-1">Intervention Details</label>
                <textarea
                  className="w-full rounded-xl border border-slate-200 p-4 text-sm focus:ring-2 focus:ring-slate-100 focus:border-slate-600 outline-none h-32 transition-all"
                  placeholder="Describe the support provided..."
                  value={actionText}
                  onChange={(e) => setActionText(e.target.value)}
                />
              </div>

              <div className="flex justify-end gap-3">
                <Button variant="ghost" onClick={() => setSelectedPatient(null)}>Cancel</Button>
                <Button
                  className={isAdmin ? 'bg-red-600 hover:bg-red-700' : 'bg-emerald-600 hover:bg-emerald-700'}
                  onClick={handleCreateAction}
                  disabled={isCreating}
                >
                  {isCreating ? "Logging..." : <><Send size={16} className="mr-2" /> Log Intervention</>}
                </Button>
              </div>
            </div>
          ) : (
            <div className="py-12 text-center border-2 border-dashed border-slate-100 rounded-2xl">
              <AlertTriangle className="mx-auto text-slate-300 mb-2" size={40} />
              <p className="text-slate-400 font-medium">Select a patient from the feed to document an action.</p>
            </div>
          )}
        </div>

        {/* History Feed - UPDATED TO SHOW USER NAMES */}
        <div className="bg-slate-900 rounded-2xl p-6 shadow-lg text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <History size={18} className={isAdmin ? 'text-red-400' : 'text-emerald-400'} />
              <h3 className={`text-sm font-black uppercase tracking-widest ${isAdmin ? 'text-red-400' : 'text-emerald-400'}`}>
                {isAdmin ? "Global System Logs" : "Recent Interventions"}
              </h3>
            </div>
            <button
              onClick={() => refetch()}
              disabled={isLoading}
              className="p-1 hover:bg-white/10 rounded-full transition-colors disabled:opacity-50"
            >
              <RefreshCcw
                size={16}
                className={`text-slate-500 ${isLoading ? 'animate-spin' : 'hover:rotate-180 transition-all duration-500'}`}
              />
            </button>
          </div>

          <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
            {isLoading ? (
              <div className="text-slate-500 italic flex items-center gap-2">
                <div className="w-2 h-2 bg-slate-500 rounded-full animate-pulse" />
                Syncing logs...
              </div>
            ) : fetchError ? (
              <div className="text-red-400 text-xs p-3 bg-red-950/30 rounded-xl border border-red-900/50">
                Check API routing configuration (app.ts).
              </div>
            ) : actions && actions.length > 0 ? (
              actions.map((action: any) => (
                <div key={action.actionId} className="p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-colors group">
                  <div className="flex items-center justify-between mb-2">
                    {/* DISPLAYING PATIENT NAME INSTEAD OF ID */}
                    <div className="flex items-center gap-2">
                      <User size={12} className={isAdmin ? 'text-red-400' : 'text-emerald-400'} />
                      <span className={`text-[10px] font-black uppercase tracking-tighter ${isAdmin ? 'text-red-300' : 'text-emerald-300'}`}>
                        {action.userName || `Patient #${action.userId}`}
                      </span>
                    </div>
                    {action.success && <CheckCircle2 size={14} className="text-emerald-500" />}
                  </div>
                  <p className="text-sm text-slate-300 leading-relaxed italic">"{action.actionDescription}"</p>
                </div>
              ))
            ) : (
              <div className="text-slate-500 text-sm italic text-center py-4">
                No interventions logged yet.
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default ActionCenter;