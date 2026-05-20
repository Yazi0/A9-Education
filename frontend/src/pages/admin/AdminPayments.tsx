import React, { useEffect, useState } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import { 
  CreditCard, Search, CheckCircle2, XCircle, Plus, 
  Loader2, Calendar, User, BookOpen, Trash2, Save, 
  DollarSign, Landmark, RefreshCw
} from "lucide-react";
import axiosInstance from "../../api/axios";
import { API_ENDPOINTS } from "../../api/endpoints";

const AdminPayments: React.FC = () => {
  const [payments, setPayments] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  
  // Modals state
  const [isRecordOpen, setIsRecordOpen] = useState(false);
  const [deleteConfirmPayment, setDeleteConfirmPayment] = useState<any | null>(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [alert, setAlert] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  // Form Fields
  const [formData, setFormData] = useState({
    student: "",
    subject: "",
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
    amount: "",
    payment_method: "cash",
    status: "approved",
  });

  const months = [
    { value: 1, label: "January" },
    { value: 2, label: "February" },
    { value: 3, label: "March" },
    { value: 4, label: "April" },
    { value: 5, label: "May" },
    { value: 6, label: "June" },
    { value: 7, label: "July" },
    { value: 8, label: "August" },
    { value: 9, label: "September" },
    { value: 10, label: "October" },
    { value: 11, label: "November" },
    { value: 12, label: "December" },
  ];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [paymentsRes, usersRes, subjectsRes] = await Promise.all([
        axiosInstance.get(API_ENDPOINTS.ADMIN.PAYMENTS),
        axiosInstance.get(API_ENDPOINTS.ADMIN.USERS),
        axiosInstance.get(API_ENDPOINTS.ADMIN.SUBJECTS),
      ]);
      setPayments(paymentsRes.data);
      setStudents(usersRes.data.filter((u: any) => u.role === 'student'));
      setSubjects(subjectsRes.data);
    } catch (err) {
      console.error(err);
      showAlert('error', 'Failed to fetch financial / payment records.');
    } finally {
      setLoading(false);
    }
  };

  const showAlert = (type: 'success' | 'error', message: string) => {
    setAlert({ type, message });
    setTimeout(() => setAlert(null), 4000);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleOpenRecord = () => {
    setFormData({
      student: students[0]?.id || "",
      subject: subjects[0]?.id || "",
      month: new Date().getMonth() + 1,
      year: new Date().getFullYear(),
      amount: subjects[0]?.class_fee || "2500",
      payment_method: "cash",
      status: "approved",
    });
    setIsRecordOpen(true);
  };

  const handleSubjectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedSubId = Number(e.target.value);
    const subObj = subjects.find(s => s.id === selectedSubId);
    setFormData({
      ...formData,
      subject: e.target.value,
      amount: subObj ? subObj.class_fee.toString() : ""
    });
  };

  const handleRecordPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.student || !formData.subject || !formData.amount) {
      showAlert('error', 'Please fill in all required fields.');
      return;
    }

    try {
      setModalLoading(true);
      const res = await axiosInstance.post(API_ENDPOINTS.ADMIN.PAYMENTS, formData);
      setPayments([res.data, ...payments]);
      setIsRecordOpen(false);
      showAlert('success', 'Manual payment receipt recorded successfully.');
    } catch (err: any) {
      console.error(err);
      showAlert('error', err.response?.data?.detail || 'Failed to record payment.');
    } finally {
      setModalLoading(false);
    }
  };

  const handleUpdateStatus = async (id: number, newStatus: string) => {
    try {
      setModalLoading(true);
      const res = await axiosInstance.patch(`${API_ENDPOINTS.ADMIN.PAYMENTS}${id}/`, {
        status: newStatus
      });
      setPayments(payments.map(p => p.id === id ? res.data : p));
      showAlert('success', `Payment receipt status marked as "${newStatus}".`);
    } catch (err) {
      console.error(err);
      showAlert('error', 'Failed to update payment status.');
    } finally {
      setModalLoading(false);
    }
  };

  const executeDelete = async (id: number) => {
    try {
      setModalLoading(true);
      await axiosInstance.delete(`${API_ENDPOINTS.ADMIN.PAYMENTS}${id}/`);
      setPayments(payments.filter(p => p.id !== id));
      setDeleteConfirmPayment(null);
      showAlert('success', 'Payment record deleted successfully.');
    } catch (err) {
      console.error(err);
      showAlert('error', 'Failed to delete payment record.');
    } finally {
      setModalLoading(false);
    }
  };

  // Filter payments based on search query and status tab
  const filteredPayments = payments.filter(payment => {
    const studentObj = students.find(s => s.id === payment.student);
    const subjectObj = subjects.find(s => s.id === payment.subject);
    
    const studentName = studentObj?.name || "";
    const studentUsername = studentObj?.username || "";
    const subjectName = subjectObj?.name || "";

    const matchesSearch = 
      studentName.toLowerCase().includes(search.toLowerCase()) ||
      studentUsername.toLowerCase().includes(search.toLowerCase()) ||
      subjectName.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter === 'all' || payment.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto space-y-6 p-4">
        {/* Title Block */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
          <div>
            <h1 className="text-2xl font-black text-gray-800 tracking-tight">Payments & Ledger</h1>
            <p className="text-gray-500 text-xs font-semibold mt-0.5">Audit student payments, approve subscriptions, and log cash fees</p>
          </div>
          <button
            onClick={handleOpenRecord}
            className="py-3 px-5 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 text-white rounded-xl font-bold text-xs uppercase tracking-wider shadow-lg shadow-red-200/50 flex items-center gap-2 transition-all active:scale-[0.98]"
          >
            <Plus size={16} /> Record Payment
          </button>
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
              placeholder="Search payments by student name, username, or subject..."
            />
          </div>

          {/* Status Tabs */}
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'all', label: 'All Transactions', count: payments.length },
              { id: 'approved', label: 'Approved / Completed', count: payments.filter(p => p.status === 'approved').length },
              { id: 'pending', label: 'Pending Audit', count: payments.filter(p => p.status === 'pending').length },
              { id: 'declined', label: 'Declined', count: payments.filter(p => p.status === 'declined').length }
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
                <th className="px-8 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Subject & Month</th>
                <th className="px-8 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Method</th>
                <th className="px-8 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Amount</th>
                <th className="px-8 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Status</th>
                <th className="px-8 py-4 text-xs font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td colSpan={6} className="text-center py-20 text-gray-400 font-bold italic">
                    Loading payments...
                  </td>
                </tr>
              ) : filteredPayments.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-16 text-gray-400 font-bold italic">
                    No transactions found.
                  </td>
                </tr>
              ) : (
                filteredPayments.map((payment) => {
                  const studentObj = students.find(s => s.id === payment.student);
                  const subjectObj = subjects.find(s => s.id === payment.subject);
                  const monthLabel = months.find(m => m.value === payment.month)?.label || `M-${payment.month}`;

                  return (
                    <tr key={payment.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-8 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-green-700 font-bold">
                            <User size={18} />
                          </div>
                          <div>
                            <p className="font-bold text-gray-800">{studentObj?.name || `Student #${payment.student}`}</p>
                            <p className="text-xs text-gray-500 font-medium">Username: {studentObj?.username}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-4">
                        <p className="font-bold text-gray-700">{subjectObj?.name || `Subject #${payment.subject}`}</p>
                        <div className="flex items-center gap-1.5 text-xs text-gray-400 font-semibold mt-0.5">
                          <Calendar size={12} />
                          <span>{monthLabel} {payment.year}</span>
                        </div>
                      </td>
                      <td className="px-8 py-4">
                        <span className="px-2.5 py-1 rounded-md text-[10px] font-black bg-gray-100 text-gray-700 uppercase tracking-wider flex items-center gap-1 w-max">
                          {payment.payment_method === 'cash' ? <DollarSign size={10} /> : <Landmark size={10} />}
                          {payment.payment_method}
                        </span>
                      </td>
                      <td className="px-8 py-4">
                        <span className="font-extrabold text-gray-800">Rs. {payment.amount}</span>
                      </td>
                      <td className="px-8 py-4">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                          payment.status === 'approved' 
                            ? 'bg-green-100 text-green-700' 
                            : payment.status === 'pending'
                            ? 'bg-amber-100 text-amber-700'
                            : 'bg-red-100 text-red-700'
                        }`}>
                          {payment.status}
                        </span>
                      </td>
                      <td className="px-8 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {payment.status !== 'approved' && (
                            <button
                              onClick={() => handleUpdateStatus(payment.id, 'approved')}
                              disabled={modalLoading}
                              className="p-2 hover:bg-white rounded-lg border border-transparent hover:border-gray-200 text-green-500 hover:text-green-700 shadow-sm transition-all"
                              title="Mark Approved"
                            >
                              <CheckCircle2 size={16} />
                            </button>
                          )}
                          {payment.status !== 'declined' && (
                            <button
                              onClick={() => handleUpdateStatus(payment.id, 'declined')}
                              disabled={modalLoading}
                              className="p-2 hover:bg-white rounded-lg border border-transparent hover:border-gray-200 text-red-500 hover:text-red-700 shadow-sm transition-all"
                              title="Mark Declined"
                            >
                              <XCircle size={16} />
                            </button>
                          )}
                          <button
                            onClick={() => setDeleteConfirmPayment(payment)}
                            disabled={modalLoading}
                            className="p-2 hover:bg-white rounded-lg border border-transparent hover:border-gray-200 text-gray-400 hover:text-red-600 shadow-sm transition-all"
                            title="Delete Record"
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

      {/* Record Payment Modal */}
      {isRecordOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-8 shadow-2xl relative border border-gray-100">
            <h3 className="text-xl font-black text-gray-800 tracking-tight mb-6">
              Record Manual Payment Receipt
            </h3>

            <form onSubmit={handleRecordPayment} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Select Student <span className="text-red-500">*</span>
                </label>
                <select
                  name="student"
                  value={formData.student}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 outline-none text-sm font-semibold text-gray-700"
                  required
                >
                  <option value="">Select a Student</option>
                  {students.map(s => (
                    <option key={s.id} value={s.id}>{s.name} ({s.username})</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Select Subject <span className="text-red-500">*</span>
                </label>
                <select
                  name="subject"
                  value={formData.subject}
                  onChange={handleSubjectChange}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 outline-none text-sm font-semibold text-gray-700"
                  required
                >
                  <option value="">Select a Subject</option>
                  {subjects.map(sub => (
                    <option key={sub.id} value={sub.id}>{sub.name} (Rs. {sub.class_fee})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Subscription Month <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="month"
                    value={formData.month}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 outline-none text-sm font-semibold text-gray-700"
                    required
                  >
                    {months.map(m => (
                      <option key={m.value} value={m.value}>{m.label}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Subscription Year <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="year"
                    value={formData.year}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 outline-none text-sm font-semibold text-gray-800"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Payment Method
                  </label>
                  <select
                    name="payment_method"
                    value={formData.payment_method}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 outline-none text-sm font-semibold text-gray-700"
                  >
                    <option value="cash">Cash Payment</option>
                    <option value="bank_transfer">Bank Transfer</option>
                    <option value="online">Online Card</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Amount Collected (Rs.) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="amount"
                    value={formData.amount}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 outline-none text-sm font-semibold text-gray-800"
                    required
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setIsRecordOpen(false)}
                  className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-bold text-xs uppercase tracking-wider transition-all active:scale-[0.98]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={modalLoading}
                  className="flex-1 py-3 bg-red-700 hover:bg-red-800 text-white rounded-xl font-bold text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-1.5 active:scale-[0.98] disabled:opacity-50"
                >
                  {modalLoading ? <Loader2 className="animate-spin" size={14} /> : <Save size={14} />}
                  Record Receipt
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmPayment && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-8 shadow-2xl border border-gray-100 flex flex-col items-center text-center animate-scale-in">
            <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mb-5 border-2 border-red-100 shadow-inner">
              <Trash2 className="w-7 h-7 animate-bounce" />
            </div>

            <h3 className="text-xl font-black text-gray-800 tracking-tight mb-2">
              Delete Payment Record?
            </h3>
            
            <p className="text-gray-500 text-sm leading-relaxed mb-6 font-semibold">
              Are you sure you want to permanently delete this payment transaction record? This action will void the student's monthly active subscription status!
            </p>

            <div className="flex gap-3 w-full">
              <button
                type="button"
                onClick={() => setDeleteConfirmPayment(null)}
                className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-bold text-xs uppercase tracking-wider transition-all active:scale-[0.98]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => executeDelete(deleteConfirmPayment.id)}
                disabled={modalLoading}
                className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold text-xs uppercase tracking-wider transition-all shadow-md shadow-red-200 flex items-center justify-center gap-1.5 active:scale-[0.98] disabled:opacity-50"
              >
                {modalLoading ? <Loader2 className="animate-spin" size={14} /> : <Trash2 size={14} />}
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminPayments;
