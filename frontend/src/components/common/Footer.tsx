import React from 'react';
import { Home, MessageSquare } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="mt-auto pt-8">
      <div className="max-w-7xl mx-auto pt-6 border-t border-gray-200">
        <div className="bg-red-200 rounded-2xl p-6 shadow-lg">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-center md:text-left mb-4 md:mb-0">
              <div className="flex items-center justify-center md:justify-start mb-2">
                <div className="w-10 h-10 bg-gradient-to-r from-red-600 to-red-700 rounded-full flex items-center justify-center mr-3 shadow-lg">
                  <Home className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">A9 Education Center</h2>
              </div>
              <p className="text-gray-700">Empowering students through quality education</p>
            </div>
            
            <div className="text-center md:text-right">
              <p className="text-sm text-gray-700 mb-1">© {new Date().getFullYear()} A9 Education Center</p>
              <p className="text-xs text-gray-600">All rights reserved</p>
              <div className="flex justify-center md:justify-end gap-4 mt-3">
                <button className="flex items-center text-gray-600 hover:text-red-700 text-sm transition-colors">
                  <MessageSquare className="w-4 h-4 mr-1" />
                  Support
                </button>
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
  );
};

export default Footer;