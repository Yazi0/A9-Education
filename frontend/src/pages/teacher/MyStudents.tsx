import { useState, useEffect } from "react";
import { Users, Search, Mail, Phone, User, BookOpen, GraduationCap, Calendar, ChevronDown, ChevronUp, Filter } from "lucide-react";
import api from "../../api/axios";
import TeacherLayout from "../../layouts/TeacherLayout";

interface EnrolledStudent {
  id: number;
  name: string;
  username: string;
  student_id: string;
  email: string;
  phone: string;
  current_grade: string;
  district: string;
  date_joined: string;
  enrolled_subject: string;
  enrolled_subject_id: number;
  enrolled_at: string;
}

const MyStudents = () => {
  const [students, setStudents] = useState<EnrolledStudent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("all");
  const [sortConfig, setSortConfig] = useState<{ key: keyof EnrolledStudent; direction: 'asc' | 'desc' }>({ key: 'name', direction: 'asc' });

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await api.get("enrollments/teacher-students/");
        setStudents(Array.isArray(response.data) ? response.data : []);
      } catch (err: any) {
        console.error("Error fetching students:", err);
        setError("Failed to load your students. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, []);

  const subjects = ["all", ...Array.from(new Set(students.map(s => s.enrolled_subject)))];

  const handleSort = (key: keyof EnrolledStudent) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const sorted = [...students].sort((a, b) => {
    const aVal = a[sortConfig.key] as string;
    const bVal = b[sortConfig.key] as string;
    return sortConfig.direction === 'asc' ? String(aVal).localeCompare(String(bVal)) : String(bVal).localeCompare(String(aVal));
  });

  const filtered = sorted.filter(s => {
    const matchesSearch =
      s.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.student_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSubject = subjectFilter === "all" || s.enrolled_subject === subjectFilter;
    return matchesSearch && matchesSubject;
  });

  const SortIcon = ({ col }: { col: keyof EnrolledStudent }) =>
    sortConfig.key === col
      ? (sortConfig.direction === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />)
      : null;

  if (loading) {
    return (
      <TeacherLayout>
        <div className="flex flex-col items-center justify-center py-32">
          <div className="w-14 h-14 border-4 border-red-600 border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-gray-600 font-medium">Loading your students...</p>
        </div>
      </TeacherLayout>
    );
  }

  if (error) {
    return (
      <TeacherLayout>
        <div className="flex flex-col items-center justify-center py-32 bg-red-50 rounded-3xl border border-red-100">
          <p className="text-red-600 font-bold text-lg mb-4">{error}</p>
          <button onClick={() => window.location.reload()} className="px-6 py-2 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 shadow-lg">
            Retry
          </button>
        </div>
      </TeacherLayout>
    );
  }

  return (
    <TeacherLayout>
      <div>
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-red-600 text-white rounded-2xl shadow-lg">
              <Users size={28} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Students</h1>
              <p className="text-gray-500 mt-0.5">Students enrolled in your subjects</p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="p-3 bg-red-50 rounded-xl"><Users size={22} className="text-red-600" /></div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{students.length}</p>
              <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Total Enrolled</p>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="p-3 bg-blue-50 rounded-xl"><BookOpen size={22} className="text-blue-600" /></div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{subjects.length - 1}</p>
              <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Subjects</p>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="p-3 bg-green-50 rounded-xl"><GraduationCap size={22} className="text-green-600" /></div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{new Set(students.map(s => s.current_grade)).size}</p>
              <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Grades</p>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="p-3 bg-purple-50 rounded-xl"><Calendar size={22} className="text-purple-600" /></div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{filtered.length}</p>
              <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Showing</p>
            </div>
          </div>
        </div>

        {/* Search + Filter */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 mb-6 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search by name, student ID or email..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 outline-none text-sm"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter size={16} className="text-gray-500 shrink-0" />
            <select
              value={subjectFilter}
              onChange={e => setSubjectFilter(e.target.value)}
              className="px-4 py-3 border border-gray-200 rounded-xl bg-white text-sm focus:ring-2 focus:ring-red-500 outline-none min-w-[160px]"
            >
              {subjects.map(s => (
                <option key={s} value={s}>{s === "all" ? "All Subjects" : s}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Table */}
        {filtered.length === 0 ? (
          <div className="bg-white rounded-3xl border border-dashed border-gray-200 py-24 text-center">
            <Users size={56} className="text-gray-200 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-700 mb-1">No students found</h3>
            <p className="text-gray-400">
              {students.length === 0
                ? "No students have enrolled in your subjects yet."
                : "Try adjusting your search or filter."}
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="p-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-800" onClick={() => handleSort('name')}>
                      <div className="flex items-center gap-1">Student <SortIcon col="name" /></div>
                    </th>
                    <th className="p-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-800" onClick={() => handleSort('enrolled_subject')}>
                      <div className="flex items-center gap-1">Subject <SortIcon col="enrolled_subject" /></div>
                    </th>
                    <th className="p-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-800" onClick={() => handleSort('current_grade')}>
                      <div className="flex items-center gap-1">Grade <SortIcon col="current_grade" /></div>
                    </th>
                    <th className="p-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Contact</th>
                    <th className="p-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-800" onClick={() => handleSort('enrolled_at')}>
                      <div className="flex items-center gap-1">Enrolled <SortIcon col="enrolled_at" /></div>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filtered.map((student) => (
                    <tr key={`${student.id}-${student.enrolled_subject_id}`} className="hover:bg-gray-50 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center shrink-0">
                            <User size={18} className="text-red-600" />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">{student.name}</p>
                            <p className="text-xs text-gray-400 font-mono">ID: {student.student_id || student.username}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-700 text-sm font-semibold rounded-lg">
                          <BookOpen size={13} />
                          {student.enrolled_subject}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className="px-3 py-1 bg-blue-50 text-blue-700 text-sm font-medium rounded-lg">
                          {student.current_grade || "—"}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="space-y-1">
                          {student.email && (
                            <div className="flex items-center gap-1.5 text-sm text-gray-600">
                              <Mail size={13} className="text-gray-400 shrink-0" />
                              <span className="truncate max-w-[160px]">{student.email}</span>
                            </div>
                          )}
                          {student.phone && (
                            <div className="flex items-center gap-1.5 text-sm text-gray-600">
                              <Phone size={13} className="text-gray-400 shrink-0" />
                              {student.phone}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-1.5 text-sm text-gray-500">
                          <Calendar size={13} className="text-gray-400" />
                          {student.enrolled_at}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-6 py-3 bg-gray-50 border-t border-gray-100 text-sm text-gray-500">
              Showing <span className="font-bold text-gray-800">{filtered.length}</span> of <span className="font-bold text-gray-800">{students.length}</span> enrolled students
            </div>
          </div>
        )}
      </div>
    </TeacherLayout>
  );
};

export default MyStudents;