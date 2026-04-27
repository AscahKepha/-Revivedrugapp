import React from 'react';
import { useSelector } from 'react-redux';
import { useGetAllCheckinsQuery, useDeleteCheckinMutation } from '../../features/api/checkinsApi';
import { useGetAllUsersProfilesQuery } from '../../features/api/userApi';
import { Trash2, Calendar, ClipboardList, AlertCircle, CheckCircle, Search } from 'lucide-react';
import { format } from 'date-fns';
import type { RootState } from '../../app/store';

const CheckinHistory: React.FC = () => {
  // 1. Get user context for role-based styling
  const { userType } = useSelector((state: RootState) => state.auth);
  const isAdmin = userType === 'admin';

  // 2. Fetch Data
  const { data: checkins = [], isLoading: loadingCheckins } = useGetAllCheckinsQuery();
  const { data: users = [] } = useGetAllUsersProfilesQuery();
  const [deleteCheckin] = useDeleteCheckinMutation();

  // Theme Configuration
  const theme = {
    primary: isAdmin ? 'text-red-600' : 'text-emerald-700',
    iconBg: isAdmin ? 'bg-red-50' : 'bg-emerald-50',
    accent: isAdmin ? 'blue-600' : 'emerald-600' // Using blue for Admin's historical view
  };

  const getUserName = (userId: number) => {
    const user = users.find((u) => u.userId === userId);
    return user ? user.userName : `User #${userId}`;
  };

  const getRiskStyle = (cravings: number, control: number) => {
    const score = cravings + (10 - control);
    if (score >= 12) return "bg-red-100 text-red-700 border-red-200";
    if (score >= 7) return "bg-orange-100 text-orange-700 border-orange-200";
    return "bg-green-100 text-green-700 border-green-200";
  };

  if (loadingCheckins) {
    return (
      <div className="flex flex-col items-center justify-center p-20 space-y-4">
        <div className={`animate-spin rounded-full h-12 w-12 border-b-2 ${isAdmin ? 'border-red-600' : 'border-emerald-600'}`}></div>
        <p className="text-slate-500 font-medium animate-pulse">Retrieving recovery logs...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black uppercase tracking-tight text-slate-900 flex items-center gap-2">
            <div className={`${theme.iconBg} p-2 rounded-lg`}>
              <ClipboardList className={theme.primary} size={24} />
            </div>
            {isAdmin ? 'System-Wide Check-ins' : 'Patient Recovery Logs'}
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Monitoring daily cravings, control levels, and intervention needs.
          </p>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input
            type="text"
            placeholder="Search patient..."
            className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-slate-100 outline-none transition-all w-full md:w-64"
          />
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 text-slate-500 uppercase text-[10px] font-black tracking-widest border-b border-slate-100">
                <th className="px-6 py-4">Patient</th>
                <th className="px-6 py-4">Timestamp</th>
                <th className="px-6 py-4 text-center">Cravings</th>
                <th className="px-6 py-4 text-center">Control</th>
                <th className="px-6 py-4">Relapse Risk</th>
                <th className="px-6 py-4">Status</th>
                {isAdmin && <th className="px-6 py-4 text-right">Admin</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {checkins.map((checkin) => (
                <tr key={checkin.checkinId} className="hover:bg-slate-50/80 transition-colors group">
                  <td className="px-6 py-4">
                    <span className="text-sm font-bold text-slate-900">{getUserName(checkin.userId)}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-slate-500">
                      <Calendar size={14} className="opacity-50" />
                      <span className="text-xs">
                        {checkin.createdAt ? format(new Date(checkin.createdAt), 'MMM dd, HH:mm') : 'N/A'}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`text-sm font-black ${checkin.cravings > 7 ? 'text-red-600' : 'text-slate-600'}`}>
                      {checkin.cravings}/10
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden max-w-[60px] mx-auto">
                      <div
                        className={`h-full ${checkin.control > 7 ? 'bg-emerald-500' : 'bg-orange-400'}`}
                        style={{ width: `${checkin.control * 10}%` }}
                      />
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {checkin.consequences ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-red-50 text-red-700 text-[10px] font-black uppercase tracking-wide border border-red-100">
                        <AlertCircle size={12} /> High Alert
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 text-[10px] font-black uppercase tracking-wide border border-emerald-100">
                        <CheckCircle size={12} /> Protected
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className={`inline-block px-3 py-1 rounded-full border text-[9px] font-black uppercase tracking-tighter ${getRiskStyle(checkin.cravings, checkin.control)}`}>
                      {checkin.cravings + (10 - checkin.control) >= 12 ? 'Immediate Intervention' : 'Stable'}
                    </div>
                  </td>
                  {isAdmin && (
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => { if (confirm('Permanently remove this recovery log?')) deleteCheckin(checkin.checkinId) }}
                        className="p-2 text-slate-300 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                        title="Delete Log"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {checkins.length === 0 && (
          <div className="flex flex-col items-center justify-center p-20 text-center space-y-3">
            <div className="p-4 bg-slate-50 rounded-full text-slate-300">
              <ClipboardList size={40} />
            </div>
            <div>
              <p className="text-slate-900 font-bold">No logs found</p>
              <p className="text-xs text-slate-400">Patient check-ins will appear here once submitted.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckinHistory;