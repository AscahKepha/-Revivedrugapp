import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useGetAllUsersProfilesQuery } from '../../features/api/userApi';
import {
    ArrowLeft, Activity, Flame, ShieldAlert,
    MessageSquare, Heart, MapPin, Mail, Phone, ShieldCheck
} from 'lucide-react';
import type { RootState } from '../../app/store';
import type { UserProfile } from '../../types/auth';

const PatientDetailView: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    // Auth context for theming
    const { userType } = useSelector((state: RootState) => state.auth);
    const isAdmin = userType === 'admin';
    const themeColor = isAdmin ? 'blue' : 'emerald';

    const [activeTab, setActiveTab] = useState<'overview' | 'checkins' | 'risk'>('overview');

    // Fetch data using RTK Query
    const { data: allUsers = [], isLoading } = useGetAllUsersProfilesQuery();

    // Find the specific patient. 
    // We check both userId and userid due to potential SQL casing differences.
    const patient = allUsers.find(u =>
        (u.userId?.toString() === id) || ((u as any).userid?.toString() === id)
    ) as UserProfile;

    if (isLoading) {
        return (
            <div className="p-20 text-center space-y-4">
                <div className={`animate-spin w-10 h-10 border-4 border-t-transparent ${isAdmin ? 'border-blue-600' : 'border-emerald-600'} rounded-full mx-auto`}></div>
                <p className="animate-pulse font-black text-slate-400 uppercase tracking-widest text-[10px]">Retrieving Clinical Data...</p>
            </div>
        );
    }

    if (!patient) {
        return (
            <div className="p-20 text-center bg-white rounded-[2rem] border border-slate-100 shadow-sm">
                <ShieldAlert className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                <h2 className="text-xl font-black uppercase text-slate-900">Profile Not Found</h2>
                <p className="text-slate-500 mb-6 text-sm">The recovery record for ID #{id} is unavailable.</p>
                <button
                    onClick={() => navigate(-1)}
                    className={`px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest text-white ${isAdmin ? 'bg-blue-600' : 'bg-emerald-600'}`}
                >
                    Return to Directory
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto space-y-6 pb-20">
            {/* Navigation Header */}
            <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-slate-400 hover:text-slate-900 transition-colors font-black text-[10px] uppercase tracking-[0.2em]"
            >
                <ArrowLeft size={14} /> Back to Directory
            </button>

            {/* Profile Hero Card */}
            <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm flex flex-col xl:flex-row gap-8 items-start xl:items-center">
                <div className={`w-32 h-32 rounded-3xl bg-gradient-to-br ${isAdmin ? 'from-blue-600 to-blue-400' : 'from-emerald-600 to-emerald-400'} flex items-center justify-center text-white text-4xl font-black shadow-xl transform hover:rotate-3 transition-transform`}>
                    {patient.userName.charAt(0).toUpperCase()}
                </div>

                <div className="flex-1 space-y-4">
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tight">{patient.userName}</h1>
                            <ShieldCheck className={isAdmin ? 'text-blue-500' : 'text-emerald-500'} size={24} />
                        </div>
                        <p className="text-slate-400 font-mono text-xs">Internal ID: {patient.userId || (patient as any).userid}</p>
                    </div>

                    <div className="flex flex-wrap gap-x-8 gap-y-3">
                        <div className="flex items-center gap-2 text-slate-600 text-sm font-medium">
                            <Mail size={16} className="text-slate-300" /> {patient.email}
                        </div>
                        <div className="flex items-center gap-2 text-slate-600 text-sm font-medium">
                            <MapPin size={16} className="text-slate-300" /> {patient.address || 'Confidential'}
                        </div>
                        <div className="flex items-center gap-2 text-slate-600 text-sm font-medium">
                            <Phone size={16} className="text-slate-300" /> {patient.contactPhone}
                        </div>
                    </div>
                </div>

                <div className="bg-slate-900 rounded-[1.5rem] p-6 flex gap-8 text-white shadow-2xl border border-slate-800">
                    <div className="text-center">
                        <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Current Streak</p>
                        <div className="flex items-center justify-center gap-1 text-orange-400">
                            <Flame size={20} className="fill-current" />
                            <span className="text-3xl font-black">{patient.streak_days || 0}</span>
                        </div>
                    </div>
                    <div className="text-center border-l pl-8 border-slate-800">
                        <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Longest Streak</p>
                        <div className="flex items-center justify-center gap-1 text-emerald-400">
                            <Activity size={20} />
                            <span className="text-3xl font-black">{patient.longest_streak || 0}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tab Navigation */}
            <div className="flex gap-2 p-1.5 bg-slate-100 w-fit rounded-2xl">
                {(['overview', 'checkins', 'risk'] as const).map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-8 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.15em] transition-all ${activeTab === tab
                                ? 'bg-white text-slate-900 shadow-md scale-105'
                                : 'text-slate-500 hover:text-slate-800'
                            }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Content Area */}
            <div className="min-h-[400px]">
                {activeTab === 'overview' && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Support Partner Actions */}
                        <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
                            <h3 className="text-xs font-black uppercase tracking-widest mb-8 flex items-center gap-2 text-slate-400">
                                <Heart size={16} className="text-rose-500" /> Clinical Interventions
                            </h3>
                            <div className="space-y-6">
                                {(patient as any).supportPartnerActions?.length > 0 ? (
                                    (patient as any).supportPartnerActions.map((action: any, idx: number) => (
                                        <div key={idx} className="flex gap-4 group">
                                            <div className="flex flex-col items-center">
                                                <div className={`w-3 h-3 rounded-full border-2 ${action[3] ? 'border-emerald-500 bg-emerald-50' : 'border-red-500 bg-red-50'}`} />
                                                <div className="w-0.5 h-full bg-slate-50 mt-1" />
                                            </div>
                                            <div className="pb-6">
                                                <p className="text-sm text-slate-700 font-bold leading-tight mb-1">{action[4]}</p>
                                                <p className="text-[10px] text-slate-400 font-black uppercase tracking-tighter">
                                                    {new Date(action[5]).toLocaleDateString(undefined, { dateStyle: 'long' })}
                                                </p>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-slate-400 text-sm italic py-4">No intervention history found for this patient.</p>
                                )}
                            </div>
                        </div>

                        {/* Recent Messages */}
                        <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
                            <h3 className="text-xs font-black uppercase tracking-widest mb-8 flex items-center gap-2 text-slate-400">
                                <MessageSquare size={16} className="text-blue-500" /> Communication Log
                            </h3>
                            <div className="space-y-4">
                                {(patient as any).messages?.length > 0 ? (
                                    (patient as any).messages.slice(-4).map((msg: any, idx: number) => (
                                        <div key={idx} className="p-5 rounded-2xl bg-slate-50 border border-slate-100 hover:bg-white transition-colors">
                                            <p className="text-sm text-slate-600 italic leading-relaxed">"{msg[3]}"</p>
                                            <div className="mt-3 flex justify-between items-center">
                                                <span className="text-[9px] font-black uppercase text-slate-400 bg-white px-2 py-1 rounded-md border border-slate-100">
                                                    {msg[4]}
                                                </span>
                                                <span className="text-[9px] text-slate-400 font-bold">{new Date(msg[5]).toLocaleTimeString()}</span>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-slate-400 text-sm italic py-4">No recent messages found.</p>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'checkins' && (
                    <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-slate-50 border-b border-slate-100">
                                    <tr>
                                        <th className="px-8 py-5 text-[9px] font-black uppercase tracking-widest text-slate-400">Date Recorded</th>
                                        <th className="px-8 py-5 text-[9px] font-black uppercase tracking-widest text-slate-400">Craving Intensity</th>
                                        <th className="px-8 py-5 text-[9px] font-black uppercase tracking-widest text-slate-400">Self-Control Score</th>
                                        <th className="px-8 py-5 text-[9px] font-black uppercase tracking-widest text-slate-400">Recovery Notes</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {patient.checkins?.map((check: any, idx: number) => (
                                        <tr key={idx} className="hover:bg-slate-50/50 transition-colors group">
                                            <td className="px-8 py-5 text-xs font-bold text-slate-900">
                                                {new Date(check[2]).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                            </td>
                                            <td className="px-8 py-5">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-20 h-2 bg-slate-100 rounded-full overflow-hidden">
                                                        <div
                                                            className={`h-full ${check[3] > 7 ? 'bg-red-500' : 'bg-orange-500'}`}
                                                            style={{ width: `${check[3] * 10}%` }}
                                                        />
                                                    </div>
                                                    <span className="text-[10px] font-black text-slate-600">{check[3]}/10</span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-5">
                                                <span className="font-mono text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded-md">{check[4]}/10</span>
                                            </td>
                                            <td className="px-8 py-5 text-xs text-slate-500 italic max-w-xs truncate group-hover:whitespace-normal transition-all">
                                                "{check[8]}"
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {activeTab === 'risk' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {patient.riskScores?.map((risk: any, idx: number) => (
                            <div key={idx} className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm relative overflow-hidden group hover:border-slate-200 transition-all">
                                <div className={`absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 rounded-full opacity-5 ${risk[3] === 'high' ? 'bg-red-500' : 'bg-orange-500'}`} />

                                <div className="flex justify-between items-start mb-6">
                                    <div className={`p-3 rounded-2xl ${risk[3] === 'high' ? 'bg-red-50 text-red-600' : 'bg-orange-50 text-orange-600'}`}>
                                        <ShieldAlert size={20} />
                                    </div>
                                    <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
                                        {new Date(risk[4]).toLocaleDateString()}
                                    </span>
                                </div>

                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Risk Assessment</p>
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-4xl font-black text-slate-900">{risk[2]}</span>
                                        <span className="text-slate-300 font-bold text-xs uppercase">/ 30</span>
                                    </div>
                                </div>

                                <div className={`mt-6 w-full py-3 rounded-xl text-center text-[10px] font-black uppercase tracking-[0.2em] border ${risk[3] === 'high'
                                        ? 'bg-red-600 text-white border-red-600 shadow-lg shadow-red-100'
                                        : 'bg-orange-50 text-orange-600 border-orange-100'
                                    }`}>
                                    {risk[3]} Probability
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default PatientDetailView;