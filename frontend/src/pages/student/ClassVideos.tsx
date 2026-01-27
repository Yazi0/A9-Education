import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { 
  Video, 
  ChevronLeft, 
  Clock, 
  Calendar, 
  Play, 
  BookOpen,
  Search,
  Filter,
  Download,
  Users,
  Share2,
  Bookmark,
  Eye,
  Home,
  MessageSquare,
  Loader2,
  AlertCircle
} from "lucide-react";
import api from "../../api/axios"; // Adjust the import path as needed

// API Interfaces
interface ApiVideo {
  id: number;
  title: string;
  video_url: string;
  duration: string;
  thumbnail_url: string;
  description: string;
  category: string;
  views: number;
  created_at: string;
  watched_percentage: number;
  youtube_video_id?: string;
}

interface ApiClass {
  id: number;
  title: string;
  teacher: string;
  stream: string;
  level: string;
  videos: ApiVideo[];
}

// Existing interface for compatibility
interface VideoLink {
  id: number;
  title: string;
  url: string;
  duration: string;
  thumbnail: string;
  description: string;
  category: string;
  views: number;
  uploadDate: string;
  watched: number;
}

const ClassVideos = () => {
  const { classId } = useParams<{ classId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialVideoId = queryParams.get('video');
  const resumeTimestamp = queryParams.get('timestamp');

  const [selectedVideo, setSelectedVideo] = useState<number | null>(
    initialVideoId ? parseInt(initialVideoId) : null
  );
  const [showVideoPopup, setShowVideoPopup] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [classData, setClassData] = useState<{
    id: number;
    name: string;
    stream: string;
    level: string;
    teacher: string;
    videoLinks: VideoLink[];
    categories: { id: string; name: string; count: number }[];
  } | null>(null);

  // Fetch class data from API
  useEffect(() => {
    const fetchClassData = async () => {
      if (!classId) return;

      try {
        setLoading(true);
        setError(null);
        
        // Fetch class details
        const classRes = await api.get<ApiClass>(`content/subjects/${classId}/classes/`);
        const apiClass = classRes.data;
        
        // Convert API videos to the expected format
        const videoLinks: VideoLink[] = apiClass.videos.map((video: ApiVideo, index: number) => {
          // Extract YouTube ID from URL if it exists
          let youtubeId = "";
          if (video.youtube_video_id) {
            youtubeId = video.youtube_video_id;
          } else if (video.video_url.includes('youtube.com')) {
            const urlParams = new URL(video.video_url).searchParams;
            youtubeId = urlParams.get('v') || "";
          }
          
          return {
            id: video.id,
            title: video.title,
            url: video.video_url,
            duration: video.duration,
            thumbnail: video.thumbnail_url || `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`,
            description: video.description,
            category: video.category.toLowerCase().replace(/\s+/g, '-'),
            views: video.views || 0,
            uploadDate: video.created_at,
            watched: video.watched_percentage || 0
          };
        });

        // Create categories from videos
        const categoryCounts: Record<string, number> = {};
        videoLinks.forEach(video => {
          categoryCounts[video.category] = (categoryCounts[video.category] || 0) + 1;
        });

        const categories = [
          { id: "all", name: "All Videos", count: videoLinks.length },
          ...Object.entries(categoryCounts).map(([id, count]) => ({
            id,
            name: id.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
            count
          }))
        ];

        setClassData({
          id: apiClass.id,
          name: apiClass.title,
          stream: apiClass.stream,
          level: apiClass.level,
          teacher: apiClass.teacher,
          videoLinks,
          categories
        });

      } catch (err: any) {
        console.error("Error fetching class data:", err);
        setError("Failed to load class videos. Please try again later.");
        
        // Fallback to mock data
        setClassData(getMockClassData());
      } finally {
        setLoading(false);
      }
    };

    fetchClassData();
  }, [classId]);

  // Mock data fallback function
  const getMockClassData = () => {
    return {
      id: 1,
      name: "Combined Mathematics",
      stream: "Science",
      level: "Advanced Level",
      teacher: "Mr. Perera",
      videoLinks: [
        { 
          id: 1, 
          title: "Calculus - Lesson 1: Introduction", 
          url: "https://www.youtube.com/watch?v=9Qa0J4KuGqA", 
          duration: "45 min",
          thumbnail: "https://img.youtube.com/vi/9Qa0J4KuGqA/maxresdefault.jpg",
          description: "Introduction to differential calculus, limits, and derivatives",
          category: "calculus",
          views: 1245,
          uploadDate: "2024-01-15",
          watched: 65
        },
        { 
          id: 2, 
          title: "Algebra Revision - Complete Guide", 
          url: "https://www.youtube.com/watch?v=LQN3XzD7p8A", 
          duration: "30 min",
          thumbnail: "https://img.youtube.com/vi/LQN3XzD7p8A/maxresdefault.jpg",
          description: "Complete algebra revision for A/L with examples",
          category: "algebra",
          views: 890,
          uploadDate: "2024-01-10",
          watched: 100
        },
        { 
          id: 3, 
          title: "2023 Past Paper Discussion", 
          url: "https://www.youtube.com/watch?v=5qap5aO4i9A", 
          duration: "60 min",
          thumbnail: "https://img.youtube.com/vi/5qap5aO4i9A/maxresdefault.jpg",
          description: "Detailed discussion of 2023 past paper with solutions",
          category: "past-papers",
          views: 1567,
          uploadDate: "2024-01-05",
          watched: 45
        }
      ],
      categories: [
        { id: "all", name: "All Videos", count: 3 },
        { id: "calculus", name: "Calculus", count: 1 },
        { id: "algebra", name: "Algebra", count: 1 },
        { id: "past-papers", name: "Past Papers", count: 1 }
      ]
    };
  };

  // Handle video filtering
  const filteredVideos = classData?.videoLinks.filter(video => {
    const matchesSearch = video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         video.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "all" || video.category === categoryFilter;
    return matchesSearch && matchesCategory;
  }) || [];

  const handleVideoClick = (videoId: number) => {
    setSelectedVideo(videoId);
    setShowVideoPopup(true);
  };

  const handleClosePopup = () => {
    setShowVideoPopup(false);
  };

  const handleBack = () => {
    navigate(`/student/my-subjects`);
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  // Extract YouTube ID from URL
  const getYouTubeId = (url: string) => {
    try {
      const urlObj = new URL(url);
      const videoId = urlObj.searchParams.get('v');
      return videoId || url.split('/').pop() || '';
    } catch {
      return url.split('v=')[1]?.split('&')[0] || '';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6 flex flex-col items-center justify-center">
        <Loader2 className="w-12 h-12 text-red-600 animate-spin mb-4" />
        <p className="text-gray-600 text-lg">Loading class videos...</p>
      </div>
    );
  }

  if (error && !classData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6 flex flex-col items-center justify-center">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">Unable to Load Videos</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg font-semibold hover:from-red-700 hover:to-red-800 transition-all"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!classData) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6 flex flex-col">
      {/* Error Alert */}
      {error && (
        <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <AlertCircle className="text-yellow-600" size={20} />
            <div>
              <p className="text-yellow-800 font-medium">Using demo data</p>
              <p className="text-yellow-700 text-sm">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          <div className="flex items-center mb-4 md:mb-0">
            <button
              onClick={handleBack}
              className="flex items-center px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-lg font-semibold mr-4 shadow-md hover:shadow-lg transition-all"
            >
              <ChevronLeft className="mr-2" size={18} />
              Back to Classes
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{classData.name} Videos</h1>
              <p className="text-gray-600 mt-2">Teacher: {classData.teacher} • {classData.level}</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm text-gray-500">Total Videos</p>
              <p className="text-2xl font-bold text-red-700">{classData.videoLinks.length}</p>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search videos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Filter className="inline mr-2" size={16} />
                Category
              </label>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500"
              >
                {classData.categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name} ({category.count})
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sort By
              </label>
              <select className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500">
                <option>Most Recent</option>
                <option>Most Watched</option>
                <option>Duration: Short to Long</option>
                <option>Duration: Long to Short</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Video Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {filteredVideos.map((video) => (
          <div
            key={video.id}
            className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all group cursor-pointer border border-gray-200"
            onClick={() => handleVideoClick(video.id)}
          >
            {/* Video Thumbnail */}
            <div className="relative overflow-hidden">
              <img
                src={video.thumbnail}
                alt={video.title}
                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = `https://via.placeholder.com/400x225/FF6B6B/FFFFFF?text=${encodeURIComponent(video.title.substring(0, 30))}`;
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              <div className="absolute bottom-4 left-4 right-4">
                <div className="flex items-center justify-between text-white">
                  <div className="flex items-center bg-black/60 px-2 py-1 rounded">
                    <Clock size={14} className="mr-1" />
                    <span className="text-sm">{video.duration}</span>
                  </div>
                  {video.watched > 0 && (
                    <div className="bg-green-600 px-2 py-1 rounded text-sm">
                      {video.watched}% watched
                    </div>
                  )}
                </div>
              </div>
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center shadow-lg">
                  <Play className="text-white" size={32} />
                </div>
              </div>
            </div>

            {/* Video Info */}
            <div className="p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-red-600 transition-colors line-clamp-2">
                {video.title}
              </h3>
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">{video.description}</p>
              
              <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                <div className="flex items-center">
                  <Eye size={14} className="mr-1" />
                  <span>{video.views.toLocaleString()} views</span>
                </div>
                <div className="flex items-center">
                  <Calendar size={14} className="mr-1" />
                  <span>{formatDate(video.uploadDate)}</span>
                </div>
              </div>

              {/* Progress Bar */}
              {video.watched > 0 && (
                <div className="mb-4">
                  <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-red-600 to-red-700 rounded-full"
                      style={{ width: `${video.watched}%` }}
                    />
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleVideoClick(video.id);
                  }}
                  className="px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-lg font-semibold text-sm flex items-center"
                >
                  <Play className="mr-2" size={16} />
                  Watch Now
                </button>
                
                <div className="flex gap-2">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      // Bookmark functionality
                    }}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    title="Save for later"
                  >
                    <Bookmark size={18} className="text-gray-500 hover:text-red-600" />
                  </button>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      // Share functionality
                    }}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    title="Share video"
                  >
                    <Share2 size={18} className="text-gray-500 hover:text-red-600" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredVideos.length === 0 && (
        <div className="text-center py-12">
          <div className="inline-block p-4 bg-gradient-to-r from-red-100 to-red-200 rounded-full mb-4">
            <Video className="text-red-700" size={48} />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No videos found</h3>
          <p className="text-gray-600">Try adjusting your search filters</p>
        </div>
      )}

      {/* Video Popup Modal */}
      {showVideoPopup && selectedVideo && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-900">
                {classData.videoLinks.find(v => v.id === selectedVideo)?.title}
              </h3>
              <button
                onClick={handleClosePopup}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ✕
              </button>
            </div>
            
            <div className="p-6">
              {/* YouTube Video Player */}
              <div className="relative pb-[56.25%] h-0 mb-6 rounded-xl overflow-hidden">
                <iframe
                  src={`https://www.youtube.com/embed/${getYouTubeId(classData.videoLinks.find(v => v.id === selectedVideo)?.url || '')}${resumeTimestamp ? `?start=${resumeTimestamp}` : ''}`}
                  className="absolute top-0 left-0 w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title="Video player"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2">
                  <div className="bg-gray-50 rounded-xl p-4 mb-4">
                    <h4 className="font-bold text-gray-900 mb-2">Description</h4>
                    <p className="text-gray-600">
                      {classData.videoLinks.find(v => v.id === selectedVideo)?.description}
                    </p>
                  </div>
                  
                  <div className="flex gap-4">
                    <button className="px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg font-semibold flex items-center">
                      <Bookmark className="mr-2" size={18} />
                      Save for Later
                    </button>
                    <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 flex items-center">
                      <Download className="mr-2" size={18} />
                      Download Notes
                    </button>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="bg-red-50 rounded-xl p-4">
                    <h4 className="font-bold text-gray-900 mb-2">Video Details</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Duration:</span>
                        <span className="font-semibold">{classData.videoLinks.find(v => v.id === selectedVideo)?.duration}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Uploaded:</span>
                        <span className="font-semibold">{formatDate(classData.videoLinks.find(v => v.id === selectedVideo)?.uploadDate || '')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Views:</span>
                        <span className="font-semibold">{classData.videoLinks.find(v => v.id === selectedVideo)?.views.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 rounded-xl p-4">
                    <h4 className="font-bold text-gray-900 mb-2">Next Video</h4>
                    <button 
                      onClick={() => {
                        const nextVideo = classData.videoLinks.find(v => v.id === selectedVideo + 1);
                        if (nextVideo) {
                          setSelectedVideo(nextVideo.id);
                        }
                      }}
                      className="text-red-700 hover:text-red-800 font-medium text-sm"
                    >
                      Continue to next lesson →
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="mt-auto pt-8">
        <div className="max-w-7xl mx-auto pt-6 border-t border-gray-200">
          <div className="bg-red-200 rounded-2xl p-6 shadow-lg">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="text-center md:text-left mb-4 md:mb-0">
                <div className="flex items-center justify-center md:justify-start mb-2">
                  <div className="w-10 h-10 bg-gradient-to-r from-red-600 to-red-700 rounded-full flex items-center justify-center mr-3 shadow-lg">
                    <Home className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">A9 Education Center</h2>
                </div>
                <p className="text-gray-700">Video Learning Portal • {classData.name}</p>
              </div>
              
              <div className="text-center md:text-right">
                <p className="text-sm text-gray-700 mb-1">© {new Date().getFullYear()} A9 Education Center</p>
                <p className="text-xs text-gray-600">All rights reserved</p>
              </div>
            </div>
            
            <div className="mt-6 pt-4 border-t border-red-300 text-center">
              <p className="text-sm text-gray-700">
                Galle, Sri Lanka • 📞 +94 91 223 4455
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ClassVideos;