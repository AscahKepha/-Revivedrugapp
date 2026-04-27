import React from 'react';
import { useGetSupportPartnersQuery, useDeleteSupportPartnerMutation } from '../../features/api/partnerApi';
import { useGetAllUsersProfilesQuery } from '../../features/api/userApi';
import { Trash2, ShieldCheck, User as UserIcon, Phone, Heart } from 'lucide-react';
import { format } from 'date-fns';

const AllSupportPartnersPage: React.FC = () => {
    // 1. Fetch the Support Partner relationship records
    const { data: partners = [], isLoading: loadingPartners } = useGetSupportPartnersQuery();
    
    // 2. Fetch User profiles to display the Patient's real name
    const { data: users = [] } = useGetAllUsersProfilesQuery();
    
    const [deletePartner] = useDeleteSupportPartnerMutation();

    const getPatientName = (userId: number) => {
        const user = users.find((u) => u.userId === userId);
        return user ? user.userName : `User #${userId}`;
    };

    if (loadingPartners) return <div className="p-10 text-center">Loading Support Network...</div>;

    return (
        <div className="p-6">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                    <ShieldCheck className="text-emerald-600" />
                    Support Partner Directory
                </h1>
                <p className="text-gray-500">View and manage assigned guardians for patients in recovery.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {partners.map((partner) => (
                    <div key={partner.partnerId} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-4">
                            <div className="bg-emerald-50 p-2 rounded-lg text-emerald-600">
                                <Heart className="w-6 h-6" />
                            </div>
                            <button 
                                onClick={() => { if(confirm('Remove this partner?')) deletePartner(partner.partnerId!) }}
                                className="text-gray-300 hover:text-red-500 transition-colors"
                            >
                                <Trash2 className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="mb-4">
                            <h2 className="text-lg font-bold text-gray-900">{partner.partnerName}</h2>
                            <p className="text-emerald-600 text-sm font-medium uppercase tracking-wide">
                                {partner.relationship}
                            </p>
                        </div>

                        <div className="space-y-2 border-t border-gray-50 pt-4">
                            <div className="flex items-center gap-3 text-sm text-gray-600">
                                <UserIcon className="w-4 h-4 text-gray-400" />
                                <span className="font-medium">Assigned to:</span> 
                                <span className="text-blue-600 font-semibold">{getPatientName(partner.userId)}</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-gray-600">
                                <Phone className="w-4 h-4 text-gray-400" />
                                <span>{partner.contactInfo}</span>
                            </div>
                            {partner.createdAt && (
                                <div className="text-[10px] text-gray-400 mt-4 italic">
                                    Linked on {format(new Date(partner.createdAt), 'PPP')}
                                </div>
                            )}
                        </div>
                    </div>
                ))}

                {partners.length === 0 && (
                    <div className="col-span-full py-20 text-center bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                        <p className="text-gray-500 font-medium">No support partner relationships established yet.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AllSupportPartnersPage;