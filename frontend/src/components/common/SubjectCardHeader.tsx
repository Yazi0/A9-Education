import React from 'react';
import { Users } from 'lucide-react';
import type { Subject } from '../models/Subject';


interface SubjectCardHeaderProps {
  subject: Subject;
}

const SubjectCardHeader: React.FC<SubjectCardHeaderProps> = ({ subject }) => {
  const getLevelBadgeColor = (level: string) => {
    return level === "Advanced Level" 
      ? "bg-gradient-to-r from-red-700 to-red-800 text-white" 
      : "bg-gradient-to-r from-red-600 to-red-700 text-white";
  };

  return (
    <div className="bg-gradient-to-r from-red-700 to-red-800 p-6 text-white">
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center flex-wrap gap-2 mb-2">
            <h3 className="text-xl font-bold">{subject.name}</h3>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getLevelBadgeColor(subject.level)}`}>
              {subject.level === "Advanced Level" ? "A/L" : "O/L"}
            </span>
          </div>
          <p className="text-red-100">Teacher: {subject.teacher}</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-red-200">Stream</p>
          <p className="font-semibold">{subject.stream}</p>
        </div>
      </div>
      
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-red-600/30">
        {subject.clsDate && (
          <div>
            <p className="text-sm text-red-200">Class Date</p>
            <p className="font-semibold">{subject.clsDate}</p>
          </div>
        )}
        <div className="text-right">
          <p className="text-sm text-red-200">Students</p>
          <div className="flex items-center">
            <Users size={14} className="mr-1" />
            <span className="font-semibold">{subject.studentCount}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubjectCardHeader;