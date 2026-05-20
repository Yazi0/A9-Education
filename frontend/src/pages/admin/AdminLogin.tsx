import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShieldCheck, Lock, User, ArrowRight, Loader2 } from "lucide-react";
import axiosInstance from "../../api/axios";

const AdminLogin: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await axiosInstance.post('/auth/login/', {
        username,
        password
      });

      // Verify if the user is an admin or staff member by fetching their profile
      localStorage.setItem('access', response.data.access);
      localStorage.setItem('refresh', response.data.refresh);
      
      const userProfile = await axiosInstance.get('/users/me/', {
        headers: {
          Authorization: `Bearer ${response.data.access}`
        }
      });
      
      // is_staff or is_superuser comes from the model but it's not and Django's User handles it.
      // In custom model, AbstractUser has is_staff.
      if (userProfile.data.is_staff || userProfile.data.is_superuser) {
        navigate('/A9-admin/dashboard');
      } else {
        localStorage.removeItem('access');
        localStorage.removeItem('refresh');
        setError("Only administrators can access this area.");
      }
    } catch (err: any) {
      console.error(err);
      setError("Invalid username or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-900 to-black flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden relative group">
        <div className="absolute inset-0 bg-red-600 opacity-0 group-hover:opacity-5 transition-opacity" />
        
        <div className="bg-red-700 p-10 text-center text-white relative">
          <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl ring-2 ring-white/10">
            <ShieldCheck size={48} />
          </div>
          <h1 className="text-3xl font-black tracking-tight mb-2">A9 Control Panel</h1>
          <p className="text-red-200">Management & Administration</p>
        </div>

        <form onSubmit={handleLogin} className="p-10 space-y-6">
          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-bold border border-red-100 animate-pulse">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div className="relative group">
              <User className="absolute left-4 top-4 text-gray-400 group-focus-within:text-red-600 transition-colors" size={20} />
              <input
                type="text"
                placeholder="Admin Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-12 pr-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-red-500 focus:bg-white transition-all font-medium text-gray-800"
                required
              />
            </div>
            <div className="relative group">
              <Lock className="absolute left-4 top-4 text-gray-400 group-focus-within:text-red-600 transition-colors" size={20} />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-red-500 focus:bg-white transition-all font-medium text-gray-800"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-red-700 text-white rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-red-800 transition-all shadow-lg hover:shadow-red-900/40 transform hover:-translate-y-1 active:translate-y-0 disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={24} />
            ) : (
              <>
                Login to Dashboard <ArrowRight size={20} />
              </>
            )}
          </button>
        </form>

        <div className="p-6 bg-gray-50 border-t flex items-center justify-center text-xs text-gray-400 font-bold uppercase tracking-widest">
          A9-Education Integrated Management System
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
