import { useEffect, useState } from "react";
import {
  GraduationCap,
  BookOpen,
  Award,
  DollarSign,
} from "lucide-react";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

type Teacher = {
  id: number;
  username: string;
  email: string;
  subject: string;
  grades: string;
  educational_qualifications: string;
  about: string;
  class_fee: string;
};

const Teachers = () => {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const res = await axios.get(
          "http://localhost:8000/api/users/teachers/"
        );
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
    <div className="bg-gray-50 text-gray-800">
      <Navbar />

      {/* Hero */}
      <section className="bg-red-200 py-20 text-center">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Our <span className="text-black">Joined Teachers</span>
          </h1>
          <p className="max-w-3xl mx-auto text-lg text-gray-700">
            Learn online from qualified teachers across Sri Lanka.
          </p>
        </div>
      </section>

      {/* Teachers */}
      <section className="container mx-auto px-4 py-16 max-w-6xl">
        {loading && <p className="text-center">Loading teachers...</p>}
        {error && <p className="text-center text-red-600">{error}</p>}

        {!loading && !error && (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
            {teachers.map((teacher) => (
              <div
                key={teacher.id}
                className="bg-white p-6 rounded-xl shadow border"
              >
                <h3 className="text-xl font-bold mb-1 text-center">
                  {teacher.username}
                </h3>

                <p className="text-center text-red-600 font-medium mb-4">
                  {teacher.subject}
                </p>

                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-red-500" />
                    Grades: {teacher.grades}
                  </div>

                  <div className="flex items-center gap-2">
                    <GraduationCap className="w-4 h-4 text-red-500" />
                    {teacher.educational_qualifications}
                  </div>

                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-red-500" />
                    {teacher.about}
                  </div>

                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-red-500" />
                    Class Fee: Rs. {teacher.class_fee}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
};

export default Teachers;
