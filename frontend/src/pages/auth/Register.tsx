import { useState, useEffect } from "react";
import QRCode from "react-qr-code";
import {
  Eye, EyeOff, CheckCircle, User, Mail, Phone, MapPin,
  Lock, GraduationCap, Shield, Hash, Download,
  ChevronRight, Star, BookOpen, Sparkles, Award, Rocket,
  X, Copy, Check, QrCode, CreditCard, Save, RefreshCw
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
  const [copied, setCopied] = useState(false);
  const [showRegistrationPopup, setShowRegistrationPopup] = useState(false);
  const [registrationNumber, setRegistrationNumber] = useState("");
  const [registrationDate, setRegistrationDate] = useState("");

  // Student fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [district, setDistrict] = useState("");
  const [grade, setGrade] = useState("G-8");
  // const [username, setUsername] = useState(""); // Removed manual username
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [generatedStudentId, setGeneratedStudentId] = useState("");


  const districts = [
    "GAL", "COL", "KAN", "GAM", "MAT", "KAL", "NUW", "HAM",
    "ANP", "BAD", "KEG", "KUR", "MTR", "POL", "PUT", "RAT"
  ];

  const grades = [
    "G-6", "G-7", "G-8", "G-9", "G-10", "G-11", "G-12"
  ];

  // Generate student ID whenever district or grade changes
  const generateNewId = () => {
    if (district && grade) {
      const studentId = `STU-${district}-${grade}-S${randomNum}`;
      setGeneratedStudentId(studentId);
    }
  };

  // Generate student ID whenever district or grade changes
  useEffect(() => {
    generateNewId();
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
    // Username validation removed as we use generatedStudentId
    // if (!username.trim()) errors.push("Username is required");
    // if (username.length < 4) errors.push("Username must be at least 4 characters");
    if (!generatedStudentId) errors.push("Student ID generation failed. Please re-select Grade/District.");
    if (password.length < 6) errors.push("Password must be at least 6 characters");
    if (password !== confirmPassword) errors.push("Passwords do not match");

    return errors;
  };

  const handleRegister = async () => {
    const errors = validateForm();
    if (errors.length > 0) {
      alert(errors.join("\n"));
      return;
    }

    try {
      const response = await api.post("users/register/", {
        username: generatedStudentId,
        password,
        email,
        role: "student",
        name,
        phone,
        address,
        district,
        current_grade: grade,
      });

      const newUser = response.data;

      // Generate registration number and date for display
      const regNum = `REG${Date.now().toString().slice(-8)}`;
      const now = new Date();
      const dateStr = now.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });

      setRegistrationNumber(regNum);
      setRegistrationDate(dateStr);
      setGeneratedStudentId(newUser.student_id);

      localStorage.setItem("lastRegisteredUser", JSON.stringify(newUser));

      // Show registration popup
      setShowRegistrationPopup(true);
    } catch (error: any) {
      console.error("Registration error:", error);
      let msg = "Registration failed. Please try again.";

      if (error.response?.data) {
        if (error.response.data.username) {
          msg = "Student ID already exists. Please click the refresh icon next to the Username to generate a new one.";
        } else {
          const errors = Object.entries(error.response.data)
            .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(", ") : value}`)
            .join("\n");
          if (errors) msg = errors;
        }
      }
      alert(msg);
    }
  };

  const downloadQRCode = () => {
    const svgElement = document.getElementById("student-qr-code");
    if (!svgElement) {
      console.error("QR Code SVG element not found");
      return;
    }

    const svg = svgElement.querySelector("svg");
    if (!svg) {
      console.error("SVG not found inside QR code container");
      return;
    }

    try {
      // Get SVG data
      const svgData = new XMLSerializer().serializeToString(svg);

      // Create canvas
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        console.error("Failed to get canvas context");
        return;
      }

      // Create image
      const img = new Image();
      const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
      const url = URL.createObjectURL(svgBlob);

      img.onload = () => {
        // Set canvas dimensions
        canvas.width = img.width;
        canvas.height = img.height;

        // Draw image on canvas
        ctx.drawImage(img, 0, 0);

        // Convert canvas to PNG
        const pngDataUrl = canvas.toDataURL("image/png");

        // Create download link
        const downloadLink = document.createElement("a");
        downloadLink.download = `Student-ID-${generatedStudentId.replace(/\//g, '-')}.png`;
        downloadLink.href = pngDataUrl;

        // Trigger download
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);

        // Clean up
        URL.revokeObjectURL(url);
      };

      img.onerror = () => {
        console.error("Failed to load SVG image");
        URL.revokeObjectURL(url);
      };

      img.src = url;
    } catch (error) {
      console.error("Error downloading QR code:", error);
      alert("Failed to download QR code. Please try again.");
    }
  };


  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
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

        <div className="relative z-10 p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 backdrop-blur-sm rounded-xl">
                <Rocket className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Student Registration</h1>
                <p className="text-red-100 text-sm">Join A9 Education Platform</p>
              </div>
            </div>

            <div className="hidden md:block">
              <img src={ThemeImg} className="w-20 h-20 object-contain drop-shadow-lg" alt="Theme" />
            </div>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center justify-between relative">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex flex-col items-center relative z-10">
                <div className={`
                  w-10 h-10 rounded-full flex items-center justify-center mb-2
                  ${currentStep >= step
                    ? "bg-white text-red-600 shadow-lg"
                    : "bg-white/30 text-white"}
                  transition-all duration-300
                `}>
                  {currentStep > step ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    <span className="font-bold">{step}</span>
                  )}
                </div>
                <span className="text-xs font-medium text-white">
                  {step === 1 ? "Personal" : step === 2 ? "Academic" : "Security"}
                </span>
              </div>
            ))}

            {/* Progress Line */}
            <div className="absolute top-5 left-0 right-0 h-1 bg-white/30">
              <div
                className="h-full bg-white transition-all duration-500"
                style={{ width: `${(currentStep - 1) * 50}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* FORM CONTENT */}
      <div className="p-6 max-h-[70vh] overflow-y-auto">
        <div className="space-y-8">
          {/* WELCOME MESSAGE */}
          {currentStep === 1 && (
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-red-50 rounded-2xl mb-4">
                <Sparkles className="w-8 h-8 text-red-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                Welcome Future Learner! 🎓
              </h2>
              <p className="text-gray-600">
                Let's get you started on your educational journey
              </p>
            </div>
          )}

          {/* STEP 1: PERSONAL INFORMATION */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-red-100 rounded-lg">
                  <User className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Personal Information</h3>
                  <p className="text-sm text-gray-500">Tell us about yourself</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <User className="w-4 h-4" />
                    Full Name *
                  </label>
                  <input
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                    placeholder="Enter your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <Mail className="w-4 h-4" />
                    Email Address *
                  </label>
                  <input
                    type="email"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                    placeholder="student@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <Phone className="w-4 h-4" />
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                    placeholder="+94 77 123 4567"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <MapPin className="w-4 h-4" />
                    Address *
                  </label>
                  <input
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                    placeholder="Your residential address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </div>
              </div>

              {/* Tips Card */}
              <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-xl p-4 border border-red-200">
                <div className="flex items-start gap-3">
                  <Star className="w-5 h-5 text-red-500 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-red-800 mb-1">Quick Tip</p>
                    <p className="text-xs text-red-600">
                      Make sure all information is accurate. This will be used for your official student records.
                    </p>
                  </div>
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
                    Username (Your Student ID)
                  </label>
                  <div className="flex gap-2">
                    <div className="w-full px-4 py-3 border border-gray-200 bg-gray-50 rounded-xl text-gray-700 font-mono font-bold flex items-center">
                      {generatedStudentId}
                    </div>
                    <button
                      type="button"
                      onClick={generateNewId}
                      className="p-3 border border-gray-300 rounded-xl hover:bg-gray-50 text-gray-600 transition-colors"
                      title="Regenerate ID"
                    >
                      <RefreshCw className="w-5 h-5" />
                    </button>
                  </div>
                  <p className="text-xs text-gray-500">This will be your username for logging in.</p>
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
          <div className="flex justify-between pt-6 border-t border-gray-200">
            {currentStep > 1 && (
              <button
                onClick={prevStep}
                className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-all flex items-center gap-2"
              >
                <ChevronRight className="w-4 h-4 rotate-180" />
                Back
              </button>
            )}

            <button
              onClick={currentStep === 3 ? handleRegister : nextStep}
              className={`
                px-6 py-3 rounded-xl font-medium transition-all flex items-center gap-2
                bg-gradient-to-r from-red-600 to-red-700 text-white 
                hover:from-red-700 hover:to-red-800 shadow-lg hover:shadow-xl
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
          <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
            {/* Close Button */}
            <button
              onClick={closeRegistrationPopup}
              className="absolute top-4 right-4 z-50 p-2 bg-red-100/80 hover:bg-red-200 text-red-600 rounded-full transition-colors shadow-lg backdrop-blur-sm"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Popup Header */}
            <div className="bg-gradient-to-br from-red-600 to-red-700 p-6 text-center">
              <div className="w-20 h-20 mx-auto bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mb-4 shadow-lg">
                <CheckCircle className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-2">
                Registration Successful! 🎉
              </h2>
              <p className="text-red-100 text-lg">
                Welcome to A9 Education Platform
              </p>
            </div>

            {/* Popup Content */}
            <div className="p-6">
              <div className="space-y-8">
                {/* Registration Details Card */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border-2 border-blue-200 shadow-lg">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <CreditCard className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-blue-800">Registration Details</h3>
                          <p className="text-sm text-blue-600">Your official registration information</p>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <p className="text-sm font-medium text-blue-700 mb-1">Registration Number</p>
                          <div className="flex items-center gap-3">
                            <p className="font-mono text-xl font-bold text-blue-900">{registrationNumber}</p>
                            <button
                              onClick={() => copyToClipboard(registrationNumber)}
                              className="p-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition-colors"
                              title="Copy Registration Number"
                            >
                              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                            </button>
                          </div>
                        </div>

                        <div>
                          <p className="text-sm font-medium text-blue-700 mb-1">Registration Date & Time</p>
                          <p className="text-lg font-semibold text-blue-900">{registrationDate}</p>
                        </div>

                        <div>
                          <p className="text-sm font-medium text-blue-700 mb-1">Student ID</p>
                          <div className="flex items-center gap-3">
                            <p className="font-mono text-xl font-bold text-blue-900">{generatedStudentId}</p>
                            <button
                              onClick={() => copyToClipboard(generatedStudentId)}
                              className="p-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition-colors"
                              title="Copy Student ID"
                            >
                              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-red-100 rounded-lg">
                          <QrCode className="w-6 h-6 text-red-600" />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-red-800">QR Code Access</h3>
                          <p className="text-sm text-red-600">Your digital login key</p>
                        </div>
                      </div>

                      <div className="flex flex-col items-center justify-center">
                        <div className="p-4 bg-white rounded-xl border-2 border-red-200 shadow-lg mb-4" id="student-qr-code">
                          <QRCode
                            value={generatedStudentId}
                            size={180}
                            bgColor="#FFFFFF"
                            fgColor="#DC2626"
                            level="H"
                          />
                        </div>
                        <p className="text-sm text-center text-red-600 mb-4">
                          Scan this QR code for instant login access
                        </p>
                        <button
                          onClick={downloadQRCode}
                          className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl font-medium hover:from-red-700 hover:to-red-800 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                        >
                          <Download className="w-5 h-5" />
                          Download QR Code
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Student Information Summary */}
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border-2 border-green-200 shadow-lg">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <User className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-green-800">Student Information</h3>
                      <p className="text-sm text-green-600">Your registered details</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="bg-white/70 p-4 rounded-xl border border-green-100">
                      <p className="text-xs text-gray-500 mb-1">Full Name</p>
                      <p className="font-semibold text-gray-900">{name}</p>
                    </div>

                    <div className="bg-white/70 p-4 rounded-xl border border-green-100">
                      <p className="text-xs text-gray-500 mb-1">Email</p>
                      <p className="font-semibold text-gray-900">{email}</p>
                    </div>

                    <div className="bg-white/70 p-4 rounded-xl border border-green-100">
                      <p className="text-xs text-gray-500 mb-1">Phone</p>
                      <p className="font-semibold text-gray-900">{phone}</p>
                    </div>

                    <div className="bg-white/70 p-4 rounded-xl border border-green-100">
                      <p className="text-xs text-gray-500 mb-1">Username</p>
                      <p className="font-semibold text-gray-900">{generatedStudentId}</p>
                    </div>

                    <div className="bg-white/70 p-4 rounded-xl border border-green-100">
                      <p className="text-xs text-gray-500 mb-1">Grade</p>
                      <p className="font-semibold text-gray-900">{grade}</p>
                    </div>

                    <div className="bg-white/70 p-4 rounded-xl border border-green-100">
                      <p className="text-xs text-gray-500 mb-1">District</p>
                      <p className="font-semibold text-gray-900">{district}</p>
                    </div>
                  </div>
                </div>

                {/* Login Instructions */}
                <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-6 border-2 border-amber-200 shadow-lg">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-amber-100 rounded-lg">
                      <Shield className="w-6 h-6 text-amber-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-amber-800">Login Instructions</h3>
                      <p className="text-sm text-amber-600">Multiple ways to access your account</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-white/70 rounded-xl border border-amber-100">
                      <div className="w-12 h-12 mx-auto bg-blue-100 rounded-full flex items-center justify-center mb-3">
                        <User className="w-6 h-6 text-blue-600" />
                      </div>
                      <h4 className="font-bold text-gray-900 mb-1">Username/Password</h4>
                      <p className="text-sm text-gray-600">Use: <span className="font-mono font-semibold">{generatedStudentId}</span></p>
                    </div>

                    <div className="text-center p-4 bg-white/70 rounded-xl border border-amber-100">
                      <div className="w-12 h-12 mx-auto bg-red-100 rounded-full flex items-center justify-center mb-3">
                        <QrCode className="w-6 h-6 text-red-600" />
                      </div>
                      <h4 className="font-bold text-gray-900 mb-1">QR Code Scan</h4>
                      <p className="text-sm text-gray-600">Scan the provided QR code</p>
                    </div>

                    <div className="text-center p-4 bg-white/70 rounded-xl border border-amber-100">
                      <div className="w-12 h-12 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-3">
                        <CreditCard className="w-6 h-6 text-green-600" />
                      </div>
                      <h4 className="font-bold text-gray-900 mb-1">Student ID</h4>
                      <p className="text-sm text-gray-600">Use: <span className="font-mono font-semibold">{generatedStudentId}</span></p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
                  <button
                    onClick={downloadQRCode}
                    className="flex-1 px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-bold hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                  >
                    <Save className="w-5 h-5" />
                    Download QR Code
                  </button>

                  <button
                    onClick={closeRegistrationPopup}
                    className="flex-1 px-6 py-4 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl font-bold hover:from-red-700 hover:to-red-800 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                  >
                    <Rocket className="w-5 h-5" />
                    Go to Dashboard
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