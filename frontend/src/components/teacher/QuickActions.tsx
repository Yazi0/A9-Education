// src/components/teacher/QuickActions.tsx
import { ChevronRight, Video, FileText, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

const QuickActions = () => {
  const navigate = useNavigate();

  const features = [
    {
      id: 1,
      title: "Upload Video",
      description: "Share lecture videos and multimedia content",
      icon: <Video className="w-6 h-6" />,
      path: "/teacher/upload-video",
      color: "bg-gradient-to-br from-purple-500 to-pink-600",
      textColor: "text-purple-600"
    },
    {
      id: 2,
      title: "Upload Notes",
      description: "Upload study materials and resources",
      icon: <FileText className="w-6 h-6" />,
      path: "/teacher/upload-notes",
      color: "bg-gradient-to-br from-emerald-500 to-teal-600",
      textColor: "text-emerald-600"
    },
    {
      id: 3,
      title: "My Students",
      description: "View and manage student progress",
      icon: <Users className="w-6 h-6" />,
      path: "/teacher/students",
      color: "bg-gradient-to-br from-amber-500 to-orange-600",
      textColor: "text-amber-600"
    }
  ];

  return (
    <>
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {features.map(feature => (
          <div
            key={feature.id}
            onClick={() => navigate(feature.path)}
            className="group bg-white rounded-2xl p-6 shadow-lg border border-gray-100
              hover:shadow-xl transition-all cursor-pointer"
          >
            <div className="flex items-start justify-between">
              <div className="flex gap-4">
                <div className={`p-3 ${feature.color} rounded-xl text-white`}>
                  {feature.icon}
                </div>
                <div>
                  <h3 className={`font-bold text-lg ${feature.textColor}`}>{feature.title}</h3>
                  <p className="text-gray-600 text-sm mt-1">{feature.description}</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transition" />
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default QuickActions;