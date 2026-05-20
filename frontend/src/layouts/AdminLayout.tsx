import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { 
  Users, BookOpen, CreditCard, LayoutDashboard, 
  LogOut, Menu, X, ShieldCheck, GraduationCap, FileText
} from "lucide-react";

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    navigate('/A9-admin');
  };

  const navItems = [
    { name: 'Overview', path: '/A9-admin/dashboard', icon: LayoutDashboard },
    { name: 'Users', path: '/A9-admin/users', icon: Users },
    { name: 'Applications', path: '/A9-admin/applications', icon: FileText },
    { name: 'Subjects', path: '/A9-admin/subjects', icon: BookOpen },
    { name: 'Enrollments', path: '/A9-admin/enrollments', icon: GraduationCap },
    { name: 'Payments', path: '/A9-admin/payments', icon: CreditCard },
  ];


  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar Mobile Toggle */}
      <button 
        className="lg:hidden fixed bottom-6 right-6 z-50 bg-red-600 text-white p-4 rounded-full shadow-lg"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        {sidebarOpen ? <X /> : <Menu />}
      </button>

      {/* Sidebar */}
      <aside className={`
        fixed lg:relative z-40 h-full w-64 bg-red-900 text-white transition-transform duration-300
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex flex-col h-full">
          <div className="p-6 flex items-center gap-3 border-b border-red-800">
            <ShieldCheck className="text-red-400" size={32} />
            <span className="font-bold text-xl tracking-tight">A9 Admin</span>
          </div>

          <nav className="flex-1 p-4 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-xl transition-all
                    ${isActive ? 'bg-white text-red-900 shadow-lg' : 'hover:bg-red-800'}
                  `}
                >
                  <Icon size={20} />
                  <span className="font-medium">{item.name}</span>
                </Link>
              );
            })}
          </nav>

          <div className="p-4 border-t border-red-800">
            <button 
              onClick={handleLogout}
              className="flex items-center gap-3 w-full px-4 py-3 rounded-xl hover:bg-red-800 transition-colors"
            >
              <LogOut size={20} />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b px-8 py-4 flex justify-between items-center shrink-0">
          <h2 className="text-xl font-bold text-gray-800">
            {navItems.find(i => i.path === location.pathname)?.name || 'Dashboard'}
          </h2>
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-gray-600">Administrator</span>
            <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-700 font-bold">
              A9
            </div>
          </div>
        </header>

        {/* Dynamic Content */}
        <div className="flex-1 overflow-y-auto p-8">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
