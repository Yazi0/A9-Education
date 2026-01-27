// src/components/teacher/RecentActivity.tsx

const RecentActivity = () => {
  const activities = [
    { id: 1, title: "Uploaded Chemistry Video", time: "2 hours ago" },
    { id: 2, title: "Added Math Course", time: "1 day ago" },
    { id: 3, title: "Shared Physics Notes", time: "2 days ago" },
    { id: 4, title: "Updated Student Grades", time: "3 days ago" },
    { id: 5, title: "Created New Assignment", time: "4 days ago" }
  ];

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Activity</h2>
      <div className="space-y-4">
        {activities.map(activity => (
          <div key={activity.id} className="flex justify-between items-center p-3 hover:bg-gray-50 rounded-lg transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
              <span className="text-gray-700">{activity.title}</span>
            </div>
            <span className="text-sm text-gray-500">{activity.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentActivity;