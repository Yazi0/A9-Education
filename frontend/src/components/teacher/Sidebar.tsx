// src/components/teacher/Sidebar.tsx
import { LogOut, LayoutDashboard, Video, FileText, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface SidebarProps {
  onLogout: () => void;
}

const Sidebar = ({ onLogout }: SidebarProps) => {
  const navigate = useNavigate();

  const sidebarItems = [
    { name: "Dashboard", icon: <LayoutDashboard className="w-5 h-5" />, path: "/teacherdashboard" },
    { name: "Upload Video", icon: <Video className="w-5 h-5" />, path: "/teacher/upload-video" },
    { name: "Upload Notes", icon: <FileText className="w-5 h-5" />, path: "/teacher/upload-notes" },
    { name: "My Students", icon: <Users className="w-5 h-5" />, path: "/teacher/students" }
  ];

  return (
    <aside className="w-64 fixed left-0 top-0 h-screen bg-white border-r border-gray-200">
      <div className="p-6 border-b">
        <h2 className="text-xl font-bold text-indigo-600">Teacher Panel</h2>
        <p className="text-sm text-gray-500">Learning Platform</p>
      </div>

      <nav className="p-4 space-y-2">
        {sidebarItems.map(item => (
          <button
            key={item.name}
            onClick={() => navigate(item.path)}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-lg font-medium
              text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition"
          >
            {item.icon}
            {item.name}
          </button>
        ))}
      </nav>

      <div className="absolute bottom-0 w-full p-4 border-t">
        <button
          onClick={onLogout}
          className="flex items-center gap-3 text-gray-600 hover:text-red-600 w-full"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;