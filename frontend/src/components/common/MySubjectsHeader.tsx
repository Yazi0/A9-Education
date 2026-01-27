import React from 'react';
import { BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface MySubjectsHeaderProps {
  enrolledCount: number;
}

const MySubjectsHeader: React.FC<MySubjectsHeaderProps> = ({ enrolledCount }) => {
  const navigate = useNavigate();

  return (
    <div className="mb-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">My O/L & A/L Classes</h1>
          <p className="text-gray-600 mt-2">Track your progress in Ordinary and Advanced Level classes</p>
        </div>
        <button 
          onClick={() => navigate("/subjects")}
          className="mt-4 md:mt-0 px-6 py-3 bg-gradient-to-r from-red-700 to-red-800 hover:from-red-800 hover:to-red-900 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all flex items-center"
        >
          <BookOpen className="mr-2" size={20} />
          + Enroll New Class
        </button>
      </div>
    </div>
  );
};

export default MySubjectsHeader;