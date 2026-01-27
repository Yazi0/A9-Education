import React from 'react';
import { Video, FileText, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface SubjectActionButtonsProps {
  classId: number;
  lastVideoWatched?: {
    id: number;
    title: string;
    url: string;
    duration: string;
    progress: number;
    timestamp: string;
  };
}

const SubjectActionButtons: React.FC<SubjectActionButtonsProps> = ({
  classId,
  lastVideoWatched
}) => {
  const navigate = useNavigate();

  const handleContinueLearning = () => {
    if (lastVideoWatched) {
      navigate(`/student/classvideos/${classId}?video=${lastVideoWatched.id}&timestamp=${lastVideoWatched.timestamp}`);
    } else {
      navigate(`/student/classvideos/${classId}`);
    }
  };

  const handleViewAllNotes = () => {
    navigate(`/student/studymaterials/${classId}`);
  };

  const handleViewAllVideos = () => {
    navigate(`/student/classvideos/${classId}`);
  };

  return (
    <div className="space-y-3">
      <button
        onClick={handleContinueLearning}
        className="w-full py-3 bg-gradient-to-r from-red-700 to-red-800 hover:from-red-800 hover:to-red-900 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all flex items-center justify-center"
      >
        <Video className="mr-2" size={18} />
        {lastVideoWatched ? "Continue Learning" : "Start Learning"}
      </button>
      
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={handleViewAllNotes}
          className="py-3 border-2 border-red-700 text-red-700 hover:bg-red-50 rounded-xl font-medium transition-colors flex items-center justify-center"
        >
          <FileText className="mr-2" size={18} />
          All Materials
        </button>
        
        <button
          onClick={handleViewAllVideos}
          className="py-3 border-2 border-gray-300 text-gray-700 hover:bg-gray-50 rounded-xl font-medium transition-colors flex items-center justify-center"
        >
          <Eye className="mr-2" size={18} />
          All Videos
        </button>
      </div>
    </div>
  );
};

export default SubjectActionButtons;