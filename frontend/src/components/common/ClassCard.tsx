import React from 'react';
import { Star, Users, Clock } from 'lucide-react';

import { useNavigate } from 'react-router-dom';
import type { Class } from '../models/Class';

interface ClassCardProps {
  cls: Class;
  onEnrollClick: (cls: Class) => void;
}

const ClassCard: React.FC<ClassCardProps> = ({ cls, onEnrollClick }) => {
  const navigate = useNavigate();

  const getLevelBadgeColor = (level: string) => {
    const isAL = level.includes("12") || level.includes("13") || level.includes("Advanced") || level.includes("A/L");
    return isAL
      ? "bg-purple-100 text-purple-700"
      : "bg-blue-100 text-blue-700";
  };

  const getLevelText = (level: string) => {
    if (level.includes("12") || level.includes("13") || level.includes("Advanced") || level.includes("A/L")) {
      return "A/L";
    }
    return "O/L";
  };

  const getStreamColor = (stream: string) => {
    const colors: Record<string, string> = {
      "Science": "from-red-500 to-red-600",
      "Arts": "from-red-500 to-red-600",
      "Commerce": "from-red-500 to-red-600",
      "Technology": "from-red-500 to-red-600"
    };
    return colors[stream] || "from-red-500 to-red-600";
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all group">
      {/* Stream Badge */}
      <div className={`h-2 bg-gradient-to-r ${getStreamColor(cls.stream)}`}></div>

      <div className="p-6">
        {/* Class Header */}
        <div className="mb-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-xl font-bold text-gray-900 group-hover:text-red-600">{cls.name}</h3>
            <span className={`px-2 py-1 rounded-lg text-xs font-medium ${getLevelBadgeColor(cls.level)}`}>
              {getLevelText(cls.level)}
            </span>
          </div>
          <p className="text-sm text-gray-500">{cls.stream} Stream</p>
        </div>

        {/* Teacher Info */}
        <div className="flex items-center mb-4">
          <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center text-white font-bold mr-3">
            {cls.teacher.charAt(0)}
          </div>
          <div>
            <p className="font-medium">{cls.teacher}</p>
            <div className="flex items-center">
              <Star className="text-amber-500" size={14} />
              <span className="ml-1 text-sm font-medium">{cls.rating}</span>
            </div>
          </div>
        </div>

        {/* Description */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{cls.description}</p>

        {/* Topics */}
        <div className="mb-4">
          <p className="text-xs text-gray-500 mb-2">Topics Covered:</p>
          <div className="flex flex-wrap gap-1">
            {cls.topics.slice(0, 3).map((topic, index) => (
              <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                {topic}
              </span>
            ))}
            {cls.topics.length > 3 && (
              <span className="px-2 py-1 bg-gray-100 text-gray-500 rounded text-xs">
                +{cls.topics.length - 3} more
              </span>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="text-center">
            <div className="flex items-center justify-center text-gray-400 mb-1">
              <Users size={16} />
            </div>
            <p className="text-sm font-semibold">{cls.enrolled} students</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center text-gray-400 mb-1">
              <Clock size={16} />
            </div>
            <p className="text-sm font-semibold">{cls.duration}</p>
          </div>
        </div>

        {/* Exam Date */}
        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Exam Date:</span>
            <span className="font-semibold">{cls.examDate}</span>
          </div>
          <div className="flex items-center justify-between mt-1">
            <span className="text-sm text-gray-600">Class Type:</span>
            <span className="text-sm font-medium text-red-600">{cls.classType}</span>
          </div>
        </div>

        {/* Price & Action */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Monthly Fee</p>
            <p className="text-2xl font-bold text-gray-900">Rs. {cls.price}</p>
          </div>
          {cls.paid ? (
            <button
              onClick={() => navigate(`/student/class/${cls.id}`)}
              className="px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-lg font-semibold text-sm"
            >
              Access Class
            </button>
          ) : (
            <button
              onClick={() => onEnrollClick(cls)}
              className="px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-lg font-semibold text-sm"
            >
              Enroll Now
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClassCard;