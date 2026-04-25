import { FaUsers, FaHeartbeat, FaShieldAlt, FaClipboardCheck, FaHistory, FaUserFriends, FaFire } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Legend, BarChart, Bar } from 'recharts';
import { userApi } from '../../features/api/userApi';
import { partnerApi } from '../../features/api/partnerApi';
import { supportActionsApi } from '../../features/api/actionsApi';
import { checkinsApi } from '../../features/api/checkinsApi'; // Assuming this exists for check-in history
import { useSelector } from 'react-redux';
import type { RootState } from '../../app/types';
import { PuffLoader } from 'react-spinners';

const cardVariants = {
    hover: { scale: 1.02, transition: { type: "spring" as const , stiffness: 300 } },
    tap: { scale: 0.98 },
};

const COLORS = ['#10b981', '#ef4444', '#f59e0b', '#3b82f6'];

export const ManagementHubPage = () => {
    const { isAuthenticated } = useSelector((state: RootState) => state.auth);

    // --- API Integration ---
    const { data: usersData = [], isLoading: isLoadingUsers } = userApi.useGetAllUsersProfilesQuery(undefined, { skip: !isAuthenticated });
    const { data: partnersData = [], isLoading: isLoadingPartners } = partnerApi.useGetSupportPartnersQuery(undefined, { skip: !isAuthenticated });
    const { data: actionsData = [], isLoading: isLoadingActions } = supportActionsApi.useGetActionsQuery(undefined, { skip: !isAuthenticated });
    const { data: checkinsData = [], isLoading: isLoadingCheckins } = checkinsApi.useGetAllCheckinsQuery(undefined, { skip: !isAuthenticated });

    const overallLoading = isLoadingUsers || isLoadingPartners || isLoadingActions || isLoadingCheckins;

    // --- Data Processing ---
    const patients = usersData.filter((u: any) => u.userType === 'patient');
    const admins = usersData.filter((u: any) => u.userType === 'admin');
    
    // Recovery Metrics
    const totalStreaks = patients.reduce((sum: number, p: any) => sum + (p.streak_days || 0), 0);
    const highRiskPatients = checkinsData.filter((c: any) => c.status === 'relapsed' || c.status === 'struggling').length;

    // Intervention Success Rate
    const successfulActions = actionsData.filter((a: any) => a.success).length;
    const interventionSuccessRate = actionsData.length > 0 ? Math.round((successfulActions / actionsData.length) * 100) : 0;

    // Chart: Registrations Over Time
    const registrationsByDate = usersData.reduce((acc: any, user: any) => {
        const date = user.createdAt?.split('T')[0] || 'Unknown';
        acc[date] = (acc[date] || 0) + 1;
        return acc;
    }, {});
    const registrationTrendData = Object.keys(registrationsByDate).sort().map(date => ({ name: date, Users: registrationsByDate[date] }));

    // Chart: Intervention Status (Pie)
    const actionStatusData = [
        { name: 'Successful', value: successfulActions },
        { name: 'Needs Follow-up', value: actionsData.length - successfulActions }
    ].filter(v => v.value > 0);

    return (
        <div className="min-h-screen bg-slate-50 p-6">
            <div className="max-w-7xl mx-auto space-y-8">
                <header className="flex justify-between items-center bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                    <div>
                        <h1 className="text-3xl font-black text-slate-800 tracking-tight">Drug-Revive Analytics 🏥</h1>
                        <p className="text-slate-500">Monitoring recovery progress and support network efficacy</p>
                    </div>
                    {overallLoading && <PuffLoader color="#10b981" size={40} />}
                </header>

                {/* Summary Grid */}
                <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <motion.div variants={cardVariants} whileHover="hover" className="bg-emerald-600 p-6 rounded-2xl text-white shadow-lg flex justify-between items-center">
                        <div>
                            <p className="text-emerald-100 text-xs font-bold uppercase">Total Patients</p>
                            <h3 className="text-3xl font-black">{patients.length}</h3>
                            <p className="text-[10px] mt-1 opacity-80">Total Users: {usersData.length}</p>
                        </div>
                        <FaHeartbeat className="text-4xl opacity-20" />
                    </motion.div>

                    <motion.div variants={cardVariants} whileHover="hover" className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex justify-between items-center">
                        <div>
                            <p className="text-slate-400 text-xs font-bold uppercase">Support Network</p>
                            <h3 className="text-3xl font-black text-slate-800">{partnersData.length}</h3>
                            <p className="text-[10px] mt-1 text-emerald-600 font-bold">Active Partners</p>
                        </div>
                        <FaShieldAlt className="text-4xl text-emerald-100" />
                    </motion.div>

                    <motion.div variants={cardVariants} whileHover="hover" className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex justify-between items-center">
                        <div>
                            <p className="text-slate-400 text-xs font-bold uppercase">Intervention Success</p>
                            <h3 className="text-3xl font-black text-indigo-600">{interventionSuccessRate}%</h3>
                            <p className="text-[10px] mt-1 text-slate-500">{actionsData.length} Total Logs</p>
                        </div>
                        <FaClipboardCheck className="text-4xl text-indigo-100" />
                    </motion.div>

                    <motion.div variants={cardVariants} whileHover="hover" className="bg-orange-500 p-6 rounded-2xl text-white shadow-lg flex justify-between items-center">
                        <div>
                            <p className="text-orange-100 text-xs font-bold uppercase">Total Recovery Days</p>
                            <h3 className="text-3xl font-black">{totalStreaks}</h3>
                            <p className="text-[10px] mt-1 opacity-80">Combined Patient Streaks</p>
                        </div>
                        <FaFire className="text-4xl opacity-20" />
                    </motion.div>
                </section>

                {/* Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* User Growth */}
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                        <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                            <FaUserFriends className="text-emerald-500" /> Community Growth
                        </h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={registrationTrendData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
                                <YAxis stroke="#94a3b8" fontSize={12} />
                                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                                <Line type="monotone" dataKey="Users" stroke="#10b981" strokeWidth={3} dot={{ r: 4, fill: '#10b981' }} activeDot={{ r: 6 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Intervention Outcomes */}
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                        <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                            <FaHistory className="text-indigo-500" /> Intervention Outcomes
                        </h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie data={actionStatusData} innerRadius={80} outerRadius={100} paddingAngle={5} dataKey="value">
                                    {actionStatusData.map((_, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend verticalAlign="bottom" height={36}/>
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ManagementHubPage;