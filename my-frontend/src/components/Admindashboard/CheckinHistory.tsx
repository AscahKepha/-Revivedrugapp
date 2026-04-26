import React from 'react';
import { useGetAllCheckinsQuery, useDeleteCheckinMutation } from '../../features/api/checkinsApi';
import { useGetAllUsersProfilesQuery } from '../../features/api/userApi';
import { Trash2, Calendar, ClipboardList, AlertCircle, CheckCircle } from 'lucide-react';
import { format } from 'date-fns';

const CheckinHistory: React.FC = () => {
  const { data: checkins = [], isLoading: loadingCheckins } = useGetAllCheckinsQuery();
  const { data: users = [] } = useGetAllUsersProfilesQuery();
  const [deleteCheckin] = useDeleteCheckinMutation();

  const getUserName = (userId: number) => {
    const user = users.find((u) => u.userId === userId);
    return user ? user.userName : `User #${userId}`;
  };

  // Logic to determine risk level display based on your controller's scoring
  const getRiskStyle = (cravings: number, control: number) => {
    const score = cravings + (10 - control); // Simplified visual logic for the UI
    if (score >= 12) return "bg-red-100 text-red-700 border-red-200";
    if (score >= 7) return "bg-orange-100 text-orange-700 border-orange-200";
    return "bg-green-100 text-green-700 border-green-200";
  };

  if (loadingCheckins) return <div className="p-10 text-center">Loading recovery logs...</div>;

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <ClipboardList className="text-blue-600" />
          Patient Check-in History
        </h1>
        <p className="text-gray-500">Monitor daily cravings, self-efficacy, and recovery notes.</p>
      </div>

      <div className="overflow-x-auto bg-white rounded-xl shadow-sm border border-gray-100">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 text-gray-600 uppercase text-xs font-semibold">
              <th className="px-6 py-4">User</th>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4 text-center">Cravings (1-10)</th>
              <th className="px-6 py-4 text-center">Control (1-10)</th>
              <th className="px-6 py-4">Consequences</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {checkins.map((checkin) => (
              <tr key={checkin.checkinId} className="hover:bg-gray-50 transition-colors group">
                <td className="px-6 py-4 font-medium text-gray-900">
                  {getUserName(checkin.userId)}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {checkin.createdAt ? format(new Date(checkin.createdAt), 'MMM dd, yyyy') : 'N/A'}
                  </div>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className={`px-2 py-1 rounded-md text-xs font-bold ${checkin.cravings > 7 ? 'text-red-600 bg-red-50' : 'text-gray-600'}`}>
                    {checkin.cravings}
                  </span>
                </td>
                <td className="px-6 py-4 text-center text-sm">
                  {checkin.control} / 10
                </td>
                <td className="px-6 py-4">
                  {checkin.consequences ? (
                    <span className="flex items-center gap-1 text-red-500 text-xs font-semibold">
                      <AlertCircle className="w-3 h-3" /> Yes
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-green-500 text-xs font-semibold">
                      <CheckCircle className="w-3 h-3" /> None
                    </span>
                  )}
                </td>
                <td className="px-6 py-4">
                  <div className={`text-[10px] px-2 py-1 rounded-full border text-center font-bold uppercase tracking-wider ${getRiskStyle(checkin.cravings, checkin.control)}`}>
                    {checkin.cravings + (10 - checkin.control) >= 12 ? 'High Risk' : 'Stable'}
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <button
                    onClick={() => { if (confirm('Delete this record?')) deleteCheckin(checkin.checkinId) }}
                    className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {checkins.length === 0 && (
          <div className="p-20 text-center text-gray-400">
            No check-ins have been recorded yet.
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckinHistory;