import { useState, type ReactNode } from "react";
import StudentSidebar from "../components/StudentSidebar";
import { Menu } from "lucide-react";

interface StudentLayoutProps {
  children: ReactNode;
}

const StudentLayout = ({ children }: StudentLayoutProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 z-40">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center p-1 shadow-sm border border-gray-100 overflow-hidden">
            <img src="/icon.png" className="w-full h-full object-contain" alt="Logo" />
          </div>
          <span className="font-bold text-gray-800">Student Panel</span>
        </div>
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <Menu size={24} />
        </button>
      </div>

      {/* Sidebar */}
      <StudentSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Main Content */}
      <main className="flex-1 md:ml-64 p-4 md:p-8 mt-16 md:mt-0 min-h-screen">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

export default StudentLayout;
