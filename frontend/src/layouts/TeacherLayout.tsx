import { useNavigate } from "react-router-dom";
import { Pencil, LogOut } from "lucide-react";

/* ================= TYPES ================= */

interface TeacherData {
  name: string;
  subject: string;
  grades: string[];
  avatar?: string;
}

interface SidebarProps {
  teacher: TeacherData;
  onEditProfile?: () => void;
}

/* ================= COMPONENT ================= */

const Sidebar = ({ teacher, onEditProfile }: SidebarProps) => {
  const navigate = useNavigate();

  return (
    <aside className="w-72 bg-white border-r min-h-screen p-6 flex flex-col">
      {/* Teacher Info */}
      <div className="flex items-center gap-4 mb-6">
        <img
          src={teacher.avatar}
          alt="Teacher Avatar"
          className="w-14 h-14 rounded-full border"
        />
        <div>
          <h2 className="font-bold text-gray-900">{teacher.name}</h2>
          <p className="text-sm text-gray-600">{teacher.subject}</p>
        </div>
      </div>

      {/* Grades */}
      <div className="mb-6">
        <p className="text-xs uppercase text-gray-500 mb-2">Grades</p>
        <div className="flex flex-wrap gap-2">
          {teacher.grades.length > 0 ? (
            teacher.grades.map((grade) => (
              <span
                key={grade}
                className="px-3 py-1 text-xs bg-indigo-100 text-indigo-600 rounded-full"
              >
                {grade}
              </span>
            ))
          ) : (
            <span className="text-sm text-gray-400">No grades assigned</span>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-2 mt-auto">
        {onEditProfile && (
          <button
            onClick={onEditProfile}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition"
          >
            <Pencil size={16} />
            Edit Profile
          </button>
        )}

        <button
          onClick={() => {
            localStorage.clear();
            navigate("/login");
          }}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition"
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
