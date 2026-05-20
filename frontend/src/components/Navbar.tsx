import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, LogIn } from "lucide-react";

/**
 * Navbar component with a red glassmorphism effect.
 * Features: 
 * - Hide on scroll down, show on scroll up.
 * - Glassmorphism (blur + semi-transparent red).
 */
const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Scrolling downwards - hide
        setIsVisible(false);
      } else {
        // Scrolling upwards - show
        setIsVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 transform ${
        isVisible ? "translate-y-0" : "-translate-y-full"
      } bg-red-600/60 backdrop-blur-xl border-b border-white/20 px-6 py-3 shadow-2xl shadow-red-900/20`}
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center text-white">
        {/* Logo */}
        <div 
          className="flex items-center gap-3 cursor-pointer group"
          onClick={() => navigate("/home")}
        >
          <div className="bg-white/20 p-2 rounded-xl group-hover:bg-white/30 transition-colors">
            <img
              src="/icon.png"
              alt="Logo"
              className="w-8 h-8 rounded-lg object-cover"
            />
          </div>
          <span className="text-xl font-bold tracking-tight">Education</span>
        </div>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          {["Home", "Teachers", "Subjects", "About", "Contact"].map((item) => (
            <button
              key={item}
              onClick={() => navigate(`/${item.toLowerCase()}`)}
              className="hover:text-red-100 transition-colors relative group"
            >
              {item}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-white transition-all group-hover:w-full" />
            </button>
          ))}
        </nav>

        {/* Action Button */}
        <div className="flex items-center h-full">
          <button
            onClick={() => navigate("/login")}
            className="flex items-center gap-2 bg-white text-red-700 px-5 py-2.5 rounded-full font-bold text-sm shadow-lg hover:shadow-red-500/30 hover:scale-105 active:scale-95 transition-all"
          >
            <LogIn size={16} />
            <span>Get Started</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
