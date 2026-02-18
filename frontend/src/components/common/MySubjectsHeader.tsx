import React from 'react';
import { BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface MySubjectsHeaderProps {
  enrolledCount: number;
}

const MySubjectsHeader: React.FC<MySubjectsHeaderProps> = ({ enrolledCount }) => {
  const navigate = useNavigate();

  return (
    <div className="mb-6 md:mb-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="text-center md:text-left">
          <h1 className="text-2xl md:text-4xl font-black text-gray-900 tracking-tight leading-tight">My Classes ({enrolledCount})</h1>
          <p className="text-gray-500 text-sm md:text-base font-medium mt-1">Track your progress in Ordinary and Advanced Level classes</p>
        </div>
        <button
          onClick={() => navigate("/subjects")}
          className="w-full md:w-auto px-6 py-3.5 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-2xl font-bold shadow-lg shadow-red-200 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center"
        >
          <BookOpen className="mr-2" size={20} />
          + Enroll New Class
        </button>
      </div>
    </div>
  );
};

export default MySubjectsHeader;