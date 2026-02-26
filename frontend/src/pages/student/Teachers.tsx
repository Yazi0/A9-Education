import { useState, useEffect } from "react";
import { Search, Loader2, Sparkles, Users } from "lucide-react";
import api from "../../api/axios";
import StudentLayout from "../../layouts/StudentLayout";
import TeacherCard from "../../components/common/TeacherCard";

const Teachers = () => {
  const [teachers, setTeachers] = useState<any[]>([]);
  const [studentGrade, setStudentGrade] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        setLoading(true);
        // Fetch student profile to get their grade
        const profileRes = await api.get("users/me/");
        const profile = profileRes.data;
        setStudentGrade(profile.current_grade_name);

        // Fetch teachers based on student's grade
        let teachersRes;
        if (profile.current_grade) {
          teachersRes = await api.get(`users/teachers/?grade=${profile.current_grade}`);
        } else {
          teachersRes = await api.get("users/teachers/");
        }
        setTeachers(teachersRes.data);
        setError(null);
      } catch (err) {
        console.error("Error fetching teachers:", err);
        setError("Failed to load instructors.");
      } finally {
        setLoading(false);
      }
    };

    fetchTeachers();
  }, []);

  const filteredTeachers = teachers.filter(teacher => 
    teacher.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    teacher.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    teacher.subjects?.some((s: any) => s.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <StudentLayout>
      <div className="max-w-6xl mx-auto flex-1 w-full">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2 p-2 bg-red-50 text-red-600 rounded-lg w-fit">
               <Users size={20} />
               <span className="text-xs font-bold uppercase tracking-widest">Our Faculty</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Expert Instructors</h1>
            <p className="text-gray-600 mt-2">Connecting you with the best teachers for 
              <span className="text-red-600 font-bold ml-1">{studentGrade || "your level"}</span>
            </p>
          </div>
          <div className="mt-4 md:mt-0 px-4 py-2 bg-white text-gray-700 rounded-lg text-sm font-medium border border-gray-200 shadow-sm flex items-center gap-2">
            <Sparkles className="text-amber-500" size={16} />
            Verified Faculty: {teachers.length}
          </div>
        </div>

        {/* Search Bar */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-8 max-w-2xl">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search by teacher name or subject..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 outline-none transition-all"
            />
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24">
            <Loader2 className="animate-spin text-red-600 mb-4" size={48} />
            <p className="text-gray-500 font-medium">Finding best instructors for you...</p>
          </div>
        ) : error ? (
          <div className="text-center py-24 bg-red-50 rounded-3xl border border-red-100">
            <p className="text-red-600 font-bold text-lg mb-4">{error}</p>
            <button 
                onClick={() => window.location.reload()} 
                className="px-6 py-2 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-all shadow-lg shadow-red-200"
            >
                Retry
            </button>
          </div>
        ) : filteredTeachers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredTeachers.map((teacher) => (
              <TeacherCard key={teacher.id} teacher={teacher} />
            ))}
          </div>
        ) : (
          <div className="text-center py-24 bg-white rounded-3xl border border-dashed border-gray-300">
            <div className="inline-block p-6 bg-gray-50 rounded-full mb-6">
              <Search className="text-gray-300" size={64} />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No instructors found</h3>
            <p className="text-gray-500 max-w-md mx-auto">We couldn't find any teachers matching your search criteria. Try a different subject or name.</p>
          </div>
        )}

        {/* CTA Banner */}
        {!loading && !error && (
            <div className="mt-20 bg-gradient-to-r from-red-600 to-red-800 rounded-3xl p-10 text-white shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-white/10 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-700" />
                <div className="relative z-10">
                    <h2 className="text-3xl font-black mb-2">Need Guidance?</h2>
                    <p className="text-red-100 max-w-lg mb-6">Our instructors are here to help you excel in your studies. Reach out to them for personalized counseling and support.</p>
                    <button className="px-8 py-3 bg-white text-red-600 rounded-xl font-black hover:bg-red-50 transition-all shadow-xl">
                        Contact Faculty
                    </button>
                </div>
            </div>
        )}
      </div>
    </StudentLayout>
  );
};

export default Teachers;
