import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { QrCode, Eye, EyeOff, Camera, X, Key, User } from "lucide-react";
import Img from "../../assets/image/bg.png";
import ThemeImg from "../../assets/image/Theme.png";
import Register from "./Register";
import api from "../../api/axios";

// API service (assuming you have an api.ts file)
; // Adjust this import based on your project structure

interface RegisteredUser {
  username: string;
  password: string;
  role: "student" | "teacher";
  name: string;
  studentId?: string;
}

const Login = () => {
  const navigate = useNavigate();

  const qrRef = useRef<Html5Qrcode | null>(null);
  const [studentId, setStudentId] = useState(""); // Changed from username
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [qrResult, setQrResult] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [qrErrorCount, setQrErrorCount] = useState(0);
  const [showAlternativeOptions, setShowAlternativeOptions] = useState(false);

  /* ================= API LOGIN FUNCTION ================= */
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    // For QR mode, use normal login flow
    if (showQR) {
      loginUser();
      return;
    }

    setError("");
    setLoading(true);

    try {
      // Use studentId as username for API call
      const response = await api.post("auth/login/", {
        username: studentId,
        password,
      });

      // Store tokens
      localStorage.setItem("access", response.data.access);
      localStorage.setItem("refresh", response.data.refresh);

      // Fetch user details from the /me/ endpoint
      try {
        const userRes = await api.get("users/me/");
        const user = userRes.data;

        localStorage.setItem("currentUser", JSON.stringify(user));
        localStorage.setItem("userRole", user.role);

        // Redirect based on role
        if (user.role === "student") {
          navigate("/studentdashboard");
        } else {
          navigate("/teacherdashboard");
        }
      } catch (meError) {
        console.error("Error fetching user profile:", meError);
        setError("Failed to fetch user profile. Please try again.");
      }

    } catch (error: any) {
      console.error("Login error:", error);
      setError("Incorrect Student ID/Username or password");
      setLoading(false);
    }
  };

  /* ================= NORMAL LOGIN (STUDENT ID & PASSWORD) ================= */
  const loginUser = () => {
    setError("");
    setLoading(true);

    setTimeout(() => {
      const users: RegisteredUser[] = JSON.parse(
        localStorage.getItem("registeredUsers") || "[]"
      );

      // Student login requires studentId and password
      const student = users.find(
        (u) => u.role === "student" &&
          u.studentId?.toUpperCase() === studentId.toUpperCase() &&
          u.password === password
      );

      // Teacher login still uses username
      const teacher = users.find(
        (u) => u.role === "teacher" &&
          u.username === studentId && // Using studentId field for teacher username
          u.password === password
      );

      const user = student || teacher;

      if (!user) {
        setError("Incorrect Student ID/Username or password");
        setLoading(false);
        return;
      }

      localStorage.setItem("currentUser", JSON.stringify(user));
      localStorage.setItem("userRole", user.role);

      navigate(
        user.role === "student"
          ? "/studentdashboard"
          : "/teacherdashboard"
      );
      setLoading(false);
    }, 500);
  };

  /* ================= INITIALIZE QR SCANNER ================= */
  const initializeScanner = async () => {
    try {
      if (!showQR) return;

      const qr = new Html5Qrcode("qr-reader");
      qrRef.current = qr;
      setIsScanning(true);
      setIsCameraOn(true);
      setError("");
      setShowAlternativeOptions(false);

      await qr.start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: {
            width: 250,
            height: 250
          }
        },
        async (decodedText: string) => {
          // Stop scanning immediately
          await stopScanner();
          setQrResult(decodedText);

          // Process QR result
          setTimeout(() => {
            processQRResult(decodedText);
          }, 300);
        },
        (errorMessage: string) => {
          // Error callback - ignore common errors
          if (!errorMessage.includes("NotFoundException")) {
            console.log("QR scan error:", errorMessage);
          }
        }
      );
    } catch (err: any) {
      console.error("Scanner error:", err);
      if (err?.name !== 'NotAllowedError') {
        setError("Camera permission denied or unavailable");
        setShowAlternativeOptions(true);
      }
      setIsScanning(false);
      setIsCameraOn(false);
    }
  };

  /* ================= STOP SCANNER SAFELY ================= */
  const stopScanner = async () => {
    try {
      if (qrRef.current && isCameraOn) {
        await qrRef.current.stop();
        qrRef.current = null;
        setIsCameraOn(false);
        setIsScanning(false);
      }
    } catch (err) {
      console.log("Scanner already stopped");
    }
  };

  /* ================= PROCESS QR RESULT ================= */
  const processQRResult = (decodedText: string) => {
    setError("");

    const users: RegisteredUser[] = JSON.parse(
      localStorage.getItem("registeredUsers") || "[]"
    );

    const scannedId = decodedText.trim().toUpperCase();
    console.log("Scanned Student ID:", scannedId);

    const student = users.find(
      (u) =>
        u.role === "student" &&
        u.studentId?.toUpperCase() === scannedId
    );

    if (!student) {
      const newErrorCount = qrErrorCount + 1;
      setQrErrorCount(newErrorCount);

      if (newErrorCount >= 3) {
        setError("Invalid QR Code. Please use Student ID & Password login instead.");
        setShowAlternativeOptions(true);
      } else {
        setError(`Invalid QR Code (Attempt ${newErrorCount}/3). Please scan a valid student ID QR code.`);

        // Restart scanner after error (with delay)
        setTimeout(() => {
          if (showQR && !isCameraOn) {
            initializeScanner();
          }
        }, 1000);
      }
      setQrResult(null);
      return;
    }

    // Reset error count on success
    setQrErrorCount(0);

    // Successful QR login
    localStorage.setItem("currentUser", JSON.stringify(student));
    localStorage.setItem("userRole", "student");

    // Navigate to student dashboard
    navigate("/studentdashboard");
  };

  /* ================= HANDLE QR SCAN TOGGLE ================= */
  const handleQRScanToggle = async () => {
    if (showQR) {
      // Stop scanner if it's active
      await stopScanner();
      setShowQR(false);
      setQrResult(null);
      setError("");
      setShowAlternativeOptions(false);
      setQrErrorCount(0);
    } else {
      setShowQR(true);
      setError("");
      setStudentId("");
      setPassword("");
      setQrErrorCount(0);
      setShowAlternativeOptions(false);
    }
  };

  /* ================= USE EFFECT FOR QR SCANNER ================= */
  useEffect(() => {
    if (showQR) {
      const timer = setTimeout(() => {
        initializeScanner();
      }, 300);
      return () => clearTimeout(timer);
    } else {
      stopScanner();
    }

    // Cleanup on unmount
    return () => {
      stopScanner();
    };
  }, [showQR]);

  /* ================= SWITCH TO PASSWORD LOGIN ================= */
  const switchToPasswordLogin = () => {
    setShowQR(false);
    setShowAlternativeOptions(false);
    setError("");
    setQrErrorCount(0);
  };

  /* ================= HANDLE KEY PRESS ================= */
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !showQR) {
      handleLogin(e as any);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-red-100 p-4">
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2">
        {/* LEFT - IMAGE */}
        <div className="hidden md:flex items-center justify-center bg-gradient-to-br from-red-600 to-red-700 p-8">
          <div className="text-center">
            <img src={Img} alt="Education" className="max-w-[80%] mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-white mb-3">Welcome Back!</h2>
            <p className="text-red-100">Access your educational resources with ease</p>
          </div>
        </div>

        {/* RIGHT - LOGIN FORM */}
        <div className="p-6 md:p-10 flex flex-col justify-center">
          <div className="flex justify-center mb-6">
            <img src={ThemeImg} className="w-48" alt="Logo" />
          </div>

          <h1 className="text-2xl font-bold text-center text-gray-800 mb-2">
            {showQR ? "Scan Student ID QR Code" : "Sign In"}
          </h1>

          <p className="text-center text-gray-600 mb-6">
            {showQR
              ? "Scan your student ID QR code to login automatically"
              : "Enter your credentials to continue"}
          </p>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 rounded">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <span className="text-sm font-medium">{error}</span>
              </div>

              {showAlternativeOptions && (
                <div className="mt-3 pt-3 border-t border-red-200">
                  <p className="text-sm text-red-600 mb-2">Try one of these options:</p>
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={switchToPasswordLogin}
                      className="text-sm bg-red-100 hover:bg-red-200 text-red-700 py-2 px-3 rounded-lg font-medium transition-colors"
                    >
                      Login with Student ID & Password
                    </button>
                    <button
                      onClick={initializeScanner}
                      className="text-sm bg-red-100 hover:bg-red-200 text-red-700 py-2 px-3 rounded-lg font-medium transition-colors"
                    >
                      Try Scanning Again
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {!showQR ? (
            /* NORMAL LOGIN FORM */
            <form onSubmit={handleLogin} className="space-y-4" onKeyPress={handleKeyPress}>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Student ID / Username
                </label>
                <div className="relative">
                  <input
                    className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="Enter Student ID or Username"
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                    required
                  />
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Students: Use your Student ID | Teachers: Use your Username
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent pr-10"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || !studentId || !password}
                className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white py-3.5 rounded-xl font-semibold hover:from-red-700 hover:to-red-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Signing in...
                  </span>
                ) : (
                  "Sign In"
                )}
              </button>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Or continue with</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleQRScanToggle}
                className="w-full border-2 border-red-600 text-red-600 py-3.5 rounded-xl font-semibold hover:bg-red-50 transition-all flex items-center justify-center gap-2"
              >
                <QrCode className="w-5 h-5" />
                Login with QR Code (Students Only)
              </button>
            </form>
          ) : (
            /* QR SCANNER VIEW */
            <div className="space-y-4">
              <div className="text-center mb-4">
                <div className="inline-flex items-center justify-center p-3 bg-red-100 rounded-full mb-3">
                  <Camera className="w-8 h-8 text-red-600" />
                </div>
                <p className="text-gray-600 text-sm">
                  Point your camera at your student ID QR code
                </p>
                {qrErrorCount > 0 && (
                  <p className="text-red-500 text-xs mt-1">
                    Invalid attempts: {qrErrorCount}/3
                  </p>
                )}
              </div>

              <div className="relative">
                <div
                  id="qr-reader"
                  className="w-full border-2 border-dashed border-gray-300 rounded-xl overflow-hidden"
                  style={{ minHeight: "300px" }}
                />

                {/* Scanner overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative">
                    {/* Scanner frame */}
                    <div className="w-64 h-64 border-2 border-red-500 rounded-lg relative">
                      {/* Corner decorations */}
                      <div className="absolute -top-1 -left-1 w-6 h-6 border-t-2 border-l-2 border-red-500 rounded-tl"></div>
                      <div className="absolute -top-1 -right-1 w-6 h-6 border-t-2 border-r-2 border-red-500 rounded-tr"></div>
                      <div className="absolute -bottom-1 -left-1 w-6 h-6 border-b-2 border-l-2 border-red-500 rounded-bl"></div>
                      <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-2 border-r-2 border-red-500 rounded-br"></div>

                      {/* Scanning animation */}
                      {isScanning && (
                        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-red-500 to-transparent animate-scan"></div>
                      )}
                    </div>

                    {/* Scanner status */}
                    <div className="mt-4 text-center">
                      <p className="text-sm text-gray-600">
                        {isScanning ? "Scanning..." : "Ready to scan"}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Position QR code inside the frame
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {qrResult && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm text-green-700 font-medium">QR Code Detected!</p>
                  <p className="text-xs text-green-600 mt-1 truncate">Student ID: {qrResult}</p>
                  <p className="text-xs text-green-600 mt-1">Processing login...</p>
                </div>
              )}

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handleQRScanToggle}
                  className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                >
                  <X className="w-4 h-4" />
                  Cancel Scan
                </button>

                <button
                  type="button"
                  onClick={() => {
                    stopScanner();
                    setTimeout(() => initializeScanner(), 300);
                  }}
                  className="flex-1 border border-blue-300 text-blue-700 py-3 rounded-xl font-medium hover:bg-blue-50 transition-colors flex items-center justify-center gap-2"
                  disabled={!isCameraOn}
                >
                  <Camera className="w-4 h-4" />
                  Retry Scan
                </button>
              </div>

              <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-center text-sm font-medium text-gray-700 mb-2">
                  Having trouble scanning?
                </p>
                <button
                  type="button"
                  onClick={switchToPasswordLogin}
                  className="w-full border-2 border-red-600 text-red-600 py-2.5 rounded-lg font-medium hover:bg-red-50 transition-all"
                >
                  Switch to Student ID & Password Login
                </button>
              </div>
            </div>
          )}

          <div className="mt-8 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={() => setIsRegisterOpen(true)}
              className="w-full border-2 border-red-600 text-red-600 py-3.5 rounded-xl font-semibold hover:bg-red-50 transition-all"
            >
              Create New Account
            </button>

            <p className="text-center text-sm text-gray-500 mt-4">
              {showQR
                ? "Don't have a QR code? Register as a new student to get one."
                : "Students will receive a QR code after registration."}
            </p>
          </div>
        </div>
      </div>

      {/* REGISTER MODAL */}
      {isRegisterOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsRegisterOpen(false)}
              className="absolute top-4 right-4 z-50 p-2 bg-gray-100/50 hover:bg-gray-200 backdrop-blur-sm rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
            <Register onClose={() => setIsRegisterOpen(false)} />
          </div>
        </div>
      )}

      {/* Add CSS for scanning animation */}
      <style>{`
        @keyframes scan {
          0% { transform: translateY(0); opacity: 0.5; }
          50% { opacity: 1; }
          100% { transform: translateY(256px); opacity: 0.5; }
        }
        .animate-scan {
          animation: scan 1.5s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default Login;