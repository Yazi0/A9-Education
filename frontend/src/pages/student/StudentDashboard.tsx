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
  Home,
  Target,
  Zap,
  Calendar,
  Trophy,
  TrendingDown,
  ChevronLeft,
  ChevronRight as RightIcon
} from "lucide-react";
import api from "../../api/axios";

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
      change: "+2",
      trend: "up"
    },
    {
      icon: <Video className="text-green-600" size={24} />,
      label: "Completed Lessons",
      value: "24",
      color: "bg-green-50",
      change: "+8",
      trend: "up"
    },
    {
      icon: <Award className="text-amber-600" size={24} />,
      label: "Achievements",
      value: "12",
      color: "bg-amber-50",
      change: "+3",
      trend: "up"
    },
    {
      icon: <Clock className="text-purple-600" size={24} />,
      label: "Study Hours",
      value: "42",
      color: "bg-purple-50",
      change: "+15",
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

  const recentActivity = [
    { action: "Completed Math Assignment", time: "2 hours ago", icon: "📝", color: "bg-red-100" },
    { action: "Joined Science Live Class", time: "Yesterday", icon: "🎥", color: "bg-green-100" },
    { action: "Earned 'Quick Learner' Badge", time: "2 days ago", icon: "🏆", color: "bg-amber-100" },
    { action: "Submitted English Essay", time: "3 days ago", icon: "✏️", color: "bg-blue-100" },
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
    {
      title: "Exam Prep",
      description: "Mid-term exams starting next week",
      progress: 40,
      icon: <Calendar className="text-white" size={32} />,
      color: "from-purple-600 to-purple-700"
    },
    {
      title: "Leaderboard",
      description: "Ranked #3 in your class",
      progress: 90,
      icon: <Trophy className="text-white" size={32} />,
      color: "from-blue-600 to-blue-700"
    }
  ];

  const nextSlide = () => {
    setActiveSlide((prev) => (prev + 1) % sliderContent.length);
  };

  const prevSlide = () => {
    setActiveSlide((prev) => (prev - 1 + sliderContent.length) % sliderContent.length);
  };

  const learningGoals = [
    { goal: "Complete Math Chapter 5", progress: 75, color: "bg-red-500" },
    { goal: "Science Project Submission", progress: 40, color: "bg-green-500" },
    { goal: "English Vocabulary Mastery", progress: 60, color: "bg-amber-500" },
    { goal: "Computer Lab Practice", progress: 90, color: "bg-blue-500" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6 flex flex-col">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
            Welcome back, <span className="text-red-600">{loading ? "..." : userData?.name || userData?.username}!</span>
          </h1>
          <p className="text-gray-600 mt-2">Here's your learning progress for today</p>
        </div>

        <div className="mt-4 md:mt-0 flex items-center space-x-4">
          <div className="relative">
            <div className="relative">
              <Bell className="text-gray-600 cursor-pointer hover:text-red-600 transition-colors" size={24} />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="relative">
              <img
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${userData?.username || "Guest"}&backgroundColor=b6e3f4`}
                alt="Profile"
                className="w-12 h-12 rounded-full border-2 border-white shadow-lg"
              />
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
            </div>
            <div>
              <p className="font-semibold text-gray-900">Grade {userData?.current_grade || "N/A"} Student</p>
              <p className="text-sm text-gray-500">ID: {userData?.student_id || "N/A"}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 group hover:border-red-100">
            <div className="flex items-center justify-between">
              <div className={`p-3 rounded-xl ${stat.color} group-hover:scale-110 transition-transform`}>
                {stat.icon}
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
              </div>
            </div>
            <div className="flex items-center mt-4">
              {stat.trend === "up" ? (
                <TrendingUp className="text-green-500 mr-2" size={16} />
              ) : (
                <TrendingDown className="text-red-500 mr-2" size={16} />
              )}
              <span className={`text-sm font-medium ${stat.trend === "up" ? "text-green-600" : "text-red-600"}`}>
                {stat.change} this week
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Slider Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900">Featured Challenges</h2>
          <div className="flex gap-2">
            <button
              onClick={prevSlide}
              className="p-2 bg-white rounded-lg shadow hover:bg-gray-50 transition-colors"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={nextSlide}
              className="p-2 bg-white rounded-lg shadow hover:bg-gray-50 transition-colors"
            >
              <RightIcon size={20} />
            </button>
          </div>
        </div>

        <div className="relative bg-gradient-to-r from-red-600 to-red-700 rounded-2xl shadow-xl overflow-hidden h-64">
          {sliderContent.map((slide, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-all duration-500 ${index === activeSlide ? "opacity-100" : "opacity-0 pointer-events-none"
                }`}
            >
              <div className={`h-full bg-gradient-to-r ${slide.color} p-8 flex flex-col justify-between`}>
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                        {slide.icon}
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-white">{slide.title}</h3>
                        <p className="text-red-100">{slide.description}</p>
                      </div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="flex justify-between text-white mb-2">
                      <span>Progress</span>
                      <span className="font-bold">{slide.progress}%</span>
                    </div>
                    <div className="h-3 bg-white/30 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-white rounded-full transition-all duration-1000"
                        style={{ width: `${slide.progress}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-center gap-2">
                  {sliderContent.map((_, dotIndex) => (
                    <button
                      key={dotIndex}
                      onClick={() => setActiveSlide(dotIndex)}
                      className={`w-2 h-2 rounded-full transition-all ${dotIndex === activeSlide ? "bg-white w-6" : "bg-white/50"
                        }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Quick Actions */}
        <div className="lg:col-span-2">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {quickActions.map((action, index) => (
                <button
                  key={index}
                  onClick={action.onClick}
                  className="group relative bg-white rounded-2xl p-5 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 overflow-hidden hover:-translate-y-1"
                >
                  <div className={`absolute inset-0 bg-gradient-to-r ${action.color} opacity-0 group-hover:opacity-5 transition-opacity`}></div>
                  <div className="relative">
                    <div className={`p-3 rounded-xl bg-gradient-to-r ${action.color} mb-4 inline-block`}>
                      {action.icon}
                    </div>
                    <div className="text-left">
                      <h3 className="font-bold text-lg text-gray-900 group-hover:text-red-600 transition-colors">
                        {action.title}
                      </h3>
                      <p className="text-sm text-gray-500">{action.description}</p>
                    </div>
                  </div>
                  <ChevronRight className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-300 group-hover:text-red-500 transition-colors" size={20} />
                </button>
              ))}
            </div>
          </div>

          {/* Learning Goals */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Learning Goals</h2>
              <button className="text-red-600 hover:text-red-700 text-sm font-medium flex items-center">
                Set New Goal <RightIcon size={16} className="ml-1" />
              </button>
            </div>
            <div className="space-y-4">
              {learningGoals.map((goal, index) => (
                <div key={index} className="group">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-900">{goal.goal}</span>
                    <span className="text-sm font-semibold text-gray-700">{goal.progress}%</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${goal.color} rounded-full transition-all duration-700 group-hover:shadow-lg`}
                      style={{ width: `${goal.progress}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activity & Progress */}
        <div className="space-y-6">
          {/* Recent Activity */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Recent Activity</h2>
              <button className="text-red-600 hover:text-red-700 text-sm font-medium">
                View All
              </button>
            </div>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center p-4 rounded-xl bg-gray-50 hover:bg-red-50 transition-colors group">
                  <div className={`w-10 h-10 ${activity.color} rounded-lg flex items-center justify-center text-lg mr-4`}>
                    {activity.icon}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{activity.action}</p>
                    <p className="text-sm text-gray-500">{activity.time}</p>
                  </div>
                  <div className="w-2 h-2 bg-red-500 rounded-full group-hover:animate-pulse"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-auto">
        <div className="max-w-7xl mx-auto pt-6 border-t border-gray-200">
          <div className="bg-red-200 rounded-2xl p-6 shadow-lg">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="text-center md:text-left mb-4 md:mb-0">
                <div className="flex items-center justify-center md:justify-start mb-2">
                  <div className="w-10 h-10 bg-gradient-to-r from-red-600 to-red-700 rounded-full flex items-center justify-center mr-3 shadow-lg">
                    <Home className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">A9 Education Center</h2>
                </div>
                <p className="text-gray-700">Empowering students through quality education since 2010</p>
              </div>

              <div className="text-center md:text-right">
                <p className="text-sm text-gray-700 mb-1">© {new Date().getFullYear()} A9 Education Center</p>
                <p className="text-xs text-gray-600 mb-3">All rights reserved</p>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-red-300 text-center">
              <p className="text-sm text-gray-700">
                Galle, Sri Lanka • 📞 +94 91 223 4455 • ✉️ info@a9education.lk
              </p>
              <p className="text-xs text-gray-600 mt-2">
                "Education is the passport to the future, for tomorrow belongs to those who prepare for it today."
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default StudentDashboard;