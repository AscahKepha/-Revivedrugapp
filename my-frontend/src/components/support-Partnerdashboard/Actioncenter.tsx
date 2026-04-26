import React, { useState } from 'react';
import { useGetActionsQuery, useCreateActionMutation } from '../../features/api/actionsApi';
import { Activity, ClipboardList, Send, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { Button } from '../ui/button';
// import { Input } from '../ui/input';
import { toast } from 'react-hot-toast';

const ActionCenter: React.FC = () => {
  const { data: actions, isLoading } = useGetActionsQuery();
  const [createAction] = useCreateActionMutation();
  
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const [actionText, setActionText] = useState("");

  // Mock cravings data (In a real app, you'd fetch this from a cravingsApi)
  const recentCravings = [
    { id: 101, patientName: "John Doe", level: "High", trigger: "Stress", time: "10 mins ago" },
    { id: 102, patientName: "Jane Smith", level: "Medium", trigger: "Social Setting", time: "1 hour ago" },
  ];

  const handleCreateAction = async () => {
    if (!selectedPatient || !actionText) {
      toast.error("Please select a patient and write an action.");
      return;
    }

    try {
      await createAction({
        partnerId: 1, // You'd get this from your auth state
        userId: selectedPatient.id,
        actionDescription: actionText,
        success: true,
      }).unwrap();
      
      toast.success(`Action logged for ${selectedPatient.patientName}`);
      setActionText("");
      setSelectedPatient(null);
    } catch (err) {
      toast.error("Failed to log intervention.");
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6 bg-gray-50 min-h-screen">
      
      {/* Left Column: Patient Cravings Feed */}
      <div className="lg:col-span-1 space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <Activity className="text-emerald-600" size={24} />
          <h2 className="text-xl font-black uppercase tracking-tight text-gray-900">Live Cravings</h2>
        </div>

        {recentCravings.map((craving) => (
          <div 
            key={craving.id}
            onClick={() => setSelectedPatient(craving)}
            className={`p-4 rounded-2xl border-2 transition-all cursor-pointer ${
              selectedPatient?.id === craving.id 
              ? 'border-emerald-500 bg-emerald-50 shadow-md' 
              : 'border-white bg-white hover:border-gray-200 shadow-sm'
            }`}
          >
            <div className="flex justify-between items-start mb-2">
              <span className="font-bold text-gray-900">{craving.patientName}</span>
              <span className={`text-[10px] px-2 py-1 rounded-full font-black uppercase ${
                craving.level === 'High' ? 'bg-red-100 text-red-600' : 'bg-orange-100 text-orange-600'
              }`}>
                {craving.level} Intensity
              </span>
            </div>
            <p className="text-xs text-gray-500 mb-2">Triggered by: <span className="font-medium text-gray-700">{craving.trigger}</span></p>
            <p className="text-[10px] text-gray-400 italic">{craving.time}</p>
          </div>
        ))}
      </div>

      {/* Right Column: Intervention Creator & History */}
      <div className="lg:col-span-2 space-y-6">
        
        {/* Intervention Form */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-6">
            <ClipboardList className="text-emerald-600" size={24} />
            <h2 className="text-xl font-black uppercase tracking-tight text-gray-900">Create Intervention</h2>
          </div>

          {selectedPatient ? (
            <div className="space-y-4">
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100">
                <p className="text-sm font-bold text-emerald-800">
                  Targeting {selectedPatient.patientName}'s {selectedPatient.trigger} trigger.
                </p>
              </div>
              
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-gray-500 ml-1">Action Description</label>
                <textarea 
                  className="w-full rounded-xl border border-gray-200 p-4 text-sm focus:ring-2 focus:ring-emerald-100 focus:border-emerald-600 outline-none h-32 transition-all"
                  placeholder="What steps did you take? (e.g., Called patient, suggested breathing exercises...)"
                  value={actionText}
                  onChange={(e) => setActionText(e.target.value)}
                />
              </div>

              <div className="flex justify-end gap-3">
                <Button variant="ghost" onClick={() => setSelectedPatient(null)}>Cancel</Button>
                <Button variant="support" onClick={handleCreateAction}>
                  <Send size={16} className="mr-2" /> Log Action
                </Button>
              </div>
            </div>
          ) : (
            <div className="py-12 text-center border-2 border-dashed border-gray-100 rounded-2xl">
              <AlertTriangle className="mx-auto text-gray-300 mb-2" size={40} />
              <p className="text-gray-400 font-medium">Select a patient from the feed to start an action.</p>
            </div>
          )}
        </div>

        {/* Action History Feed */}
        <div className="bg-gray-900 rounded-2xl p-6 shadow-lg text-white">
          <h3 className="text-sm font-black uppercase tracking-widest text-emerald-500 mb-4">Recent Intervention Logs</h3>
          <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
            {actions?.map((action) => (
              <div key={action.actionId} className="p-4 bg-white/5 rounded-xl border border-white/10">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-emerald-400">Action ID: #{action.actionId}</span>
                  {action.success && <CheckCircle2 size={14} className="text-emerald-500" />}
                </div>
                <p className="text-sm text-gray-300 leading-relaxed italic">"{action.actionDescription}"</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default ActionCenter;