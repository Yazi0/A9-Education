import React from 'react';
import { ArrowLeft, BookOpen } from 'lucide-react';

interface ClassesHeaderProps {
  onBackToDashboard: () => void;
  onViewMyClasses: () => void;
  enrolledCount: number;
}

const ClassesHeader: React.FC<ClassesHeaderProps> = ({
  onBackToDashboard,
  onViewMyClasses,
  enrolledCount,
}) => {
  return (
    <div className="mb-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between">
        <div className="flex items-center mb-4 md:mb-0">
          <button
            onClick={onBackToDashboard}
            className="flex items-center px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-lg font-semibold mr-4 shadow-md hover:shadow-lg transition-all"
          >
            <ArrowLeft className="mr-2" size={18} />
            Back to Dashboard
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">O/L & A/L Classes</h1>
            <p className="text-gray-600 mt-2">Prepare for Ordinary and Advanced Level exams with expert teachers</p>
          </div>
        </div>
        <button
          onClick={onViewMyClasses}
          className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all flex items-center"
        >
          <BookOpen className="mr-2" size={20} />
          View My Classes ({enrolledCount})
        </button>
      </div>
    </div>
  );
};

export default ClassesHeader;