// src/components/teacher/TeacherInfo.tsx
import { useState } from "react";
import { BookOpen, Edit3, Save, X, Loader2 } from "lucide-react";
import api from "../../api/axios";

interface TeacherData {
  name: string;
  subject: string;
  grades: string[];
  educational_qualifications?: string;
  about?: string;
  class_fee?: string;
}

interface TeacherInfoProps {
  teacher: TeacherData;
  onUpdate: (updatedData: Partial<TeacherData>) => Promise<void>;
}

const TeacherInfo = ({ teacher, onUpdate }: TeacherInfoProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editedData, setEditedData] = useState<TeacherData>({ ...teacher });
  const [tempGrades, setTempGrades] = useState<string>(teacher.grades.join(", "));

  const handleEditClick = () => {
    setIsEditing(true);
    setEditedData({ ...teacher });
    setTempGrades(teacher.grades.join(", "));
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedData({ ...teacher });
    setTempGrades(teacher.grades.join(", "));
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      
      // Parse grades from comma-separated string
      const updatedData = {
        ...editedData,
        grades: tempGrades.split(",").map(g => g.trim()).filter(g => g)
      };
      
      await onUpdate(updatedData);
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating teacher info:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleInputChange = (field: keyof TeacherData, value: string) => {
    setEditedData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 mb-8">
      {/* Header with Edit Button */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Teacher Information</h2>

        {!isEditing ? (
          <button
            onClick={handleEditClick}
            className="inline-flex items-center gap-2
              px-4 py-2 text-sm font-medium
              text-indigo-600 bg-indigo-50 rounded-lg
              hover:bg-indigo-100 transition"
          >
            <Edit3 className="w-4 h-4" />
            Edit Profile
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={handleCancel}
              className="inline-flex items-center gap-2
                px-4 py-2 text-sm font-medium
                text-gray-600 bg-gray-100 rounded-lg
                hover:bg-gray-200 transition"
              disabled={isSaving}
            >
              <X className="w-4 h-4" />
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="inline-flex items-center gap-2
                px-4 py-2 text-sm font-medium
                text-white bg-indigo-600 rounded-lg
                hover:bg-indigo-700 transition"
              disabled={isSaving}
            >
              {isSaving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              {isSaving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        )}
      </div>

      {/* Info Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-gray-500 text-sm mb-1">Teacher Name</label>
          {isEditing ? (
            <input
              type="text"
              value={editedData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              disabled={isSaving}
            />
          ) : (
            <p className="text-lg font-semibold text-gray-900 mt-1">
              {teacher.name}
            </p>
          )}
        </div>

        <div>
          <label className="block text-gray-500 text-sm mb-1">Subject</label>
          {isEditing ? (
            <input
              type="text"
              value={editedData.subject}
              onChange={(e) => handleInputChange("subject", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              disabled={isSaving}
            />
          ) : (
            <div className="flex items-center gap-2 mt-1">
              <BookOpen className="w-5 h-5 text-indigo-600" />
              <span className="text-lg font-semibold text-gray-900">
                {teacher.subject}
              </span>
            </div>
          )}
        </div>

        <div>
          <label className="block text-gray-500 text-sm mb-1">Grades</label>
          {isEditing ? (
            <input
              type="text"
              value={tempGrades}
              onChange={(e) => setTempGrades(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="Grade 8, Grade 9, Grade 10"
              disabled={isSaving}
            />
          ) : (
            <div className="flex flex-wrap gap-2 mt-2">
              {teacher.grades.map(grade => (
                <span
                  key={grade}
                  className="px-3 py-1 text-sm rounded-full
                    bg-indigo-100 text-indigo-700 font-medium"
                >
                  {grade}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Additional Fields (Visible in edit mode or if they have content) */}
      {(isEditing || teacher.about || teacher.educational_qualifications || teacher.class_fee) && (
        <div className="mt-6 pt-6 border-t border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-6">
          {isEditing ? (
            <>
              <div>
                <label className="block text-gray-500 text-sm mb-1">Educational Qualifications</label>
                <textarea
                  value={editedData.educational_qualifications || ""}
                  onChange={(e) => handleInputChange("educational_qualifications", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent h-32 resize-none"
                  placeholder="Enter your qualifications"
                  disabled={isSaving}
                />
              </div>
              <div>
                <label className="block text-gray-500 text-sm mb-1">About</label>
                <textarea
                  value={editedData.about || ""}
                  onChange={(e) => handleInputChange("about", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent h-32 resize-none"
                  placeholder="Tell students about yourself"
                  disabled={isSaving}
                />
              </div>
              <div>
                <label className="block text-gray-500 text-sm mb-1">Class Fee</label>
                <input
                  type="text"
                  value={editedData.class_fee || ""}
                  onChange={(e) => handleInputChange("class_fee", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="e.g., $50/hour"
                  disabled={isSaving}
                />
              </div>
            </>
          ) : (
            <>
              {teacher.educational_qualifications && (
                <div>
                  <p className="text-gray-500 text-sm mb-2">Qualifications</p>
                  <p className="text-gray-700">{teacher.educational_qualifications}</p>
                </div>
              )}
              {teacher.about && (
                <div>
                  <p className="text-gray-500 text-sm mb-2">About</p>
                  <p className="text-gray-700">{teacher.about}</p>
                </div>
              )}
              {teacher.class_fee && (
                <div>
                  <p className="text-gray-500 text-sm mb-2">Class Fee</p>
                  <p className="text-lg font-semibold text-gray-900">{teacher.class_fee}</p>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default TeacherInfo;