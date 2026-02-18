// src/pages/teacher/TeacherDashboard.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Video,
  FileText,
  Users,
  ChevronRight,
  GraduationCap,
  Sparkles,
  BookOpen,
  LayoutDashboard,
  LogOut,
  Edit3,
  Save,
  X,
  Loader2,
  Calendar,
  Clock,
  User
} from "lucide-react";
import api from "../../api/axios";

interface TeacherData {
  name: string;
  subject: string;
  grades: string[];
  educational_qualifications?: string;
  about?: string;
  class_fee?: string;
}

const TeacherDashboard = () => {
  const navigate = useNavigate();

  // State for teacher data
  const [teacher, setTeacher] = useState<TeacherData>({
    name: "Loading...",
    subject: "Loading...",
    grades: ["Loading..."]
  });

  // UI states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<TeacherData>({
    name: "",
    subject: "",
    grades: [],
    educational_qualifications: "",
    about: "",
    class_fee: ""
  });
  const [tempGrades, setTempGrades] = useState("");
  const [saving, setSaving] = useState(false);

  // Fetch teacher data on mount
  useEffect(() => {
    const fetchTeacherData = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await api.get("users/me/");
        const userData = response.data;

        const teacherData: TeacherData = {
          name: userData.name || userData.username || "Teacher",
          subject: userData.subject || "Not specified",
          grades: userData.grades
            ? (typeof userData.grades === 'string'
              ? userData.grades.split(",").map((g: string) => g.trim())
              : userData.grades)
            : ["Not specified"],
          educational_qualifications: userData.educational_qualifications,
          about: userData.about,
          class_fee: userData.class_fee
        };

        setTeacher(teacherData);
        setEditData(teacherData);
        setTempGrades(teacherData.grades.join(", "));

      } catch (err: any) {
        console.error("Error loading dashboard:", err);
        if (err.response?.status === 401) {
          setError("Session expired. Redirecting to login...");
          setTimeout(() => {
            localStorage.clear();
            navigate("/login");
          }, 2000);
        } else {
          setError(err.message || "Failed to load dashboard data.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchTeacherData();
  }, [navigate]);

  // Edit functions
  const handleEditClick = () => {
    setIsEditing(true);
    setEditData({ ...teacher });
    setTempGrades(teacher.grades.join(", "));
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditData({ ...teacher });
    setTempGrades(teacher.grades.join(", "));
  };

  const handleSaveEdit = async () => {
    try {
      setSaving(true);
      setError(null);

      const updatedGrades = tempGrades.split(",").map(g => g.trim()).filter(g => g);

      await api.patch("users/me/", {
        name: editData.name,
        subject: editData.subject,
        grades: updatedGrades.join(", "),
        educational_qualifications: editData.educational_qualifications,
        about: editData.about,
        class_fee: editData.class_fee
      });

      setTeacher({
        ...editData,
        grades: updatedGrades
      });
      setIsEditing(false);
      alert("Profile updated successfully!");
    } catch (err: any) {
      console.error("Error saving profile:", err);
      setError(err.message || "Failed to save profile changes.");
      alert("Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field: keyof TeacherData, value: string) => {
    setEditData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    navigate("/login");
  };

  // Sidebar items
  const sidebarItems = [
    { name: "Dashboard", icon: <LayoutDashboard className="w-5 h-5" />, path: "/teacherdashboard" },
    { name: "Upload Video", icon: <Video className="w-5 h-5" />, path: "/teacher/upload-video" },
    { name: "Upload Notes", icon: <FileText className="w-5 h-5" />, path: "/teacher/upload-notes" },
    { name: "My Students", icon: <Users className="w-5 h-5" />, path: "/teacher/students" }
  ];

  // Quick action items
  const features = [
    {
      id: 1,
      title: "Upload Video",
      description: "Share lecture videos and multimedia content",
      icon: <Video className="w-6 h-6" />,
      path: "/teacher/upload-video",
      color: "bg-gradient-to-br from-purple-500 to-pink-600",
      textColor: "text-purple-600"
    },
    {
      id: 2,
      title: "Upload Notes",
      description: "Upload study materials and resources",
      icon: <FileText className="w-6 h-6" />,
      path: "/teacher/upload-notes",
      color: "bg-gradient-to-br from-emerald-500 to-teal-600",
      textColor: "text-emerald-600"
    },
    {
      id: 3,
      title: "My Students",
      description: "View and manage student progress",
      icon: <Users className="w-6 h-6" />,
      path: "/teacher/students",
      color: "bg-gradient-to-br from-amber-500 to-orange-600",
      textColor: "text-amber-600"
    }
  ];

  // Recent activities
  const activities: any[] = [];

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4 mx-auto"></div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Loading Teacher Dashboard</h2>
          <p className="text-gray-600">Getting your profile ready...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) { // Don't show error if we have demo data
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50 p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-6">
            <div className="text-2xl font-bold text-red-600">!</div>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-3">Oops!</h1>

          <p className="text-gray-600 mb-6">{error}</p>

          <div className="flex flex-col gap-3">
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors"
            >
              Refresh Page
            </button>

            <button
              onClick={handleLogout}
              className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
            >
              Go to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Main dashboard UI
  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 hidden md:flex flex-col fixed left-0 top-0 h-screen bg-white border-r border-gray-200">
        <div className="p-6 border-b">
          <h2 className="text-xl font-bold text-indigo-600">Teacher Panel</h2>
          <p className="text-sm text-gray-500 mt-1">Education Platform</p>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {sidebarItems.map(item => (
            <button
              key={item.name}
              onClick={() => navigate(item.path)}
              className="flex items-center gap-3 w-full px-4 py-3 rounded-lg font-medium
                text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-all duration-200"
            >
              {item.icon}
              {item.name}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-200">
          <div className="mb-4 p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-indigo-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700 truncate">{teacher.name}</p>
                <p className="text-xs text-gray-500">Teacher</p>
              </div>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-3 text-gray-600 hover:text-red-600 w-full p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <main className="md:ml-64 flex-1 p-4 md:p-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white rounded-xl shadow-sm">
              <GraduationCap className="w-9 h-9 text-indigo-600" />
            </div>

            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Teacher Dashboard</h1>
              <p className="text-gray-600 flex items-center gap-2 mt-1">
                <Sparkles className="w-4 h-4 text-amber-500" />
                Welcome back, {teacher.name}
              </p>
            </div>
          </div>
        </div>

        {/* Teacher Info Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 mb-8">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-800">Teacher Information</h2>

              {!isEditing ? (
                <button
                  onClick={handleEditClick}
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium
                    text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors"
                >
                  <Edit3 className="w-4 h-4" />
                  Edit Profile
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={handleCancelEdit}
                    className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium
                      text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                    disabled={saving}
                  >
                    <X className="w-4 h-4" />
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveEdit}
                    className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium
                      text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
                    disabled={saving}
                  >
                    {saving ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Save className="w-4 h-4" />
                    )}
                    {saving ? "Saving..." : "Save"}
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    disabled={saving}
                  />
                ) : (
                  <p className="text-lg font-semibold text-gray-900">{teacher.name}</p>
                )}
              </div>

              {/* Subject */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">Subject</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editData.subject}
                    onChange={(e) => handleInputChange("subject", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    disabled={saving}
                  />
                ) : (
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-indigo-600" />
                    <span className="text-lg font-semibold text-gray-900">{teacher.subject}</span>
                  </div>
                )}
              </div>

              {/* Grades */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">Grades</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={tempGrades}
                    onChange={(e) => setTempGrades(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Grade 8, Grade 9, Grade 10"
                    disabled={saving}
                  />
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {teacher.grades.map(grade => (
                      <span
                        key={grade}
                        className="px-3 py-1 text-sm rounded-full bg-indigo-100 text-indigo-700 font-medium"
                      >
                        {grade}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Additional Info */}
            {(teacher.about || teacher.educational_qualifications || teacher.class_fee || isEditing) && (
              <div className="mt-8 pt-8 border-t border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* About */}
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">About</label>
                  {isEditing ? (
                    <textarea
                      value={editData.about || ""}
                      onChange={(e) => handleInputChange("about", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent h-32"
                      placeholder="Tell students about yourself..."
                      disabled={saving}
                    />
                  ) : teacher.about ? (
                    <p className="text-gray-700">{teacher.about}</p>
                  ) : (
                    <p className="text-gray-500 italic">No information provided</p>
                  )}
                </div>

                {/* Qualifications */}
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">Qualifications</label>
                  {isEditing ? (
                    <textarea
                      value={editData.educational_qualifications || ""}
                      onChange={(e) => handleInputChange("educational_qualifications", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent h-32"
                      placeholder="Your educational background..."
                      disabled={saving}
                    />
                  ) : teacher.educational_qualifications ? (
                    <p className="text-gray-700">{teacher.educational_qualifications}</p>
                  ) : (
                    <p className="text-gray-500 italic">No qualifications provided</p>
                  )}
                </div>

                {/* Class Fee */}
                {isEditing || teacher.class_fee ? (
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-2">Class Fee</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editData.class_fee || ""}
                        onChange={(e) => handleInputChange("class_fee", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        placeholder="e.g., $50/hour"
                        disabled={saving}
                      />
                    ) : teacher.class_fee ? (
                      <p className="text-lg font-semibold text-gray-900">{teacher.class_fee}</p>
                    ) : null}
                  </div>
                ) : null}
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {features.map(feature => (
            <div
              key={feature.id}
              onClick={() => navigate(feature.path)}
              className="group bg-white rounded-2xl p-6 shadow-lg border border-gray-100
                hover:shadow-xl transition-all duration-300 cursor-pointer hover:-translate-y-1"
            >
              <div className="flex items-start justify-between">
                <div className="flex gap-4">
                  <div className={`p-3 ${feature.color} rounded-xl text-white`}>
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className={`font-bold text-lg ${feature.textColor}`}>{feature.title}</h3>
                    <p className="text-gray-600 text-sm mt-1">{feature.description}</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
          ))}
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-xl font-semibold text-gray-800">Recent Activity</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {activities.map(activity => (
                <div key={activity.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                    <span className="text-gray-700">{activity.title}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Clock className="w-4 h-4" />
                    {activity.time}
                  </div>
                </div>
              ))}
            </div>

            {activities.length === 0 && (
              <div className="text-center py-8">
                <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No recent activity</p>
              </div>
            )}
          </div>
        </div>

      </main>
    </div>
  );
};

export default TeacherDashboard;