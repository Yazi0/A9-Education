import React, { useEffect, useState } from 'react';
import { FileText, ChevronRight, Download, Loader2, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';

// API Interface
interface ApiMaterial {
  id: number;
  title: string;
  file: string;
  file_type?: string;
  file_size?: string;
  description?: string;
  created_at?: string;
}

// Existing interface for compatibility
interface StudyMaterial {
  id: number;
  title: string;
  type: string;
  size: string;
  downloadUrl: string;
}

interface StudyMaterialsSectionProps {
  subjectId?: number;
  classId?: number;
  materials?: StudyMaterial[]; // Optional for backward compatibility
  title?: string;
  maxItems?: number;
  showViewAll?: boolean;
}

const StudyMaterialsSection: React.FC<StudyMaterialsSectionProps> = ({
  subjectId,
  classId,
  materials: propMaterials,
  title = "Study Materials",
  maxItems = 2,
  showViewAll = true
}) => {
  const navigate = useNavigate();
  const [apiMaterials, setApiMaterials] = useState<StudyMaterial[]>([]);
  const [loading, setLoading] = useState(!propMaterials);
  const [error, setError] = useState<string | null>(null);

  // Format file size
  const formatFileSize = (bytes?: number): string => {
    if (!bytes) return "Unknown size";
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  // Get file type from extension
  const getFileType = (fileName: string): string => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'pdf': return 'pdf';
      case 'doc':
      case 'docx': return 'word';
      case 'ppt':
      case 'pptx': return 'powerpoint';
      case 'xls':
      case 'xlsx': return 'excel';
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif': return 'image';
      case 'mp4':
      case 'avi':
      case 'mov': return 'video';
      default: return 'file';
    }
  };

  // Fetch materials from API if not provided as prop
  useEffect(() => {
    const fetchMaterials = async () => {
      // If materials are passed as prop, use them
      if (propMaterials) {
        setApiMaterials(propMaterials);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        let endpoint = '';
        
        // Determine which endpoint to use
        if (subjectId) {
          endpoint = `content/subjects/${subjectId}/materials/`;
        } else if (classId) {
          // If you have a classes endpoint for materials
          endpoint = `content/classes/${classId}/materials/`;
        } else {
          throw new Error('Either subjectId or classId is required');
        }
        
        const res = await api.get<ApiMaterial[]>(endpoint);
        
        // Convert API materials to StudyMaterial format
        const studyMaterials: StudyMaterial[] = res.data.map((material: ApiMaterial) => ({
          id: material.id,
          title: material.title,
          type: getFileType(material.file),
          size: material.file_size || formatFileSize(0),
          downloadUrl: material.file
        }));
        
        setApiMaterials(studyMaterials);
      } catch (err: any) {
        console.error("Error fetching materials:", err);
        setError("Failed to load study materials");
        
        // Fallback to mock data
        setApiMaterials(getMockMaterials());
      } finally {
        setLoading(false);
      }
    };

    fetchMaterials();
  }, [subjectId, classId, propMaterials]);

  // Mock data fallback
  const getMockMaterials = (): StudyMaterial[] => [
    {
      id: 1,
      title: "Calculus Complete Notes.pdf",
      type: "pdf",
      size: "2.4 MB",
      downloadUrl: "/downloads/calculus.pdf"
    },
    {
      id: 2,
      title: "Algebra Practice Problems.docx",
      type: "word",
      size: "1.8 MB",
      downloadUrl: "/downloads/algebra.docx"
    },
    {
      id: 3,
      title: "Trigonometry Formulas.xlsx",
      type: "excel",
      size: "0.8 MB",
      downloadUrl: "/downloads/trigonometry.xlsx"
    }
  ];

  const handleViewAllNotes = () => {
    if (classId) {
      navigate(`/student/studymaterials/${classId}`);
    } else if (subjectId) {
      navigate(`/student/studymaterials/subject/${subjectId}`);
    }
  };

  const handleDownloadNotes = (noteUrl: string, title: string) => {
    // Create a temporary anchor element for download
    const link = document.createElement('a');
    link.href = noteUrl;
    link.download = title;
    link.target = '_blank';
    
    // Check if the URL is absolute
    if (noteUrl.startsWith('http')) {
      // Open in new tab for external URLs
      window.open(noteUrl, '_blank', 'noopener,noreferrer');
    } else {
      // Trigger download for relative URLs
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  // Use prop materials if provided, otherwise use API materials
  const displayMaterials = propMaterials || apiMaterials;

  if (loading) {
    return (
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-bold text-gray-900 flex items-center">
            <FileText className="mr-2 text-red-700" size={20} />
            {title}
          </h4>
        </div>
        <div className="flex items-center justify-center py-4">
          <Loader2 className="w-5 h-5 text-red-600 animate-spin mr-2" />
          <span className="text-gray-600 text-sm">Loading materials...</span>
        </div>
      </div>
    );
  }

  if (error && displayMaterials.length === 0) {
    return (
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-bold text-gray-900 flex items-center">
            <FileText className="mr-2 text-red-700" size={20} />
            {title}
          </h4>
        </div>
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (displayMaterials.length === 0) {
    return (
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-bold text-gray-900 flex items-center">
            <FileText className="mr-2 text-red-700" size={20} />
            {title}
          </h4>
        </div>
        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 text-center">
          <p className="text-gray-600 text-sm">No study materials available yet</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-bold text-gray-900 flex items-center">
          <FileText className="mr-2 text-red-700" size={20} />
          {title}
        </h4>
        {showViewAll && displayMaterials.length > maxItems && (
          <button 
            onClick={handleViewAllNotes}
            className="text-sm text-red-700 hover:text-red-800 font-medium flex items-center transition-colors"
          >
            View All ({displayMaterials.length}) <ChevronRight size={16} />
          </button>
        )}
      </div>
      
      {/* Error warning if using fallback data */}
      {error && displayMaterials.length > 0 && (
        <div className="mb-3 p-2 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-3 h-3 text-yellow-600" />
            <p className="text-xs text-yellow-700">{error} (showing demo data)</p>
          </div>
        </div>
      )}
      
      <div className="space-y-2">
        {displayMaterials.slice(0, maxItems).map((note) => (
          <div 
            key={note.id} 
            className="flex items-center justify-between p-3 bg-gray-50 hover:bg-red-50 rounded-lg border border-gray-200 group transition-all hover:border-red-300"
          >
            <div className="flex items-center flex-1 min-w-0">
              <div className="flex-shrink-0 mr-3">
                <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                  <FileText className="text-red-700" size={16} />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 group-hover:text-red-700 truncate">
                  {note.title}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`text-xs px-1.5 py-0.5 rounded ${
                    note.type === 'pdf' ? 'bg-red-100 text-red-700' :
                    note.type === 'word' ? 'bg-blue-100 text-blue-700' :
                    note.type === 'excel' ? 'bg-green-100 text-green-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {note.type.toUpperCase()}
                  </span>
                  <span className="text-xs text-gray-500">
                    {note.size}
                  </span>
                </div>
              </div>
            </div>
            <button 
              onClick={() => handleDownloadNotes(note.downloadUrl, note.title)}
              className="flex-shrink-0 ml-2 p-1.5 text-gray-400 hover:text-red-700 hover:bg-red-100 rounded transition-colors"
              title="Download"
            >
              <Download size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StudyMaterialsSection;