import { useState, useEffect } from "react";
import QRCode from "react-qr-code";
import {
  Eye, EyeOff, CheckCircle, User, MapPin,
  Lock, GraduationCap, Shield, Hash, Download,
  ChevronRight, Star, BookOpen, Award, Rocket,
  X, Camera, Upload
} from "lucide-react";
import ThemeImg from "../../assets/image/Theme.png";
import api from "../../api/axios";

interface Props {
  onClose: () => void;
}

interface Props {
  onClose: () => void;
}

const Register = ({ onClose }: Props) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [showRegistrationPopup, setShowRegistrationPopup] = useState(false);

  // Student fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [district, setDistrict] = useState("");
  const [grade, setGrade] = useState("G-8");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [generatedStudentId, setGeneratedStudentId] = useState("");
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);


  const districts = [
    "GAL", "COL", "KAN", "GAM", "MAT", "KAL", "NUW", "HAM",
    "ANP", "BAD", "KEG", "KUR", "MTR", "POL", "PUT", "RAT"
  ];

  const grades = [
    "G-6", "G-7", "G-8", "G-9", "G-10", "G-11", "G-12"
  ];

  // Generate student ID whenever district or grade changes
  useEffect(() => {
    if (district && grade) {
      const randomNum = Math.floor(1000 + Math.random() * 9000);
      const studentId = `STU/${district}/${grade}/S${randomNum}`;
      setGeneratedStudentId(studentId);
    }
  }, [district, grade]);

  const validateForm = () => {
    const errors: string[] = [];

    // Required fields
    if (!name.trim()) errors.push("Full name is required");
    if (!email.trim() || !email.includes('@')) errors.push("Valid email is required");
    if (!phone.trim() || phone.length < 10) errors.push("Valid phone number is required");
    if (!address.trim()) errors.push("Address is required");
    if (!district) errors.push("District is required");
    if (!grade) errors.push("Grade is required");

    // Username and password validations
    if (!username.trim()) errors.push("Username is required");
    if (username.length < 4) errors.push("Username must be at least 4 characters");
    if (password.length < 6) errors.push("Password must be at least 6 characters");
    if (password !== confirmPassword) errors.push("Passwords do not match");

    return errors;
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRegister = async () => {
    const errors = validateForm();
    if (errors.length > 0) {
      alert(errors.join("\n"));
      return;
    }

    try {
      const formData = new FormData();
      formData.append("username", username);
      formData.append("password", password);
      formData.append("email", email);
      formData.append("role", "student");
      formData.append("name", name);
      formData.append("phone", phone);
      formData.append("address", address);
      formData.append("district", district);
      formData.append("current_grade", grade);
      if (profileImage) {
        formData.append("profile_image", profileImage);
      }

      const response = await api.post("users/register/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const newUser = response.data;
      setGeneratedStudentId(newUser.student_id);

      // Show registration popup
      setShowRegistrationPopup(true);
    } catch (error: any) {
      console.error("Registration error:", error);
      const msg = error.response?.data?.username ? "Username already exists" : "Registration failed. Please try again.";
      alert(msg);
    }
  };


  const nextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const closeRegistrationPopup = () => {
    setShowRegistrationPopup(false);
    onClose();
  };

  return (
    <div className="w-full bg-white">
      {/* HEADER WITH DECORATIVE ELEMENTS */}
      <div className="relative bg-gradient-to-br from-red-500 via-red-600 to-red-700 overflow-hidden rounded-t-2xl">
        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-32 h-32 bg-white/10 rounded-full -translate-x-16 -translate-y-16"></div>
        <div className="absolute bottom-0 right-0 w-40 h-40 bg-white/5 rounded-full translate-x-20 translate-y-20"></div>

        {/* Integrated Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-50 p-2 text-white hover:bg-white/20 rounded-full transition-all group"
        >
          <X className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
        </button>

        <div className="relative z-10 p-3">
          <div className="flex items-center justify-between mb-3 mr-8">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-white/20 backdrop-blur-sm rounded-lg">
                <Rocket className="w-4 h-4 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-white leading-tight">Student Registration</h1>
              </div>
            </div>

            <div className="hidden md:block pr-2">
              <img src={ThemeImg} className="w-10 h-10 object-contain drop-shadow-lg" alt="Theme" />
            </div>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center justify-between relative px-2">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex flex-col items-center relative z-10">
                <div className={`
                  w-8 h-8 rounded-full flex items-center justify-center mb-1
                  ${currentStep >= step
                    ? "bg-white text-red-600 shadow-lg"
                    : "bg-white/30 text-white"}
                  transition-all duration-300
                `}>
                  {currentStep > step ? (
                    <CheckCircle className="w-4 h-4" />
                  ) : (
                    <span className="text-xs font-bold">{step}</span>
                  )}
                </div>
                <span className="text-[10px] font-medium text-white">
                  {step === 1 ? "Personal" : step === 2 ? "Academic" : "Security"}
                </span>
              </div>
            ))}

            {/* Progress Line */}
            <div className="absolute top-4 left-0 right-0 h-1 bg-white/30 mx-4">
              <div
                className="h-full bg-white transition-all duration-500"
                style={{ width: `${(currentStep - 1) * 50}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* FORM CONTENT */}
      <div className="p-4 px-6">
        <div className="space-y-4">
          {/* WELCOME MESSAGE */}
          {currentStep === 1 && (
            <div className="text-center mb-2">
              <h2 className="text-md font-bold text-gray-900 leading-tight">
                Welcome Future Learner! 🎓
              </h2>
            </div>
          )}

          {/* STEP 1: PERSONAL INFORMATION */}
          {currentStep === 1 && (
            <div className="space-y-3">
              <div className="flex flex-row items-center gap-4 mb-1 p-3 bg-gray-50 rounded-xl border border-gray-100">
                <div className="relative group shrink-0">
                  <div className="w-16 h-16 bg-white rounded-xl border-2 border-dashed border-red-200 flex items-center justify-center overflow-hidden shadow-inner group-hover:border-red-400 transition-colors">
                    {imagePreview ? (
                      <img src={imagePreview} className="w-full h-full object-cover" alt="Profile Preview" />
                    ) : (
                      <Camera className="w-6 h-6 text-red-100" />
                    )}
                  </div>
                  <label className="absolute -bottom-1 -right-1 p-1.5 bg-red-600 text-white rounded-lg shadow-md cursor-pointer hover:bg-red-700 transition-all scale-90">
                    <Upload className="w-3 h-3" />
                    <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                  </label>
                </div>

                <div className="flex-1">
                  <h3 className="text-xs font-bold text-gray-900 mb-0.5">Profile Photo</h3>
                  <p className="text-[10px] text-gray-500 leading-tight">
                    Required for your official student identity card. (Max 5MB).
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 mb-1">
                <div className="p-1 bg-red-100 rounded">
                  <User className="w-3 h-3 text-red-600" />
                </div>
                <h3 className="text-xs font-bold text-gray-900">Personal Information</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="flex items-center gap-2 text-xs font-semibold text-gray-700">
                    Full Name *
                  </label>
                  <input
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                    placeholder="Enter your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div className="space-y-1">
                  <label className="flex items-center gap-2 text-xs font-semibold text-gray-700">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                    placeholder="student@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div className="space-y-1">
                  <label className="flex items-center gap-2 text-xs font-semibold text-gray-700">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                    placeholder="+94 77 123 4567"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>

                <div className="space-y-1">
                  <label className="flex items-center gap-2 text-xs font-semibold text-gray-700">
                    Address *
                  </label>
                  <input
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                    placeholder="Your residential address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </div>
              </div>

              {/* Tips Card */}
              <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-xl p-3 border border-red-200">
                <div className="flex items-center gap-3">
                  <Star className="w-4 h-4 text-red-500" />
                  <p className="text-[10px] text-red-600 font-medium">
                    Make sure all information is accurate. This will be used for your official student records.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: ACADEMIC INFORMATION */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-red-100 rounded-lg">
                  <GraduationCap className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Academic Details</h3>
                  <p className="text-sm text-gray-500">Set up your learning profile</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <MapPin className="w-4 h-4" />
                    District *
                  </label>
                  <div className="relative">
                    <select
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent appearance-none bg-white"
                      value={district}
                      onChange={(e) => setDistrict(e.target.value)}
                    >
                      <option value="">Select District</option>
                      {districts.map((dist) => (
                        <option key={dist} value={dist}>{dist}</option>
                      ))}
                    </select>
                    <ChevronRight className="absolute right-3 top-1/2 transform -translate-y-1/2 rotate-90 w-5 h-5 text-gray-400" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <BookOpen className="w-4 h-4" />
                    Grade Level *
                  </label>
                  <div className="relative">
                    <select
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent appearance-none bg-white"
                      value={grade}
                      onChange={(e) => setGrade(e.target.value)}
                    >
                      {grades.map((g) => (
                        <option key={g} value={g}>Grade {g.split('-')[1]}</option>
                      ))}
                    </select>
                    <ChevronRight className="absolute right-3 top-1/2 transform -translate-y-1/2 rotate-90 w-5 h-5 text-gray-400" />
                  </div>
                </div>
              </div>

              {/* Student ID Preview */}
              {district && grade && (
                <div className="bg-gradient-to-r from-red-50 to-pink-50 rounded-xl p-5 border-2 border-red-200 shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Hash className="w-5 h-5 text-red-600" />
                      <div>
                        <p className="text-sm font-medium text-red-700">Your Student ID</p>
                        <p className="font-mono text-lg font-bold text-red-900">{generatedStudentId}</p>
                      </div>
                    </div>
                    <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                      <Award className="w-5 h-5 text-red-600" />
                    </div>
                  </div>
                  <p className="text-xs text-red-600">
                    This unique ID will be used for all platform interactions
                  </p>
                </div>
              )}
            </div>
          )}

          {/* STEP 3: SECURITY & CREDENTIALS */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-red-100 rounded-lg">
                  <Shield className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Security Setup</h3>
                  <p className="text-sm text-gray-500">Create secure login credentials</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <User className="w-4 h-4" />
                    Username *
                  </label>
                  <input
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                    placeholder="Choose a unique username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                  <div className="flex items-center gap-2 mt-1">
                    <div className={`w-2 h-2 rounded-full ${username.length >= 4 ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                    <span className="text-xs text-gray-500">Minimum 4 characters</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                      <Lock className="w-4 h-4" />
                      Password *
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent pr-10 transition-all"
                        placeholder="Create a strong password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-red-600 transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <div className={`w-2 h-2 rounded-full ${password.length >= 6 ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                      <span className="text-xs text-gray-500">Minimum 6 characters</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                      <Lock className="w-4 h-4" />
                      Confirm Password *
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent pr-10 transition-all"
                        placeholder="Confirm your password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-red-600 transition-colors"
                      >
                        {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <div className={`w-2 h-2 rounded-full ${password === confirmPassword && password.length > 0 ? 'bg-green-500' : 'bg-red-300'}`}></div>
                      <span className="text-xs text-gray-500">Passwords must match</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* NAVIGATION BUTTONS */}
          <div className="flex justify-between pt-4 border-t border-gray-100 mt-2">
            {currentStep > 1 && (
              <button
                onClick={prevStep}
                className="px-5 py-2.5 border-2 border-gray-200 text-gray-700 rounded-xl font-bold text-sm hover:bg-gray-50 transition-all flex items-center gap-2"
              >
                <ChevronRight className="w-4 h-4 rotate-180" />
                Back
              </button>
            )}

            <button
              onClick={currentStep === 3 ? handleRegister : nextStep}
              className={`
                px-6 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2
                bg-gradient-to-r from-red-600 to-red-700 text-white 
                hover:from-red-700 hover:to-red-800 shadow-md hover:shadow-lg
                ${currentStep === 1 ? "ml-auto" : ""}
              `}
            >
              {currentStep === 3 ? "Complete Registration" : "Continue"}
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* REGISTRATION SUCCESS POPUP */}
      {showRegistrationPopup && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[95vh] overflow-y-auto">
            {/* Close Button */}
            <button
              onClick={closeRegistrationPopup}
              className="absolute top-4 right-4 z-[60] p-2 bg-red-100 hover:bg-red-200 text-red-600 rounded-full transition-colors shadow-lg"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Popup Header */}
            <div className="bg-gradient-to-br from-red-600 to-red-700 p-6 text-center">
              <h2 className="text-2xl font-bold text-white mb-1">
                Registration Successful! 🎉
              </h2>
              <p className="text-red-100 text-sm">
                Your Academic Account is now Active
              </p>
            </div>

            {/* Popup Content */}
            <div className="p-6">
              <div className="space-y-6">

                {/* ID Card Display Section */}
                <div className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                  <div id="StudentIDCardPreview" className="w-[320px] bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
                    {/* Card Header */}
                    <div className="bg-red-700 p-3 text-white flex justify-between items-center">
                      <div className="flex items-center gap-1.5">
                        <div className="w-6 h-6 bg-white rounded flex items-center justify-center font-black text-[10px] text-red-700">A9</div>
                        <span className="text-[11px] font-black uppercase tracking-wider">A9 Academy</span>
                      </div>
                      <span className="text-[7px] font-bold opacity-80 uppercase tracking-tighter">Student ID</span>
                    </div>

                    <div className="p-4 relative overflow-hidden">
                      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#b91c1c 0.5px, transparent 0.5px)', backgroundSize: '10px 10px' }}></div>
                      <div className="relative z-10">
                        {/* Name Header */}
                        <div className="mb-3 text-center border-b border-gray-100 pb-2">
                          <h4 className="text-[13px] font-black text-gray-900 leading-none uppercase">{name}</h4>
                        </div>

                        <div className="flex gap-4 items-center">
                          {/* Photo */}
                          <div className="flex flex-col items-center">
                            <div className="w-16 h-16 bg-gray-50 rounded-lg border-2 border-red-50 flex items-center justify-center overflow-hidden mb-1">
                              {imagePreview ? (
                                <img src={imagePreview} className="w-full h-full object-cover" alt="Pic" />
                              ) : (
                                <User className="w-8 h-8 text-red-100" />
                              )}
                            </div>
                            <div className="px-2 py-0.5 bg-red-600 rounded text-[5px] font-bold text-white uppercase">ACTIVE</div>
                          </div>

                          {/* Details */}
                          <div className="flex-1 space-y-2">
                            <div>
                              <p className="text-[5px] text-gray-400 font-bold uppercase">Registry No</p>
                              <p className="text-[10px] font-black text-red-700 font-mono italic">{generatedStudentId}</p>
                            </div>
                            <div>
                              <p className="text-[5px] text-gray-400 font-bold uppercase">Academic Level</p>
                              <p className="text-[10px] font-black text-gray-800 uppercase">{grade}</p>
                            </div>
                          </div>

                          {/* QR */}
                          <div className="pl-3 border-l border-red-50">
                            <div className="p-1 bg-white border border-red-100 rounded-lg">
                              <QRCode value={generatedStudentId} size={48} level="M" fgColor="#b91c1c" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="bg-red-700 py-1.5 px-4 text-center">
                      <span className="text-[5px] text-red-100 font-bold tracking-[0.2em]">VALID UNTIL DEC 2026</span>
                    </div>
                  </div>

                  <p className="text-xs text-center text-gray-500 mt-4 max-w-xs">
                    Your official student ID has been generated using your uploaded photo and registered details.
                  </p>
                </div>

                {/* Details and Actions */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                    <p className="text-blue-800 font-bold mb-2">Login Credentials</p>
                    <div className="space-y-1">
                      <p className="text-blue-600">Username: <span className="font-mono font-bold text-blue-900">{username}</span></p>
                      <p className="text-blue-600">Student ID: <span className="font-mono font-bold text-blue-900">{generatedStudentId}</span></p>
                    </div>
                  </div>
                  <div className="bg-amber-50 p-4 rounded-xl border border-amber-100">
                    <p className="text-amber-800 font-bold mb-2">Important</p>
                    <p className="text-amber-600 text-xs">Download your Student ID and keep it safe. You will need it for physical verification at A9 Academy.</p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-gray-100">
                  <button
                    onClick={() => {
                      const card = document.getElementById("StudentIDCardPreview");
                      if (card) {
                        import("html-to-image").then(m => {
                          m.toPng(card, { pixelRatio: 2 }).then(dataUrl => {
                            const link = document.createElement('a');
                            link.download = `A9_ID_${name.replace(/\s+/g, '_')}.png`;
                            link.href = dataUrl;
                            link.click();
                          });
                        });
                      }
                    }}
                    className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 transition-all flex items-center justify-center gap-2 shadow-lg"
                  >
                    <Download className="w-4 h-4" />
                    Download Student ID
                  </button>
                  <button
                    onClick={closeRegistrationPopup}
                    className="flex-1 py-3 bg-red-600 text-white rounded-xl font-bold text-sm hover:bg-red-700 transition-all flex items-center justify-center gap-2 shadow-lg"
                  >
                    <Rocket className="w-4 h-4" />
                    Complete Setup
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add fade-in animation */}
      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default Register;