import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Home as HomeIcon, LogIn } from "lucide-react";

const Navbar: React.FC = () => {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 bg-red-700 backdrop-blur border-b px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">

          {/* Logo */}
          <div className="flex items-center gap-3 cursor-pointer">
            <img
              src="/icon.png"
              alt="EduSphere Logo"
              className="w-10 h-10 rounded-xl object-cover"
            />
            <span className="text-2xl font-bold text-black">Education</span>
          </div>

          <div className="flex gap-4">
            <button onClick={() => navigate("/home")} className="hidden md:flex items-center gap-2 text-white">
              <HomeIcon size={16} /> Home
            </button>

            <button
              onClick={() => navigate("/teachers")}
              className="hidden md:flex items-center gap-2 text-white"
            >
              Teachers   
            </button>

            <button
              onClick={() => navigate("/subject")}
              className="hidden md:flex items-center gap-2 text-white"
            >
              Subjects   
            </button>

            <button
              onClick={() => navigate("/about")}
              className="hidden md:flex items-center gap-2 text-white"
            >
              About   
            </button>

            <button
              onClick={() => navigate("/contact")}
              className="hidden md:flex items-center gap-2 text-white"
            >
              Contact   
            </button>

            <button
              onClick={() => navigate("/login")}
              className="flex items-center gap-2 bg-gradient-to-r from-red-600 to-pink-600 text-white px-6 py-2 rounded-xl"
            >
              <LogIn size={16} />
              Get Started
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </header>
  );
};

export default Navbar;
