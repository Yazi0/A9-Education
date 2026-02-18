import { useNavigate, useLocation } from "react-router-dom";
import {
    User,
    BookOpen,
    BarChart3,
    LayoutDashboard,
    LogOut,
} from "lucide-react";
import { useEffect, useState } from "react";
import api from "../api/axios";

const StudentSidebar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [userData, setUserData] = useState<any>(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await api.get("users/me/");
                setUserData(response.data);
            } catch (error) {
                console.error("Error fetching user for sidebar:", error);
            }
        };
        fetchUser();
    }, []);

    const handleLogout = () => {
        localStorage.clear();
        sessionStorage.clear();
        navigate("/login");
    };

    const sidebarItems = [
        { name: "Dashboard", icon: <LayoutDashboard size={20} />, path: "/studentdashboard" },
        { name: "My Profile", icon: <User size={20} />, path: "/profile" },
        { name: "All Subjects", icon: <BookOpen size={20} />, path: "/subjects" },
        { name: "My Subjects", icon: <BarChart3 size={20} />, path: "/student/my-subjects" },
    ];

    return (
        <div className="w-64 hidden md:flex flex-col fixed left-0 top-0 h-screen bg-white border-r border-gray-200 z-50">
            <div className="p-6 border-b">
                <h2 className="text-xl font-bold text-red-600">Student Panel</h2>
                <p className="text-sm text-gray-500 mt-1">Education Platform</p>
            </div>

            <nav className="flex-1 p-4 space-y-2">
                {sidebarItems.map(item => {
                    const isActive = location.pathname.toLowerCase() === item.path.toLowerCase();
                    return (
                        <button
                            key={item.name}
                            onClick={() => navigate(item.path)}
                            className={`flex items-center gap-3 w-full px-4 py-3 rounded-lg font-medium transition-all duration-200
                ${isActive
                                    ? "bg-red-50 text-red-600"
                                    : "text-gray-700 hover:bg-gray-50 hover:text-red-600"}`}
                        >
                            {item.icon}
                            {item.name}
                        </button>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-gray-200">
                <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center overflow-hidden">
                            <img
                                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${userData?.username || "Guest"}&backgroundColor=b6e3f4`}
                                alt="Avatar"
                            />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-700 truncate">{userData?.name || userData?.username || "Student"}</p>
                            <p className="text-xs text-gray-500">Grade {userData?.current_grade || userData?.grade || "N/A"}</p>
                        </div>
                    </div>
                </div>

                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 text-gray-600 hover:text-red-600 w-full p-2 rounded-lg hover:bg-red-50 transition-colors"
                >
                    <LogOut size={20} />
                    Logout
                </button>
            </div>
        </div>
    );
};

export default StudentSidebar;
