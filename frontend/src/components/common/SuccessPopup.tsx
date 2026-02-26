import React, { useEffect } from 'react';
import { CheckCircle, PartyPopper } from 'lucide-react';

interface SuccessPopupProps {
  isOpen: boolean;
  message: string;
  onClose: () => void;
}

const SuccessPopup: React.FC<SuccessPopupProps> = ({ isOpen, message, onClose }) => {
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        onClose();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl border border-gray-100 transform animate-in zoom-in-95 duration-300 text-center relative overflow-hidden">
        {/* Background Decorative Elements */}
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-green-50 rounded-full blur-3xl opacity-50"></div>
        <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-blue-50 rounded-full blur-3xl opacity-50"></div>

        <div className="relative z-10">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm border-4 border-white">
            <CheckCircle className="text-green-600" size={40} strokeWidth={2.5} />
          </div>

          <h3 className="text-2xl font-black text-gray-900 mb-2 flex items-center justify-center gap-2">
            Success! <PartyPopper className="text-amber-500" size={24} />
          </h3>
          
          <p className="text-gray-600 font-medium leading-relaxed mb-8 px-2">
            {message}
          </p>

          <button
            onClick={onClose}
            className="w-full py-4 bg-gradient-to-r from-gray-900 to-black hover:from-gray-800 hover:to-gray-900 text-white rounded-2xl font-black shadow-lg hover:shadow-xl transition-all transform active:scale-95"
          >
            Great, thanks!
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuccessPopup;
