// StudyMaterials.tsx
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
  Calendar,
  Home,
  MessageSquare,
  ExternalLink,
  Printer
} from "lucide-react";

const StudyMaterials = () => {
  const { classId } = useParams();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");

  // Mock data for study materials
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
      },
      { 
        id: 4, 
        title: "Revision Guide - Complete Syllabus.pdf", 
        type: "pdf", 
        size: "3.2 MB", 
        downloadUrl: "/downloads/revision.pdf",
        uploadDate: "2024-01-03",
        pages: 68,
        description: "Complete syllabus revision guide"
      },
      { 
        id: 5, 
        title: "Model Papers with Answers.xlsx", 
        type: "excel", 
        size: "2.1 MB", 
        downloadUrl: "/downloads/model-papers.xlsx",
        uploadDate: "2024-01-01",
        pages: 24,
        description: "Model papers with detailed answers"
      },
      { 
        id: 6, 
        title: "Quick Reference Guide.pdf", 
        type: "pdf", 
        size: "1.2 MB", 
        downloadUrl: "/downloads/quick-guide.pdf",
        uploadDate: "2023-12-28",
        pages: 18,
        description: "Quick reference for formulas and concepts"
      },
      { 
        id: 7, 
        title: "Trigonometry Diagrams.png", 
        type: "image", 
        size: "0.8 MB", 
        downloadUrl: "/downloads/trig-diagrams.png",
        uploadDate: "2023-12-25",
        pages: 1,
        description: "Important trigonometry diagrams"
      },
      { 
        id: 8, 
        title: "Statistics Problems Collection.pdf", 
        type: "pdf", 
        size: "2.9 MB", 
        downloadUrl: "/downloads/statistics.pdf",
        uploadDate: "2023-12-20",
        pages: 42,
        description: "Collection of statistical problems"
      }
    ],
    categories: [
      { id: "all", name: "All Materials", count: 8 },
      { id: "pdf", name: "PDF Documents", count: 4 },
      { id: "doc", name: "Word Documents", count: 1 },
      { id: "excel", name: "Spreadsheets", count: 1 },
      { id: "zip", name: "Archives", count: 1 },
      { id: "image", name: "Images", count: 1 }
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

  const handleDownload = (downloadUrl: string, title: string) => {
    // Simulate download
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = title;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePreview = (material: any) => {
    // In real app, this would open a PDF viewer
    window.open(material.downloadUrl, '_blank');
  };

  const getFileIcon = (type: string) => {
    switch(type) {
      case 'pdf': return <FileText className="text-red-600" size={24} />;
      case 'doc': return <File className="text-blue-600" size={24} />;
      case 'excel': return <FileSpreadsheet className="text-green-600" size={24} />;
      case 'zip': return <FileArchive className="text-amber-600" size={24} />;
      case 'image': return <FileImage className="text-purple-600" size={24} />;
      default: return <FileText className="text-gray-600" size={24} />;
    }
  };

  const getFileColor = (type: string) => {
    switch(type) {
      case 'pdf': return 'bg-red-50 border-red-200';
      case 'doc': return 'bg-blue-50 border-blue-200';
      case 'excel': return 'bg-green-50 border-green-200';
      case 'zip': return 'bg-amber-50 border-amber-200';
      case 'image': return 'bg-purple-50 border-purple-200';
      default: return 'bg-gray-50 border-gray-200';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6 flex flex-col">
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
              <h1 className="text-3xl font-bold text-gray-900">{classData.name} Study Materials</h1>
              <p className="text-gray-600 mt-2">Teacher: {classData.teacher} • {classData.level}</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm text-gray-500">Total Materials</p>
              <p className="text-2xl font-bold text-red-700">{classData.materials.length}</p>
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
                placeholder="Search study materials..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Filter className="inline mr-2" size={16} />
                File Type
              </label>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
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
                <option>File Size</option>
                <option>Alphabetical</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Materials Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {filteredMaterials.map((material) => (
          <div
            key={material.id}
            className={`bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all border ${getFileColor(material.type)}`}
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  <div className={`p-3 rounded-xl ${getFileColor(material.type)} mr-4`}>
                    {getFileIcon(material.type)}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 line-clamp-2">{material.title}</h3>
                    <p className="text-sm text-gray-500 mt-1">.{material.type.toUpperCase()}</p>
                  </div>
                </div>
              </div>

              <p className="text-gray-600 text-sm mb-4 line-clamp-2">{material.description}</p>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-xs text-gray-500 mb-1">File Size</p>
                  <p className="font-semibold text-gray-900">{material.size}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Upload Date</p>
                  <p className="font-semibold text-gray-900">{formatDate(material.uploadDate)}</p>
                </div>
              </div>

              {material.pages && (
                <div className="mb-4 flex items-center text-sm text-gray-600">
                  <FileText className="mr-2" size={16} />
                  <span>{material.pages} pages</span>
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => handleDownload(material.downloadUrl, material.title)}
                  className="flex-1 py-2.5 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-lg font-semibold flex items-center justify-center"
                >
                  <Download className="mr-2" size={18} />
                  Download
                </button>
                
                <button
                  onClick={() => handlePreview(material)}
                  className="px-4 py-2.5 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg font-medium flex items-center"
                  title="Preview"
                >
                  <Eye size={18} />
                </button>
                
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2.5 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg font-medium flex items-center"
                  title="Print"
                >
                  <Printer size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredMaterials.length === 0 && (
        <div className="text-center py-12">
          <div className="inline-block p-4 bg-gradient-to-r from-red-100 to-red-200 rounded-full mb-4">
            <FileText className="text-red-700" size={48} />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No study materials found</h3>
          <p className="text-gray-600">Try adjusting your search filters</p>
        </div>
      )}

      {/* Bulk Download Section */}
      {filteredMaterials.length > 0 && (
        <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-2xl shadow-lg p-6 text-white mb-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-4 md:mb-0">
              <h3 className="text-xl font-bold mb-2">Download All Materials</h3>
              <p className="text-red-100 opacity-90">
                Get all {filteredMaterials.length} study materials in one ZIP file
              </p>
            </div>
            <button className="px-6 py-3 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-xl font-bold transition-colors flex items-center">
              <Download className="mr-2" size={20} />
              Download All ({filteredMaterials.length} files)
            </button>
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
                <p className="text-gray-700">Study Materials Portal • {classData.name}</p>
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

export default StudyMaterials;