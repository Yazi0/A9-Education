// src/components/teacher/Header.tsx
import { GraduationCap, Sparkles } from "lucide-react";

interface HeaderProps {
  teacherName: string;
  subject?: string;
}

const Header = ({ teacherName, subject }: HeaderProps) => {
  return (
    <div className="mb-8">
      <div className="flex items-center gap-4">
        <div className="p-3 bg-white rounded-xl shadow-sm">
          <GraduationCap className="w-9 h-9 text-indigo-600" />
        </div>

        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
            {subject || "Teacher"} Dashboard
          </h1>
          <p className="text-gray-600 flex items-center gap-2 mt-1">
            <Sparkles className="w-4 h-4 text-amber-500" />
            Welcome back, {teacherName}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Header;