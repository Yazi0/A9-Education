import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  FileText,
  ChevronLeft,
  Download,
  Search,
  Filter,
  File,
  FileArchive,
  FileSpreadsheet,
  FileImage,
  Eye,
  Printer,
  Home
} from "lucide-react";
import StudentLayout from "../../layouts/StudentLayout";

const StudyMaterials = () => {
  const { classId } = useParams();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");

  const classData = {
    id: 1,
    name: "Combined Mathematics",
    stream: "Science",
    level: "Advanced Level",
    teacher: "Mr. Perera",
    materials: [
      {
        id: 1,
        title: "Calculus Complete Notes.pdf",
        type: "pdf",
        size: "2.4 MB",
        downloadUrl: "/downloads/calculus.pdf",
        uploadDate: "2024-01-15",
        pages: 45,
        description: "Complete calculus notes covering all chapters"
      },
      {
        id: 2,
        title: "Algebra Formulas and Exercises.doc",
        type: "doc",
        size: "1.8 MB",
        downloadUrl: "/downloads/algebra.doc",
        uploadDate: "2024-01-10",
        pages: 32,
        description: "Algebra formulas with practice exercises"
      },
      {
        id: 3,
        title: "2020-2023 Past Papers.zip",
        type: "zip",
        size: "15 MB",
        downloadUrl: "/downloads/past-papers.zip",
        uploadDate: "2024-01-05",
        pages: 120,
        description: "Complete past papers collection 2020-2023"
      }
    ],
    categories: [
      { id: "all", name: "All Materials", count: 3 },
      { id: "pdf", name: "PDF Documents", count: 1 },
      { id: "doc", name: "Word Documents", count: 1 },
      { id: "zip", name: "Archives", count: 1 }
    ]
  };

  const filteredMaterials = classData.materials.filter(material => {
    const matchesSearch = material.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      material.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === "all" || material.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const handleBack = () => {
    navigate(`/student/my-subjects`);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'pdf': return <FileText className="text-red-600" size={24} />;
      case 'doc': return <File className="text-blue-600" size={24} />;
      case 'excel': return <FileSpreadsheet className="text-green-600" size={24} />;
      case 'zip': return <FileArchive className="text-amber-600" size={24} />;
      case 'image': return <FileImage className="text-purple-600" size={24} />;
      default: return <FileText className="text-gray-600" size={24} />;
    }
  };

  const getFileColor = (type: string) => {
    switch (type) {
      case 'pdf': return 'bg-red-50 border-red-100';
      case 'doc': return 'bg-blue-50 border-blue-100';
      case 'excel': return 'bg-green-50 border-green-100';
      case 'zip': return 'bg-amber-50 border-amber-100';
      case 'image': return 'bg-purple-50 border-purple-100';
      default: return 'bg-gray-50 border-gray-100';
    }
  };

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
              <h1 className="text-3xl font-bold text-gray-900">{classData.name} Materials</h1>
              <p className="text-gray-600 mt-1">Teacher: {classData.teacher} • {classData.level}</p>
            </div>
          </div>
          <div className="mt-4 md:mt-0">
            <div className="text-right">
              <p className="text-sm text-gray-500 font-medium">Resources Available</p>
              <p className="text-2xl font-bold text-red-600">{classData.materials.length}</p>
            </div>
          </div>
        </div>

        {/* Search & Filter */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search materials..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 outline-none transition-all"
              />
            </div>
            <div className="flex items-center gap-3">
              <Filter className="text-gray-400 shrink-0" size={20} />
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 outline-none transition-all"
              >
                {classData.categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name} ({cat.count})</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Materials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {filteredMaterials.map((material) => (
            <div
              key={material.id}
              className={`group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden flex flex-col`}
            >
              <div className="p-6 flex-1">
                <div className="flex items-center gap-4 mb-4">
                  <div className={`p-3 rounded-xl ${getFileColor(material.type)} group-hover:scale-110 transition-transform`}>
                    {getFileIcon(material.type)}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 line-clamp-1">{material.title}</h3>
                    <p className="text-xs text-gray-400 uppercase font-bold">{material.type} • {material.size}</p>
                  </div>
                </div>
                <p className="text-sm text-gray-500 line-clamp-2 mb-6 h-10">
                  {material.description}
                </p>
                <div className="flex items-center justify-between text-xs text-gray-400 font-medium mb-6">
                  <div className="flex items-center gap-1">
                    <FileText size={14} /> {material.pages} Pages
                  </div>
                  <div>Uploaded: {formatDate(material.uploadDate)}</div>
                </div>
              </div>
              <div className="p-4 bg-gray-50 border-t border-gray-100 flex gap-2">
                <button
                  className="flex-1 py-2.5 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-all flex items-center justify-center gap-2"
                >
                  <Download size={18} /> Download
                </button>
                <button
                  className="p-2.5 bg-white border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 transition-all"
                >
                  <Eye size={20} />
                </button>
                <button
                  onClick={() => window.print()}
                  className="p-2.5 bg-white border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 transition-all"
                >
                  <Printer size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Bulk Download Banner */}
        {filteredMaterials.length > 0 && (
          <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-3xl p-6 md:p-8 text-white shadow-xl shadow-red-200 mb-12">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h3 className="text-xl font-bold mb-1">Bundle Download Available</h3>
                <p className="text-red-100 text-sm opacity-90">Get all {filteredMaterials.length} resources in a single compressed archive.</p>
              </div>
              <button className="px-8 py-3 bg-white text-red-600 rounded-xl font-bold hover:bg-red-50 transition-all flex items-center gap-2">
                <Download size={20} /> Download ZIP Archive
              </button>
            </div>
          </div>
        )}

        {/* Empty State */}
        {filteredMaterials.length === 0 && (
          <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-200 mb-12">
            <FileText className="mx-auto text-gray-200 mb-4" size={64} />
            <h3 className="text-xl font-bold text-gray-900">No materials found</h3>
            <p className="text-gray-500">Try adjusting your search or filters to find what you need.</p>
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
              <p className="text-gray-500 text-sm">Empowering students with high-quality study materials across Sri Lanka.</p>
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

export default StudyMaterials;