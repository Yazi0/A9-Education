import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
  Video,
  ChevronLeft,
  Clock,
  Play,
  Search,
  Filter,
  Download,
  Bookmark,
  Eye,
  Loader2,
  AlertCircle,
  FileText,
  Home
} from "lucide-react";
import api from "../../api/axios";
import StudentLayout from "../../layouts/StudentLayout";

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

  useEffect(() => {
    const fetchClassData = async () => {
      if (!classId) return;
      try {
        setLoading(true);
        setError(null);
        const classRes = await api.get<ApiClass>(`content/subjects/${classId}/classes/`);
        const apiClass = classRes.data;
        const videoLinks: VideoLink[] = apiClass.videos.map((video: ApiVideo) => {
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
        setClassData(getMockClassData());
      } finally {
        setLoading(false);
      }
    };
    fetchClassData();
  }, [classId]);

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
        }
      ],
      categories: [
        { id: "all", name: "All Videos", count: 2 },
        { id: "calculus", name: "Calculus", count: 1 },
        { id: "algebra", name: "Algebra", count: 1 }
      ]
    };
  };

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
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <Loader2 className="w-12 h-12 text-red-600 animate-spin mb-4" />
        <p className="text-gray-600 text-lg">Loading class videos...</p>
      </div>
    );
  }

  if (error && !classData) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md text-center border border-red-100">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">Unable to Load Videos</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="w-full px-6 py-3 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700 transition-all"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!classData) return null;

  return (
    <StudentLayout>
      <div className="max-w-6xl mx-auto flex-1 w-full">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={handleBack}
              className="p-2 bg-white rounded-xl shadow-sm hover:bg-gray-50 transition-all border border-gray-100"
            >
              <ChevronLeft size={24} className="text-gray-600" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{classData.name} Videos</h1>
              <p className="text-gray-600 mt-1">Teacher: {classData.teacher} • {classData.level}</p>
            </div>
          </div>
          <div className="mt-4 md:mt-0 flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm text-gray-500 font-medium">Available Lessons</p>
              <p className="text-2xl font-bold text-red-600">{classData.videoLinks.length}</p>
            </div>
          </div>
        </div>

        {/* Search & Filter Section */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search by lesson title..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all"
              />
            </div>
            <div className="flex items-center gap-3">
              <Filter className="text-gray-400 shrink-0" size={20} />
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 outline-none transition-all"
              >
                {classData.categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name} ({cat.count})</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Video Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {filteredVideos.map((video) => (
            <div
              key={video.id}
              className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden cursor-pointer"
              onClick={() => handleVideoClick(video.id)}
            >
              <div className="relative aspect-video">
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />
                <div className="absolute bottom-3 right-3 px-2 py-1 bg-black/70 text-white text-xs font-bold rounded flex items-center gap-1">
                  <Clock size={12} /> {video.duration}
                </div>
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-14 h-14 bg-red-600 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <Play className="text-white fill-current" size={24} />
                  </div>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-red-600 transition-colors line-clamp-2">
                  {video.title}
                </h3>
                <p className="text-sm text-gray-500 line-clamp-2 mb-4">
                  {video.description}
                </p>
                <div className="flex items-center justify-between text-xs text-gray-400 font-medium">
                  <div className="flex items-center gap-1">
                    <Eye size={14} /> {video.views.toLocaleString()} views
                  </div>
                  <div>{formatDate(video.uploadDate)}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredVideos.length === 0 && (
          <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-200 mb-12">
            <Video className="mx-auto text-gray-200 mb-4" size={64} />
            <h3 className="text-xl font-bold text-gray-900">No lessons found</h3>
            <p className="text-gray-500">Try adjusting your search or filters to find what you need.</p>
          </div>
        )}

        {/* Video Popup Modal */}
        {showVideoPopup && selectedVideo && (
          <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-white rounded-3xl w-full max-w-5xl max-h-[90vh] overflow-hidden shadow-2xl">
              <div className="flex justify-between items-center p-6 border-b border-gray-100">
                <h3 className="text-xl font-bold text-gray-900 line-clamp-1">
                  {classData.videoLinks.find(v => v.id === selectedVideo)?.title}
                </h3>
                <button
                  onClick={handleClosePopup}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-gray-600"
                >
                  <ChevronLeft size={24} className="rotate-90" />
                </button>
              </div>
              <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
                <div className="aspect-video w-full bg-black">
                  <iframe
                    src={`https://www.youtube.com/embed/${getYouTubeId(classData.videoLinks.find(v => v.id === selectedVideo)?.url || '')}${resumeTimestamp ? `?start=${resumeTimestamp}` : ''}`}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
                <div className="p-8">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                      <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <FileText size={20} className="text-red-600" /> Lesson Description
                      </h4>
                      <p className="text-gray-600 leading-relaxed mb-8">
                        {classData.videoLinks.find(v => v.id === selectedVideo)?.description}
                      </p>
                      <div className="flex flex-wrap gap-4">
                        <button className="px-6 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-all flex items-center gap-2">
                          <Bookmark size={20} /> Bookmark Lesson
                        </button>
                        <button className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition-all flex items-center gap-2">
                          <Download size={20} /> Download Materials
                        </button>
                      </div>
                    </div>
                    <div>
                      <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                        <h4 className="font-bold text-gray-900 mb-4">Lesson Details</h4>
                        <div className="space-y-4 text-sm font-medium">
                          <div className="flex justify-between">
                            <span className="text-gray-500">Duration:</span>
                            <span className="text-gray-900">{classData.videoLinks.find(v => v.id === selectedVideo)?.duration}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Release Date:</span>
                            <span className="text-gray-900">{formatDate(classData.videoLinks.find(v => v.id === selectedVideo)?.uploadDate || '')}</span>
                          </div>
                          <div className="flex justify-between pt-4 border-t border-gray-200">
                            <span className="text-gray-500">Views:</span>
                            <span className="text-gray-900">{classData.videoLinks.find(v => v.id === selectedVideo)?.views.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer Section */}
        <footer className="mt-auto border-t border-gray-200 py-12">
          <div className="bg-red-50 rounded-3xl p-8 border border-red-100 flex flex-col md:flex-row justify-between items-center text-center md:text-left gap-6">
            <div>
              <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
                <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center shadow-lg shadow-red-200">
                  <Home className="text-white" size={20} />
                </div>
                <h2 className="text-xl font-bold text-gray-900">A9 Education Center</h2>
              </div>
              <p className="text-gray-500 text-sm">Empowering students with high-quality video lessons across Sri Lanka.</p>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-right">
                <p className="text-sm font-bold text-gray-900">© 2024 A9 Education</p>
                <p className="text-xs text-gray-500">Online Learning Portal</p>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </StudentLayout>
  );
};

export default ClassVideos;