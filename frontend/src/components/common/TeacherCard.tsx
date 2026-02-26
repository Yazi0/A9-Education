import React from 'react';
import { Star, MessageSquare, BookOpen } from 'lucide-react';

interface Teacher {
  id: number;
  name: string;
  subject: string;
  about?: string;
  profile_image?: string;
  grades_detail?: { id: number; name: string }[];
}

interface TeacherCardProps {
  teacher: Teacher;
}

const TeacherCard: React.FC<TeacherCardProps> = ({ teacher }) => {
  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 group">
      <div className="flex items-start gap-4">
        {/* Profile Image */}
        <div className="relative shrink-0">
          <div className="w-20 h-20 rounded-2xl overflow-hidden bg-red-50 border-2 border-white shadow-md transform group-hover:rotate-3 transition-transform duration-300">
            {teacher.profile_image ? (
              <img 
                src={teacher.profile_image} 
                alt={teacher.name} 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-red-500 to-pink-600 text-white text-3xl font-black">
                {teacher.name.charAt(0)}
              </div>
            )}
          </div>
          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 border-2 border-white rounded-full flex items-center justify-center">
             <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
          </div>
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start">
            <h4 className="text-xl font-bold text-gray-900 group-hover:text-red-600 truncate transition-colors">
              {teacher.name}
            </h4>
          </div>
          <p className="text-sm font-semibold text-red-500 flex items-center gap-1.5 mt-0.5">
            <BookOpen size={14} />
            {teacher.subject}
          </p>
          
          <div className="flex items-center gap-2 mt-2">
            <div className="flex text-amber-500">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={12} fill={i < 4 ? "currentColor" : "none"} />
              ))}
            </div>
            <span className="text-xs font-bold text-gray-400">4.9 (120+ reviews)</span>
          </div>
        </div>
      </div>

      <p className="text-sm text-gray-600 mt-4 line-clamp-2 italic">
        "{teacher.about || `Dedicated educator specializing in ${teacher.subject}. Committed to helping students achieve their highest potential.`}"
      </p>

      {/* Grades Chips */}
      <div className="flex flex-wrap gap-1.5 mt-4">
        {teacher.grades_detail?.slice(0, 3).map(grade => (
          <span key={grade.id} className="px-2 py-0.5 bg-gray-50 border border-gray-100 text-gray-500 rounded-lg text-[10px] font-bold uppercase tracking-wider">
            {grade.name}
          </span>
        ))}
      </div>

      <div className="mt-6 flex gap-3">
        <button className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-bold shadow-sm shadow-red-200 transition-colors flex items-center justify-center gap-2">
          View Profile
        </button>
        <button className="p-2.5 bg-gray-50 hover:bg-gray-100 text-gray-400 hover:text-red-600 rounded-xl transition-all border border-gray-100">
          <MessageSquare size={20} />
        </button>
      </div>
    </div>
  );
};

export default TeacherCard;
