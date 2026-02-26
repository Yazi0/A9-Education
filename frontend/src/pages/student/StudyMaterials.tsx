import { useEffect, useState } from "react";
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
  Home,
  Loader2,
  AlertCircle
} from "lucide-react";
import StudentLayout from "../../layouts/StudentLayout";
import api from "../../api/axios";

// API Interface
interface ApiMaterial {
  id: number;
  title: string;
  file: string;
  created_at: string;
}

interface Material {
  id: number;
  title: string;
  type: string;
  size: string;
  downloadUrl: string;
  uploadDate: string;
  pages: number | string;
  description: string;
}

const StudyMaterials = () => {
  const { classId } = useParams<{ classId: string }>();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [classData, setClassData] = useState<{
    id: number;
    name: string;
    stream: string;
    level: string;
    teacher: string;
    materials: Material[];
    categories: { id: string; name: string; count: number }[];
  } | null>(null);

  const handleBack = () => {
    navigate(-1);
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!classId) return;
      try {
        setLoading(true);
        setError(null);

        const [subjectRes, materialsRes] = await Promise.all([
          api.get(`subjects/${classId}/`),
          api.get<ApiMaterial[]>(`content/subjects/${classId}/materials/`)
        ]);

        const s = subjectRes.data;
        const apiMaterials = materialsRes.data;

        const materials: Material[] = apiMaterials.map(m => {
          const extension = m.file.split('.').pop()?.toLowerCase() || 'pdf';
          return {
            id: m.id,
            title: m.title,
            type: extension,
            size: "TBA",
            downloadUrl: m.file,
            uploadDate: m.created_at,
            pages: "TBA",
            description: `Study notes for ${s.name}`
          };
        });

        const typeCounts: Record<string, number> = {};
        materials.forEach(m => {
          typeCounts[m.type] = (typeCounts[m.type] || 0) + 1;
        });

        const categories = [
          { id: "all", name: "All Materials", count: materials.length },
          ...Object.entries(typeCounts).map(([id, count]) => ({
            id,
            name: id.toUpperCase() + " Files",
            count
          }))
        ];

        setClassData({
          id: s.id,
          name: s.name,
          stream: s.stream,
          level: s.level || "Advanced Level",
          teacher: s.teacher_name || "TBA",
          materials,
          categories
        });

      } catch (err: any) {
        console.error("Error fetching materials:", err);
        setError("Failed to load materials. Please ensure you have paid for this month.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [classId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <Loader2 className="w-12 h-12 text-red-600 animate-spin mb-4" />
        <p className="text-gray-600 text-lg">Loading study materials...</p>
      </div>
    );
  }

  if (error || !classData) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md text-center border border-red-100">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">Unable to Load Materials</h3>
          <p className="text-gray-600 mb-4">{error || "Subject not found."}</p>
          <button
            onClick={() => handleBack()}
            className="w-full px-6 py-3 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700 transition-all"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const filteredMaterials = classData.materials.filter(material => {
    const matchesSearch = material.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      material.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === "all" || material.type === typeFilter;
    return matchesSearch && matchesType;
  });

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
                <a
                  href={material.downloadUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-2.5 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-all flex items-center justify-center gap-2"
                >
                  <Download size={18} /> Download
                </a>
                <button
                  onClick={() => window.open(material.downloadUrl, '_blank')}
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