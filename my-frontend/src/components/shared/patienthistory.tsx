import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  Download, 
  History, 
  Calendar, 
  User, 
  CheckCircle, 
  XCircle,
  ChevronRight
} from 'lucide-react';
import { useGetActionsQuery } from '../../features/api/actionsApi';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Skeleton } from '../ui/skeleton';

const PatientHistory: React.FC = () => {
  const { data: actions, isLoading } = useGetActionsQuery();
  
  // States for Filtering
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Memoized filtering logic for performance
  const filteredActions = useMemo(() => {
    if (!actions) return [];
    return actions.filter((action) => {
      const matchesSearch = action.actionDescription.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === "all" 
        ? true 
        : statusFilter === "success" ? action.success : !action.success;
      return matchesSearch && matchesStatus;
    });
  }, [actions, searchTerm, statusFilter]);

  if (isLoading) return <HistoryLoadingSkeleton />;

  return (
    <div className="p-6 bg-gray-50 min-h-screen space-y-6">
      
      {/* 1. Header & Quick Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-emerald-600 mb-1">
            <History size={20} />
            <span className="text-xs font-black uppercase tracking-widest">Clinical Records</span>
          </div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Patient Intervention History</h1>
        </div>
        <Button variant="outline" className="bg-white border-gray-200 text-gray-700">
          <Download size={16} className="mr-2" /> Export Report
        </Button>
      </div>

      {/* 2. Filter Bar */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-wrap gap-4 items-center">
        <div className="relative flex-1 min-w-[280px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <Input 
            placeholder="Search intervention descriptions..." 
            className="pl-10" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter size={16} className="text-gray-400" />
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-11 rounded-xl border border-gray-200 px-4 text-sm font-bold focus:ring-2 focus:ring-emerald-100 outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="success">Successful</option>
            <option value="pending">Needs Follow-up</option>
          </select>
        </div>
      </div>

      {/* 3. Data Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="p-4 text-[10px] font-black uppercase text-gray-500 tracking-wider">Patient/User ID</th>
              <th className="p-4 text-[10px] font-black uppercase text-gray-500 tracking-wider">Action Description</th>
              <th className="p-4 text-[10px] font-black uppercase text-gray-500 tracking-wider text-center">Status</th>
              <th className="p-4 text-[10px] font-black uppercase text-gray-500 tracking-wider">Created At</th>
              <th className="p-4"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filteredActions.length > 0 ? (
              filteredActions.map((action) => (
                <tr key={action.actionId} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-xs">
                        {action.userId}
                      </div>
                      <span className="text-sm font-bold text-gray-900">User #{action.userId}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <p className="text-sm text-gray-600 line-clamp-1 max-w-md">
                      {action.actionDescription}
                    </p>
                  </td>
                  <td className="p-4">
                    <div className="flex justify-center">
                      {action.success ? (
                        <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-100 text-green-700 text-[10px] font-black uppercase">
                          <CheckCircle size={12} /> Success
                        </span>
                      ) : (
                        <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-700 text-[10px] font-black uppercase">
                          <XCircle size={12} /> Pending
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2 text-gray-500">
                      <Calendar size={14} />
                      <span className="text-xs font-medium">
                        {new Date().toLocaleDateString()} {/* Replace with real action date */}
                      </span>
                    </div>
                  </td>
                  <td className="p-4 text-right">
                    <button className="p-2 text-gray-300 hover:text-emerald-600 transition-colors">
                      <ChevronRight size={18} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="p-12 text-center">
                  <p className="text-gray-400 font-medium italic">No history records found matching your filters.</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Loading State Component
const HistoryLoadingSkeleton = () => (
  <div className="p-6 space-y-6">
    <div className="h-10 w-64 bg-gray-200 animate-pulse rounded-lg" />
    <div className="h-16 w-full bg-gray-200 animate-pulse rounded-2xl" />
    <div className="space-y-4">
      {[1, 2, 3, 4, 5].map((i) => (
        <Skeleton key={i} className="h-20 w-full" />
      ))}
    </div>
  </div>
);

export default PatientHistory;