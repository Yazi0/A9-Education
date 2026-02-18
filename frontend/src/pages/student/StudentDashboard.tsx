import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  BookOpen,
  BarChart3,
  Video,
  Award,
  Clock,
  TrendingUp,
  Bell,
  ChevronRight,
  Target,
  Zap,
  TrendingDown,
  ChevronLeft,
  ChevronRight as RightIcon
} from "lucide-react";
import api from "../../api/axios";

import StudentLayout from "../../layouts/StudentLayout";

const StudentDashboard = () => {
  const navigate = useNavigate();
  const [activeSlide, setActiveSlide] = useState(0);
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeSubjectsCount, setActiveSubjectsCount] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [meRes, enrollmentsRes] = await Promise.all([
          api.get("users/me/"),
          api.get("enrollments/my/")
        ]);
        setUserData(meRes.data);
        setActiveSubjectsCount(enrollmentsRes.data.length);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const stats = [
    {
      icon: <BookOpen className="text-red-600" size={24} />,
      label: "Active Subjects",
      value: activeSubjectsCount.toString(),
      color: "bg-red-50",
      change: "0",
      trend: "up"
    },
    {
      icon: <Video className="text-green-600" size={24} />,
      label: "Completed Lessons",
      value: "0",
      color: "bg-green-50",
      change: "0",
      trend: "up"
    },
    {
      icon: <Award className="text-amber-600" size={24} />,
      label: "Achievements",
      value: "0",
      color: "bg-amber-50",
      change: "0",
      trend: "up"
    },
    {
      icon: <Clock className="text-purple-600" size={24} />,
      label: "Study Hours",
      value: "0",
      color: "bg-purple-50",
      change: "0",
      trend: "up"
    },
  ];

  const quickActions = [
    {
      title: "My Profile",
      description: "Update personal information",
      icon: <User className="text-white" size={20} />,
      color: "from-red-600 to-red-700",
      onClick: () => navigate("/Profile")
    },
    {
      title: "All Subjects",
      description: "Browse available courses",
      icon: <BookOpen className="text-white" size={20} />,
      color: "from-red-600 to-red-700",
      onClick: () => navigate("/Subjects")
    },
    {
      title: "My Subjects",
      description: "View enrolled courses",
      icon: <BarChart3 className="text-white" size={20} />,
      color: "from-red-600 to-red-700",
      onClick: () => navigate("/student/my-subjects")
    },
  ];

  const sliderContent = [
    {
      title: "Weekly Challenge",
      description: "Complete 5 assignments this week",
      progress: 60,
      icon: <Target className="text-white" size={32} />,
      color: "from-red-600 to-red-700"
    },
    {
      title: "Study Streak",
      description: "14 days in a row! Keep it up!",
      progress: 85,
      icon: <Zap className="text-white" size={32} />,
      color: "from-amber-600 to-amber-700"
    },
  ];

  const nextSlide = () => {
    setActiveSlide((prev) => (prev + 1) % sliderContent.length);
  };

  const prevSlide = () => {
    setActiveSlide((prev) => (prev - 1 + sliderContent.length) % sliderContent.length);
  };

  return (
    <StudentLayout>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 px-1 md:px-0">
        <div className="text-center md:text-left">
          <h1 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight leading-tight">
            Welcome back, <span className="text-red-700">{loading ? "..." : userData?.name || userData?.username}!</span>
          </h1>
          <p className="text-gray-500 font-medium mt-1 text-sm md:text-base">Ready to level up your knowledge today?</p>
        </div>

        <div className="flex items-center justify-center md:justify-end gap-3">
          <button className="p-3 bg-white rounded-2xl shadow-sm border border-gray-100 hover:bg-gray-50 transition-all active:scale-95 relative">
            <Bell className="text-gray-600" size={22} />
            <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-red-600 border-2 border-white rounded-full animate-pulse"></span>
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 mb-8 px-1 md:px-0">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-2xl p-4 md:p-6 shadow-sm border border-gray-100 group transition-all hover:shadow-md">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div className={`p-2.5 rounded-xl ${stat.color} shrink-0 w-fit`}>
                {stat.icon}
              </div>
              <div className="md:text-right">
                <p className="text-2xl md:text-3xl font-black text-gray-900 leading-tight">{stat.value}</p>
                <p className="text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-widest mt-0.5">{stat.label}</p>
              </div>
            </div>
            <div className="flex items-center mt-4 pt-3 border-t border-gray-50">
              {stat.trend === "up" ? (
                <TrendingUp className="text-green-500 mr-1.5" size={14} />
              ) : (
                <TrendingDown className="text-red-500 mr-1.5" size={14} />
              )}
              <span className={`text-[10px] md:text-xs font-bold uppercase tracking-wide ${stat.trend === "up" ? "text-green-600" : "text-red-600"}`}>
                {stat.change} this week
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Slider Section */}
      <div className="mb-8 px-1 md:px-0">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl md:text-2xl font-black text-gray-900 tracking-tight">Featured for You</h2>
          <div className="flex gap-2">
            <button
              onClick={prevSlide}
              className="p-2 bg-white rounded-xl shadow-sm border border-gray-100 hover:bg-gray-50 transition-all active:scale-90"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={nextSlide}
              className="p-2 bg-white rounded-xl shadow-sm border border-gray-100 hover:bg-gray-50 transition-all active:scale-90"
            >
              <RightIcon size={18} />
            </button>
          </div>
        </div>

        <div className="relative rounded-3xl shadow-xl overflow-hidden h-[300px] md:h-64">
          {sliderContent.map((slide, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-all duration-700 ease-in-out ${index === activeSlide ? "opacity-100 scale-100" : "opacity-0 scale-110 pointer-events-none"
                }`}
            >
              <div className={`h-full bg-gradient-to-br ${slide.color} p-6 md:p-8 flex flex-col justify-between relative`}>
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
                <div className="relative z-10">
                  <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
                    <div className="p-4 bg-white/20 rounded-2xl backdrop-blur-md w-fit shadow-inner">
                      {slide.icon}
                    </div>
                    <div>
                      <h3 className="text-2xl md:text-3xl font-black text-white leading-tight">{slide.title}</h3>
                      <p className="text-white/80 font-medium text-sm md:text-base mt-1">{slide.description}</p>
                    </div>
                  </div>

                  <div className="max-w-md">
                    <div className="flex justify-between text-white text-xs font-black uppercase tracking-widest mb-2">
                      <span>Course Progress</span>
                      <span>{slide.progress}%</span>
                    </div>
                    <div className="h-3 bg-black/20 rounded-full overflow-hidden p-0.5">
                      <div
                        className="h-full bg-white rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(255,255,255,0.5)]"
                        style={{ width: `${slide.progress}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-center gap-2.5 relative z-10">
                  {sliderContent.map((_, dotIndex) => (
                    <button
                      key={dotIndex}
                      onClick={() => setActiveSlide(dotIndex)}
                      className={`h-1.5 rounded-full transition-all duration-500 ${dotIndex === activeSlide ? "bg-white w-8 shadow-[0_0_8px_rgba(255,255,255,0.8)]" : "bg-white/30 w-2 hover:bg-white/50"
                        }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 mb-8 px-1 md:px-0">
        {/* Quick Actions */}
        <div className="lg:col-span-2 space-y-8">
          <div>
            <h2 className="text-xl md:text-2xl font-black text-gray-900 tracking-tight mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
              {quickActions.map((action, index) => (
                <button
                  key={index}
                  onClick={action.onClick}
                  className="group relative bg-white rounded-2xl p-4 md:p-5 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden hover:-translate-y-1 active:scale-95"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${action.color} opacity-0 group-hover:opacity-[0.03] transition-opacity`}></div>
                  <div className="relative">
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${action.color} mb-4 inline-block shadow-lg shadow-red-100`}>
                      {action.icon}
                    </div>
                    <div className="text-left">
                      <h3 className="font-black text-base md:text-lg text-gray-900 group-hover:text-red-700 transition-colors">
                        {action.title}
                      </h3>
                      <p className="text-xs md:text-sm text-gray-400 font-medium mt-0.5">{action.description}</p>
                    </div>
                  </div>
                  <ChevronRight className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-200 group-hover:text-red-600 transition-all group-hover:translate-x-1" size={18} />
                </button>
              ))}
            </div>
          </div>

          {/* Learning Goals Placeholder */}
          <div className="bg-white rounded-3xl shadow-sm p-6 md:p-8 border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl md:text-2xl font-black text-gray-900 tracking-tight">Your Learning Goals</h2>
              <button className="text-red-700 hover:text-red-800 text-xs md:text-sm font-black uppercase tracking-wider flex items-center gap-2">
                Set New Goal <RightIcon size={14} />
              </button>
            </div>
            <div className="text-center py-10 border-2 border-dashed border-gray-100 rounded-2xl bg-gray-50/50">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                <Target size={24} className="text-gray-300" />
              </div>
              <p className="text-gray-400 font-bold text-sm">No learning goals set yet.</p>
              <p className="text-gray-300 text-xs mt-1">Start tracking your academic milestones!</p>
            </div>
          </div>
        </div>

        {/* Recent Activity Placeholder */}
        <div className="bg-white rounded-3xl shadow-sm p-6 md:p-7 border border-gray-100 flex flex-col h-fit hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl md:text-2xl font-black text-gray-900 tracking-tight">Activity</h2>
            <button className="text-red-700 hover:text-red-800 text-xs font-black uppercase tracking-wider">
              History
            </button>
          </div>
          <div className="text-center py-12 flex-1 flex flex-col justify-center border-2 border-dashed border-gray-100 rounded-2xl bg-gray-50/50">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
              <Zap size={24} className="text-gray-200" />
            </div>
            <p className="text-gray-400 font-bold text-sm">Watching for updates...</p>
            <p className="text-gray-300 text-xs mt-1">Activities will appear here.</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-8 mb-4 px-1 md:px-0">
        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start mb-3">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center p-1.5 shadow-sm border border-gray-100 overflow-hidden mr-3">
                  <img src="/icon.png" className="w-full h-full object-contain" alt="Logo" />
                </div>
                <div>
                  <h2 className="text-lg md:text-xl font-black text-gray-900 leading-tight">A9 Academy</h2>
                  <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest leading-none">Education Elevated</p>
                </div>
              </div>
              <p className="text-gray-500 text-xs md:text-sm max-w-xs font-medium">Empowering the next generation of scholars through innovative digital learning since 2010.</p>
            </div>

            <div className="text-center md:text-right">
              <div className="flex items-center justify-center md:justify-end gap-4 mb-3">
                <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center hover:bg-red-50 transition-colors cursor-pointer group">
                  <div className="w-4 h-4 rounded-full bg-gray-300 group-hover:bg-red-600 transition-colors"></div>
                </div>
                <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center hover:bg-red-50 transition-colors cursor-pointer group">
                  <div className="w-4 h-4 rounded-full bg-gray-300 group-hover:bg-red-600 transition-colors"></div>
                </div>
              </div>
              <p className="text-[10px] font-black pointer-events-none text-gray-400 uppercase tracking-widest">© {new Date().getFullYear()} A9 Academy Global</p>
              <p className="text-[10px] text-gray-300 uppercase font-bold tracking-tighter mt-0.5">Crafted for Excellence</p>
            </div>
          </div>
        </div>
      </footer>
    </StudentLayout>
  );
};

export default StudentDashboard;