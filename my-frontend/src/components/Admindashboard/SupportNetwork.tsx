import React, { useState } from 'react';
import { useGetAllUsersProfilesQuery } from '../../features/api/userApi';
import { useGetSupportPartnersQuery, useDeleteSupportPartnerMutation } from '../../features/api/partnerApi';
import { type SupportPartner } from '../../types/index';
import { type UserProfile } from '../../features/auth/authSlice';
import { Trash2, ShieldCheck, User as UserIcon, Phone } from 'lucide-react';

const SupportNetwork: React.FC = () => {
    // 1. Fetch all users and all partner-patient relationships
    const { data: allUsers = [], isLoading: loadingUsers } = useGetAllUsersProfilesQuery();
    const { data: relations = [], isLoading: loadingRelations } = useGetSupportPartnersQuery();
    const [deletePartner] = useDeleteSupportPartnerMutation();

    // 2. Filter for users whose role is 'support_partner'
    const supportPartners = allUsers.filter((user: UserProfile) => user.userType === 'support_partner');

    const getPatientName = (userId: number) => {
        const patient = allUsers.find(u => u.userId === userId);
        return patient ? patient.userName : "Unknown Patient";
    };

    if (loadingUsers || loadingRelations) return <div className="p-6 text-center">Loading Support Network...</div>;

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Support Network Management</h1>
                <span className="bg-green-100 text-green-800 px-4 py-1 rounded-full text-sm font-medium">
                    {supportPartners.length} Active Partners
                </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {supportPartners.map((partner) => (
                    <div key={partner.userId} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        {/* Header: Partner Info */}
                        <div className="p-4 bg-gray-50 border-b border-gray-100 flex items-center gap-3">
                            <div className="bg-green-500 p-2 rounded-lg">
                                <ShieldCheck className="text-white w-5 h-5" />
                            </div>
                            <div>
                                <h2 className="font-semibold text-gray-900">{partner.userName}</h2>
                                <p className="text-xs text-gray-500 italic">Support Partner</p>
                            </div>
                        </div>

                        {/* Body: Linked Patients & Contact */}
                        <div className="p-4 space-y-4">
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Phone className="w-4 h-4 text-gray-400" />
                                <span>{partner.email}</span>
                            </div>

                            <div className="pt-2">
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Assigned Patients</p>
                                <div className="space-y-2">
                                    {relations
                                        .filter(rel => rel.partnerId === partner.userId || rel.userId === partner.userId) // Adjust based on your FK logic
                                        .map((rel) => (
                                            <div key={rel.partnerId} className="flex justify-between items-center bg-blue-50 p-2 rounded-md">
                                                <div className="flex items-center gap-2">
                                                    <UserIcon className="w-3 h-3 text-blue-500" />
                                                    <span className="text-sm font-medium text-blue-700">
                                                        {rel.partnerName} {/* Displaying the partner's saved contact name */}
                                                    </span>
                                                </div>
                                                <button
                                                    onClick={() => deletePartner(rel.partnerId)}
                                                    className="text-red-400 hover:text-red-600 transition-colors"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ))}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {supportPartners.length === 0 && (
                <div className="text-center py-20 bg-white rounded-xl border-2 border-dashed border-gray-200">
                    <p className="text-gray-500">No support partners found in the system.</p>
                </div>
            )}
        </div>
    );
};

export default SupportNetwork;