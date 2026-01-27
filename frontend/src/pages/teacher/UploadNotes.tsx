import { useState, useEffect } from "react";
import { Upload, FileText, Clock, Download, Trash2, AlertCircle, File, Loader, Calendar, X } from "lucide-react";
import api from "../../api/axios";
import Footer from "../../components/Footer";

const UploadNotes = () => {
  const [subjects, setSubjects] = useState<any[]>([]);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [noteTitle, setNoteTitle] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [deletingNote, setDeletingNote] = useState<number | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<number | null>(null);
  const [recentNotes, setRecentNotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const res = await api.get("subjects/my/");
        setSubjects(res.data);
      } catch (err) {
        console.error("Error fetching subjects:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSubjects();
  }, []);

  useEffect(() => {
    if (selectedSubject) {
      const fetchNotes = async () => {
        try {
          const res = await api.get(`content/subjects/${selectedSubject}/materials/`);
          setRecentNotes(res.data.map((m: any) => ({
            ...m,
            fileType: m.file ? m.file.split('.').pop().toUpperCase() : "PDF",
            fileSize: "N/A",
            uploadDate: "Available",
            downloads: 0,
            fileName: m.file ? m.file.split('/').pop() : "document.pdf",
            fileUrl: m.file
          })));
        } catch (err) {
          console.error("Error fetching notes:", err);
        }
      };
      fetchNotes();
    } else {
      setRecentNotes([]);
    }
  }, [selectedSubject]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSubject || !noteTitle || !selectedFile) {
      alert("Please select a subject, title, and file");
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("subject", selectedSubject);
    formData.append("title", noteTitle);
    formData.append("file", selectedFile);

    try {
      await api.post("content/materials/create/", formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      // Refresh notes
      const res = await api.get(`content/subjects/${selectedSubject}/materials/`);
      setRecentNotes(res.data.map((m: any) => ({
        ...m,
        fileType: m.file ? m.file.split('.').pop().toUpperCase() : "PDF",
        fileSize: "N/A",
        uploadDate: "Just now",
        downloads: 0,
        fileName: m.file ? m.file.split('/').pop() : "document.pdf",
        fileUrl: m.file
      })));

      setNoteTitle("");
      setSelectedFile(null);
      alert("Notes uploaded successfully!");
    } catch (err) {
      console.error("Error uploading notes:", err);
      alert("Failed to upload notes.");
    } finally {
      setUploading(false);
    }
  };

  const handleDownload = (_noteId: number, _fileName: string, fileUrl: string) => {
    if (!fileUrl) return;
    window.open(fileUrl, "_blank");
  };

  const confirmDelete = async (noteId: number) => {
    setDeletingNote(noteId);
    try {
      await api.delete(`content/materials/${noteId}/delete/`);
      setRecentNotes(prev => prev.filter(note => note.id !== noteId));
      setShowDeleteConfirm(null);
    } catch (err) {
      console.error("Error deleting note:", err);
      alert("Failed to delete notes.");
    } finally {
      setDeletingNote(null);
    }
  };

  const clearFile = () => {
    setSelectedFile(null);
  };

  const handleDeleteClick = (noteId: number) => {
    setShowDeleteConfirm(noteId);
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader className="w-12 h-12 animate-spin text-emerald-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-emerald-50 p-4 md:p-8">
      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-red-100 rounded-lg">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Delete Notes</h3>
                <p className="text-gray-600 mt-1">Are you sure? This action cannot be undone.</p>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={cancelDelete}
                className="flex-1 py-2.5 px-4 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => confirmDelete(showDeleteConfirm)}
                className="flex-1 py-2.5 px-4 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-white rounded-xl shadow-sm">
            <FileText className="w-8 h-8 text-emerald-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Upload Study Notes</h1>
            <p className="text-gray-600 mt-1">Share educational materials with your students</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto">
        <button
          onClick={() => window.history.back()}
          type="button"
          className="bg-gradient-to-r from-purple-600 to-pink-600 text-white
            px-6 py-2.5 rounded-xl font-medium
            hover:from-purple-700 hover:to-pink-700
            focus:ring-4 focus:ring-purple-300
            transition-all inline-flex items-center gap-2"
        >
          Back to Dashboard
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Upload Form */}
        <div className="bg-white rounded-2xl p-6 md:p-8 shadow-lg border border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-emerald-100 rounded-lg">
              <Upload className="w-5 h-5 text-emerald-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Upload New Notes</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Subject <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  className="w-full p-3 pl-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent appearance-none bg-white cursor-pointer hover:border-emerald-400 transition-colors"
                  required
                >
                  <option value="">Choose a subject...</option>
                  {subjects.map((s) => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Note Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Note Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={noteTitle}
                onChange={(e) => setNoteTitle(e.target.value)}
                placeholder="Enter descriptive note title"
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent hover:border-emerald-400 transition-colors"
                required
              />
            </div>

            {/* File Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Document File <span className="text-red-500">*</span>
              </label>

              {!selectedFile ? (
                <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer bg-gray-50 hover:bg-emerald-50 hover:border-emerald-400 transition-all group">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <File className="w-12 h-12 text-gray-400 mb-3 group-hover:text-emerald-500" />
                    <p className="mb-1 text-sm text-gray-500">
                      <span className="font-semibold">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-gray-500">PDF, DOC, DOCX up to 10MB</p>
                  </div>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx,.txt"
                    className="hidden"
                    onChange={handleFileChange}
                    required
                  />
                </label>
              ) : (
                <div className="relative p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
                  <div className="flex items-center gap-3">
                    <FileText className="w-10 h-10 text-emerald-600" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{selectedFile.name}</p>
                      <p className="text-xs text-gray-500">
                        {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={clearFile}
                      className="p-1 hover:bg-emerald-100 rounded-lg transition-colors"
                    >
                      <X className="w-5 h-5 text-gray-500 hover:text-red-500" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={uploading}
              className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-3.5 rounded-xl font-medium hover:from-emerald-700 hover:to-teal-700 focus:ring-4 focus:ring-emerald-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
            >
              {uploading ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="w-5 h-5" />
                  Upload Notes
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Column - Recent Notes */}
        <div className="bg-white rounded-2xl p-6 md:p-8 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Clock className="w-5 h-5 text-blue-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">
                Notes in this subject
              </h2>
            </div>
          </div>

          {/* Notes Grid */}
          {recentNotes.length > 0 ? (
            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
              {recentNotes.map((note: any) => (
                <div
                  key={note.id}
                  className="group relative flex gap-4 p-4 rounded-xl border border-gray-200 hover:border-emerald-300 hover:bg-emerald-50 transition-all"
                >
                  {/* Delete Button */}
                  <button
                    onClick={() => handleDeleteClick(note.id)}
                    disabled={deletingNote === note.id}
                    className="absolute -top-2 -right-2 z-10 p-1.5 bg-red-100 text-red-600 rounded-full opacity-0 group-hover:opacity-100 hover:bg-red-200 transition-all hover:scale-110 disabled:opacity-100"
                    title="Delete notes"
                  >
                    {deletingNote === note.id ? (
                      <Loader className="w-4 h-4 animate-spin" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                  </button>

                  {/* File Icon */}
                  <div className="relative flex-shrink-0">
                    <div className="w-12 h-14 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-lg flex items-center justify-center group-hover:from-emerald-200 group-hover:to-teal-200 transition-colors">
                      <FileText className="w-6 h-6 text-emerald-600" />
                    </div>
                    <div className="absolute -bottom-1 -right-1 bg-emerald-600 text-white text-xs px-1.5 py-0.5 rounded">
                      {note.fileType}
                    </div>
                  </div>

                  {/* Note Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <h3 className="font-medium text-gray-900 truncate group-hover:text-emerald-700 transition-colors">
                        {note.title}
                      </h3>
                    </div>
                    <div className="flex items-center gap-3 mt-2 flex-wrap">
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded">
                        ID: {note.id}
                      </span>
                      <span className="text-sm text-gray-600">{note.subject}</span>
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                        {note.fileSize}
                      </span>
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {note.uploadDate}
                        </div>
                        <div className="flex items-center gap-1">
                          <Download className="w-3 h-3" />
                          {note.downloads} downloads
                        </div>
                      </div>

                      {/* Download Button */}
                      <button
                        onClick={() => handleDownload(note.id, note.fileName, note.fileUrl)}
                        className="px-3 py-1.5 bg-emerald-100 text-emerald-700 text-sm font-medium rounded-lg hover:bg-emerald-200 hover:text-emerald-800 transition-colors flex items-center gap-1.5"
                      >
                        <Download className="w-3.5 h-3.5" />
                        Download
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No notes found for this subject.</p>
              <p className="text-sm text-gray-400 mt-1">Select a subject or upload the first materials!</p>
            </div>
          )}

          {/* Statistics */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">{recentNotes.length}</p>
                <p className="text-sm text-gray-600">Total Notes</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">
                  {recentNotes.reduce((sum, note) => sum + note.downloads, 0)}
                </p>
                <p className="text-sm text-gray-600">Total Downloads</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">
                  {subjects.length}
                </p>
                <p className="text-sm text-gray-600">Total Subjects</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default UploadNotes;