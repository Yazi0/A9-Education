import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Video,
  Users,
  BarChart3,
  Target,
  Award,
  TrendingUp,
  Shield,
  Sparkles,
  Calculator,
  Zap,
  Beaker,
  Code,
  Brain,
  Book,
  PenTool,
  Music,
  Home as HomeIcon,
  LogIn,
} from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

/* ===================== DATA ===================== */

const stats = [
  { number: "10,000+", label: "Active Students", icon: Users },
  { number: "500+", label: "Expert Teachers", icon: Award },
  { number: "95%", label: "Success Rate", icon: TrendingUp },
  { number: "24/7", label: "Support Available", icon: Shield },
];

const features = [
  {
    title: "Personalized Learning Paths",
    desc: "AI-powered customized learning journeys",
    icon: Target,
    color: "from-blue-500 to-cyan-500",
  },
  {
    title: "Expert Video Lessons",
    desc: "HD video classes by top educators",
    icon: Video,
    color: "from-purple-500 to-pink-500",
  },
  {
    title: "Smart Practice System",
    desc: "Adaptive quizzes with instant feedback",
    icon: BarChart3,
    color: "from-green-500 to-emerald-500",
  },
  {
    title: "Live Interactive Classes",
    desc: "Real-time classes with Q&A",
    icon: Users,
    color: "from-orange-500 to-red-500",
  },
];

const courses = [
  { name: "Mathematics", icon: Calculator, color: "from-blue-500 to-cyan-500" },
  { name: "Physics", icon: Zap, color: "from-purple-500 to-pink-500" },
  { name: "Chemistry", icon: Beaker, color: "from-green-500 to-emerald-500" },
  { name: "ICT", icon: Code, color: "from-orange-500 to-red-500" },
  { name: "Biology", icon: Brain, color: "from-teal-500 to-green-500" },
  { name: "English", icon: Book, color: "from-indigo-500 to-blue-500" },
  { name: "Art", icon: PenTool, color: "from-pink-500 to-rose-500" },
  { name: "Music", icon: Music, color: "from-violet-500 to-purple-500" },
];

/* ===================== COMPONENT ===================== */

const Home: React.FC = () => {
  const navigate = useNavigate();
  const featuresRef = useRef<HTMLDivElement>(null);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const move = (e: MouseEvent) =>
      setMouse({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 overflow-hidden">

      {/* ================= NAVBAR ================= */}
      <Navbar />

      {/* ================= HERO ================= */}
      <section
        className="min-h-[90vh] flex items-center justify-center relative text-center px-4 bg-cover bg-center"
        style={{ backgroundImage: `url("/bg1.jpeg")` }}
      >
        <div className="absolute inset-0 bg-black/60"></div>

        <div
          className="absolute w-96 h-96 bg-red-400/30 rounded-full blur-3xl"
          style={{
            transform: `translate(${mouse.x * 0.02}px, ${mouse.y * 0.02}px)`,
          }}
        />

        <div className="relative z-10 max-w-4xl text-white">
          <div className="inline-flex gap-2 items-center bg-white/20 px-4 py-2 rounded-full mb-6">
            <Sparkles />
            <span className="font-medium">Join 10,000+ Students</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            Build Your{" "}
            <span className="bg-gradient-to-r from-red-400 to-pink-400 bg-clip-text text-transparent">
              Future Today
            </span>
          </h1>

          <p className="text-xl text-gray-200 mb-10">
            Learn smarter with expert teachers, live classes, and smart practice
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate("/login")}
              className="bg-gradient-to-r from-red-600 to-pink-600 px-8 py-4 rounded-2xl font-semibold"
            >
              Start Learning
            </button>

            <button
              onClick={() =>
                featuresRef.current?.scrollIntoView({ behavior: "smooth" })
              }
              className="border-2 border-white px-8 py-4 rounded-2xl font-semibold"
            >
              Explore Features
            </button>
          </div>
        </div>
      </section>

      {/* ================= STATS ================= */}
      <section className="py-16 bg-blend-color-burn bg-red-50">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 px-4">
          {stats.map(({ number, label, icon: Icon }) => (
            <div key={label} className="bg-white p-6 rounded-xl shadow text-center">
              <Icon className="mx-auto mb-2 text-red-500" />
              <h3 className="text-2xl font-bold">{number}</h3>
              <p className="text-gray-600">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ================= FEATURES (IMAGE BG) ================= */}
      <section
        ref={featuresRef}
        className="py-20 px-4 bg-cover bg-center relative"
        style={{ backgroundImage: `url("/Stu.png")` }}
      >
        <div className="absolute inset-0 bg-black/60"></div>

        <div className="relative z-10 max-w-6xl mx-auto grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map(({ title, desc, icon: Icon, color }) => (
            <div
              key={title}
              className="bg-white p-6 rounded-2xl shadow hover:-translate-y-2 transition"
            >
              <div
                className={`w-14 h-14 bg-gradient-to-br ${color} rounded-xl flex items-center justify-center text-white mb-4`}
              >
                <Icon />
              </div>
              <h3 className="font-bold text-lg mb-2">{title}</h3>
              <p className="text-gray-600">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ================= COURSES ================= */}
      <section className="py-20 bg-red-100 px-4">
        <div className="max-w-6xl mx-auto grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {courses.map(({ name, icon: Icon, color }) => (
            <div key={name} className="bg-white p-6 rounded-2xl shadow">
              <div
                className={`w-12 h-12 bg-gradient-to-br ${color} rounded-lg flex items-center justify-center text-white mb-4`}
              >
                <Icon />
              </div>
              <h3 className="text-xl font-bold">{name}</h3>
            </div>
          ))}
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <Footer />
    </div>
  );
};

export default Home;
