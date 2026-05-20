import React, { useEffect, useState } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import { 
  BookOpen, Plus, Search, Edit2, Trash2, Loader2, Save, 
  Layers, DollarSign, User, Award, CheckCircle, HelpCircle
} from "lucide-react";
import axiosInstance from "../../api/axios";
import { API_ENDPOINTS } from "../../api/endpoints";

const AdminSubjects: React.FC = () => {
  const [subjects, setSubjects] = useState<any[]>([]);
  const [teachers, setTeachers] = useState<any[]>([]);
  const [grades, setGrades] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  
  // Modals state
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState<any | null>(null);
  const [deleteConfirmSubject, setDeleteConfirmSubject] = useState<any | null>(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [alert, setAlert] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  // Form Fields
  const [formData, setFormData] = useState({
    name: "",
    stream: "Combined Maths",
    teacher: "",
    class_fee: "",
    description: "",
    grades: [] as number[],
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [subjectsRes, usersRes, gradesRes] = await Promise.all([
        axiosInstance.get(API_ENDPOINTS.ADMIN.SUBJECTS),
        axiosInstance.get(API_ENDPOINTS.ADMIN.USERS),
        axiosInstance.get('users/grades/'), // Fetch grades list
      ]);
      setSubjects(subjectsRes.data);
      // Filter only users with role 'teacher'
      setTeachers(usersRes.data.filter((u: any) => u.role === 'teacher'));
      setGrades(gradesRes.data);
    } catch (err) {
      console.error(err);
      showAlert('error', 'Failed to fetch subjects or configuration data.');
    } finally {
      setLoading(false);
    }
  };

  const showAlert = (type: 'success' | 'error', message: string) => {
    setAlert({ type, message });
    setTimeout(() => setAlert(null), 4000);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleGradesChange = (gradeId: number) => {
    const isSelected = formData.grades.includes(gradeId);
    if (isSelected) {
      setFormData({
        ...formData,
        grades: formData.grades.filter(id => id !== gradeId)
      });
    } else {
      setFormData({
        ...formData,
        grades: [...formData.grades, gradeId]
      });
    }
  };

  const handleOpenCreate = () => {
    setFormData({
      name: "",
      stream: "Combined Maths",
      teacher: teachers[0]?.id || "",
      class_fee: "",
      description: "",
      grades: [],
    });
    setIsCreateOpen(true);
  };

  const handleOpenEdit = (subject: any) => {
    setEditingSubject(subject);
    setFormData({
      name: subject.name,
      stream: subject.stream || "Combined Maths",
      teacher: subject.teacher || "",
      class_fee: subject.class_fee.toString(),
      description: subject.description || "",
      grades: subject.grades || [],
    });
  };

  const handleCreateSubject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.teacher || !formData.class_fee) {
      showAlert('error', 'Please fill in all required fields.');
      return;
    }

    try {
      setModalLoading(true);
      const res = await axiosInstance.post(API_ENDPOINTS.ADMIN.SUBJECTS, formData);
      setSubjects([res.data, ...subjects]);
      setIsCreateOpen(false);
      showAlert('success', `Subject "${formData.name}" created successfully.`);
    } catch (err: any) {
      console.error(err);
      showAlert('error', err.response?.data?.detail || 'Failed to create subject.');
    } finally {
      setModalLoading(false);
    }
  };

  const handleEditSubject = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setModalLoading(true);
      const res = await axiosInstance.put(`${API_ENDPOINTS.ADMIN.SUBJECTS}${editingSubject.id}/`, formData);
      setSubjects(subjects.map(s => s.id === editingSubject.id ? res.data : s));
      setEditingSubject(null);
      showAlert('success', `Subject details updated successfully.`);
    } catch (err: any) {
      console.error(err);
      showAlert('error', 'Failed to update subject details.');
    } finally {
      setModalLoading(false);
    }
  };

  const executeDelete = async (id: number, name: string) => {
    try {
      setModalLoading(true);
      await axiosInstance.delete(`${API_ENDPOINTS.ADMIN.SUBJECTS}${id}/`);
      setSubjects(subjects.filter(s => s.id !== id));
      setDeleteConfirmSubject(null);
      showAlert('success', `Subject "${name}" deleted successfully.`);
    } catch (err) {
      console.error(err);
      showAlert('error', 'Failed to delete subject.');
    } finally {
      setModalLoading(false);
    }
  };

  // Filter subjects based on search query
  const filteredSubjects = subjects.filter(subject => {
    const teacherName = teachers.find(t => t.id === subject.teacher)?.name || "";
    return (
      subject.name.toLowerCase().includes(search.toLowerCase()) ||
      (subject.stream && subject.stream.toLowerCase().includes(search.toLowerCase())) ||
      teacherName.toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto space-y-6 p-4">
        {/* Title Block */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
          <div>
            <h1 className="text-2xl font-black text-gray-800 tracking-tight">Manage Subjects</h1>
            <p className="text-gray-500 text-xs font-semibold mt-0.5">Create, edit, and configure academic subjects for teachers</p>
          </div>
          <button
            onClick={handleOpenCreate}
            className="py-3 px-5 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 text-white rounded-xl font-bold text-xs uppercase tracking-wider shadow-lg shadow-red-200/50 flex items-center gap-2 transition-all active:scale-[0.98]"
          >
            <Plus size={16} /> Add Subject
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
        <div className="bg-white p-4 rounded-3xl border border-gray-100 shadow-sm flex items-center px-6 gap-3">
          <Search className="text-gray-400 shrink-0" size={18} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-transparent outline-none text-sm font-medium text-gray-700 placeholder-gray-400"
            placeholder="Search subjects by name, stream, or teacher..."
          />
        </div>

        {/* Table Wrapper */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-x-auto">
          <table className="w-full text-left min-w-[950px]">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-8 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Subject</th>
                <th className="px-8 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Teacher</th>
                <th className="px-8 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Grades</th>
                <th className="px-8 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Fee</th>
                <th className="px-8 py-4 text-xs font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td colSpan={5} className="text-center py-20 text-gray-400 font-bold italic">
                    Loading subjects...
                  </td>
                </tr>
              ) : filteredSubjects.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-16 text-gray-400 font-bold italic">
                    No subjects found.
                  </td>
                </tr>
              ) : (
                filteredSubjects.map((subject) => {
                  const teacherObj = teachers.find(t => t.id === subject.teacher);
                  return (
                    <tr key={subject.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-8 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center text-red-700 font-bold">
                            <BookOpen size={18} />
                          </div>
                          <div>
                            <p className="font-bold text-gray-800">{subject.name}</p>
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-black bg-blue-100 text-blue-700 uppercase tracking-wider">
                              {subject.stream || "Combined Maths"}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-4">
                        <p className="font-bold text-gray-700">{teacherObj?.name || `Teacher #${subject.teacher}`}</p>
                        <p className="text-xs text-gray-400 font-medium">Username: {teacherObj?.username}</p>
                      </td>
                      <td className="px-8 py-4">
                        <div className="flex flex-wrap gap-1 max-w-[200px]">
                          {subject.grades && subject.grades.length > 0 ? (
                            subject.grades.map((gradeId: number) => {
                              const gradeObj = grades.find(g => g.id === gradeId);
                              return (
                                <span key={gradeId} className="px-2 py-0.5 bg-gray-100 rounded text-[10px] font-bold text-gray-600">
                                  {gradeObj?.name || `G-${gradeId}`}
                                </span>
                              );
                            })
                          ) : (
                            <span className="text-xs text-gray-400 italic">No Grades</span>
                          )}
                        </div>
                      </td>
                      <td className="px-8 py-4">
                        <span className="font-extrabold text-gray-800">Rs. {subject.class_fee}</span>
                      </td>
                      <td className="px-8 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleOpenEdit(subject)}
                            className="p-2 hover:bg-white rounded-lg border border-transparent hover:border-gray-200 text-gray-400 hover:text-black shadow-sm transition-all"
                            title="Edit Subject"
                          >
                            <Edit2 size={14} />
                          </button>
                          <button
                            onClick={() => setDeleteConfirmSubject(subject)}
                            className="p-2 hover:bg-white rounded-lg border border-transparent hover:border-gray-200 text-gray-400 hover:text-red-600 shadow-sm transition-all"
                            title="Delete Subject"
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

      {/* Create / Edit Modal */}
      {(isCreateOpen || editingSubject) && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-8 shadow-2xl relative border border-gray-100 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-black text-gray-800 tracking-tight mb-6">
              {isCreateOpen ? "Create New Subject" : "Edit Subject Details"}
            </h3>

            <form onSubmit={isCreateOpen ? handleCreateSubject : handleEditSubject} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1">
                  Subject Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 outline-none transition-all text-sm font-semibold text-gray-800"
                  placeholder="e.g. Combined Mathematics"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                    A/L Stream <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="stream"
                    value={formData.stream}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 outline-none text-sm font-semibold text-gray-700"
                  >
                    <option value="Combined Maths">Combined Maths</option>
                    <option value="Biology">Biology</option>
                    <option value="Technology">Technology</option>
                    <option value="Commerce">Commerce</option>
                    <option value="Arts">Arts</option>
                    <option value="O/L Science">O/L Science</option>
                    <option value="O/L Maths">O/L Maths</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Class Fee (Rs.) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="class_fee"
                    value={formData.class_fee}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 outline-none transition-all text-sm font-semibold text-gray-800"
                    placeholder="2500"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1">
                  Assigned Teacher <span className="text-red-500">*</span>
                </label>
                <select
                  name="teacher"
                  value={formData.teacher}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 outline-none text-sm font-semibold text-gray-700"
                  required
                >
                  <option value="">Select a Teacher</option>
                  {teachers.map(t => (
                    <option key={t.id} value={t.id}>{t.name} ({t.username})</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block">
                  Select Applicable Grades *
                </label>
                <div className="flex flex-wrap gap-2 p-3 bg-gray-50 rounded-xl border border-gray-100">
                  {grades.map(grade => {
                    const isChecked = formData.grades.includes(grade.id);
                    return (
                      <button
                        type="button"
                        key={grade.id}
                        onClick={() => handleGradesChange(grade.id)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                          isChecked 
                            ? "bg-red-600 text-white shadow-md shadow-red-100" 
                            : "bg-white border border-gray-200 hover:bg-gray-100 text-gray-600"
                        }`}
                      >
                        {grade.name}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 outline-none transition-all text-sm font-semibold text-gray-800"
                  placeholder="Subject syllabus summary and class details..."
                />
              </div>

              <div className="flex gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => {
                    setIsCreateOpen(false);
                    setEditingSubject(null);
                  }}
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
                  {isCreateOpen ? "Create Subject" : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmSubject && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-8 shadow-2xl border border-gray-100 flex flex-col items-center text-center animate-scale-in">
            <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mb-5 border-2 border-red-100 shadow-inner">
              <Trash2 className="w-7 h-7 animate-bounce" />
            </div>

            <h3 className="text-xl font-black text-gray-800 tracking-tight mb-2">
              Delete Subject?
            </h3>
            
            <p className="text-gray-500 text-sm leading-relaxed mb-6 font-semibold">
              Are you sure you want to permanently delete the subject <span className="text-red-600 font-black">"{deleteConfirmSubject.name}"</span>? All videos, materials, and student enrollments for this subject will be lost!
            </p>

            <div className="flex gap-3 w-full">
              <button
                type="button"
                onClick={() => setDeleteConfirmSubject(null)}
                className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-bold text-xs uppercase tracking-wider transition-all active:scale-[0.98]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => executeDelete(deleteConfirmSubject.id, deleteConfirmSubject.name)}
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

export default AdminSubjects;
