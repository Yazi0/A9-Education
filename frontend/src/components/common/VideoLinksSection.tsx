import React, { useEffect, useState } from 'react';
import { Video, ChevronRight, ExternalLink, Loader2, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
 // Adjust import path as needed

// API Interface
interface ApiVideo {
  id: number;
  title: string;
  video_url: string;
  duration?: string;
  description?: string;
  created_at?: string;
}

// Existing interface for compatibility
interface TeacherVideo {
  id: number;
  title: string;
  url: string;
  duration: string;
  thumbnail?: string;
  description?: string;
  category?: string;
  views?: number;
  uploadDate?: string;
  watched?: number;
}

interface VideoLinksSectionProps {
  classId: number;
  title?: string;
  maxItems?: number;
  showViewAll?: boolean;
  videos?: TeacherVideo[]; // Optional for backward compatibility
}

const VideoLinksSection: React.FC<VideoLinksSectionProps> = ({
  classId,
  title = "Latest Video Lessons",
  maxItems = 2,
  showViewAll = true,
  videos: propVideos // Allow videos to be passed as prop
}) => {
  const navigate = useNavigate();
  const [apiVideos, setApiVideos] = useState<TeacherVideo[]>([]);
  const [loading, setLoading] = useState(!propVideos);
  const [error, setError] = useState<string | null>(null);

  // Fetch videos from API if not provided as prop
  useEffect(() => {
    const fetchVideos = async () => {
      // If videos are passed as prop, use them
      if (propVideos) {
        setApiVideos(propVideos);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        const res = await api.get<ApiVideo[]>(`content/classes/${classId}/videos/`);
        
        // Convert API videos to TeacherVideo format
        const teacherVideos: TeacherVideo[] = res.data.map((video: ApiVideo) => ({
          id: video.id,
          title: video.title,
          url: video.video_url,
          duration: video.duration || "30 min", // Default duration if not provided
          description: video.description || "",
          uploadDate: video.created_at || "",
          watched: 0 // Default to 0 if not tracking watch progress
        }));
        
        setApiVideos(teacherVideos);
      } catch (err: any) {
        console.error("Error fetching videos:", err);
        setError("Failed to load videos");
        
        // Fallback to mock data
        setApiVideos(getMockVideos());
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, [classId, propVideos]);

  // Mock data fallback
  const getMockVideos = (): TeacherVideo[] => [
    {
      id: 1,
      title: "Calculus - Lesson 1: Introduction",
      url: "https://www.youtube.com/watch?v=9Qa0J4KuGqA",
      duration: "45 min",
      description: "Introduction to differential calculus"
    },
    {
      id: 2,
      title: "Algebra Revision - Complete Guide",
      url: "https://www.youtube.com/watch?v=LQN3XzD7p8A",
      duration: "30 min",
      description: "Complete algebra revision for A/L"
    },
    {
      id: 3,
      title: "2023 Past Paper Discussion",
      url: "https://www.youtube.com/watch?v=5qap5aO4i9A",
      duration: "60 min",
      description: "Detailed discussion of 2023 past paper"
    }
  ];

  const handleViewAllVideos = () => {
    navigate(`/student/classvideos/${classId}`);
  };

  const handleWatchVideo = (videoId: number, videoUrl: string) => {
    // Navigate to class videos with specific video selected
    navigate(`/student/classvideos/${classId}?video=${videoId}`);
    
    // Optionally open in new tab as fallback
    window.open(videoUrl, '_blank', 'noopener,noreferrer');
  };

  // Use prop videos if provided, otherwise use API videos
  const displayVideos = propVideos || apiVideos;

  if (loading) {
    return (
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-bold text-gray-900 flex items-center">
            <Video className="mr-2 text-red-700" size={20} />
            {title}
          </h4>
        </div>
        <div className="flex items-center justify-center py-4">
          <Loader2 className="w-5 h-5 text-red-600 animate-spin mr-2" />
          <span className="text-gray-600 text-sm">Loading videos...</span>
        </div>
      </div>
    );
  }

  if (error && displayVideos.length === 0) {
    return (
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-bold text-gray-900 flex items-center">
            <Video className="mr-2 text-red-700" size={20} />
            {title}
          </h4>
        </div>
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (displayVideos.length === 0) {
    return (
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-bold text-gray-900 flex items-center">
            <Video className="mr-2 text-red-700" size={20} />
            {title}
          </h4>
        </div>
        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 text-center">
          <p className="text-gray-600 text-sm">No videos available yet</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-bold text-gray-900 flex items-center">
          <Video className="mr-2 text-red-700" size={20} />
          {title}
        </h4>
        {showViewAll && displayVideos.length > maxItems && (
          <button 
            onClick={handleViewAllVideos}
            className="text-sm text-red-700 hover:text-red-800 font-medium flex items-center transition-colors"
          >
            View All ({displayVideos.length}) <ChevronRight size={16} />
          </button>
        )}
      </div>
      
      {/* Error warning if using fallback data */}
      {error && displayVideos.length > 0 && (
        <div className="mb-3 p-2 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-3 h-3 text-yellow-600" />
            <p className="text-xs text-yellow-700">{error} (showing demo data)</p>
          </div>
        </div>
      )}
      
      <div className="space-y-2">
        {displayVideos.slice(0, maxItems).map((video) => (
          <div 
            key={video.id} 
            className="flex items-center justify-between p-3 bg-gray-50 hover:bg-red-50 rounded-lg border border-gray-200 group transition-all hover:border-red-300 cursor-pointer"
            onClick={() => handleWatchVideo(video.id, video.url)}
          >
            <div className="flex items-center flex-1 min-w-0">
              <div className="flex-shrink-0 mr-3">
                <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                  <Video className="text-red-700" size={16} />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 group-hover:text-red-700 truncate">
                  {video.title}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  {video.duration && (
                    <span className="text-xs text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">
                      {video.duration}
                    </span>
                  )}
                  {video.description && (
                    <span className="text-xs text-gray-500 truncate">
                      {video.description}
                    </span>
                  )}
                </div>
              </div>
            </div>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                handleWatchVideo(video.id, video.url);
              }}
              className="flex-shrink-0 ml-2 p-1.5 text-gray-400 hover:text-red-700 hover:bg-red-100 rounded transition-colors"
              title="Watch Video"
            >
              <ExternalLink size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VideoLinksSection;