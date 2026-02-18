import { useNavigate, useLocation } from "react-router-dom";
import {
    User,
    BookOpen,
    BarChart3,
    LayoutDashboard,
    LogOut,
    X,
} from "lucide-react";
import { useEffect, useState } from "react";
import api from "../api/axios";

interface SidebarProps {
    isOpen?: boolean;
    onClose?: () => void;
}

const StudentSidebar = ({ isOpen, onClose }: SidebarProps) => {
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

    const handleNavigation = (path: string) => {
        navigate(path);
        if (onClose) onClose();
    };

    const sidebarItems = [
        { name: "Dashboard", icon: <LayoutDashboard size={20} />, path: "/studentdashboard" },
        { name: "My Profile", icon: <User size={20} />, path: "/profile" },
        { name: "All Subjects", icon: <BookOpen size={20} />, path: "/subjects" },
        { name: "My Subjects", icon: <BarChart3 size={20} />, path: "/student/my-subjects" },
    ];

    return (
        <>
            {/* Backdrop for Mobile */}
            <div
                className={`fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity duration-300 ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
                onClick={onClose}
            />

            <div className={`
                w-64 flex flex-col fixed left-0 top-0 h-screen bg-white border-r border-gray-200 z-50 transition-transform duration-300 ease-in-out
                ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
            `}>
                <div className="p-6 border-b flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center p-1.5 shadow-sm border border-gray-100 overflow-hidden shrink-0">
                            <img src="/icon.png" className="w-full h-full object-contain" alt="Logo" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-red-600 leading-tight">Student Panel</h2>
                            <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest mt-0.5">Education</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="md:hidden p-2 text-gray-500 hover:bg-gray-100 rounded-lg">
                        <X size={20} />
                    </button>
                </div>

                <nav className="flex-1 p-4 space-y-2 overflow-y-auto no-scrollbar">
                    {sidebarItems.map(item => {
                        const isActive = location.pathname.toLowerCase() === item.path.toLowerCase();
                        return (
                            <button
                                key={item.name}
                                onClick={() => handleNavigation(item.path)}
                                className={`flex items-center gap-3 w-full px-4 py-3 rounded-lg font-medium transition-all duration-200
                    ${isActive
                                        ? "bg-red-50 text-red-600 shadow-sm"
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
                            <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center overflow-hidden border border-red-200">
                                <img
                                    src={userData?.profile_image ? (userData.profile_image.startsWith('http') ? userData.profile_image : `http://localhost:8000${userData.profile_image}`) : `https://api.dicebear.com/7.x/avataaars/svg?seed=${userData?.username || "Guest"}&backgroundColor=b6e3f4`}
                                    alt="Avatar"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-bold text-gray-800 truncate">{userData?.name || userData?.username || "Student"}</p>
                                <p className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">Level {userData?.current_grade || userData?.grade || "N/A"}</p>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 text-gray-600 hover:text-red-600 w-full p-2.5 rounded-lg hover:bg-red-50 transition-colors font-semibold text-sm"
                    >
                        <LogOut size={18} />
                        Logout
                    </button>
                </div>
            </div>
        </>
    );
};

export default StudentSidebar;
