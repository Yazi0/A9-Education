import { useState, useEffect } from "react";
import QRCode from "react-qr-code";
import { toPng } from "html-to-image";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  GraduationCap,
  Camera,
  Save,
  ShieldCheck,
  Download,
  Copy,
  Check,
  BookOpen,
  Users,
  MessageSquare
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";

import StudentLayout from "../../layouts/StudentLayout";

const Profile = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>({
    studentId: "Loading...",
    name: "Loading...",
    address: "Loading...",
    email: "Loading...",
    phone: "Loading...",
    dob: "",
    grade: "Loading...",
    bio: "Loading...",
    dateJoined: ""
  });

  const [isEditing, setIsEditing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeClassesCount, setActiveClassesCount] = useState(0);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setLoading(true);
        const [profileRes, enrollmentsRes] = await Promise.all([
          api.get("users/me/"),
          api.get("enrollments/my/")
        ]);

        console.log("Profile Data:", profileRes.data);
        const data = profileRes.data;

        setProfile({
          studentId: data.student_id || data.studentId || "N/A",
          name: data.name || data.username || "Student",
          address: data.address || "Not provided",
          email: data.email || "Not provided",
          phone: data.phone || "Not provided",
          dob: data.dob || "2000-01-01",
          grade: data.current_grade || data.grade || "N/A",
          bio: data.about || data.bio || "No bio available",
          dateJoined: data.date_joined || ""
        });

        setActiveClassesCount(enrollmentsRes.data.length);
        setError(null);
      } catch (error: any) {
        console.error("Error fetching profile:", error);
        setError("Failed to load profile data. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchProfileData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSaveProfile = async () => {
    try {
      await api.patch("users/me/", {
        name: profile.name,
        address: profile.address,
        email: profile.email,
        phone: profile.phone,
        current_grade: profile.grade,
        about: profile.bio
      });
      setIsEditing(false);
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile.");
    }
  };


  const handleCopyID = () => {
    navigator.clipboard.writeText(profile.studentId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadQR = () => {
    const cardElement = document.getElementById("StudentIDCard");
    if (!cardElement) {
      alert("Could not find ID card element");
      return;
    }

    toPng(cardElement, {
      cacheBust: true,
      pixelRatio: 2, // Higher quality
      backgroundColor: '#ffffff'
    })
      .then((dataUrl) => {
        const link = document.createElement('a');
        link.download = `A9_Student_ID_${profile.studentId}.png`;
        link.href = dataUrl;
        link.click();
      })
      .catch((err) => {
        console.error('Error generating ID card image:', err);
        alert("Failed to generate ID card image");
      });
  };

  const stats = [
    {
      label: "Enrolled",
      value: activeClassesCount.toString(),
      icon: "📚"
    },
    {
      label: "Joined",
      value: profile.dateJoined ? new Date(profile.dateJoined).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : "N/A",
      icon: "📅"
    },
    {
      label: "Status",
      value: "Active",
      icon: "✅"
    },
    {
      label: "Verification",
      value: "Verified",
      icon: "🛡️"
    },
  ];

  return (
    <StudentLayout>
      {/* Main Content */}
      <div className="max-w-6xl mx-auto flex-1 w-full">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-[60vh]">
            <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-gray-600 text-lg">Loading your profile...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center h-[60vh]">
            <div className="bg-red-50 p-6 rounded-2xl border border-red-100 text-center max-w-md">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Unable to Load Profile</h3>
              <p className="text-gray-600 mb-6">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-2 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 transition-colors"
              >
                Retry
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Student Profile</h1>
                <p className="text-gray-600 mt-2">Manage your personal information and access your student QR code</p>
              </div>
              <div className="flex gap-3 mt-4 md:mt-0">
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="px-5 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors shadow-sm"
                >
                  {isEditing ? "Cancel Edit" : "Edit Profile"}
                </button>
                <button
                  onClick={handleSaveProfile}
                  className="px-5 py-2.5 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all flex items-center"
                >
                  <Save className="mr-2" size={18} />
                  Save Changes
                </button>
              </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              {/* Left Column - Profile Card */}
              <div className="lg:col-span-2 space-y-6">
                {/* Profile Card */}
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                  {/* Profile Header */}
                  <div className="h-32 bg-gradient-to-r from-red-600 to-red-700 relative">
                    <div className="absolute -bottom-16 left-8">
                      <div className="relative">
                        <div className="w-32 h-32 rounded-full border-4 border-white bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center overflow-hidden shadow-lg">
                          <User className="w-16 h-16 text-gray-400" />
                        </div>
                        {isEditing && (
                          <button className="absolute bottom-2 right-2 w-10 h-10 bg-red-600 hover:bg-red-700 rounded-full flex items-center justify-center text-white shadow-lg">
                            <Camera size={18} />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Profile Info */}
                  <div className="pt-20 px-6 pb-6">
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900">{profile.name}</h2>
                        <div className="flex items-center mt-1">
                          <ShieldCheck className="w-4 h-4 text-green-500 mr-2" />
                          <span className="text-sm font-medium text-gray-600">Registered {profile.role ? profile.role.charAt(0).toUpperCase() + profile.role.slice(1) : 'Student'}</span>
                        </div>
                      </div>
                      <span className="px-4 py-1.5 bg-gradient-to-r from-red-100 to-red-50 text-red-700 rounded-full text-sm font-semibold">
                        Grade {profile.grade}
                      </span>
                    </div>

                    {/* Bio */}
                    <div className="mb-8">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                      {isEditing ? (
                        <textarea
                          name="bio"
                          value={profile.bio}
                          onChange={handleChange}
                          className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 min-h-[100px] resize-none"
                          placeholder="Tell us about yourself..."
                        />
                      ) : (
                        <p className="text-gray-600 p-4 bg-gray-50 rounded-xl">{profile.bio}</p>
                      )}
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                      {stats.map((stat, index) => (
                        <div key={index} className="bg-gray-50 rounded-xl p-4 flex flex-col items-center justify-center text-center">
                          <div className="text-xl mb-1">{stat.icon}</div>
                          <p className="text-lg font-bold text-gray-900 truncate w-full">{stat.value}</p>
                          <p className="text-xs font-medium text-gray-500 mt-1">{stat.label}</p>
                        </div>
                      ))}
                    </div>

                    {/* Profile Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                            <Mail className="w-4 h-4 mr-2 text-red-600" />
                            Email Address
                          </label>
                          {isEditing ? (
                            <input
                              type="email"
                              name="email"
                              value={profile.email}
                              onChange={handleChange}
                              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                            />
                          ) : (
                            <p className="p-3 bg-gray-50 rounded-lg text-gray-900">{profile.email}</p>
                          )}
                        </div>

                        <div>
                          <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                            <Phone className="w-4 h-4 mr-2 text-red-600" />
                            Phone Number
                          </label>
                          {isEditing ? (
                            <input
                              type="tel"
                              name="phone"
                              value={profile.phone}
                              onChange={handleChange}
                              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                            />
                          ) : (
                            <p className="p-3 bg-gray-50 rounded-lg text-gray-900">{profile.phone}</p>
                          )}
                        </div>

                        <div>
                          <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                            <GraduationCap className="w-4 h-4 mr-2 text-red-600" />
                            Student ID
                          </label>
                          <div className="flex items-center gap-2">
                            <p className="flex-1 p-3 bg-gradient-to-r from-red-50 to-red-100 rounded-lg text-red-700 font-semibold">
                              {profile.studentId}
                            </p>
                            <button
                              onClick={handleCopyID}
                              className="p-3 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                              title="Copy Student ID"
                            >
                              {copied ? (
                                <Check className="w-4 h-4 text-green-600" />
                              ) : (
                                <Copy className="w-4 h-4 text-gray-600" />
                              )}
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                            <MapPin className="w-4 h-4 mr-2 text-red-600" />
                            Address
                          </label>
                          {isEditing ? (
                            <input
                              name="address"
                              value={profile.address}
                              onChange={handleChange}
                              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                            />
                          ) : (
                            <p className="p-3 bg-gray-50 rounded-lg text-gray-900">{profile.address}</p>
                          )}
                        </div>

                        <div>
                          <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                            <Calendar className="w-4 h-4 mr-2 text-red-600" />
                            Date of Birth
                          </label>
                          {isEditing ? (
                            <input
                              type="date"
                              name="dob"
                              value={profile.dob}
                              onChange={handleChange}
                              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                            />
                          ) : (
                            <p className="p-3 bg-gray-50 rounded-lg text-gray-900">
                              {new Date(profile.dob).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                            <User className="w-4 h-4 mr-2 text-red-600" />
                            Full Name
                          </label>
                          {isEditing ? (
                            <input
                              name="name"
                              value={profile.name}
                              onChange={handleChange}
                              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                            />
                          ) : (
                            <p className="p-3 bg-gray-50 rounded-lg text-gray-900">{profile.name}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - QR Code Only */}
              <div className="space-y-6">
                {/* ID Card Style QR Section */}
                <div className="space-y-6">
                  {/* Virtual Student ID Card */}
                  <div className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-red-600 to-red-900 rounded-[2rem] blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
                    <div
                      className="relative bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100 flex flex-col w-[320px] mx-auto"
                    >
                      <div id="StudentIDCard" className="bg-white">
                        {/* University Style ID Header */}
                        <div className="bg-red-700 px-5 py-2 text-white flex justify-between items-center relative overflow-hidden">
                          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
                          <div className="relative z-10 flex items-center gap-2">
                            <div className="w-6 h-6 bg-white rounded flex items-center justify-center font-black text-[10px] text-red-700 shadow-md">A9</div>
                            <div>
                              <h3 className="text-[11px] font-black tracking-widest uppercase leading-none">A9 Academy</h3>
                              <p className="text-[5px] text-red-100 font-bold tracking-[0.1em] mt-0.5">UNIVERSITY DIVISION</p>
                            </div>
                          </div>
                          <div className="relative z-10 text-right">
                            <div className="text-[6px] font-black text-white/90 tracking-tighter uppercase leading-none">Official ID</div>
                            <div className="h-0.5 w-6 bg-white/60 ml-auto mt-1 rounded-full"></div>
                          </div>
                        </div>

                        {/* ID Card Body */}
                        <div className="p-3 bg-white relative overflow-hidden">
                          {/* Pattern Overlay */}
                          <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#b91c1c 0.5px, transparent 0.5px)', backgroundSize: '10px 10px' }}></div>

                          <div className="relative z-10">
                            {/* Full Width Top Section for Name */}
                            <div className="mb-2 text-center border-b border-gray-100 pb-2">
                              <p className="text-[5px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">REGISTRATION IDENTITY</p>
                              <h4 className="text-[13px] font-black text-gray-900 leading-none uppercase tracking-tight">
                                {profile.name}
                              </h4>
                            </div>

                            <div className="flex gap-3 items-center">
                              {/* Left Side: Photo wrapper */}
                              <div className="flex flex-col items-center">
                                <div className="w-14 h-14 bg-gray-50 rounded-lg border-[1.5px] border-red-100 shadow-sm flex items-center justify-center overflow-hidden mb-1 relative">
                                  <User className="w-7 h-7 text-red-200" />
                                  <div className="absolute inset-0 border-[2.5px] border-white rounded-lg"></div>
                                </div>
                                <div className="px-1.5 py-0.5 bg-red-600 rounded text-[5px] font-extrabold text-white uppercase tracking-wider">
                                  ACTIVE
                                </div>
                              </div>

                              {/* Center: Details */}
                              <div className="flex-1 flex flex-col justify-center min-w-0 px-1">
                                <div className="mb-2">
                                  <p className="text-[5px] font-bold text-gray-400 uppercase leading-none mb-1">Registry No</p>
                                  <p className="text-[10px] font-black text-red-700 font-mono italic tracking-tighter whitespace-nowrap">{profile.studentId}</p>
                                </div>
                                <div>
                                  <p className="text-[5px] font-bold text-gray-400 uppercase leading-none mb-1">Grade Level</p>
                                  <p className="text-[10px] font-black text-gray-800 uppercase leading-none">L-{profile.grade}</p>
                                </div>
                              </div>

                              {/* Right Side: QR Code */}
                              <div className="flex flex-col items-center justify-center pl-2 border-l border-red-50">
                                <div className="p-1 bg-white border border-red-100 rounded-lg shadow-sm">
                                  <QRCode
                                    id="StudentQRCode"
                                    value={profile.studentId}
                                    size={48}
                                    level="M"
                                    fgColor="#b91c1c"
                                    style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                                  />
                                </div>
                                <p className="text-[5px] text-red-800 font-black mt-1.5 tracking-[0.2em] leading-none opacity-60">SCAN</p>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* ID Card Bottom */}
                        <div className="bg-red-700 py-1.5 px-4 flex justify-between items-center">
                          <div className="text-[5px] text-red-100 font-bold tracking-[0.2em]">VALID UNTIL DEC 2026</div>
                          <div className="flex gap-1">
                            <div className="w-1 h-1 bg-red-400 rounded-full animate-pulse"></div>
                            <div className="w-1 h-1 bg-red-400 rounded-full opacity-60"></div>
                            <div className="w-1 h-1 bg-red-400 rounded-full opacity-30"></div>
                          </div>
                        </div>
                      </div>

                      {/* ID Card Footer Action */}
                      <div className="px-6 py-4 bg-gray-50/50 border-t border-gray-100 mt-auto">
                        <button
                          onClick={handleDownloadQR}
                          className="w-full py-3 bg-white border border-gray-200 hover:border-red-600 hover:text-red-600 text-gray-700 rounded-xl font-bold text-xs uppercase tracking-widest transition-all shadow-sm flex items-center justify-center gap-2 active:scale-95"
                        >
                          <Download size={14} />
                          Download University ID
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* QR Code Info */}
                  <div className="p-4 bg-gradient-to-r from-red-50 to-red-100 rounded-xl">
                    <h4 className="font-semibold text-red-800 mb-2">QR Code Information</h4>
                    <ul className="text-sm text-red-700 space-y-1">
                      <li className="flex items-center">
                        <div className="w-1.5 h-1.5 bg-red-600 rounded-full mr-2"></div>
                        Contains student identification data
                      </li>
                      <li className="flex items-center">
                        <div className="w-1.5 h-1.5 bg-red-600 rounded-full mr-2"></div>
                        Can be scanned for attendance tracking
                      </li>
                      <li className="flex items-center">
                        <div className="w-1.5 h-1.5 bg-red-600 rounded-full mr-2"></div>
                        Valid for campus access and verification
                      </li>
                      <li className="flex items-center">
                        <div className="w-1.5 h-1.5 bg-red-600 rounded-full mr-2"></div>
                        Updated with current registration status
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Quick Actions Card */}
                <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-2xl shadow-xl p-6 text-white">
                  <h3 className="text-xl font-bold mb-4">Quick Actions</h3>
                  <div className="space-y-3">
                    <button
                      onClick={() => navigate("/student/my-subjects")}
                      className="w-full flex items-center justify-between p-3 bg-red-700 hover:bg-red-800 rounded-lg transition-colors"
                    >
                      <div className="flex items-center">
                        <BookOpen className="w-5 h-5 mr-3" />
                        <span>View Classes</span>
                      </div>
                      <span>→</span>
                    </button>
                    <button
                      onClick={() => navigate("/Subjects")}
                      className="w-full flex items-center justify-between p-3 bg-red-700 hover:bg-red-800 rounded-lg transition-colors"
                    >
                      <div className="flex items-center">
                        <Users className="w-5 h-5 mr-3" />
                        <span>Browse All Subjects</span>
                      </div>
                      <span>→</span>
                    </button>
                    <button
                      onClick={() => window.location.href = "mailto:support@a9education.com"}
                      className="w-full flex items-center justify-between p-3 bg-red-700 hover:bg-red-800 rounded-lg transition-colors"
                    >
                      <div className="flex items-center">
                        <MessageSquare className="w-5 h-5 mr-3" />
                        <span>Support Center</span>
                      </div>
                      <span>→</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </StudentLayout>
  );
};

export default Profile;