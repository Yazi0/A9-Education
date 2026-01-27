import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../assets/image/Theme.png";

const Loading = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // ⏱️ 30 seconds loading
    const timer = setTimeout(() => {
      // redirect after loading
      navigate("/home"); // change if needed
    }, 50000); // 50,000 ms = 50 seconds

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center
      bg-gradient-to-br from-red-300 via-red-200 to-purple-100
      relative overflow-hidden"
    >
      {/* Background Glow */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-red-800 rounded-full blur-3xl opacity-30"></div>
      <div className="absolute top-1/2 -right-32 w-96 h-96 bg-red-500 rounded-full blur-3xl opacity-30"></div>

        {/* Logo */}
        <img
          src={Logo}
          alt="UD Learning Platform Logo"
          className="w-75 h-75 mx-auto mb-4 object-contain"
        />
        {/* Loading Text */}
        <p className="text-sm text-gray-500 mt-4">
          Loading... 
        </p>
        <p className="text-sm text-gray-500 mt-4">
          Please wait up to 50 seconds.
          </p>

        {/* Spinner */}
        <div className="border-4 border-red-500 border-t-transparent rounded-full w-12 h-12 mx-auto animate-spin"></div>
        
      </div>
  );
};

export default Loading;
