import React, { useEffect, useState } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import { 
  GraduationCap, Search, Trash2, CheckCircle2, AlertCircle, 
  Loader2, Calendar, User, BookOpen, Ban, Clock
} from "lucide-react";
import axiosInstance from "../../api/axios";
import { API_ENDPOINTS } from "../../api/endpoints";

const AdminEnrollments: React.FC = () => {
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  
  // Modals / Actions state
  const [deleteConfirmEnrollment, setDeleteConfirmEnrollment] = useState<any | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [alert, setAlert] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [enrollmentsRes, usersRes, subjectsRes] = await Promise.all([
        axiosInstance.get(API_ENDPOINTS.ADMIN.ENROLLMENTS),
        axiosInstance.get(API_ENDPOINTS.ADMIN.USERS),
        axiosInstance.get(API_ENDPOINTS.ADMIN.SUBJECTS),
      ]);
      setEnrollments(enrollmentsRes.data);
      setStudents(usersRes.data.filter((u: any) => u.role === 'student'));
      setSubjects(subjectsRes.data);
    } catch (err) {
      console.error(err);
      showAlert('error', 'Failed to load enrollment records.');
    } finally {
      setLoading(false);
    }
  };

  const showAlert = (type: 'success' | 'error', message: string) => {
    setAlert({ type, message });
    setTimeout(() => setAlert(null), 4000);
  };

  const handleUpdateStatus = async (enrollmentId: number, newStatus: string) => {
    try {
      setActionLoading(true);
      const res = await axiosInstance.patch(`${API_ENDPOINTS.ADMIN.ENROLLMENTS}${enrollmentId}/`, {
        status: newStatus
      });
      
      // Update local state
      setEnrollments(enrollments.map(e => e.id === enrollmentId ? res.data : e));
      showAlert('success', `Enrollment status updated to "${newStatus}" successfully.`);
    } catch (err: any) {
      console.error(err);
      showAlert('error', 'Failed to update enrollment status.');
    } finally {
      setActionLoading(false);
    }
  };

  const executeDelete = async (id: number) => {
    try {
      setActionLoading(true);
      await axiosInstance.delete(`${API_ENDPOINTS.ADMIN.ENROLLMENTS}${id}/`);
      setEnrollments(enrollments.filter(e => e.id !== id));
      setDeleteConfirmEnrollment(null);
      showAlert('success', 'Enrollment record removed successfully.');
    } catch (err) {
      console.error(err);
      showAlert('error', 'Failed to remove enrollment record.');
    } finally {
      setActionLoading(false);
    }
  };

  // Filter enrollments based on search query and status tab
  const filteredEnrollments = enrollments.filter(enrollment => {
    const studentObj = students.find(s => s.id === enrollment.student);
    const subjectObj = subjects.find(s => s.id === enrollment.subject);
    
    const studentName = studentObj?.name || "";
    const studentUsername = studentObj?.username || "";
    const subjectName = subjectObj?.name || "";

    const matchesSearch = 
      studentName.toLowerCase().includes(search.toLowerCase()) ||
      studentUsername.toLowerCase().includes(search.toLowerCase()) ||
      subjectName.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter === 'all' || enrollment.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto space-y-6 p-4">
        {/* Title Block */}
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
          <h1 className="text-2xl font-black text-gray-800 tracking-tight">Student Enrollments</h1>
          <p className="text-gray-500 text-xs font-semibold mt-0.5">Manage, approve, or revoke student subject subscriptions</p>
        </div>

        {alert && (
          <div className={`p-4 rounded-2xl text-sm font-bold border transition-all ${
            alert.type === 'success' ? 'bg-green-50 text-green-700 border-green-100' : 'bg-red-50 text-red-700 border-red-100'
          }`}>
            {alert.message}
          </div>
        )}

        {/* Filter controls */}
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
          {/* Search */}
          <div className="flex items-center px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl gap-3">
            <Search className="text-gray-400 shrink-0" size={18} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-transparent outline-none text-sm font-medium text-gray-700 placeholder-gray-400"
              placeholder="Search by student name, username, or subject..."
            />
          </div>

          {/* Status Tabs */}
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'all', label: 'All Enrollments', count: enrollments.length },
              { id: 'pending', label: 'Pending', count: enrollments.filter(e => e.status === 'pending').length },
              { id: 'enrolled', label: 'Enrolled', count: enrollments.filter(e => e.status === 'enrolled').length },
              { id: 'payment_pending', label: 'Payment Pending', count: enrollments.filter(e => e.status === 'payment_pending').length }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setStatusFilter(tab.id)}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                  statusFilter === tab.id 
                    ? 'bg-red-600 text-white shadow-md shadow-red-100' 
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                }`}
              >
                <span>{tab.label}</span>
                <span className={`px-2 py-0.5 text-[10px] rounded-md ${
                  statusFilter === tab.id ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-600'
                }`}>{tab.count}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Table Wrapper */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-x-auto">
          <table className="w-full text-left min-w-[950px]">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-8 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Student</th>
                <th className="px-8 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Enrolled Subject</th>
                <th className="px-8 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Enrolled Date</th>
                <th className="px-8 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Status</th>
                <th className="px-8 py-4 text-xs font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td colSpan={5} className="text-center py-20 text-gray-400 font-bold italic">
                    Loading enrollment records...
                  </td>
                </tr>
              ) : filteredEnrollments.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-16 text-gray-400 font-bold italic">
                    No enrollment records found.
                  </td>
                </tr>
              ) : (
                filteredEnrollments.map((enrollment) => {
                  const studentObj = students.find(s => s.id === enrollment.student);
                  const subjectObj = subjects.find(s => s.id === enrollment.subject);
                  
                  return (
                    <tr key={enrollment.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-8 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-700 font-bold">
                            <User size={18} />
                          </div>
                          <div>
                            <p className="font-bold text-gray-800">{studentObj?.name || `Student #${enrollment.student}`}</p>
                            <p className="text-xs text-gray-400 font-medium">Username: {studentObj?.username}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-4">
                        <div className="flex items-center gap-2">
                          <BookOpen size={16} className="text-gray-400" />
                          <span className="font-bold text-gray-700">{subjectObj?.name || `Subject #${enrollment.subject}`}</span>
                        </div>
                      </td>
                      <td className="px-8 py-4">
                        <div className="flex items-center gap-2 text-xs text-gray-500 font-semibold">
                          <Calendar size={14} className="text-gray-300" />
                          <span>{new Date(enrollment.enrolled_at).toLocaleDateString()}</span>
                        </div>
                      </td>
                      <td className="px-8 py-4">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                          enrollment.status === 'enrolled' 
                            ? 'bg-green-100 text-green-700' 
                            : enrollment.status === 'pending'
                            ? 'bg-amber-100 text-amber-700'
                            : 'bg-orange-100 text-orange-700'
                        }`}>
                          {enrollment.status === 'payment_pending' ? 'Payment Pending' : enrollment.status}
                        </span>
                      </td>
                      <td className="px-8 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {enrollment.status !== 'enrolled' && (
                            <button
                              onClick={() => handleUpdateStatus(enrollment.id, 'enrolled')}
                              disabled={actionLoading}
                              className="p-2 hover:bg-white rounded-lg border border-transparent hover:border-gray-200 text-green-500 hover:text-green-700 shadow-sm transition-all"
                              title="Approve / Enroll"
                            >
                              <CheckCircle2 size={16} />
                            </button>
                          )}
                          {enrollment.status === 'pending' && (
                            <button
                              onClick={() => handleUpdateStatus(enrollment.id, 'payment_pending')}
                              disabled={actionLoading}
                              className="p-2 hover:bg-white rounded-lg border border-transparent hover:border-gray-200 text-amber-500 hover:text-amber-700 shadow-sm transition-all"
                              title="Set Payment Pending"
                            >
                              <Clock size={16} />
                            </button>
                          )}
                          <button
                            onClick={() => setDeleteConfirmEnrollment(enrollment)}
                            disabled={actionLoading}
                            className="p-2 hover:bg-white rounded-lg border border-transparent hover:border-gray-200 text-gray-400 hover:text-red-600 shadow-sm transition-all"
                            title="Remove Enrollment"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmEnrollment && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-8 shadow-2xl border border-gray-100 flex flex-col items-center text-center animate-scale-in">
            <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mb-5 border-2 border-red-100 shadow-inner">
              <Ban className="w-7 h-7 animate-bounce" />
            </div>

            <h3 className="text-xl font-black text-gray-800 tracking-tight mb-2">
              Revoke Enrollment?
            </h3>
            
            <p className="text-gray-500 text-sm leading-relaxed mb-6 font-semibold">
              Are you sure you want to permanently revoke this student's enrollment record? They will lose access to all study materials and classroom content immediately.
            </p>

            <div className="flex gap-3 w-full">
              <button
                type="button"
                onClick={() => setDeleteConfirmEnrollment(null)}
                className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-bold text-xs uppercase tracking-wider transition-all active:scale-[0.98]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => executeDelete(deleteConfirmEnrollment.id)}
                disabled={actionLoading}
                className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold text-xs uppercase tracking-wider transition-all shadow-md shadow-red-200 flex items-center justify-center gap-1.5 active:scale-[0.98] disabled:opacity-50"
              >
                {actionLoading ? <Loader2 className="animate-spin" size={14} /> : <Trash2 size={14} />}
                Yes, Revoke
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminEnrollments;
