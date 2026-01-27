import React from 'react';
import SubjectCardHeader from './SubjectCardHeader';
import VideoLinksSection from './VideoLinksSection';
import StudyMaterialsSection from './StudyMaterialsSection';
import ProgressStats from './ProgressStats';
import SubjectActionButtons from './SubjectActionButtons';
import type { Subject } from '../models/Subject';

interface EnrolledSubjectCardProps {
  subject: Subject;
}

const EnrolledSubjectCard: React.FC<EnrolledSubjectCardProps> = ({ subject }) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all border border-gray-200">
      {/* Header */}
      <SubjectCardHeader subject={subject} />

      {/* Content */}
      <div className="p-6">
        {/* Video Links */}
        <VideoLinksSection 
          videos={subject.teacherUploads.videoLinks}
          classId={subject.id}
        />

        {/* Notes & Past Papers */}
        <StudyMaterialsSection 
          materials={subject.teacherUploads.notes}
          classId={subject.id}
        />

        {/* Progress & Last Accessed */}
        <ProgressStats 
          progress={subject.progress}
          lastAccessed={subject.lastAccessed}
          lastVideoWatched={subject.lastVideoWatched ? {
            progress: subject.lastVideoWatched.progress,
            title: subject.lastVideoWatched.title
          } : undefined}
        />

        {/* Action Buttons */}
        <SubjectActionButtons 
          classId={subject.id}
          lastVideoWatched={subject.lastVideoWatched}
        />
      </div>
    </div>
  );
};

export default EnrolledSubjectCard;