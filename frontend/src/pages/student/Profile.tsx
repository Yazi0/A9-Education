import { useState, useEffect } from "react";
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
  QrCode,
  Download,
  Copy,
  Check,
  Home,
  BookOpen,
  Users,
  MessageSquare
} from "lucide-react";
import api from "../../api/axios";

const Profile = () => {
  const [profile, setProfile] = useState<any>({
    studentId: "Loading...",
    name: "Loading...",
    address: "Loading...",
    email: "Loading...",
    phone: "Loading...",
    dob: "",
    grade: "Loading...",
    bio: "Loading..."
  });

  const [isEditing, setIsEditing] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get("users/me/");
        const data = response.data;
        setProfile({
          studentId: data.student_id,
          name: data.name,
          address: data.address,
          email: data.email,
          phone: data.phone,
          dob: data.dob || "2000-01-01",
          grade: data.current_grade,
          bio: data.about || ""
        });
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };
    fetchProfile();
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
    // In a real app, this would generate and download the QR code
    const qrData = {
      studentId: profile.studentId,
      name: profile.name,
      grade: profile.grade,
      email: profile.email
    };

    // Simulate QR code download
    console.log("Downloading QR code for:", qrData);

    // Create a dummy download link
    const link = document.createElement('a');
    link.href = `data:text/plain;charset=utf-8,${encodeURIComponent(JSON.stringify(qrData))}`;
    link.download = `Student_QR_${profile.studentId}.txt`;
    link.click();

    // Show success message
    alert(`QR code data downloaded for ${profile.name}`);
  };

  const stats = [
    { label: "Attendance", value: "94%", icon: "📊" },
    { label: "Avg. Score", value: "88%", icon: "⭐" },
    { label: "Classes", value: "3", icon: "📚" },
    { label: "Registration", value: "Active", icon: "✅" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6 flex flex-col">
      {/* Main Content */}
      <div className="max-w-6xl mx-auto flex-1 w-full">
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
                      <span className="text-sm font-medium text-gray-600">Verified Student</span>
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
                    <div key={index} className="bg-gray-50 rounded-xl p-4 text-center">
                      <div className="text-2xl mb-1">{stat.icon}</div>
                      <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                      <p className="text-sm text-gray-500">{stat.label}</p>
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
            {/* QR Code Card */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900 flex items-center">
                  <QrCode className="mr-2 text-red-600" />
                  Student QR Code
                </h3>
                <span className="text-sm text-gray-500">ID: {profile.studentId}</span>
              </div>

              {/* QR Code Display Area */}
              <div className="bg-gray-50 rounded-xl p-8 flex flex-col items-center justify-center mb-6">
                <div className="relative">
                  {/* Placeholder QR Code - In real app, this would be generated */}
                  <div className="w-48 h-48 bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg flex flex-col items-center justify-center border-2 border-dashed border-gray-300">
                    <QrCode className="w-16 h-16 text-gray-400 mb-4" />
                    <div className="text-center">
                      <p className="text-sm font-semibold text-gray-600">{profile.name}</p>
                      <p className="text-xs text-gray-500 mt-1">Grade {profile.grade}</p>
                    </div>
                  </div>

                  {/* Student ID in QR Code */}
                  <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-white px-3 py-1 rounded-full shadow-md">
                    <span className="text-xs font-bold text-red-600">{profile.studentId}</span>
                  </div>
                </div>

                <p className="text-sm text-gray-500 mt-6 text-center">
                  Scan this QR code to verify student identity and access information
                </p>
              </div>

              {/* Download Button */}
              <button
                onClick={handleDownloadQR}
                className="w-full py-3.5 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-xl font-semibold transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-3 mb-4"
              >
                <Download size={20} />
                Download QR Code
              </button>

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
                <button className="w-full flex items-center justify-between p-3 bg-red-700 hover:bg-red-800 rounded-lg transition-colors">
                  <div className="flex items-center">
                    <BookOpen className="w-5 h-5 mr-3" />
                    <span>View Classes</span>
                  </div>
                  <span>→</span>
                </button>
                <button className="w-full flex items-center justify-between p-3 bg-red-700 hover:bg-red-800 rounded-lg transition-colors">
                  <div className="flex items-center">
                    <Users className="w-5 h-5 mr-3" />
                    <span>Contact Teacher</span>
                  </div>
                  <span>→</span>
                </button>
                <button className="w-full flex items-center justify-between p-3 bg-red-700 hover:bg-red-800 rounded-lg transition-colors">
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
      </div>

      {/* Footer */}
      <footer className="mt-auto">
        <div className="max-w-6xl mx-auto pt-6 border-t border-gray-200">
          <div className="bg-red-200 rounded-2xl p-6 shadow-lg">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="text-center md:text-left mb-4 md:mb-0">
                <div className="flex items-center justify-center md:justify-start mb-2">
                  <div className="w-10 h-10 bg-gradient-to-r from-red-600 to-red-700 rounded-full flex items-center justify-center mr-3">
                    <Home className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">A9 Education Center</h2>
                </div>
                <p className="text-gray-700">Empowering students through quality education</p>
              </div>

              <div className="text-center md:text-right">
                <p className="text-sm text-gray-600 mb-1">© {new Date().getFullYear()} A9 Education Center</p>
                <p className="text-xs text-gray-500">All rights reserved</p>
                <div className="flex justify-center md:justify-end gap-4 mt-3">
                  <a href="#" className="text-gray-600 hover:text-red-700 text-sm">Terms of Service</a>
                  <a href="#" className="text-gray-600 hover:text-red-700 text-sm">Privacy Policy</a>
                  <a href="#" className="text-gray-600 hover:text-red-700 text-sm">Contact Us</a>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-red-300 text-center">
              <p className="text-sm text-gray-700">
                Galle, Sri Lanka • 📞 +94 91 223 4455 • ✉️ info@a9education.lk
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Profile;