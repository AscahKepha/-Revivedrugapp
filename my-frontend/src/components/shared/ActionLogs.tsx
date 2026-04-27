import React from 'react';
import { useGetActionsQuery, useDeleteActionMutation } from '../../features/api/actionsApi';
import { useGetAllUsersProfilesQuery } from '../../features/api/userApi';
import { useGetSupportPartnersQuery } from '../../features/api/partnerApi';
import { History, CheckCircle2, XCircle, User, Shield, Search, Trash2 } from 'lucide-react';
import { format } from 'date-fns';

const ActionLogs: React.FC = () => {
    const { data: actions = [], isLoading: loadingActions } = useGetActionsQuery();
    const { data: users = [] } = useGetAllUsersProfilesQuery();
    const { data: partners = [] } = useGetSupportPartnersQuery();
    const [deleteAction] = useDeleteActionMutation();

    // Helper to find names
    const getPatientName = (userId: number) => users.find(u => u.userId === userId)?.userName || `User #${userId}`;
    const getPartnerName = (partnerId: number) => partners.find(p => p.partnerId === partnerId)?.partnerName || `Partner #${partnerId}`;

    if (loadingActions) return <div className="p-10 text-center text-blue-600">Loading intervention logs...</div>;

    return (
        <div className="p-6">
            <div className="mb-8 flex justify-between items-end">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                        <History className="text-indigo-600" />
                        Intervention Action Logs
                    </h1>
                    <p className="text-gray-500">Audit trail of all support partner interventions and their outcomes.</p>
                </div>
                <div className="text-right">
                    <span className="text-[10px] font-bold text-gray-400 uppercase">Success Rate</span>
                    <div className="text-2xl font-bold text-emerald-600">
                        {actions.length > 0 
                            ? Math.round((actions.filter(a => a.success).length / actions.length) * 100) 
                            : 0}%
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-50 text-gray-600 text-xs font-semibold uppercase">
                        <tr>
                            <th className="px-6 py-4">Support Partner</th>
                            <th className="px-6 py-4">Patient</th>
                            <th className="px-6 py-4">Action Description</th>
                            <th className="px-6 py-4 text-center">Status</th>
                            <th className="px-6 py-4">Timestamp</th>
                            <th className="px-6 py-4 text-right">Delete</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {actions.map((action) => (
                            <tr key={action.actionId} className="hover:bg-indigo-50/30 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        <Shield className="w-4 h-4 text-indigo-400" />
                                        <span className="font-semibold text-gray-900">{getPartnerName(action.partnerId)}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <User className="w-3 h-3" />
                                        {getPatientName(action.userId)}
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-700 italic max-w-xs">
                                    "{action.actionDescription}"
                                </td>
                                <td className="px-6 py-4 text-center">
                                    {action.success ? (
                                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700">
                                            <CheckCircle2 className="w-3 h-3" /> Success
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-rose-700">
                                            <XCircle className="w-3 h-3" /> Failed
                                        </span>
                                    )}
                                </td>
                                <td className="px-6 py-4 text-xs text-gray-500 font-mono">
                                    {action.createdAt ? format(new Date(action.createdAt), 'MMM dd, HH:mm') : 'N/A'}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button 
                                        onClick={() => { if(confirm('Remove this log?')) deleteAction(action.actionId!) }}
                                        className="text-gray-300 hover:text-rose-500 transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {actions.length === 0 && (
                    <div className="p-20 text-center">
                        <Search className="w-12 h-12 text-gray-200 mx-auto mb-2" />
                        <p className="text-gray-400 italic">No intervention logs found.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ActionLogs;