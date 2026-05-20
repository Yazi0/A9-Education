import React, { useEffect, useState } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import { 
  Users, BookOpen, GraduationCap, DollarSign, 
  ArrowUpRight, ArrowDownRight, Activity
} from "lucide-react";
import axiosInstance from "../../api/axios";
import { API_ENDPOINTS } from "../../api/endpoints";

const AdminOverview: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axiosInstance.get(API_ENDPOINTS.ADMIN.STATS);
        setStats(res.data);
      } catch (err) {
        console.error("Failed to load admin stats", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex h-full items-center justify-center">
          <Activity className="animate-spin text-red-600" size={48} />
        </div>
      </AdminLayout>
    );
  }

  const statCards = [
    { name: 'Total Students', value: stats?.total_students || 0, icon: Users, color: 'text-blue-600', bg: 'bg-blue-100', trend: 'up' },
    { name: 'Total Teachers', value: stats?.total_teachers || 0, icon: GraduationCap, color: 'text-purple-600', bg: 'bg-purple-100', trend: 'up' },
    { name: 'Total Subjects', value: stats?.total_subjects || 0, icon: BookOpen, color: 'text-orange-600', bg: 'bg-orange-100', trend: 'down' },
    { name: 'Total Revenue', value: `Rs. ${stats?.total_revenue || 0}`, icon: DollarSign, color: 'text-green-600', bg: 'bg-green-100', trend: 'up' },
  ];

  return (
    <AdminLayout>
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.name} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-lg transition-transform hover:-translate-y-1">
              <div className={`${card.bg} p-4 rounded-2xl`}>
                <Icon className={`${card.color}`} size={32} />
              </div>
              <div>
                <p className="text-gray-500 font-medium text-sm">{card.name}</p>
                <div className="flex items-center gap-2">
                  <h3 className="text-2xl font-bold text-gray-800">{card.value}</h3>
                  {card.trend === 'up' ? <ArrowUpRight className="text-green-500" size={16} /> : <ArrowDownRight className="text-red-500" size={16} />}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Payments */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center justify-between">
            Recent Payments
            <button className="text-red-600 text-sm font-medium hover:underline">View All</button>
          </h3>
          <div className="space-y-4">
            {stats?.recent_payments?.map((payment: any) => (
              <div key={payment.id} className="flex justify-between items-center p-4 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-700">
                    <DollarSign size={20} />
                  </div>
                  <div>
                    <p className="font-bold text-gray-800 tracking-tight">{payment.student__username}</p>
                    <p className="text-xs text-gray-500">Subject Subscription</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-800">Rs. {payment.amount}</p>
                  <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${payment.status === 'approved' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {payment.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Enrollments */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center justify-between">
            Recent Enrollments
            <button className="text-red-600 text-sm font-medium hover:underline">View All</button>
          </h3>
          <div className="space-y-4">
            {stats?.recent_enrollments?.map((enrollment: any) => (
              <div key={enrollment.id} className="flex justify-between items-center p-4 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700">
                    <GraduationCap size={20} />
                  </div>
                  <div>
                    <p className="font-bold text-gray-800 tracking-tight">{enrollment.student__username}</p>
                    <p className="text-xs text-gray-500">{enrollment.subject__name}</p>
                  </div>
                </div>
                <div className="text-right text-sm">
                  <p className="text-gray-500 italic">Enrolled</p>
                  <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-700`}>
                    {enrollment.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminOverview;
