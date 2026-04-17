import { AdminLayout } from "@/components/layout/admin-layout";
import { useGetAdminStats, useGetRecentActivity, useGetBookingsByService } from "@workspace/api-client-react";
import { DollarSign, Briefcase, Users, UserCheck, Activity, Calendar, User, Wrench } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { format } from "date-fns";

export default function AdminDashboard() {
  const { data: stats, isLoading: statsLoading } = useGetAdminStats();
  const { data: recentActivity, isLoading: activityLoading } = useGetRecentActivity();
  const { data: bookingsChart, isLoading: chartLoading } = useGetBookingsByService();

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "booking": return <Calendar className="w-4 h-4" />;
      case "worker": return <User className="w-4 h-4" />;
      case "completion": return <Wrench className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case "booking": return "bg-blue-100 text-blue-600";
      case "worker": return "bg-purple-100 text-purple-600";
      case "completion": return "bg-green-100 text-green-600";
      default: return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <AdminLayout>
      <div className="flex-1 overflow-auto bg-gray-50/50 p-6 md:p-8">
        <h1 className="text-2xl font-bold text-slate-900 mb-6">Dashboard Overview</h1>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white border border-border rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-slate-500">Total Revenue</h3>
              <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                <DollarSign className="w-5 h-5" />
              </div>
            </div>
            <div className="text-3xl font-bold text-slate-900">
              {statsLoading ? "..." : `₹${stats?.totalRevenue.toLocaleString()}`}
            </div>
          </div>
          
          <div className="bg-white border border-border rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-slate-500">Active Bookings</h3>
              <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                <Briefcase className="w-5 h-5" />
              </div>
            </div>
            <div className="text-3xl font-bold text-slate-900">
              {statsLoading ? "..." : stats?.activeBookings}
            </div>
          </div>

          <div className="bg-white border border-border rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-slate-500">Active Workers</h3>
              <div className="w-10 h-10 rounded-full bg-primary/20 text-primary flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
            </div>
            <div className="text-3xl font-bold text-slate-900">
              {statsLoading ? "..." : stats?.activeWorkers}
            </div>
          </div>

          <div className="bg-white border border-border rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-slate-500">Pending Verifications</h3>
              <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center">
                <UserCheck className="w-5 h-5" />
              </div>
            </div>
            <div className="text-3xl font-bold text-slate-900">
              {statsLoading ? "..." : stats?.pendingVerifications}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Chart */}
          <div className="lg:col-span-2 bg-white border border-border rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 mb-6">Bookings by Service</h3>
            <div className="h-[300px] w-full">
              {chartLoading ? (
                <div className="w-full h-full flex items-center justify-center text-slate-400">Loading chart...</div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={bookingsChart} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <XAxis dataKey="service" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                    <Tooltip 
                      cursor={{ fill: '#f8fafc' }} 
                      contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    />
                    <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                      {bookingsChart?.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill="#F59E0B" />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white border border-border rounded-xl p-6 shadow-sm flex flex-col">
            <h3 className="text-lg font-bold text-slate-900 mb-6">Recent Activity</h3>
            <div className="flex-1 overflow-y-auto pr-2 space-y-6">
              {activityLoading ? (
                <div className="space-y-4">
                  {[1,2,3,4].map(i => (
                    <div key={i} className="flex gap-4">
                      <div className="w-10 h-10 rounded-full bg-slate-100 animate-pulse flex-shrink-0" />
                      <div className="space-y-2 flex-1">
                        <div className="h-4 bg-slate-100 rounded w-3/4 animate-pulse" />
                        <div className="h-3 bg-slate-100 rounded w-1/2 animate-pulse" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                recentActivity?.map((activity) => (
                  <div key={activity.id} className="flex gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${getActivityColor(activity.type)}`}>
                      {getActivityIcon(activity.type)}
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-slate-900">{activity.title}</h4>
                      <p className="text-xs text-slate-500 mt-0.5">{activity.subtitle}</p>
                      <span className="text-[10px] text-slate-400 mt-1 block">
                        {format(new Date(activity.createdAt), "MMM d, h:mm a")}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
