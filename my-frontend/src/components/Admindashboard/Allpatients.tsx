import React from 'react';
import { useGetAllUsersProfilesQuery } from '../../features/api/userApi';
import { type UserProfile } from '../../features/auth/authSlice';
import { User, Mail, Phone, Flame, MapPin, Activity, Search } from 'lucide-react';

const AllPatients: React.FC = () => {
    // 1. Reuse the existing hook that fetches all users
    const { data: allUsers = [], isLoading, error } = useGetAllUsersProfilesQuery();

    // 2. Filter specifically for patients
    const patients = allUsers.filter((user: UserProfile) => user.userType === 'patient');

    if (isLoading) return <div className="p-10 text-center animate-pulse text-blue-500">Loading Patient Database...</div>;
    if (error) return <div className="p-10 text-center text-red-500">Failed to load patients. Check your connection.</div>;

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                        <User className="text-blue-600" />
                        Patient Management
                    </h1>
                    <p className="text-gray-500 text-sm">Monitor recovery progress and account details for all registered patients.</p>
                </div>
                
                <div className="bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="text-center border-r pr-4 border-gray-100">
                        <span className="text-[10px] text-gray-400 uppercase font-bold block">Total Patients</span>
                        <span className="text-lg font-bold text-blue-600">{patients.length}</span>
                    </div>
                    <div className="text-center">
                        <span className="text-[10px] text-gray-400 uppercase font-bold block">Active Streaks</span>
                        <span className="text-lg font-bold text-orange-500">
                            {patients.filter(p => (p.streak_days ?? 0) > 0).length}
                        </span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {patients.map((patient) => (
                    <div key={patient.userId} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:border-blue-200 transition-all flex flex-col sm:flex-row gap-6">
                        {/* Avatar & Streak Section */}
                        <div className="flex flex-col items-center gap-3">
                            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-blue-500 to-blue-300 flex items-center justify-center text-white text-2xl font-bold shadow-inner">
                                {patient.profile_picture ? (
                                    <img src={patient.profile_picture} alt="" className="w-full h-full rounded-full object-cover" />
                                ) : (
                                    patient.userName.charAt(0).toUpperCase()
                                )}
                            </div>
                            <div className="flex items-center gap-1 bg-orange-50 text-orange-600 px-3 py-1 rounded-full text-xs font-bold border border-orange-100">
                                <Flame className="w-3 h-3 fill-current" />
                                {patient.streak_days || 0} Days
                            </div>
                        </div>

                        {/* Details Section */}
                        <div className="flex-1 space-y-3">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h2 className="text-lg font-bold text-gray-900">{patient.userName}</h2>
                                    <p className="text-xs text-gray-400">UID: {patient.userId}</p>
                                </div>
                                <span className="bg-blue-50 text-blue-600 text-[10px] px-2 py-0.5 rounded-md font-bold uppercase tracking-tighter">
                                    Patient
                                </span>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <Mail className="w-4 h-4 text-gray-300" />
                                    <span className="truncate">{patient.email}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <Phone className="w-4 h-4 text-gray-300" />
                                    <span>{patient.contactPhone || 'N/A'}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <MapPin className="w-4 h-4 text-gray-300" />
                                    <span className="truncate">{patient.address || 'Location Not Set'}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <Activity className="w-4 h-4 text-gray-300" />
                                    <span>Record: {patient.longest_streak || 0} Days</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}

                {patients.length === 0 && (
                    <div className="col-span-full py-20 text-center bg-white rounded-2xl border-2 border-dashed border-gray-100">
                        <Search className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                        <p className="text-gray-400">No patients registered in the system yet.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AllPatients;