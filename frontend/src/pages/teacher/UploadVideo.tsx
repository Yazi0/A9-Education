import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Video,
  Eye,
  Play,
  Trash2,
  AlertCircle,
  Loader,
  Calendar,
  Link2,
  Check,
  ArrowLeft,
  ChevronRight,
  Sparkles,
  ExternalLink,
  Copy,
  BarChart3
} from "lucide-react";
import api from "../../api/axios";

const UploadVideo = () => {
  const navigate = useNavigate();
  const [subjects, setSubjects] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [videoTitle, setVideoTitle] = useState("");
  const [videoLink, setVideoLink] = useState("");
  const [uploading, setUploading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<number | null>(null);
  const [deletingVideo, setDeletingVideo] = useState<number | null>(null);
  const [copiedLink, setCopiedLink] = useState<number | null>(null);
  const [recentVideos, setRecentVideos] = useState<any[]>([]);

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const res = await api.get("subjects/my/");
        setSubjects(res.data);
      } catch (err) {
        console.error("Error fetching subjects:", err);
      }
    };
    fetchSubjects();
  }, []);

  useEffect(() => {
    if (selectedSubject) {
      const fetchClasses = async () => {
        try {
          const res = await api.get(`content/subjects/${selectedSubject}/classes/`);
          setClasses(res.data);
          setSelectedClass("");
          setRecentVideos([]);
        } catch (err) {
          console.error("Error fetching classes:", err);
        }
      };
      fetchClasses();
    } else {
      setClasses([]);
      setSelectedClass("");
      setRecentVideos([]);
    }
  }, [selectedSubject]);

  useEffect(() => {
    if (selectedClass) {
      const fetchVideos = async () => {
        try {
          const res = await api.get(`content/classes/${selectedClass}/videos/`);
          setRecentVideos(res.data.map((v: any) => ({
            ...v,
            uploadDate: "Available",
            views: 0,
            duration: "00:00",
            link: v.video_url,
            platform: getPlatformFromLink(v.video_url),
            thumbnail: getThumbnailForPlatform(v.video_url)
          })));
        } catch (err) {
          console.error("Error fetching videos:", err);
        }
      };
      fetchVideos();
    }
  }, [selectedClass]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClass || !videoTitle || !videoLink) {
      alert("Please select a class and fill all fields");
      return;
    }

    setUploading(true);
    try {
      await api.post("content/videos/create/", {
        class_obj: selectedClass,
        title: videoTitle,
        video_url: videoLink
      });

      const res = await api.get(`content/classes/${selectedClass}/videos/`);
      setRecentVideos(res.data.map((v: any) => ({
        ...v,
        uploadDate: "Just now",
        views: 0,
        duration: "00:00",
        link: v.video_url,
        platform: getPlatformFromLink(v.video_url),
        thumbnail: getThumbnailForPlatform(v.video_url)
      })));

      setVideoTitle("");
      setVideoLink("");
      alert("Video uploaded successfully!");
    } catch (err) {
      console.error("Error uploading video:", err);
      alert("Failed to upload video.");
    } finally {
      setUploading(false);
    }
  };

  const getPlatformFromLink = (link: string) => {
    if (!link) return "Link";
    if (link.includes("youtube") || link.includes("youtu.be")) return "YouTube";
    if (link.includes("zoom")) return "Zoom";
    if (link.includes("drive.google")) return "Google Drive";
    if (link.includes("vimeo")) return "Vimeo";
    return "Link";
  };

  const getThumbnailForPlatform = (link: string) => {
    if (!link) return "https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=400&h=225&fit=crop";
    if (link.includes("youtube")) return "https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=400&h=225&fit=crop";
    if (link.includes("zoom")) return "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400&h=225&fit=crop";
    if (link.includes("drive.google")) return "https://images.unsplash.com/photo-1573164713714-d95e436ab286?w=400&h=225&fit=crop";
    return "https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=400&h=225&fit=crop";
  };

  const confirmDelete = async (id: number) => {
    setDeletingVideo(id);
    try {
      await api.delete(`content/videos/${id}/delete/`);
      setRecentVideos((prev) => prev.filter((v) => v.id !== id));
      setShowDeleteConfirm(null);
    } catch (err) {
      console.error("Error deleting video:", err);
      alert("Failed to delete video.");
    } finally {
      setDeletingVideo(null);
    }
  };

  const copyToClipboard = (link: string, id: number) => {
    navigator.clipboard.writeText(link);
    setCopiedLink(id);
    setTimeout(() => setCopiedLink(null), 2000);
  };

  const totalViews = recentVideos.reduce((sum, video) => sum + video.views, 0);
  const totalVideos = recentVideos.length;
  const averageViews = totalVideos > 0 ? Math.round(totalViews / totalVideos) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 p-4 md:p-8">
      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-red-50 rounded-lg">
                  <AlertCircle className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-lg">Delete Video</h3>
                  <p className="text-gray-600 text-sm mt-1">This action cannot be undone</p>
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowDeleteConfirm(null)}
                  className="flex-1 py-2.5 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => confirmDelete(showDeleteConfirm)}
                  className="flex-1 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                >
                  {deletingVideo ? (
                    <Loader className="w-4 h-4 animate-spin" />
                  ) : (
                    <Trash2 className="w-4 h-4" />
                  )}
                  {deletingVideo ? "Deleting..." : "Delete"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
          <button
            onClick={() => navigate("/teacherdashboard")}
            className="hover:text-gray-700 hover:underline flex items-center gap-1 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Dashboard
          </button>
          <ChevronRight className="w-4 h-4" />
          <span className="text-gray-700 font-medium">Upload Videos</span>
        </div>

        {/* Main Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="p-3 bg-gradient-to-br from-red-600 to-red-700 text-white rounded-2xl shadow-lg">
                <Video className="w-8 h-8" />
              </div>
              <div className="absolute -top-2 -right-2">
                <Sparkles className="w-5 h-5 text-amber-500 fill-amber-500" />
              </div>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Video Lectures</h1>
              <p className="text-gray-600 mt-1">Share educational content with your students</p>
            </div>
          </div>

          <button
            onClick={() => navigate("/teacherdashboard")}
            className="flex items-center gap-2 px-4 py-2.5 bg-white text-gray-700 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors shadow-sm hover:shadow"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="font-medium">Back to Dashboard</span>
          </button>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Total Videos</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{totalVideos}</p>
            </div>
            <div className="p-3 bg-red-50 rounded-xl">
              <Video className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Course</p>
              <p className="text-lg font-bold text-gray-900 mt-1 truncate max-w-[120px]">
                {subjects.find(s => s.id.toString() === selectedSubject)?.name || "Select Subject"}
              </p>
            </div>
            <div className="p-3 bg-blue-50 rounded-xl">
              <Eye className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Avg. Views</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{averageViews}</p>
            </div>
            <div className="p-3 bg-purple-50 rounded-xl">
              <BarChart3 className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Add Video Form */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-2xl p-6 md:p-8 shadow-xl border border-gray-100"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-gradient-to-br from-red-50 to-red-100 rounded-lg">
              <Link2 className="w-6 h-6 text-red-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Add New Video</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Subject
                </label>
                <div className="relative">
                  <select
                    value={selectedSubject}
                    onChange={(e) => setSelectedSubject(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent appearance-none bg-white cursor-pointer hover:border-red-400 transition-colors"
                    required
                  >
                    <option value="">Choose subject...</option>
                    {subjects.map((s) => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Class
                </label>
                <div className="relative">
                  <select
                    value={selectedClass}
                    onChange={(e) => setSelectedClass(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent appearance-none bg-white cursor-pointer hover:border-red-400 transition-colors"
                    required
                    disabled={!selectedSubject}
                  >
                    <option value="">{selectedSubject ? "Choose class..." : "Select subject first"}</option>
                    {classes.map((c) => (
                      <option key={c.id} value={c.id}>{c.title}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Video Title
              </label>
              <input
                type="text"
                placeholder="Enter descriptive video title"
                value={videoTitle}
                onChange={(e) => setVideoTitle(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent hover:border-red-400 transition-colors"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Video URL
              </label>
              <div className="relative">
                <Link2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="url"
                  placeholder="Paste YouTube, Zoom, or Google Drive link"
                  value={videoLink}
                  onChange={(e) => setVideoLink(e.target.value)}
                  className="w-full p-3 pl-10 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent hover:border-red-400 transition-colors"
                  required
                />
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Supports YouTube, Zoom, Google Drive, Vimeo links
              </p>
            </div>

            <button
              type="submit"
              disabled={uploading}
              className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white py-3.5 rounded-xl font-medium hover:from-red-700 hover:to-red-800 focus:ring-4 focus:ring-red-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
            >
              {uploading ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Check className="w-5 h-5" />
                  Save Video Link
                </>
              )}
            </button>
          </form>
        </motion.div>

        {/* Recent Videos */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-2xl p-6 md:p-8 shadow-xl border border-gray-100"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 rounded-lg">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">
                Videos in this class
              </h2>
            </div>
          </div>

          <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
            <AnimatePresence>
              {recentVideos.map((video: any) => (
                <motion.div
                  key={video.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="group relative bg-gradient-to-br from-gray-50 to-white rounded-2xl p-4 border border-gray-200 hover:border-red-300 hover:shadow-lg transition-all duration-300"
                >
                  {/* Delete Button */}
                  <button
                    onClick={() => setShowDeleteConfirm(video.id)}
                    disabled={deletingVideo === video.id}
                    className="absolute -top-2 -right-2 z-10 p-2 bg-red-100 text-red-600 rounded-full opacity-0 group-hover:opacity-100 hover:bg-red-200 transition-all hover:scale-110 shadow-md"
                    title="Delete video"
                  >
                    {deletingVideo === video.id ? (
                      <Loader className="w-4 h-4 animate-spin" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                  </button>

                  <div className="flex gap-4">
                    {/* Thumbnail */}
                    <div className="relative flex-shrink-0 w-24 h-16 rounded-xl overflow-hidden">
                      <img
                        src={video.thumbnail}
                        alt={video.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                      <button
                        onClick={() => window.open(video.link, "_blank")}
                        className="absolute inset-0 flex items-center justify-center"
                      >
                        <Play className="w-6 h-6 text-white" fill="white" />
                      </button>
                      <div className="absolute bottom-2 right-2 bg-black/75 text-white text-xs px-2 py-1 rounded">
                        {video.duration}
                      </div>
                    </div>

                    {/* Video Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <h3 className="font-semibold text-gray-900 truncate group-hover:text-red-700 transition-colors">
                          {video.title}
                        </h3>
                      </div>
                      <div className="flex items-center gap-3 mt-2 flex-wrap">
                        <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-medium rounded-lg">
                          Video ID: {video.id}
                        </span>
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-lg">
                          {video.platform}
                        </span>
                      </div>
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {video.uploadDate}
                          </div>
                          <div className="flex items-center gap-1">
                            <Eye className="w-3 h-3" />
                            {video.views} views
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => copyToClipboard(video.link, video.id)}
                            className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                            title="Copy link"
                          >
                            {copiedLink === video.id ? (
                              <Check className="w-4 h-4 text-green-600" />
                            ) : (
                              <Copy className="w-4 h-4 text-gray-500" />
                            )}
                          </button>
                          <button
                            onClick={() => window.open(video.link, "_blank")}
                            className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                            title="Open video"
                          >
                            <ExternalLink className="w-4 h-4 text-gray-500" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {recentVideos.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <Video className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No videos found for this class.</p>
                <p className="text-sm text-gray-400 mt-1">Select a class to manage videos or add your first one!</p>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Quick Tips */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mt-8 bg-gradient-to-r from-red-50 to-red-100 rounded-2xl p-6 border border-red-200"
      >
        <div className="flex items-center gap-3 mb-4 justify-center">
          <Sparkles className="w-5 h-5 text-red-600" />
          <h3 className="font-semibold text-gray-900 justify-center">@ A9 Education Center</h3>
        </div>
        <div className="text-gray-700 text-center">
          <p className="mb-2">Pathway For Your Educational Success.</p>
        </div>
      </motion.div>
    </div>
  );
};

export default UploadVideo;