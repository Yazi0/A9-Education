import React, { useEffect, useState } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import { 
  Users, Search, UserCheck, UserX, 
  Edit2, Trash2, Mail, Phone, GraduationCap, Shield, Layers, Filter, X, Save, Loader2 
} from "lucide-react";
import axiosInstance from "../../api/axios";
import { API_ENDPOINTS } from "../../api/endpoints";

const AdminUsers: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [grades, setGrades] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Main Role Tab: 'student' | 'teacher' | 'admin'
  const [activeTab, setActiveTab] = useState<'student' | 'teacher' | 'admin'>('student');
  
  // Student specific filters
  const [selectedGrade, setSelectedGrade] = useState<string>('all');
  
  // Teacher specific filters: 'all' | 'ol' | 'al'
  const [teacherCategory, setTeacherCategory] = useState<'all' | 'ol' | 'al'>('all');

  // Edit Modal State
  const [editingUser, setEditingUser] = useState<any | null>(null);
  const [deleteConfirmUser, setDeleteConfirmUser] = useState<any | null>(null);
  const [editFormData, setEditFormData] = useState({
    name: "",
    username: "",
    email: "",
    phone: "",
    is_active: true,
    current_grade: "",
    subject: "",
  });
  const [editLoading, setEditLoading] = useState(false);

  // Status Alerts
  const [alert, setAlert] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const [usersRes, gradesRes] = await Promise.all([
        axiosInstance.get(API_ENDPOINTS.ADMIN.USERS),
        axiosInstance.get("users/grades/")
      ]);
      setUsers(usersRes.data);
      setGrades(gradesRes.data);
    } catch (err) {
      console.error("Failed to load initial data", err);
      showAlert('error', 'Failed to load user records.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  const showAlert = (type: 'success' | 'error', message: string) => {
    setAlert({ type, message });
    setTimeout(() => setAlert(null), 5000);
  };

  // Helper functions for categorizing O/L & A/L teachers
  const isOLTeacher = (user: any) => {
    if (user.grades_detail && user.grades_detail.length > 0) {
      return user.grades_detail.some((g: any) => {
        const name = g.name.toLowerCase();
        return name.includes("10") || name.includes("11") || name.includes("o/l") || name.includes("ol");
      });
    }
    const subject = (user.subject || "").toLowerCase();
    return subject.includes("o/l") || subject.includes("ol") || subject.includes("10") || subject.includes("11");
  };

  const isALTeacher = (user: any) => {
    if (user.grades_detail && user.grades_detail.length > 0) {
      return user.grades_detail.some((g: any) => {
        const name = g.name.toLowerCase();
        return name.includes("12") || name.includes("13") || name.includes("a/l") || name.includes("al");
      });
    }
    const subject = (user.subject || "").toLowerCase();
    return subject.includes("a/l") || subject.includes("al") || subject.includes("12") || subject.includes("13");
  };

  // Delete User handler
  const executeDelete = async (userId: number, username: string) => {
    try {
      setEditLoading(true);
      await axiosInstance.delete(`${API_ENDPOINTS.ADMIN.USERS}${userId}/`);
      setUsers(users.filter(u => u.id !== userId));
      showAlert('success', `User account for "${username}" deleted successfully.`);
      setDeleteConfirmUser(null);
    } catch (err: any) {
      console.error(err);
      showAlert('error', err.response?.data?.error || 'Failed to delete user. Ensure you have proper administrative privileges.');
    } finally {
      setEditLoading(false);
    }
  };

  // Edit User Modal handlers
  const handleOpenEdit = (user: any) => {
    setEditingUser(user);
    setEditFormData({
      name: user.name || "",
      username: user.username || "",
      email: user.email || "",
      phone: user.phone || "",
      is_active: user.is_active !== undefined ? user.is_active : true,
      current_grade: user.current_grade || "",
      subject: user.subject || "",
    });
  };

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditFormData({ ...editFormData, [name]: value });
  };

  const handleEditCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setEditFormData({ ...editFormData, [name]: checked });
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEditLoading(true);
    
    const patchData: any = {
      name: editFormData.name,
      username: editFormData.username,
      email: editFormData.email,
      phone: editFormData.phone,
      is_active: editFormData.is_active,
    };

    if (editingUser.role === 'student') {
      patchData.current_grade = editFormData.current_grade ? Number(editFormData.current_grade) : null;
    } else if (editingUser.role === 'teacher') {
      patchData.subject = editFormData.subject;
    }

    try {
      const res = await axiosInstance.patch(`${API_ENDPOINTS.ADMIN.USERS}${editingUser.id}/`, patchData);
      
      // Update local state
      setUsers(users.map(u => u.id === editingUser.id ? { ...u, ...res.data } : u));
      showAlert('success', `User account for "${editFormData.username}" updated successfully.`);
      setEditingUser(null);
    } catch (err: any) {
      console.error(err);
      showAlert('error', 'Failed to save changes. Make sure all fields are valid and username/email are unique.');
    } finally {
      setEditLoading(false);
    }
  };

  // Filter users based on search term, active role tab, and sub-category criteria
  const filteredUsers = users.filter((user: any) => {
    const matchesSearch = 
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) || 
      (user.name && user.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (user.phone && user.phone.includes(searchTerm));

    if (!matchesSearch) return false;

    if (activeTab === 'student') {
      if (user.role !== 'student') return false;
      if (selectedGrade !== 'all') {
        const gradeMatch = 
          user.current_grade === Number(selectedGrade) || 
          (user.current_grade_name && user.current_grade_name.toLowerCase() === selectedGrade.toLowerCase()) ||
          (user.current_grade_name && user.current_grade_name.toLowerCase().includes(selectedGrade.toLowerCase()));
        if (!gradeMatch) return false;
      }
    } else if (activeTab === 'teacher') {
      if (user.role !== 'teacher') return false;
      if (teacherCategory === 'ol') {
        if (!isOLTeacher(user)) return false;
      } else if (teacherCategory === 'al') {
        if (!isALTeacher(user)) return false;
      }
    } else if (activeTab === 'admin') {
      if (user.role === 'student' || user.role === 'teacher') return false;
    }

    return true;
  });

  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Alerts */}
        {alert && (
          <div className={`p-4 rounded-2xl font-bold text-sm shadow-md animate-bounce border ${
            alert.type === 'success' ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'
          }`}>
            {alert.message}
          </div>
        )}

        {/* Header and Search */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
          <div>
            <h3 className="text-2xl font-black text-gray-800 tracking-tight flex items-center gap-2">
              <Users className="text-red-600" size={28} />
              Manage Users
            </h3>
            <p className="text-gray-500 text-sm mt-1">Review, edit, delete and categorize registered users.</p>
          </div>
          
          <div className="relative w-full md:w-96 group">
            <Search className="absolute left-4 top-4 text-gray-400 group-focus-within:text-red-600 transition-colors" size={20} />
            <input
              type="text"
              placeholder="Search by name, email, phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-6 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-red-500 focus:bg-white transition-all font-semibold text-gray-800 text-sm"
            />
          </div>
        </div>

        {/* Main Tabs (Students vs Teachers vs Admins) */}
        <div className="flex bg-gray-100 p-1.5 rounded-2xl max-w-lg w-full shadow-inner border">
          <button
            onClick={() => setActiveTab('student')}
            className={`flex-1 py-3 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${activeTab === 'student' ? 'bg-white text-red-900 shadow' : 'text-gray-500 hover:text-gray-800'}`}
          >
            <Users size={16} /> Students ({users.filter(u => u.role === 'student').length})
          </button>
          <button
            onClick={() => setActiveTab('teacher')}
            className={`flex-1 py-3 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${activeTab === 'teacher' ? 'bg-white text-red-900 shadow' : 'text-gray-500 hover:text-gray-800'}`}
          >
            <GraduationCap size={16} /> Teachers ({users.filter(u => u.role === 'teacher').length})
          </button>
          <button
            onClick={() => setActiveTab('admin')}
            className={`flex-1 py-3 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${activeTab === 'admin' ? 'bg-white text-red-900 shadow' : 'text-gray-500 hover:text-gray-800'}`}
          >
            <Shield size={16} /> Admins ({users.filter(u => u.role !== 'student' && u.role !== 'teacher').length})
          </button>
        </div>

        {/* Sub-Categorization Filters */}
        {activeTab === 'student' && (
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-3">
            <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-1">
              <Filter size={14} /> Filter Students by Grade
            </h4>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedGrade('all')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${selectedGrade === 'all' ? 'bg-red-600 text-white shadow-md shadow-red-100' : 'bg-gray-100 hover:bg-gray-200 text-gray-600'}`}
              >
                All Grades
              </button>
              {grades.map((grade) => (
                <button
                  key={grade.id}
                  onClick={() => setSelectedGrade(grade.name)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${selectedGrade === grade.name ? 'bg-red-600 text-white shadow-md shadow-red-100' : 'bg-gray-100 hover:bg-gray-200 text-gray-600'}`}
                >
                  {grade.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'teacher' && (
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-3">
            <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-1">
              <Layers size={14} /> Categorize Teachers by Level
            </h4>
            <div className="flex gap-2">
              <button
                onClick={() => setTeacherCategory('all')}
                className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${teacherCategory === 'all' ? 'bg-red-600 text-white shadow-md shadow-red-100' : 'bg-gray-100 hover:bg-gray-200 text-gray-600'}`}
              >
                All Teachers
              </button>
              <button
                onClick={() => setTeacherCategory('ol')}
                className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${teacherCategory === 'ol' ? 'bg-red-600 text-white shadow-md shadow-red-100' : 'bg-gray-100 hover:bg-gray-200 text-gray-600'}`}
              >
                Ordinary Level (O/L) Teachers
              </button>
              <button
                onClick={() => setTeacherCategory('al')}
                className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${teacherCategory === 'al' ? 'bg-red-600 text-white shadow-md shadow-red-100' : 'bg-gray-100 hover:bg-gray-200 text-gray-600'}`}
              >
                Advanced Level (A/L) Teachers
              </button>
            </div>
          </div>
        )}

        {/* Users Table */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-x-auto">
          <table className="w-full text-left min-w-[950px]">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-8 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">User Profile</th>
                <th className="px-8 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">
                  {activeTab === 'student' ? 'Grade Level' : activeTab === 'teacher' ? 'Subject & Category' : 'Access Level'}
                </th>
                <th className="px-8 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Contact Info</th>
                <th className="px-8 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Status</th>
                <th className="px-8 py-4 text-xs font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td colSpan={5} className="text-center py-20 text-gray-400 font-bold italic">
                    Loading users...
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-16 text-gray-400 font-bold italic">
                    No users found matching the selected filters.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user: any) => (
                  <tr key={user.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-8 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center text-red-700 font-bold border-2 border-white shadow-sm ring-1 ring-red-100">
                          {user.name ? user.name.slice(0, 2).toUpperCase() : user.username.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-gray-800 tracking-tight">{user.name || user.username}</p>
                          <p className="text-xs text-gray-500 font-medium">Username: {user.username}</p>
                        </div>
                      </div>
                    </td>
                    
                    <td className="px-8 py-4">
                      {activeTab === 'student' ? (
                        <span className="px-3 py-1 rounded-full text-[10px] font-black bg-blue-100 text-blue-700 uppercase tracking-wider">
                          {user.current_grade_name || "Unassigned"}
                        </span>
                      ) : activeTab === 'teacher' ? (
                        <div className="space-y-1">
                          <span className="px-3 py-1 rounded-full text-[10px] font-black bg-purple-100 text-purple-700 uppercase tracking-wider block w-max">
                            {user.subject || "No Subject"}
                          </span>
                          <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">
                            {isOLTeacher(user) && isALTeacher(user) 
                              ? "O/L & A/L Faculty" 
                              : isALTeacher(user) 
                              ? "A/L Faculty" 
                              : isOLTeacher(user) 
                              ? "O/L Faculty" 
                              : "Junior Faculty"}
                          </span>
                        </div>
                      ) : (
                        <span className="px-3 py-1 rounded-full text-[10px] font-black bg-red-100 text-red-700 uppercase tracking-wider">
                          Administrator
                        </span>
                      )}
                    </td>

                    <td className="px-8 py-4">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2 text-xs text-gray-500 font-semibold">
                          <Mail size={12} className="text-gray-300" />
                          <span>{user.email || 'No Email'}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-500 font-semibold">
                          <Phone size={12} className="text-gray-300" />
                          <span>{user.phone || 'No Phone'}</span>
                        </div>
                      </div>
                    </td>

                    <td className="px-8 py-4">
                      <div className="flex items-center gap-2">
                        {user.is_active ? <UserCheck className="text-green-500" size={16} /> : <UserX className="text-red-500" size={16} />}
                        <span className={`text-xs font-bold ${user.is_active ? 'text-green-600' : 'text-red-600'}`}>
                          {user.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </td>

                    <td className="px-8 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => handleOpenEdit(user)}
                          className="p-2 hover:bg-white rounded-lg border border-transparent hover:border-gray-200 text-gray-400 hover:text-black shadow-sm transition-all"
                          title="Edit User"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button 
                          onClick={() => setDeleteConfirmUser(user)}
                          className="p-2 hover:bg-white rounded-lg border border-transparent hover:border-gray-200 text-gray-400 hover:text-red-600 shadow-sm transition-all"
                          title="Delete User"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

      </div>

      {/* Edit User Modal */}
      {editingUser && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-8 shadow-2xl relative border border-gray-100">
            <button
              onClick={() => setEditingUser(null)}
              className="absolute top-4 right-4 bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-700 p-2 rounded-full transition-all"
            >
              <X size={18} />
            </button>

            <h3 className="text-xl font-black text-gray-800 tracking-tight flex items-center gap-2 border-b pb-4 mb-6">
              <Edit2 className="text-red-600" size={20} />
              Edit User Account
            </h3>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={editFormData.name}
                    onChange={handleEditInputChange}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 outline-none transition-all text-sm font-semibold text-gray-800"
                    placeholder="Enter full name"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Username</label>
                  <input
                    type="text"
                    name="username"
                    value={editFormData.username}
                    onChange={handleEditInputChange}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 outline-none transition-all text-sm font-bold text-gray-800"
                    placeholder="Enter username"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={editFormData.email}
                    onChange={handleEditInputChange}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 outline-none transition-all text-sm font-semibold text-gray-800"
                    placeholder="Enter email"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Phone Number</label>
                  <input
                    type="text"
                    name="phone"
                    value={editFormData.phone}
                    onChange={handleEditInputChange}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 outline-none transition-all text-sm font-semibold text-gray-800"
                    placeholder="Enter phone number"
                  />
                </div>
              </div>

              {/* Conditional Fields based on User Role */}
              {editingUser.role === 'student' && (
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Grade Level</label>
                  <select
                    name="current_grade"
                    value={editFormData.current_grade}
                    onChange={handleEditInputChange}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 outline-none transition-all text-sm font-semibold text-gray-800"
                  >
                    <option value="">Select Student Grade</option>
                    {grades.map(g => (
                      <option key={g.id} value={g.id}>{g.name}</option>
                    ))}
                  </select>
                </div>
              )}

              {editingUser.role === 'teacher' && (
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Subject / Department</label>
                  <input
                    type="text"
                    name="subject"
                    value={editFormData.subject}
                    onChange={handleEditInputChange}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 outline-none transition-all text-sm font-semibold text-gray-800"
                    placeholder="Combined Mathematics, Chemistry, etc."
                  />
                </div>
              )}

              {/* Status Checkbox */}
              <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-xl border border-gray-100">
                <input
                  type="checkbox"
                  id="is_active"
                  name="is_active"
                  checked={editFormData.is_active}
                  onChange={handleEditCheckboxChange}
                  className="w-4 h-4 rounded text-red-600 focus:ring-red-500 border-gray-300"
                />
                <label htmlFor="is_active" className="text-xs font-bold text-gray-700 cursor-pointer select-none">
                  Enable and Activate User Account (Allow Logins)
                </label>
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-bold text-xs uppercase tracking-wider transition-all active:scale-[0.98]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={editLoading}
                  className="flex-1 py-3 bg-red-700 hover:bg-red-800 text-white rounded-xl font-bold text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-1.5 active:scale-[0.98] disabled:opacity-50"
                >
                  {editLoading ? <Loader2 className="animate-spin" size={14} /> : <Save size={14} />}
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Custom Delete Confirmation Modal */}
      {deleteConfirmUser && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-8 shadow-2xl border border-gray-100 flex flex-col items-center text-center animate-scale-in">
            {/* Warning Pulsing Icon */}
            <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mb-5 border-2 border-red-100 shadow-inner">
              <Trash2 className="w-7 h-7 animate-bounce" />
            </div>

            <h3 className="text-xl font-black text-gray-800 tracking-tight mb-2">
              Delete User Account?
            </h3>
            
            <p className="text-gray-500 text-sm leading-relaxed mb-6 font-semibold">
              Are you sure you want to permanently delete the user account for <span className="text-red-600 font-black">"{deleteConfirmUser.name || deleteConfirmUser.username}"</span>? This action is irreversible and all data will be completely erased.
            </p>

            {/* Actions */}
            <div className="flex gap-3 w-full">
              <button
                type="button"
                onClick={() => setDeleteConfirmUser(null)}
                className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-bold text-xs uppercase tracking-wider transition-all active:scale-[0.98]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => executeDelete(deleteConfirmUser.id, deleteConfirmUser.username)}
                disabled={editLoading}
                className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold text-xs uppercase tracking-wider transition-all shadow-md shadow-red-200 flex items-center justify-center gap-1.5 active:scale-[0.98] disabled:opacity-50"
              >
                {editLoading ? <Loader2 className="animate-spin" size={14} /> : <Trash2 size={14} />}
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminUsers;
