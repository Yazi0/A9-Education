import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { QrCode, Eye, EyeOff, Camera, X, Key, User } from "lucide-react";
import Img from "../../assets/image/bg.png";
import ThemeImg from "../../assets/image/Theme.png";
import Register from "./Register";
import api from "../../api/axios";

const Login = () => {
  const navigate = useNavigate();

  const qrRef = useRef<Html5Qrcode | null>(null);
  const [studentId, setStudentId] = useState("");
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
    setError("");
    setLoading(true);

    try {
      const response = await api.post("auth/login/", {
        username: studentId,
        password,
      });

      localStorage.setItem("access", response.data.access);
      localStorage.setItem("refresh", response.data.refresh);

      const userRes = await api.get("users/me/");
      const user = userRes.data;

      localStorage.setItem("currentUser", JSON.stringify(user));
      localStorage.setItem("userRole", user.role);

      if (user.role === "student") {
        navigate("/studentdashboard");
      } else {
        navigate("/teacherdashboard");
      }
    } catch (error: any) {
      console.error("Login error:", error);
      setError("Incorrect Student ID/Username or password");
    } finally {
      setLoading(false);
    }
  };

  /* ================= SCANNER LOGIC ================= */
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
        { fps: 10, qrbox: { width: 250, height: 250 } },
        async (decodedText: string) => {
          await stopScanner();
          setQrResult(decodedText);
          setTimeout(() => processQRResult(decodedText), 300);
        },
        (errorMessage: string) => {
          if (!errorMessage.includes("NotFoundException")) console.log("QR scan error:", errorMessage);
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

  const processQRResult = async (decodedText: string) => {
    setError("");
    setLoading(true);
    const scannedId = decodedText.trim();
    try {
      const response = await api.post("users/qr-login/", { student_id: scannedId });
      localStorage.setItem("access", response.data.access);
      localStorage.setItem("refresh", response.data.refresh);
      const user = response.data.user;
      localStorage.setItem("currentUser", JSON.stringify(user));
      localStorage.setItem("userRole", user.role);
      navigate("/studentdashboard");
    } catch (error: any) {
      setError(error.response?.data?.error || "Invalid QR Code or User not found");
      setShowAlternativeOptions(true);
      setQrResult(null);
    } finally {
      setLoading(false);
    }
  };

  const handleQRScanToggle = async () => {
    if (showQR) {
      await stopScanner();
      setShowQR(false);
      setQrResult(null);
      setError("");
      setShowAlternativeOptions(false);
    } else {
      setShowQR(true);
      setError("");
      setStudentId("");
      setPassword("");
      setShowAlternativeOptions(false);
    }
  };

  useEffect(() => {
    if (showQR) {
      const timer = setTimeout(() => initializeScanner(), 300);
      return () => clearTimeout(timer);
    } else {
      stopScanner();
    }
    return () => { stopScanner(); };
  }, [showQR]);

  const switchToPasswordLogin = () => {
    setShowQR(false);
    setShowAlternativeOptions(false);
    setError("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !showQR) handleLogin(e as any);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-red-100 p-4 md:p-6">
      <div className="w-full max-w-[450px] md:max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row h-auto md:h-[600px] max-h-[95vh] md:max-h-[98vh] transition-all">
        {/* DESKTOP LEFT BANNER - Restored Classic Style */}
        <div className="hidden md:flex w-1/2 items-center justify-center bg-gradient-to-br from-red-600 to-red-700 p-8 overflow-hidden relative">
          <div className="absolute top-0 left-0 w-32 h-32 bg-white/10 rounded-full -translate-x-16 -translate-y-16"></div>
          <div className="absolute bottom-0 right-0 w-40 h-40 bg-white/5 rounded-full translate-x-20 translate-y-20"></div>

          <div className="text-center relative z-10">
            <img src={Img} alt="Education" className="max-w-[85%] mx-auto mb-6 drop-shadow-2xl animate-float" />
            <h2 className="text-3xl font-bold text-white mb-3">Welcome Back!</h2>
            <p className="text-red-100 text-lg">Access your educational resources with ease</p>
          </div>
        </div>

        {/* MOBILE TOP BANNER - Only for small screens */}
        <div className="flex md:hidden w-full items-center justify-center bg-gradient-to-br from-red-600 to-red-700 p-4 shrink-0">
          <div className="text-center flex flex-row items-center justify-center gap-4">
            <img src={Img} alt="Education" className="w-14 h-14 object-contain drop-shadow-xl animate-float" />
            <h2 className="text-xl font-bold text-white">Welcome Back!</h2>
          </div>
        </div>

        {/* RIGHT - LOGIN FORM */}
        <div className="p-6 md:p-10 flex flex-col justify-center flex-1 overflow-y-auto no-scrollbar">
          <div className="flex justify-center mb-4">
            <img src={ThemeImg} className="h-12 object-contain" alt="Logo" />
          </div>

          <h1 className="text-xl font-bold text-center text-gray-800 leading-tight mb-1">
            {showQR ? "QR Login" : "Sign In"}
          </h1>

          <p className="text-center text-xs text-gray-500 mb-6">
            {showQR ? "Scan student ID code" : "Enter credentials to continue"}
          </p>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 rounded transition-all animate-shake">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <span className="text-sm font-medium">{error}</span>
              </div>
              {showAlternativeOptions && (
                <div className="mt-3 pt-3 border-t border-red-200 flex flex-col gap-2">
                  <button onClick={switchToPasswordLogin} className="text-xs bg-red-100 text-red-700 py-1.5 px-3 rounded-lg font-bold">Login with Password</button>
                  <button onClick={initializeScanner} className="text-xs bg-red-100 text-red-700 py-1.5 px-3 rounded-lg font-bold">Try Scanning Again</button>
                </div>
              )}
            </div>
          )}

          {!showQR ? (
            <form onSubmit={handleLogin} className="space-y-4" onKeyPress={handleKeyPress}>
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1 uppercase tracking-wide">Student ID / Username</label>
                <div className="relative">
                  <input className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 text-sm bg-gray-50/50" placeholder="Enter ID or Username" value={studentId} onChange={(e) => setStudentId(e.target.value)} required />
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1 uppercase tracking-wide">Password</label>
                <div className="relative">
                  <input type={showPassword ? "text" : "password"} className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 pr-10 text-sm bg-gray-50/50" placeholder="Enter password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                  <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 focus:outline-none">{showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}</button>
                </div>
              </div>

              <button type="submit" disabled={loading || !studentId || !password} className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white py-3.5 rounded-xl font-bold text-sm hover:from-red-700 shadow-md transform active:scale-[0.98] transition-all">
                {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto"></div> : "Sign In"}
              </button>

              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-100"></div></div>
                <div className="relative flex justify-center text-[9px] uppercase tracking-widest font-black"><span className="px-2 bg-white text-gray-300">Fast Options</span></div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button type="button" onClick={handleQRScanToggle} className="border-2 border-red-50 text-red-600 py-2.5 rounded-xl font-bold text-xs hover:bg-red-50 transition-all flex items-center justify-center gap-1.5"><QrCode className="w-4 h-4" />QR Login</button>
                <button type="button" onClick={() => setIsRegisterOpen(true)} className="py-2.5 bg-blue-50 text-blue-600 rounded-xl font-bold text-xs hover:bg-blue-100 transition-all border border-blue-200 shadow-sm">New Account</button>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              <div id="qr-reader" className="w-full border-2 border-dashed border-gray-300 rounded-xl overflow-hidden min-h-[300px]" />
              <div className="flex gap-3">
                <button type="button" onClick={handleQRScanToggle} className="flex-1 border border-gray-300 py-3 rounded-xl font-bold text-xs hover:bg-gray-50 flex items-center justify-center gap-2"><X className="w-4 h-4" />Cancel</button>
                <button type="button" onClick={() => { stopScanner(); setTimeout(() => initializeScanner(), 300); }} className="flex-1 bg-blue-50 text-blue-600 border border-blue-200 py-3 rounded-xl font-bold text-xs hover:bg-blue-100 flex items-center justify-center gap-2" disabled={!isCameraOn}><Camera className="w-4 h-4" />Retry</button>
              </div>
            </div>
          )}
        </div>
      </div>

      {isRegisterOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl overflow-hidden">
            <Register onClose={() => setIsRegisterOpen(false)} />
          </div>
        </div>
      )}

      <style>{`
        @keyframes scan { 0% { transform: translateY(0); opacity: 0.5; } 50% { opacity: 1; } 100% { transform: translateY(256px); opacity: 0.5; } }
        .animate-scan { animation: scan 1.5s ease-in-out infinite; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
        .animate-float { animation: float 3s ease-in-out infinite; }
        @keyframes shake { 0%, 100% { transform: translateX(0); } 10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); } 20%, 40%, 60%, 80% { transform: translateX(5px); } }
        .animate-shake { animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both; }
      `}</style>
    </div>
  );
};

export default Login;