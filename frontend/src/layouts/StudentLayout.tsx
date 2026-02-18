import type { ReactNode } from "react";
import StudentSidebar from "../components/StudentSidebar";

interface StudentLayoutProps {
  children: ReactNode;
}

const StudentLayout = ({ children }: StudentLayoutProps) => {
  return (
    <div className="min-h-screen flex bg-gray-50">
      <StudentSidebar />
      <main className="md:ml-64 flex-1 p-4 md:p-8">
        {children}
      </main>
    </div>
  );
};

export default StudentLayout;
