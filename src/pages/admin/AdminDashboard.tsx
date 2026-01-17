import { useState, useEffect } from 'react';
import { 
  Users, Calendar, DollarSign, TrendingUp, TrendingDown,
  AlertTriangle, Clock, 
  Shield, MessageSquare,
  ArrowRight, Loader2, UserPlus, Map
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import * as adminDashboardApi from '../../api/services/adminDashboardApi';
import type { AdminDashboardDTO, RecentActivityDTO } from '../../types/adminDashboardTypes';

const AdminDashboard = () => {
  const [data, setData] = useState<AdminDashboardDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        const result = await adminDashboardApi.getDashboardData();
        setData(result);
      } catch (err) {
        console.error("Failed to fetch admin dashboard", err);
        setError("Failed to load dashboard data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  const getActivityIcon = (type: RecentActivityDTO['type']) => {
    switch (type) {
      case 'USER_REGISTER': return <UserPlus className="w-4 h-4 text-blue-600" />;
      case 'EVENT_CREATE': return <Map className="w-4 h-4 text-green-600" />;
      case 'PAYMENT': return <DollarSign className="w-4 h-4 text-purple-600" />;
      case 'REVIEW': return <MessageSquare className="w-4 h-4 text-orange-600" />;
      case 'REPORT': return <AlertTriangle className="w-4 h-4 text-red-600" />;
      default: return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const getActivityColor = (type: RecentActivityDTO['type']) => {
    switch (type) {
      case 'USER_REGISTER': return 'bg-blue-50';
      case 'EVENT_CREATE': return 'bg-green-50';
      case 'PAYMENT': return 'bg-purple-50';
      case 'REVIEW': return 'bg-orange-50';
      case 'REPORT': return 'bg-red-50';
      default: return 'bg-gray-50';
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="w-12 h-12 text-[#1E3A5F] animate-spin mb-4" />
        <p className="text-gray-600 font-medium">Loading platform analytics...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-6 text-center">
        <div className="bg-red-50 text-red-700 p-4 rounded-xl border border-red-100 max-w-lg mx-auto">
          <AlertTriangle className="w-8 h-8 mx-auto mb-2" />
          <h2 className="text-lg font-bold">Error</h2>
          <p>{error || "No data available."}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'NPR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-900 text-white p-4 rounded-xl shadow-xl">
          <p className="text-xs text-gray-400 mb-2">{label} 2026</p>
          <div className="space-y-1">
            <div className="flex justify-between items-center gap-4">
              <span className="text-xs">Gross Revenue:</span>
              <span className="font-bold text-white">{formatCurrency(payload[0].value)}</span>
            </div>
            <div className="flex justify-between items-center gap-4">
              <span className="text-xs">Platform Fees:</span>
              <span className="font-bold text-purple-400">{formatCurrency(payload[1].value)}</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  const TaskItemComponent = ({ icon, label, count, link }: any) => (
    <a href={link} className="flex items-center justify-between p-3 bg-white/10 rounded-lg hover:bg-white/20 transition-all cursor-pointer">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
          {icon}
        </div>
        <span className="text-sm font-medium">{label}</span>
      </div>
      {count !== undefined && (
        <span className={`text-xs font-bold px-2 py-1 rounded-full ${count > 0 ? 'bg-orange-500 text-white' : 'bg-white/20 text-white/50'}`}>
          {count}
        </span>
      )}
    </a>
  );

  const ProgressBarComponent = ({ label, value, color, tracker }: any) => (
    <div>
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-gray-700">{label}</span>
        <span className="text-xs text-gray-500">{tracker}</span>
      </div>
      <div className="w-full bg-gray-100 rounded-full h-2">
        <div
          className={`${color} h-2 rounded-full transition-all duration-500`}
          style={{ width: `${value}%` }}
        ></div>
      </div>
    </div>
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Command Center</h1>
          <p className="text-gray-600 mt-1">Real-time overview of the HikeSathi platform</p>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard 
          label="Total Users" 
          value={data.stats.totalUsers.toLocaleString()} 
          growth={data.stats.userGrowth} 
          icon={<Users className="w-6 h-6 text-blue-600" />} 
          bgColor="bg-blue-50"
          subValue={`${data.stats.activeUsers} active now`}
        />
        <StatCard 
          label="Total Revenue" 
          value={formatCurrency(data.stats.totalRevenue)} 
          growth={data.stats.revenueGrowth} 
          icon={<DollarSign className="w-6 h-6 text-purple-600" />} 
          bgColor="bg-purple-50"
          subValue={formatCurrency(data.stats.monthlyRevenue) + " this month"}
        />
        <StatCard 
          label="Verified Events" 
          value={data.stats.totalEvents.toLocaleString()} 
          growth={data.stats.eventGrowth} 
          icon={<Calendar className="w-6 h-6 text-green-600" />} 
          bgColor="bg-green-50"
          subValue={`${data.stats.activeEvents} currently active`}
        />
        <StatCard 
          label="Organizers" 
          value={data.stats.totalOrganizers.toLocaleString()} 
          growth={3.5} 
          icon={<Shield className="w-6 h-6 text-orange-600" />} 
          bgColor="bg-orange-50"
          subValue={`${data.stats.pendingOrganizers} pending approval`}
          highlight={data.stats.pendingOrganizers > 0}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Revenue Chart Section */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Revenue Analytics</h2>
              <p className="text-sm text-gray-500">Gross income vs Platform fees</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-[#1E3A5F] rounded-full"></div>
                <span className="text-xs text-gray-600">Gross</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-purple-400 rounded-full"></div>
                <span className="text-xs text-gray-600">Fees</span>
              </div>
            </div>
          </div>
          
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.revenueChart} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="month" 
                tick={{ fill: '#6b7280', fontSize: 12 }}
                axisLine={{ stroke: '#e5e7eb' }}
              />
              <YAxis 
                tick={{ fill: '#6b7280', fontSize: 12 }}
                axisLine={{ stroke: '#e5e7eb' }}
                tickFormatter={(value) => `NPR${(value / 1000).toFixed(0)}k`}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }} />
              <Bar 
                dataKey="revenue" 
                fill="#1E3A5F" 
                radius={[8, 8, 0, 0]}
                maxBarSize={50}
              />
              <Bar 
                dataKey="platformFees" 
                fill="#c084fc" 
                radius={[8, 8, 0, 0]}
                maxBarSize={50}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* System Dashboard Sidebar */}
        <div className="space-y-6">
          <div className="bg-[#1E3A5F] rounded-2xl shadow-lg p-6 text-white overflow-hidden relative">
            <div className="relative z-10">
              <h2 className="text-lg font-bold mb-4">Urgent Tasks</h2>
              <div className="space-y-3">
                <TaskItemComponent 
                  icon={<Shield className="w-4 h-4" />} 
                  label="Organizer Verifications" 
                  count={data.stats.pendingOrganizers} 
                  link="/admin-dashboard/organizer-verification"
                />
                <TaskItemComponent 
                  icon={<Calendar className="w-4 h-4" />} 
                  label="Payments Released" 
                  count={0}
                  link="/admin-dashboard/payments"
                />
              </div>
            </div>
            <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-white/5 rounded-full blur-2xl"></div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">User Metrics</h2>
            <div className="space-y-6">
              <ProgressBarComponent label="Hiker Growth" value={78} color="bg-blue-500" tracker="+182 this month" />
              <ProgressBarComponent label="Engagement Rate" value={64} color="bg-green-500" tracker="64.2% daily active" />
              <ProgressBarComponent label="Booking Conversion" value={42} color="bg-purple-500" tracker="3.5% avg" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Activity Feed */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold text-gray-900">Activity stream</h2>
            <button className="text-sm font-semibold text-[#1E3A5F] flex items-center gap-1 hover:translate-x-1 transition-transform">
              View Audit Log
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          
          <div className="space-y-6 relative before:absolute before:left-6 before:top-2 before:bottom-2 before:w-px before:bg-gray-100">
            {data.recentActivities.map((activity) => (
              <div key={activity.id} className="flex gap-6 relative group">
                <div className={`w-12 h-12 rounded-2xl shrink-0 flex items-center justify-center relative z-10 transition-transform group-hover:scale-110 ${getActivityColor(activity.type)}`}>
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-1 pb-6 border-b border-gray-50 last:border-0 last:pb-0">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="text-sm font-bold text-gray-900 group-hover:text-[#1E3A5F] transition-colors">{activity.title}</h3>
                    <span className="text-[10px] uppercase tracking-wider font-bold text-gray-400 bg-gray-50 px-2 py-1 rounded">
                      {new Date(activity.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{activity.description}</p>
                  <div className="flex items-center gap-4">
                     {activity.status && (
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          activity.status === 'COMPLETED' ? 'bg-green-100 text-green-700' : 
                          activity.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                        }`}>
                          {activity.status}
                        </span>
                     )}
                     <button className="text-[11px] font-bold text-[#1E3A5F] uppercase tracking-wide opacity-0 group-hover:opacity-100 transition-opacity">
                        View Details
                     </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Subcomponents for cleaner code
const StatCard = ({ label, value, growth, icon, bgColor, subValue, highlight = false }: any) => (
  <div className={`bg-white rounded-2xl shadow-sm border p-6 transition-all hover:shadow-md ${highlight ? 'border-orange-500 ring-4 ring-orange-50' : 'border-gray-100'}`}>
    <div className="flex justify-between items-start mb-4">
      <div className={`p-3 rounded-xl ${bgColor}`}>
        {icon}
      </div>
      <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full ${growth >= 0 ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50'}`}>
        {growth >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
        {Math.abs(growth)}%
      </div>
    </div>
    <p className="text-sm font-medium text-gray-500">{label}</p>
    <h3 className="text-2xl font-black text-gray-900 my-1">{value}</h3>
    <p className="text-xs text-gray-500">{subValue}</p>
  </div>
);

export default AdminDashboard;