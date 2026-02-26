import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FileText,
  ChevronLeft,
  Download,
  Search,
  Filter,
  File,
  Eye,
  Home,
  Loader2,
  AlertCircle,
  BookOpen
} from "lucide-react";
import StudentLayout from "../../layouts/StudentLayout";
import api from "../../api/axios";

// API Interface
interface ApiMaterial {
  id: number;
  title: string;
  file: string;
  created_at: string;
  subject_name?: string;
}

interface Material {
  id: number;
  title: string;
  subjectName: string;
  type: string;
  size: string;
  downloadUrl: string;
  uploadDate: string;
  description: string;
}

const AllMaterials = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [categories, setCategories] = useState<{ id: string; name: string; count: number }[]>([]);

  const handleBack = () => {
    navigate(-1);
  };

  useEffect(() => {
    const fetchAllMaterials = async () => {
      try {
        setLoading(true);
        setError(null);

        // 1. Get enrolled subjects
        const enrollmentsRes = await api.get("enrollments/my/");
        if (!Array.isArray(enrollmentsRes.data)) {
          setMaterials([]);
          setLoading(false);
          return;
        }
        const enrolledSubjects = enrollmentsRes.data.filter((e: any) => e.status === 'enrolled');

        if (enrolledSubjects.length === 0) {
          setMaterials([]);
          setLoading(false);
          return;
        }

        // 2. Fetch materials for each subject
        const materialsPromises = enrolledSubjects.map(async (e: any) => {
          const subjectId = e.subject || e.subject_id;
          const [materialsRes, subjectRes] = await Promise.all([
            api.get<ApiMaterial[]>(`content/subjects/${subjectId}/materials/`),
            api.get(`subjects/${subjectId}/`)
          ]);
          
          return materialsRes.data.map(m => ({
            ...m,
            subject_name: subjectRes.data.name
          }));
        });

        const allMaterialsNested = await Promise.all(materialsPromises);
        const flattenedMaterials: Material[] = allMaterialsNested.flat().map((m: any) => {
          const extension = m.file.split('.').pop()?.toLowerCase() || 'pdf';
          return {
            id: m.id,
            title: m.title,
            subjectName: m.subject_name || "Unknown Subject",
            type: extension,
            size: "TBA",
            downloadUrl: m.file,
            uploadDate: m.created_at,
            description: `Study materials for ${m.subject_name}`
          };
        });

        setMaterials(flattenedMaterials);

        // Calculate categories
        const typeCounts: Record<string, number> = {};
        flattenedMaterials.forEach(m => {
          typeCounts[m.type] = (typeCounts[m.type] || 0) + 1;
        });

        const cats = [
          { id: "all", name: "All Materials", count: flattenedMaterials.length },
          ...Object.entries(typeCounts).map(([id, count]) => ({
            id,
            name: id.toUpperCase() + " Files",
            count
          }))
        ];
        setCategories(cats);

      } catch (err: any) {
        console.error("Error fetching all materials:", err);
        setError("Failed to load materials. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchAllMaterials();
  }, []);

  const getFileIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'pdf': return <FileText size={24} className="text-red-500" />;
      case 'doc':
      case 'docx': return <File size={24} className="text-blue-500" />;
      default: return <File size={24} className="text-gray-500" />;
    }
  };

  const getFileColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'pdf': return 'bg-red-50';
      case 'doc':
      case 'docx': return 'bg-blue-50';
      default: return 'bg-gray-50';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const filteredMaterials = materials.filter(material => {
    const matchesSearch = material.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      material.subjectName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === "all" || material.type === typeFilter;
    return matchesSearch && matchesType;
  });

  if (loading) {
    return (
      <StudentLayout>
        <div className="min-h-screen flex flex-col items-center justify-center p-4">
          <Loader2 className="w-12 h-12 text-red-600 animate-spin mb-4" />
          <p className="text-gray-600 text-lg">Loading all study materials...</p>
        </div>
      </StudentLayout>
    );
  }

  return (
    <StudentLayout>
      <div className="max-w-6xl mx-auto flex-1 w-full">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/studentdashboard")}
              className="p-2 bg-white rounded-xl shadow-sm hover:bg-gray-50 transition-all border border-gray-100"
            >
              <ChevronLeft size={24} className="text-gray-600" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">All Study Materials</h1>
              <p className="text-gray-600 mt-1">Access resources from all your enrolled subjects</p>
            </div>
          </div>
          <div className="mt-4 md:mt-0">
            <div className="text-right">
              <p className="text-sm text-gray-500 font-medium">Total Resources</p>
              <p className="text-2xl font-bold text-red-600">{materials.length}</p>
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
                placeholder="Search by title or subject..."
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
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name} ({cat.count})</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Materials Grid */}
        {error ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-red-100 mb-12">
            <AlertCircle className="mx-auto text-red-500 mb-4" size={64} />
            <h3 className="text-xl font-bold text-gray-900 mb-2">Error Loading Materials</h3>
            <p className="text-gray-600">{error}</p>
          </div>
        ) : filteredMaterials.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {filteredMaterials.map((material) => (
              <div
                key={material.id}
                className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden flex flex-col"
              >
                <div className="p-6 flex-1">
                  <div className="flex items-center gap-4 mb-4">
                    <div className={`p-3 rounded-xl ${getFileColor(material.type)} group-hover:scale-110 transition-transform`}>
                      {getFileIcon(material.type)}
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-bold text-gray-900 truncate">{material.title}</h3>
                      <p className="text-xs text-red-600 font-black uppercase tracking-wider">{material.subjectName}</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 line-clamp-2 mb-6 h-10">
                    {material.description}
                  </p>
                  <div className="flex items-center justify-between text-xs text-gray-400 font-medium">
                    <div className="flex items-center gap-1 uppercase">
                      <FileText size={14} /> {material.type}
                    </div>
                    <div>{formatDate(material.uploadDate)}</div>
                  </div>
                </div>
                <div className="p-4 bg-gray-50 border-t border-gray-100">
                  <a
                    href={material.downloadUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-all flex items-center justify-center gap-2"
                  >
                    <Download size={18} /> Download Resource
                  </a>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-200 mb-12">
            <FileText className="mx-auto text-gray-200 mb-4" size={64} />
            <h3 className="text-xl font-bold text-gray-900">No materials found</h3>
            <p className="text-gray-500">
              {searchTerm || typeFilter !== 'all' 
                ? "Try adjusting your search or filters." 
                : "You haven't enrolled in any subjects with materials yet."}
            </p>
          </div>
        )}

        {/* Footer */}
        <footer className="mt-auto border-t border-gray-200 py-12">
          <div className="bg-red-50 rounded-3xl p-8 border border-red-100 flex flex-col md:flex-row justify-between items-center text-center md:text-left gap-6">
            <div>
              <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
                <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center shadow-lg">
                  <BookOpen className="text-white" size={20} />
                </div>
                <h2 className="text-xl font-bold text-gray-900">A9 Learning Library</h2>
              </div>
              <p className="text-gray-500 text-sm">Find everything you need to excel in your studies.</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-bold text-gray-900">© 2024 A9 Education</p>
              <p className="text-xs text-gray-500">Curated Learning Materials</p>
            </div>
          </div>
        </footer>
      </div>
    </StudentLayout>
  );
};

export default AllMaterials;
