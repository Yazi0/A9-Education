import { useNavigate } from "react-router-dom";
import type { ReactNode } from "react";

interface StudentLayoutProps {
  children: ReactNode;
}

const StudentLayout = ({ children }: StudentLayoutProps) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1
              className="text-xl font-bold text-indigo-600 cursor-pointer"
              onClick={() => navigate("/studentdashboard")}
            >
              Student Portal
            </h1>

            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate("/profile")}
                className="text-gray-700 hover:text-indigo-600"
              >
                Profile
              </button>

              <button
                onClick={() => navigate("/subjects")}
                className="text-gray-700 hover:text-indigo-600"
              >
                Subjects
              </button>

              <button
                onClick={() => {
                  localStorage.removeItem("token");
                  navigate("/login");
                }}
                className="px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
};

export default StudentLayout;
