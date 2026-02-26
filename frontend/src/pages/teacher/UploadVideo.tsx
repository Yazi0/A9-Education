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
  BarChart3,
  GraduationCap
} from "lucide-react";
import api from "../../api/axios";
import TeacherLayout from "../../layouts/TeacherLayout";

const UploadVideo = () => {
  const navigate = useNavigate();

  // All subjects taught by this teacher (with grades_detail)
  const [allSubjects, setAllSubjects] = useState<any[]>([]);
  const [grades, setGrades] = useState<{ id: number; name: string }[]>([]);
  const [filteredSubjects, setFilteredSubjects] = useState<any[]>([]);

  const [selectedGrade, setSelectedGrade] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [videoTitle, setVideoTitle] = useState("");
  const [videoLink, setVideoLink] = useState("");
  const [uploading, setUploading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<number | null>(null);
  const [deletingVideo, setDeletingVideo] = useState<number | null>(null);
  const [copiedLink, setCopiedLink] = useState<number | null>(null);
  const [recentVideos, setRecentVideos] = useState<any[]>([]);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Step 1: Fetch all teacher subjects once
  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const res = await api.get("subjects/my/");
        const subjects = res.data;
        setAllSubjects(subjects);

        // Derive unique grades from all subjects
        const gradeMap = new Map<number, string>();
        subjects.forEach((s: any) => {
          (s.grades_detail || []).forEach((g: any) => {
            gradeMap.set(g.id, g.name);
          });
        });
        setGrades(Array.from(gradeMap.entries()).map(([id, name]) => ({ id, name })));
      } catch (err) {
        console.error("Error fetching subjects:", err);
      }
    };
    fetchSubjects();
  }, []);

  // Step 2: When grade changes, filter subjects for that grade
  useEffect(() => {
    if (selectedGrade) {
      const gradeId = parseInt(selectedGrade);
      const subs = allSubjects.filter((s: any) =>
        (s.grades_detail || []).some((g: any) => g.id === gradeId)
      );
      setFilteredSubjects(subs);
      setSelectedSubject("");
      setRecentVideos([]);
    } else {
      setFilteredSubjects([]);
      setSelectedSubject("");
      setRecentVideos([]);
    }
  }, [selectedGrade, allSubjects]);

  // Step 3: When subject changes, fetch videos directly
  useEffect(() => {
    if (selectedSubject) {
      const fetchVideos = async () => {
        try {
          const res = await api.get(`content/subjects/${selectedSubject}/videos/`);
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
    } else {
      setRecentVideos([]);
    }
  }, [selectedSubject]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSubject || !videoTitle || !videoLink) {
      setErrorMessage("Please select a subject and fill all required fields before uploading.");
      setShowErrorModal(true);
      return;
    }
    setUploading(true);
    try {
      await api.post("content/videos/create/", {
        subject: selectedSubject,
        title: videoTitle,
        video_url: videoLink
      });
      const res = await api.get(`content/subjects/${selectedSubject}/videos/`);
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
      setShowSuccessModal(true);
    } catch (err) {
      console.error("Error uploading video:", err);
      setErrorMessage("Failed to upload video lecture. Please check your connection and try again.");
      setShowErrorModal(true);
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
      setRecentVideos(prev => prev.filter(v => v.id !== id));
      setShowDeleteConfirm(null);
    } catch (err) {
      console.error("Error deleting video:", err);
      setErrorMessage("Failed to delete the video. Please try again later.");
      setShowErrorModal(true);
      setShowDeleteConfirm(null);
    } finally {
      setDeletingVideo(null);
    }
  };

  const copyToClipboard = (link: string, id: number) => {
    navigator.clipboard.writeText(link);
    setCopiedLink(id);
    setTimeout(() => setCopiedLink(null), 2000);
  };

  const totalVideos = recentVideos.length;

  const selectClass = (label: string, disabled: boolean, value: string, onChange: (v: string) => void, options: { value: string; label: string }[], placeholder: string) => (
    <div className="relative">
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className={`w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent appearance-none bg-white cursor-pointer transition-colors ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-red-400'}`}
        disabled={disabled}
      >
        <option value="">{placeholder}</option>
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  );

  return (
    <TeacherLayout>
      <div className="bg-white rounded-2xl">
        {/* Success Modal */}
        <AnimatePresence>
          {showSuccessModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-[60] p-4"
            >
              <motion.div
                initial={{ scale: 0.9, y: 20, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                exit={{ scale: 0.9, y: 20, opacity: 0 }}
                className="bg-white rounded-3xl p-8 w-full max-w-sm shadow-2xl text-center relative overflow-hidden"
              >
                {/* Decorative background element */}
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-red-50 rounded-full blur-3xl" />
                <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-blue-50 rounded-full blur-3xl" />

                <div className="relative">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", damping: 12, delay: 0.2 }}
                    className="w-20 h-20 bg-gradient-to-br from-red-600 to-red-700 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-red-200"
                  >
                    <Check className="w-10 h-10 text-white" strokeWidth={3} />
                  </motion.div>

                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Upload Successful!</h3>
                  <p className="text-gray-600 mb-8">
                    Your video lecture has been published and is now available to students.
                  </p>

                  <button
                    onClick={() => setShowSuccessModal(false)}
                    className="w-full bg-gray-900 text-white py-4 rounded-2xl font-bold hover:bg-black transition-all shadow-lg hover:shadow-xl active:scale-[0.98]"
                  >
                    Got it, thanks!
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error Modal */}
        <AnimatePresence>
          {showErrorModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-[60] p-4"
            >
              <motion.div
                initial={{ scale: 0.9, y: 20, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                exit={{ scale: 0.9, y: 20, opacity: 0 }}
                className="bg-white rounded-3xl p-8 w-full max-w-sm shadow-2xl text-center relative overflow-hidden"
              >
                <div className="relative">
                  <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <AlertCircle className="w-10 h-10 text-red-600" />
                  </div>

                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Oops!</h3>
                  <p className="text-gray-600 mb-8">{errorMessage}</p>

                  <button
                    onClick={() => setShowErrorModal(false)}
                    className="w-full bg-red-600 text-white py-4 rounded-2xl font-bold hover:bg-red-700 transition-all shadow-lg active:scale-[0.98]"
                  >
                    Try Again
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Delete Confirmation Modal */}
        <AnimatePresence>
          {showDeleteConfirm && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
              <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-red-50 rounded-lg"><AlertCircle className="w-6 h-6 text-red-600" /></div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg">Delete Video</h3>
                    <p className="text-gray-600 text-sm mt-1">This action cannot be undone</p>
                  </div>
                </div>
                <div className="flex gap-3 mt-6">
                  <button onClick={() => setShowDeleteConfirm(null)} className="flex-1 py-2.5 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors">Cancel</button>
                  <button onClick={() => confirmDelete(showDeleteConfirm!)} className="flex-1 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 transition-colors flex items-center justify-center gap-2">
                    {deletingVideo ? <Loader className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                    {deletingVideo ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
            <button onClick={() => navigate("/teacherdashboard")} className="hover:text-gray-700 flex items-center gap-1 transition-colors">
              <ArrowLeft className="w-4 h-4" />Dashboard
            </button>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-700 font-medium">Upload Videos</span>
          </div>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="p-3 bg-gradient-to-br from-red-600 to-red-700 text-white rounded-2xl shadow-lg">
                  <Video className="w-8 h-8" />
                </div>
                <div className="absolute -top-2 -right-2"><Sparkles className="w-5 h-5 text-amber-500 fill-amber-500" /></div>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Video Lectures</h1>
                <p className="text-gray-600 mt-1">Share educational content with your students</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
            <div className="flex items-center justify-between">
              <div><p className="text-gray-500 text-sm font-medium">Total Videos</p><p className="text-2xl font-bold text-gray-900 mt-1">{totalVideos}</p></div>
              <div className="p-3 bg-red-50 rounded-xl"><Video className="w-6 h-6 text-red-600" /></div>
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Subject</p>
                <p className="text-lg font-bold text-gray-900 mt-1 truncate max-w-[120px]">
                  {filteredSubjects.find((s: any) => s.id.toString() === selectedSubject)?.name || "—"}
                </p>
              </div>
              <div className="p-3 bg-blue-50 rounded-xl"><Eye className="w-6 h-6 text-blue-600" /></div>
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
            <div className="flex items-center justify-between">
              <div><p className="text-gray-500 text-sm font-medium">Grade</p><p className="text-2xl font-bold text-gray-900 mt-1">{grades.find(g => g.id.toString() === selectedGrade)?.name || "—"}</p></div>
              <div className="p-3 bg-purple-50 rounded-xl"><BarChart3 className="w-6 h-6 text-purple-600" /></div>
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upload Form */}
          <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} className="bg-gray-50 rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-gradient-to-br from-red-50 to-red-100 rounded-lg"><Link2 className="w-6 h-6 text-red-600" /></div>
              <h2 className="text-xl font-bold text-gray-900">Add New Video</h2>
            </div>
            <form onSubmit={handleSubmit} className="space-y-5">

              {/* 1. Grade */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1.5">
                  <GraduationCap size={15} className="text-red-500" /> Select Grade
                </label>
                {selectClass("grade", false, selectedGrade, setSelectedGrade,
                  grades.map(g => ({ value: g.id.toString(), label: g.name })),
                  "Choose grade..."
                )}
              </div>

              {/* 2. Subject (filtered by grade) */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Subject</label>
                {selectClass("subject", !selectedGrade, selectedSubject, setSelectedSubject,
                  filteredSubjects.map((s: any) => ({ value: s.id.toString(), label: s.name })),
                  selectedGrade ? "Choose subject..." : "Select grade first"
                )}
              </div>

              {/* 3. Title */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Video Title</label>
                <input
                  type="text"
                  placeholder="Enter descriptive video title"
                  value={videoTitle}
                  onChange={e => setVideoTitle(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent hover:border-red-400 transition-colors"
                  required
                />
              </div>

              {/* 4. URL */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Video URL</label>
                <div className="relative">
                  <Link2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="url"
                    placeholder="Paste YouTube, Zoom, or Google Drive link"
                    value={videoLink}
                    onChange={e => setVideoLink(e.target.value)}
                    className="w-full p-3 pl-10 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent hover:border-red-400 transition-colors"
                    required
                  />
                </div>
                <p className="text-xs text-gray-400 mt-1.5">Supports YouTube, Zoom, Google Drive, Vimeo</p>
              </div>

              <button
                type="submit"
                disabled={uploading || !selectedSubject}
                className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white py-3.5 rounded-xl font-medium hover:from-red-700 hover:to-red-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 shadow-lg"
              >
                {uploading ? <><Loader className="w-5 h-5 animate-spin" />Uploading...</> : <><Check className="w-5 h-5" />Save Video Link</>}
              </button>
            </form>
          </motion.div>

          {/* Video List */}
          <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} className="bg-gray-50 rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-blue-50 rounded-lg"><Calendar className="w-6 h-6 text-blue-600" /></div>
              <h2 className="text-xl font-bold text-gray-900">Videos in this subject</h2>
            </div>
            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1">
              <AnimatePresence>
                {recentVideos.map(video => (
                  <motion.div key={video.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="group relative bg-white rounded-2xl p-4 border border-gray-200 hover:border-red-300 hover:shadow-md transition-all duration-300">
                    <button onClick={() => setShowDeleteConfirm(video.id)} disabled={deletingVideo === video.id} className="absolute -top-2 -right-2 z-10 p-2 bg-red-100 text-red-600 rounded-full opacity-0 group-hover:opacity-100 hover:bg-red-200 transition-all hover:scale-110 shadow-md">
                      {deletingVideo === video.id ? <Loader className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                    </button>
                    <div className="flex gap-4">
                      <div className="relative flex-shrink-0 w-24 h-16 rounded-xl overflow-hidden">
                        <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                        <button onClick={() => window.open(video.link, "_blank")} className="absolute inset-0 flex items-center justify-center">
                          <Play className="w-6 h-6 text-white" fill="white" />
                        </button>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 truncate group-hover:text-red-700 transition-colors">{video.title}</h3>
                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                          <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs font-medium rounded-lg">ID: {video.id}</span>
                          <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-medium rounded-lg">{video.platform}</span>
                        </div>
                        <div className="flex items-center justify-end mt-2 gap-2">
                          <button onClick={() => copyToClipboard(video.link, video.id)} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors" title="Copy link">
                            {copiedLink === video.id ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4 text-gray-500" />}
                          </button>
                          <button onClick={() => window.open(video.link, "_blank")} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors" title="Open video">
                            <ExternalLink className="w-4 h-4 text-gray-500" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              {recentVideos.length === 0 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
                  <Video className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">{selectedSubject ? "No videos in this subject yet." : "Select a grade and subject to see videos."}</p>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Footer Banner */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="mt-8 bg-gradient-to-r from-red-50 to-red-100 rounded-2xl p-6 border border-red-200 flex items-center gap-3 justify-center">
          <Sparkles className="w-5 h-5 text-red-600" />
          <h3 className="font-semibold text-gray-900">@ A9 Education Center — Pathway For Your Educational Success.</h3>
        </motion.div>
      </div>
    </TeacherLayout>
  );
};

export default UploadVideo;