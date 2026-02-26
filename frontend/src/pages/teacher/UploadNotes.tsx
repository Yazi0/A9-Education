import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, FileText, Clock, Download, Trash2, AlertCircle, File, Loader, Calendar, X, GraduationCap, Check } from "lucide-react";
import api from "../../api/axios";
import TeacherLayout from "../../layouts/TeacherLayout";

const UploadNotes = () => {
  const [allSubjects, setAllSubjects] = useState<any[]>([]);
  const [grades, setGrades] = useState<{ id: number; name: string }[]>([]);
  const [filteredSubjects, setFilteredSubjects] = useState<any[]>([]);

  const [selectedGrade, setSelectedGrade] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [noteTitle, setNoteTitle] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [deletingNote, setDeletingNote] = useState<number | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<number | null>(null);
  const [recentNotes, setRecentNotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Step 1: Fetch teacher subjects
  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const res = await api.get("subjects/my/");
        const subjects = res.data;
        setAllSubjects(subjects);

        // Derive unique grades
        const gradeMap = new Map<number, string>();
        subjects.forEach((s: any) => {
          (s.grades_detail || []).forEach((g: any) => gradeMap.set(g.id, g.name));
        });
        setGrades(Array.from(gradeMap.entries()).map(([id, name]) => ({ id, name })));
      } catch (err) {
        console.error("Error fetching subjects:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSubjects();
  }, []);

  // Step 2: Filter subjects when grade changes
  useEffect(() => {
    if (selectedGrade) {
      const gradeId = parseInt(selectedGrade);
      setFilteredSubjects(allSubjects.filter((s: any) =>
        (s.grades_detail || []).some((g: any) => g.id === gradeId)
      ));
      setSelectedSubject("");
      setRecentNotes([]);
    } else {
      setFilteredSubjects([]);
      setSelectedSubject("");
      setRecentNotes([]);
    }
  }, [selectedGrade, allSubjects]);

  // Step 3: Load notes when subject selected
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
    if (e.target.files?.[0]) setSelectedFile(e.target.files[0]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSubject || !noteTitle || !selectedFile) {
      setErrorMessage("Please select a subject, enter a title, and choose a file to upload.");
      setShowErrorModal(true);
      return;
    }
    setUploading(true);
    const formData = new FormData();
    formData.append("subject", selectedSubject);
    formData.append("title", noteTitle);
    formData.append("file", selectedFile);
    try {
      await api.post("content/materials/create/", formData, { headers: { 'Content-Type': 'multipart/form-data' } });
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
      setShowSuccessModal(true);
    } catch (err) {
      console.error("Error uploading notes:", err);
      setErrorMessage("Failed to upload study notes. Please check the file size and try again.");
      setShowErrorModal(true);
    } finally {
      setUploading(false);
    }
  };

  const handleDownload = (_noteId: number, _fileName: string, fileUrl: string) => {
    if (fileUrl) window.open(fileUrl, "_blank");
  };

  const confirmDelete = async (noteId: number) => {
    setDeletingNote(noteId);
    try {
      await api.delete(`content/materials/${noteId}/delete/`);
      setRecentNotes(prev => prev.filter(note => note.id !== noteId));
      setShowDeleteConfirm(null);
    } catch (err) {
      setErrorMessage("Failed to delete the study notes. Please try again.");
      setShowErrorModal(true);
      setShowDeleteConfirm(null);
    } finally {
      setDeletingNote(null);
    }
  };

  if (loading) {
    return (
      <TeacherLayout>
        <div className="flex items-center justify-center py-32">
          <Loader className="w-12 h-12 animate-spin text-red-600" />
        </div>
      </TeacherLayout>
    );
  }

  return (
    <TeacherLayout>
      <div>
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
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-emerald-50 rounded-full blur-3xl" />
                <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-teal-50 rounded-full blur-3xl" />

                <div className="relative">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", damping: 12, delay: 0.2 }}
                    className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-200"
                  >
                    <Check className="w-10 h-10 text-white" strokeWidth={3} />
                  </motion.div>

                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Upload Successful!</h3>
                  <p className="text-gray-600 mb-8">
                    Your study materials have been uploaded and are now available to your students.
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
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-red-100 rounded-lg"><AlertCircle className="w-6 h-6 text-red-600" /></div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Delete Notes</h3>
                  <p className="text-gray-600 mt-1">Are you sure? This action cannot be undone.</p>
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={() => setShowDeleteConfirm(null)} className="flex-1 py-2.5 px-4 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50">Cancel</button>
                <button onClick={() => confirmDelete(showDeleteConfirm)} className="flex-1 py-2.5 px-4 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 flex items-center justify-center gap-2">
                  <Trash2 className="w-4 h-4" />Delete
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-gradient-to-br from-emerald-500 to-teal-600 text-white rounded-2xl shadow-lg">
              <FileText size={28} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Upload Study Notes</h1>
              <p className="text-gray-500 mt-0.5">Share educational materials with your students</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left: Upload Form */}
          <div className="bg-gray-50 rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-emerald-100 rounded-lg"><Upload className="w-5 h-5 text-emerald-600" /></div>
              <h2 className="text-xl font-bold text-gray-900">Upload New Notes</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* 1. Grade */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1.5">
                  <GraduationCap size={15} className="text-emerald-600" /> Select Grade
                </label>
                <select
                  value={selectedGrade}
                  onChange={e => setSelectedGrade(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 appearance-none bg-white hover:border-emerald-400 transition-colors"
                >
                  <option value="">Choose grade...</option>
                  {grades.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
                </select>
              </div>

              {/* 2. Subject */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Subject <span className="text-red-500">*</span></label>
                <select
                  value={selectedSubject}
                  onChange={e => setSelectedSubject(e.target.value)}
                  className={`w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 appearance-none bg-white transition-colors ${!selectedGrade ? 'opacity-50 cursor-not-allowed' : 'hover:border-emerald-400'}`}
                  disabled={!selectedGrade}
                  required
                >
                  <option value="">{selectedGrade ? "Choose subject..." : "Select grade first"}</option>
                  {filteredSubjects.map((s: any) => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>

              {/* 3. Note Title */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Note Title <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={noteTitle}
                  onChange={e => setNoteTitle(e.target.value)}
                  placeholder="Enter descriptive note title"
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent hover:border-emerald-400 transition-colors"
                  required
                />
              </div>

              {/* 4. File Upload */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Document File <span className="text-red-500">*</span></label>
                {!selectedFile ? (
                  <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer bg-white hover:bg-emerald-50 hover:border-emerald-400 transition-all group">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <File className="w-10 h-10 text-gray-400 mb-3 group-hover:text-emerald-500" />
                      <p className="mb-1 text-sm text-gray-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                      <p className="text-xs text-gray-400">PDF, DOC, DOCX up to 10MB</p>
                    </div>
                    <input type="file" accept=".pdf,.doc,.docx,.txt" className="hidden" onChange={handleFileChange} required />
                  </label>
                ) : (
                  <div className="relative p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
                    <div className="flex items-center gap-3">
                      <FileText className="w-10 h-10 text-emerald-600" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{selectedFile.name}</p>
                        <p className="text-xs text-gray-500">{(selectedFile.size / (1024 * 1024)).toFixed(2)} MB</p>
                      </div>
                      <button type="button" onClick={() => setSelectedFile(null)} className="p-1 hover:bg-emerald-100 rounded-lg">
                        <X className="w-5 h-5 text-gray-500 hover:text-red-500" />
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={uploading || !selectedSubject}
                className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-3.5 rounded-xl font-medium hover:from-emerald-700 hover:to-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 shadow-lg"
              >
                {uploading ? <><Loader className="w-5 h-5 animate-spin" />Uploading...</> : <><Upload className="w-5 h-5" />Upload Notes</>}
              </button>
            </form>
          </div>

          {/* Right: Notes List */}
          <div className="bg-gray-50 rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-blue-100 rounded-lg"><Clock className="w-5 h-5 text-blue-600" /></div>
              <h2 className="text-xl font-bold text-gray-900">Notes in this subject</h2>
            </div>

            {recentNotes.length > 0 ? (
              <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1">
                {recentNotes.map(note => (
                  <div key={note.id} className="group relative flex gap-4 p-4 rounded-xl bg-white border border-gray-200 hover:border-emerald-300 hover:bg-emerald-50 transition-all">
                    <button onClick={() => setShowDeleteConfirm(note.id)} disabled={deletingNote === note.id} className="absolute -top-2 -right-2 z-10 p-1.5 bg-red-100 text-red-600 rounded-full opacity-0 group-hover:opacity-100 hover:bg-red-200 transition-all hover:scale-110">
                      {deletingNote === note.id ? <Loader className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                    </button>
                    <div className="relative flex-shrink-0">
                      <div className="w-12 h-14 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-lg flex items-center justify-center">
                        <FileText className="w-6 h-6 text-emerald-600" />
                      </div>
                      <div className="absolute -bottom-1 -right-1 bg-emerald-600 text-white text-[10px] px-1.5 py-0.5 rounded font-bold">{note.fileType}</div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 truncate group-hover:text-emerald-700">{note.title}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded font-medium">ID: {note.id}</span>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-3 text-xs text-gray-500">
                          <div className="flex items-center gap-1"><Calendar className="w-3 h-3" />{note.uploadDate}</div>
                          <div className="flex items-center gap-1"><Download className="w-3 h-3" />{note.downloads} downloads</div>
                        </div>
                        <button onClick={() => handleDownload(note.id, note.fileName, note.fileUrl)} className="px-3 py-1 bg-emerald-100 text-emerald-700 text-sm font-medium rounded-lg hover:bg-emerald-200 flex items-center gap-1">
                          <Download className="w-3 h-3" />Download
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <FileText className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                <p className="text-gray-500">{selectedSubject ? "No notes uploaded for this subject yet." : "Select a grade and subject to see notes."}</p>
              </div>
            )}

            {/* Stats */}
            <div className="mt-6 pt-5 border-t border-gray-200 grid grid-cols-3 gap-4">
              <div className="text-center"><p className="text-2xl font-bold text-gray-900">{recentNotes.length}</p><p className="text-sm text-gray-500">Total Notes</p></div>
              <div className="text-center"><p className="text-2xl font-bold text-gray-900">{recentNotes.reduce((sum, n) => sum + n.downloads, 0)}</p><p className="text-sm text-gray-500">Downloads</p></div>
              <div className="text-center"><p className="text-2xl font-bold text-gray-900">{grades.length}</p><p className="text-sm text-gray-500">My Grades</p></div>
            </div>
          </div>
        </div>
      </div>
    </TeacherLayout>
  );
};

export default UploadNotes;