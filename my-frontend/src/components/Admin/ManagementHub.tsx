import { FaHeartbeat, FaShieldAlt, FaClipboardCheck, FaHistory, FaUserFriends, FaFire, FaNotesMedical } from 'react-icons/fa';
import { motion, type Variants } from 'framer-motion';
import { LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Legend, BarChart, Bar } from 'recharts';
import { userApi } from '../../features/api/userApi';
import { supportPartnerApi } from '../../features/api/partnerApi';
import { supportActionsApi } from '../../features/api/actionsApi';
import { checkinsApi } from '../../features/api/checkinsApi';
import { useSelector } from 'react-redux';
import type { RootState } from '../../app/types';
import { PuffLoader } from 'react-spinners';

const cardVariants: Variants = {
    hover: { 
        scale: 1.02, 
        transition: { type: "spring", stiffness: 300 } 
    },
    tap: { scale: 0.98 },
};

const COLORS = ['#10b981', '#f59e0b', '#ef4444', '#3b82f6'];

export const ManagementHubPage = () => {
    const { isAuthenticated } = useSelector((state: RootState) => state.auth);

    // --- API Integration ---
    const { data: usersData = [], isLoading: isLoadingUsers } = userApi.useGetAllUsersProfilesQuery(undefined, { skip: !isAuthenticated });
    const { data: partnersData = [], isLoading: isLoadingPartners } = supportPartnerApi.useGetSupportPartnersQuery(undefined, { skip: !isAuthenticated });
    const { data: actionsData = [], isLoading: isLoadingActions } = supportActionsApi.useGetActionsQuery(undefined, { skip: !isAuthenticated });
    const { data: checkinsData = [], isLoading: isLoadingCheckins } = checkinsApi.useGetAllCheckinsQuery(undefined, { skip: !isAuthenticated });

    const overallLoading = isLoadingUsers || isLoadingPartners || isLoadingActions || isLoadingCheckins;

    // --- Data Processing ---
    const patients = Array.isArray(usersData) ? usersData.filter((u: any) => u.userType === 'patient') : [];
    
    // Recovery Metrics
    const totalStreaks = patients.reduce((sum: number, p: any) => sum + (p.streak_days || 0), 0);

    // Intervention Success Rate
    const successfulActions = Array.isArray(actionsData) ? actionsData.filter((a: any) => a.success).length : 0;
    const totalActions = Array.isArray(actionsData) ? actionsData.length : 0;
    const interventionSuccessRate = totalActions > 0 
        ? Math.round((successfulActions / totalActions) * 100) 
        : 0;

    // NEW: Check-in Health Analysis (Resolves unread checkinsData warning)
    const wellnessData = Array.isArray(checkinsData) ? [
        { status: 'Sober', count: checkinsData.filter((c: any) => c.status === 'sober').length },
        { status: 'Struggling', count: checkinsData.filter((c: any) => c.status === 'struggling').length },
        { status: 'Relapsed', count: checkinsData.filter((c: any) => c.status === 'relapsed').length },
    ].filter(item => item.count > 0) : [];

    // Chart: Registration Trend
    const registrationsByDate = Array.isArray(usersData) ? usersData.reduce((acc: any, user: any) => {
        const date = user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Unknown';
        acc[date] = (acc[date] || 0) + 1;
        return acc;
    }, {}) : {};

    const registrationTrendData = Object.keys(registrationsByDate)
        .sort((a, b) => new Date(a).getTime() - new Date(b).getTime())
        .map(date => ({ 
            name: date, 
            Users: registrationsByDate[date] 
        }));

    const actionStatusData = [
        { name: 'Successful', value: successfulActions },
        { name: 'Pending', value: totalActions - successfulActions }
    ].filter(v => v.value > 0);

    return (
        <div className="min-h-screen bg-slate-50 p-6">
            <div className="max-w-7xl mx-auto space-y-8">
                <header className="flex justify-between items-center bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                    <div>
                        <h1 className="text-3xl font-black text-slate-800 tracking-tight">Drug-Revive Analytics 🏥</h1>
                        <p className="text-slate-500">Global oversight of recovery progress and community wellness</p>
                    </div>
                    {overallLoading && <PuffLoader color="#10b981" size={40} />}
                </header>

                {/* KPI Summary Grid */}
                <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <motion.div variants={cardVariants} whileHover="hover" whileTap="tap" className="bg-emerald-600 p-6 rounded-2xl text-white shadow-lg flex justify-between items-center cursor-default">
                        <div>
                            <p className="text-emerald-100 text-xs font-bold uppercase tracking-wider">Total Patients</p>
                            <h3 className="text-3xl font-black">{patients.length}</h3>
                            <p className="text-[10px] mt-1 opacity-80">Registered Recovery Journeys</p>
                        </div>
                        <FaHeartbeat className="text-4xl opacity-20" />
                    </motion.div>

                    <motion.div variants={cardVariants} whileHover="hover" whileTap="tap" className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex justify-between items-center cursor-default">
                        <div>
                            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Support Partners</p>
                            <h3 className="text-3xl font-black text-slate-800">{partnersData.length}</h3>
                            <p className="text-[10px] mt-1 text-emerald-600 font-bold">Active Advocates</p>
                        </div>
                        <FaShieldAlt className="text-4xl text-emerald-100" />
                    </motion.div>

                    <motion.div variants={cardVariants} whileHover="hover" whileTap="tap" className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex justify-between items-center cursor-default">
                        <div>
                            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Intervention Success</p>
                            <h3 className="text-3xl font-black text-indigo-600">{interventionSuccessRate}%</h3>
                            <p className="text-[10px] mt-1 text-slate-500">{totalActions} Logged Actions</p>
                        </div>
                        <FaClipboardCheck className="text-4xl text-indigo-100" />
                    </motion.div>

                    <motion.div variants={cardVariants} whileHover="hover" whileTap="tap" className="bg-orange-500 p-6 rounded-2xl text-white shadow-lg flex justify-between items-center cursor-default">
                        <div>
                            <p className="text-orange-100 text-xs font-bold uppercase tracking-wider">Community Streak</p>
                            <h3 className="text-3xl font-black">{totalStreaks}</h3>
                            <p className="text-[10px] mt-1 opacity-80">Combined Sober Days</p>
                        </div>
                        <FaFire className="text-4xl opacity-20" />
                    </motion.div>
                </section>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* User Growth Trend */}
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                        <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                            <FaUserFriends className="text-emerald-500" /> Community Growth
                        </h3>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={registrationTrendData}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickMargin={10} />
                                    <YAxis stroke="#94a3b8" fontSize={11} />
                                    <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                                    <Line type="monotone" dataKey="Users" stroke="#10b981" strokeWidth={4} dot={{ r: 4, fill: '#10b981', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Wellness Overview (Utilizing checkinsData) */}
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                        <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                            <FaNotesMedical className="text-rose-500" /> Patient Wellness Snapshot
                        </h3>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={wellnessData}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis dataKey="status" stroke="#94a3b8" fontSize={11} />
                                    <YAxis stroke="#94a3b8" fontSize={11} />
                                    <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{ borderRadius: '12px', border: 'none' }} />
                                    <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                                        {wellnessData.map((_, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Intervention Distribution */}
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 lg:col-span-2">
                        <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                            <FaHistory className="text-indigo-500" /> Support Outcome Distribution
                        </h3>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie data={actionStatusData} innerRadius={70} outerRadius={90} paddingAngle={8} dataKey="value">
                                        {actionStatusData.map((_, index) => (
                                            <Cell key={`cell-${index}`} fill={index === 0 ? '#10b981' : '#6366f1'} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend verticalAlign="bottom" iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ManagementHubPage;