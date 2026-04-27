import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useGetAllUsersProfilesQuery } from '../../features/api/userApi';
import { User, Mail, Flame, MapPin, Activity, Search, ShieldCheck, AlertCircle, ChevronRight } from 'lucide-react';
import type { RootState } from '../../app/store';
import type { UserProfile } from '../../types/auth';

const AllPatients: React.FC = () => {
    const navigate = useNavigate();
    
    // 1. Context & Auth State
    const { userType, token } = useSelector((state: RootState) => state.auth);
    const isAdmin = userType === 'admin';
    
    // Determine the base path based on the user role to fix navigation
    const basePath = isAdmin ? '/admin' : '/partner';
    
    const [searchQuery, setSearchQuery] = useState("");

    // 2. Fetch Data
    const {
        data: allUsers = [],
        isLoading,
        error,
        isSuccess,
        refetch
    } = useGetAllUsersProfilesQuery();

    // 3. Debugging Logs
    useEffect(() => {
        if (isSuccess) {
            console.log("✅ Directory Sync: Success", allUsers.length, "users loaded.");
        }
    }, [isSuccess, allUsers]);

    // 4. Filter Logic
    const patients = allUsers
        .filter((user: any) => (user.userType || user.usertype) === 'patient')
        .filter((user: any) =>
            (user.userName || user.username || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
            (user.email || "").toLowerCase().includes(searchQuery.toLowerCase())
        );

    // Theme Configuration
    const theme = {
        primary: isAdmin ? 'text-blue-600' : 'text-emerald-600',
        bg: isAdmin ? 'bg-blue-50' : 'bg-emerald-50',
        border: isAdmin ? 'hover:border-blue-200' : 'hover:border-emerald-200',
        accent: isAdmin ? 'bg-blue-600' : 'bg-emerald-600',
        gradient: isAdmin ? 'from-blue-600 to-blue-400' : 'from-emerald-600 to-emerald-400'
    };

    if (isLoading) return (
        <div className="p-20 text-center space-y-4">
            <div className={`animate-spin w-10 h-10 border-4 border-t-transparent ${theme.primary} rounded-full mx-auto`}></div>
            <p className="animate-pulse font-black text-slate-400 uppercase tracking-widest text-[10px]">Syncing Recovery Data...</p>
        </div>
    );

    if (error) {
        return (
            <div className="p-10 text-center bg-red-50 rounded-[2rem] border border-red-100 space-y-4">
                <AlertCircle className="w-12 h-12 text-red-400 mx-auto" />
                <div>
                    <p className="text-red-600 font-black uppercase text-sm tracking-widest">Connection Failed</p>
                    <p className="text-red-500 text-xs mt-1 italic">
                        {((error as any)?.status === 404) 
                            ? "Backend directory endpoint not found." 
                            : "Session unauthorized or network timeout."}
                    </p>
                </div>
                <button
                    onClick={() => refetch()}
                    className="px-8 py-2.5 bg-red-600 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-red-700 transition-all"
                >
                    Retry Connection
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-8 pb-20">
            {/* Header Section */}
            <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6">
                <div>
                    <h1 className="text-2xl font-black uppercase tracking-tight text-slate-900 flex items-center gap-3">
                        <div className={`${theme.bg} p-2.5 rounded-2xl`}>
                            <User className={theme.primary} size={22} />
                        </div>
                        {isAdmin ? "Global Directory" : "Assigned Patients"}
                    </h1>
                    <p className="text-[11px] font-bold text-slate-400 mt-1 uppercase tracking-wider">
                        {isAdmin ? "System-wide recovery monitoring" : "Direct care management"}
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4">
                    <div className="relative w-full sm:w-72">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
                        <input
                            type="text"
                            placeholder="Search clinical records..."
                            className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-xs font-medium focus:ring-4 focus:ring-slate-50 outline-none transition-all placeholder:text-slate-300"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <div className="bg-slate-900 px-5 py-2.5 rounded-[1.2rem] shadow-xl flex items-center gap-5 text-white">
                        <div className="text-center border-r pr-5 border-slate-700">
                            <span className="text-[8px] text-slate-500 uppercase font-black block tracking-tighter">Database</span>
                            <span className="text-lg font-black">{patients.length}</span>
                        </div>
                        <div className="text-center">
                            <span className="text-[8px] text-emerald-500 uppercase font-black block tracking-tighter">Active</span>
                            <span className="text-lg font-black text-emerald-400">
                                {patients.filter(p => (p.streak_days ?? 0) > 0).length}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Grid Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-6">
                {patients.map((patient: any) => {
                    const patientId = patient.userId || patient.userid;
                    const patientName = patient.userName || patient.username || "Unknown Patient";
                    
                    return (
                        <div
                            key={patientId}
                            className={`bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100 transition-all group ${theme.border} hover:shadow-xl hover:-translate-y-1`}
                        >
                            <div className="flex gap-5">
                                <div className="flex flex-col items-center gap-3">
                                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${theme.gradient} flex items-center justify-center text-white text-xl font-black shadow-lg transform group-hover:rotate-6 transition-transform`}>
                                        {patientName.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="flex items-center gap-1 bg-orange-50 text-orange-600 px-2 py-0.5 rounded-lg text-[9px] font-black border border-orange-100 uppercase tracking-tighter">
                                        <Flame className="w-3 h-3 fill-current" />
                                        {patient.streak_days || 0}
                                    </div>
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-start mb-3">
                                        <div className="truncate">
                                            <h2 className="text-base font-black text-slate-900 truncate uppercase tracking-tight">
                                                {patientName}
                                            </h2>
                                            <p className="text-[9px] text-slate-400 font-mono font-bold">UID #{patientId}</p>
                                        </div>
                                        <ShieldCheck className={isAdmin ? 'text-blue-400' : 'text-emerald-400'} size={18} />
                                    </div>

                                    <div className="space-y-2 border-t border-slate-50 pt-3">
                                        <div className="flex items-center gap-2 text-[11px] text-slate-500 font-medium">
                                            <Mail className="w-3.5 h-3.5 text-slate-300" />
                                            <span className="truncate">{patient.email}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-[11px] text-slate-500 font-medium">
                                            <MapPin className="w-3.5 h-3.5 text-slate-300" />
                                            <span className="truncate">{patient.address || 'Confidential'}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-[11px] pt-1">
                                            <Activity className={`w-3.5 h-3.5 ${isAdmin ? 'text-blue-400' : 'text-emerald-400'}`} />
                                            <span className="font-black text-slate-700 uppercase tracking-tighter">Peak: {patient.longest_streak || 0} Days</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <button 
                                onClick={() => navigate(`${basePath}/patients/${patientId}`)}
                                className={`w-full mt-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] border flex items-center justify-center gap-2 transition-all ${
                                    isAdmin 
                                    ? 'border-blue-100 text-blue-600 hover:bg-blue-600 hover:text-white hover:border-blue-600' 
                                    : 'border-emerald-100 text-emerald-600 hover:bg-emerald-600 hover:text-white hover:border-emerald-600'
                                }`}
                            >
                                Clinical Profile <ChevronRight size={14} />
                            </button>
                        </div>
                    );
                })}

                {patients.length === 0 && (
                    <div className="col-span-full py-32 text-center bg-white rounded-[3rem] border-4 border-dashed border-slate-50">
                        <Search className="w-16 h-16 text-slate-100 mx-auto mb-4" />
                        <h3 className="text-slate-400 font-black uppercase tracking-widest text-xs">No matching records</h3>
                        <p className="text-slate-300 text-[11px] mt-2 italic">Try adjusting your search filters.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AllPatients;