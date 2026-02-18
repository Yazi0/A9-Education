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
    <div className="bg-gradient-to-br from-red-700 via-red-800 to-red-900 p-5 md:p-6 text-white">
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-3 mb-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center flex-wrap gap-2 mb-1.5">
            <h3 className="text-xl font-black truncate">{subject.name}</h3>
            <span className={`px-2 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-wider shadow-sm border border-white/20 ${getLevelBadgeColor(subject.level)}`}>
              {subject.level === "Advanced Level" ? "A/L" : "O/L"}
            </span>
          </div>
          <p className="text-red-100 text-sm font-bold opacity-90 italic">Teacher: {subject.teacher}</p>
        </div>
        <div className="md:text-right flex items-center md:block gap-2 border-t md:border-t-0 border-white/10 pt-2 md:pt-0">
          <p className="text-[10px] font-black text-red-200 uppercase tracking-widest leading-none mb-1">Stream</p>
          <p className="font-black text-sm uppercase">{subject.stream}</p>
        </div>
      </div>

      <div className="flex items-center justify-between mt-4 pt-4 border-t border-red-500/30">
        {subject.clsDate && (
          <div>
            <p className="text-[10px] font-black text-red-200 uppercase tracking-widest leading-none mb-1">Class Date</p>
            <p className="font-black text-xs md:text-sm">{subject.clsDate}</p>
          </div>
        )}
        <div className="text-right">
          <p className="text-[10px] font-black text-red-200 uppercase tracking-widest leading-none mb-1">Students</p>
          <div className="flex items-center justify-end">
            <Users size={12} className="mr-1 opacity-70" />
            <span className="font-black text-xs md:text-sm">{subject.studentCount}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubjectCardHeader;