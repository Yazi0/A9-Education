import {
  Calculator,
  Zap,
  Beaker,
  Brain,
  Book,
  Code,
  PenTool,
  Music,
} from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

/* ICON MAP (backend sends icon name as string) */
const iconMap: Record<string, any> = {
  calculator: Calculator,
  zap: Zap,
  beaker: Beaker,
  brain: Brain,
  book: Book,
  code: Code,
  pentool: PenTool,
  music: Music,
};

type Subject = {
  id: number;
  name: string;
  level: string;
  icon: string;
};

const Subjects = () => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* FETCH SUBJECTS FROM BACKEND */
  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/subjects"
        );
        setSubjects(res.data);
      } catch (err) {
        setError("Failed to load subjects");
      } finally {
        setLoading(false);
      }
    };

    fetchSubjects();
  }, []);

  return (
    <div className="bg-gray-50 text-gray-800">
      <Navbar />

      {/* Hero */}
      <section className="bg-red-200 text-black">
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Explore <span className="text-black">Subjects</span>
          </h1>
          <p className="max-w-3xl mx-auto text-lg text-gray-700">
            Learn from expert teachers across Sri Lanka in your preferred subject.
          </p>
        </div>
      </section>

      {/* Subjects */}
      <section className="container mx-auto px-4 py-16 max-w-6xl">
        {loading && (
          <p className="text-center text-lg font-medium">
            Loading subjects...
          </p>
        )}

        {error && (
          <p className="text-center text-red-600 font-medium">
            {error}
          </p>
        )}

        {!loading && !error && (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {subjects.map((subject) => {
              const Icon = iconMap[subject.icon] || Book;

              return (
                <div
                  key={subject.id}
                  className="bg-white p-6 rounded-xl shadow border hover:-translate-y-1 transition"
                >
                  <div className="w-12 h-12 bg-red-100 text-red-600 flex items-center justify-center rounded-lg mb-4">
                    <Icon />
                  </div>
                  <h3 className="text-xl font-bold mb-1">
                    {subject.name}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {subject.level}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* CTA */}
      <section className="bg-red-700 text-white py-14">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Start Learning Today
          </h2>
          <p className="text-red-100">
            Choose your subject and join live online classes with expert teachers.
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Subjects;
