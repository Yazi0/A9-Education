import { useEffect, useState } from "react";
import {
  GraduationCap,
  BookOpen,
  Award,
  User as UserIcon,
  X,
  Phone,
  Mail,
  MapPin,
  ChevronRight
} from "lucide-react";
import api from "../api/axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

type Teacher = {
  id: number;
  name: string;
  username: string;
  email: string;
  phone: string;
  address: string;
  district: string;
  subject: string;
  grades: string;
  educational_qualifications: string;
  about: string;
  class_fee: string;
  profile_image: string | null;
};

const Teachers = () => {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const res = await api.get("users/teachers/");
        setTeachers(res.data);
      } catch (err) {
        setError("Failed to load teachers");
      } finally {
        setLoading(false);
      }
    };

    fetchTeachers();
  }, []);

  return (
    <div className="bg-gray-50 text-gray-800 min-h-screen">
      <Navbar />

      {/* Hero */}
      <section className="bg-red-200 py-20 text-center relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-red-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 -mr-32 -mt-32"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 -ml-32 -mb-32"></div>

        <div className="container mx-auto px-4 relative z-10">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight">
            Our <span className="text-red-700">Joined Teachers</span>
          </h1>
          <p className="max-w-2xl mx-auto text-lg text-gray-700 font-medium">
            Learn from the most qualified specialists across the country.
            Excellence starts with the right guidance.
          </p>
        </div>
      </section>

      {/* Teachers Grid */}
      <section className="container mx-auto px-4 py-16 max-w-6xl">
        {loading && (
          <div className="flex justify-center py-20">
            <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center text-red-700 max-w-md mx-auto">
            {error}
          </div>
        )}

        {!loading && !error && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {teachers.map((teacher) => (
              <div
                key={teacher.id}
                onClick={() => setSelectedTeacher(teacher)}
                className="group relative bg-white rounded-[2rem] p-2 pb-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] 
                  hover:shadow-[0_20px_50px_rgba(239,68,68,0.12)] border border-gray-100/50 
                  transition-all duration-500 cursor-pointer overflow-hidden backdrop-blur-sm"
              >
                {/* Card Top / Image Area */}
                <div className="relative h-48 rounded-[1.5rem] overflow-hidden m-1">
                  {teacher.profile_image ? (
                    <img
                      src={teacher.profile_image}
                      alt={teacher.name || teacher.username}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(teacher.name || teacher.username)}&background=fca5a5&color=991b1b&bold=true`;
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-red-50 to-pink-50">
                      <UserIcon className="w-12 h-12 text-red-200" />
                    </div>
                  )}

                  {/* Subtle Overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>

                {/* Content */}
                <div className="px-5 pt-4 text-center">
                  <div className="inline-block px-3 py-1 rounded-full bg-red-50 border border-red-100 mb-3 group-hover:bg-red-600 group-hover:border-red-600 transition-colors duration-300">
                    <p className="text-[10px] uppercase font-black tracking-[0.15em] text-red-600 group-hover:text-white">
                      {teacher.subject}
                    </p>
                  </div>

                  <h3 className="text-xl font-extrabold text-gray-900 mb-1 tracking-tight group-hover:text-red-700 transition-colors">
                    {teacher.name || teacher.username}
                  </h3>

                  <div className="flex items-center justify-center gap-1.5 text-gray-400 font-medium text-xs">
                    <BookOpen className="w-3.5 h-3.5 text-gray-300" />
                    <span>Specialist in {teacher.grades}</span>
                  </div>
                </div>

                {/* Floating Action Hint */}
                <div className="absolute top-4 right-4 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                  <div className="bg-white/90 backdrop-blur-md p-2 rounded-xl shadow-lg border border-white/20">
                    <ChevronRight className="w-4 h-4 text-red-600" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && !error && teachers.length === 0 && (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
            <GraduationCap className="w-16 h-16 text-gray-200 mx-auto mb-4" />
            <p className="text-gray-400 text-lg">Our teaching staff is currently being updated...</p>
          </div>
        )}
      </section>

      {/* Teacher Detailed Popup */}
      {selectedTeacher && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity"
            onClick={() => setSelectedTeacher(null)}
          ></div>

          <div className="relative bg-white w-full max-w-2xl rounded-[1.5rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
            {/* Header / Background with Integrated Info */}
            <div className="bg-gradient-to-r from-red-600 to-pink-600 relative py-6 px-6 overflow-hidden">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedTeacher(null);
                }}
                className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center bg-white/20 hover:bg-white/40 ring-1 ring-white/30 rounded-full text-white backdrop-blur-md transition-all duration-200 z-[110] active:scale-90"
                aria-label="Close"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="flex items-center gap-5 relative z-10">
                <div className="w-20 h-20 rounded-xl overflow-hidden border-2 border-white/30 bg-white/20 shadow-lg backdrop-blur-md shrink-0">
                  {selectedTeacher.profile_image ? (
                    <img
                      src={selectedTeacher.profile_image}
                      alt={selectedTeacher.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <UserIcon className="w-8 h-8 text-white/50" />
                    </div>
                  )}
                </div>

                <div>
                  <h2 className="text-2xl font-black text-white tracking-tight leading-tight">
                    {selectedTeacher.name || selectedTeacher.username}
                  </h2>
                  <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-2.5 py-0.5 rounded-lg border border-white/10 mt-1">
                    <p className="text-white font-bold text-[9px] uppercase tracking-widest">
                      {selectedTeacher.subject}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 bg-white">
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-5">
                  <section>
                    <h4 className="flex items-center gap-2 text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2">
                      <Award className="w-3 h-3" /> About Teacher
                    </h4>
                    <p className="text-gray-600 leading-tight text-xs italic line-clamp-4">
                      "{selectedTeacher.about || "A dedicated professional committed to student success and academic excellence."}"
                    </p>
                  </section>

                  <section>
                    <h4 className="flex items-center gap-2 text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2">
                      <GraduationCap className="w-3 h-3" /> Qualifications
                    </h4>
                    <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                      <p className="text-gray-700 font-bold text-xs leading-tight">
                        {selectedTeacher.educational_qualifications || "Verified Educator"}
                      </p>
                    </div>
                  </section>
                </div>

                <div className="space-y-4">
                  <section>
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="flex items-center gap-1.5 text-[9px] font-black text-gray-400 uppercase tracking-widest">
                        <MapPin className="w-3 h-3" /> Contact
                      </h4>
                      <span className="text-[10px] font-black text-red-600 tracking-tighter uppercase px-2 py-0.5 bg-red-50 rounded-md">Fee: Rs. {selectedTeacher.class_fee || 'TBD'}</span>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-500 shrink-0">
                          <Phone className="w-4 h-4" />
                        </div>
                        <p className="text-sm font-bold text-gray-700 tracking-tight truncate">{selectedTeacher.phone || "Privacy enabled"}</p>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center text-orange-500 shrink-0">
                          <Mail className="w-4 h-4" />
                        </div>
                        <p className="text-sm font-bold text-gray-700 tracking-tight truncate">{selectedTeacher.email}</p>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-500 shrink-0">
                          <MapPin className="w-4 h-4" />
                        </div>
                        <p className="text-sm font-bold text-gray-700 tracking-tight truncate">{selectedTeacher.district || "Island-wide Online"}</p>
                      </div>
                    </div>
                  </section>

                  <div className="pt-4 border-t border-gray-50 text-center">
                    <p className="text-[10px] text-gray-400 font-medium italic">
                      Contact teacher for enrollment.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default Teachers;
