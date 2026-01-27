import { useEffect, useState } from "react";
import type { Subject } from "../../components/models/Subject";
import MySubjectsHeader from "../../components/common/MySubjectsHeader";
import StreamFilter from "../../components/common/StreamFilter";
import EnrolledSubjectCard from "../../components/common/EnrolledSubjectCard";
import PendingSubjectCard from "../../components/common/PendingSubjectCard";
import EmptyState from "../../components/common/EmptyState";
import Footer from "../../components/common/Footer";

// Import your API instance
import api from "../../api/axios"; // Adjust the path as needed

interface ApiSubject {
  id: number;
  name: string;
  description: string;
  price: number;
  stream: string;
  // Add other fields based on your API response
}

interface Enrollment {
  id: number;
  subject: ApiSubject;
  status: 'enrolled' | 'pending' | 'payment_pending';
  progress?: number;
  payment_due?: string;
  exam_date?: string;
  // Add other enrollment fields
}

const MySubjects = () => {
  const [activeTab] = useState("enrolled");
  const [streamFilter, setStreamFilter] = useState("all");
  const [enrolledSubjects, setEnrolledSubjects] = useState<Subject[]>([]);
  const [pendingSubjects, setPendingSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch subjects from API
  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const res = await api.get("enrollments/my/");
        const enrollments: Enrollment[] = res.data;

        // Separate enrolled and pending subjects
        const enrolled: Subject[] = [];
        const pending: Subject[] = [];

        enrollments.forEach((enrollment: Enrollment) => {
          const subjectData = enrollment.subject;
          const baseSubject: Partial<Subject> = {
            id: subjectData.id,
            name: subjectData.name,
            stream: subjectData.stream || "General",
            level: "Advanced Level", // You might want to get this from API
            teacher: "TBD", // You might want to get this from API
            progress: enrollment.progress || 0,
            nextClass: "TBD", // You might want to get this from API
            assignments: { pending: 0, completed: 0 }, // You might want to get this from API
            materials: 0, // You might want to get this from API
            latestGrade: "N/A", // You might want to get this from API
            lastAccessed: "Never", // You might want to get this from API
            clsDate: "TBD", // You might want to get this from API
            studentCount: 0, // You might want to get this from API
            lastVideoWatched: {
              id: 0,
              title: "No videos watched yet",
              url: "",
              duration: "0 min",
              progress: 0,
              timestamp: "00:00"
            },
            teacherUploads: {
              videoLinks: [],
              notes: []
            }
          };

          if (enrollment.status === 'enrolled') {
            enrolled.push({
              ...baseSubject,
              // Add mock data or fetch from separate API endpoints
              teacher: "Mr. Perera",
              progress: enrollment.progress || 75,
              nextClass: "Tomorrow, 10:00 AM",
              assignments: { pending: 2, completed: 8 },
              materials: 15,
              latestGrade: "A",
              lastAccessed: "2 hours ago",
              clsDate: "Sat 8.00 am",
              studentCount: 24,
              lastVideoWatched: {
                id: 1,
                title: `${subjectData.name} - Lesson 1`,
                url: "https://www.youtube.com/watch?v=9Qa0J4KuGqA",
                duration: "45 min",
                progress: 65,
                timestamp: "23:45"
              },
              teacherUploads: {
                videoLinks: [
                  { 
                    id: 1, 
                    title: `${subjectData.name} - Lesson 1`, 
                    url: "https://www.youtube.com/watch?v=9Qa0J4KuGqA", 
                    duration: "45 min",
                    thumbnail: "https://img.youtube.com/vi/9Qa0J4KuGqA/maxresdefault.jpg",
                    description: `Introduction to ${subjectData.name}`
                  }
                ],
                notes: [
                  { 
                    id: 1, 
                    title: `${subjectData.name} Complete Notes.pdf`, 
                    type: "pdf", 
                    size: "2.4 MB", 
                    downloadUrl: `/downloads/${subjectData.name.toLowerCase()}.pdf` 
                  }
                ]
              }
            } as Subject);
          } else if (enrollment.status === 'pending' || enrollment.status === 'payment_pending') {
            pending.push({
              ...baseSubject,
              price: subjectData.price,
              status: enrollment.status,
              paymentDue: enrollment.payment_due || "Jan 20, 2024",
              examDate: enrollment.exam_date || "Aug 2024"
            } as Subject);
          }
        });

        setEnrolledSubjects(enrolled);
        setPendingSubjects(pending);

      } catch (err: any) {
        console.error("Error fetching subjects:", err);
        setError("Failed to load subjects. Please try again later.");
        
        // Fallback to mock data if API fails
        setEnrolledSubjects(getMockEnrolledSubjects());
        setPendingSubjects(getMockPendingSubjects());
      } finally {
        setLoading(false);
      }
    };

    fetchSubjects();
  }, []);

  // Mock data functions as fallback
  const getMockEnrolledSubjects = (): Subject[] => [
    {
      id: 1,
      name: "Combined Mathematics",
      stream: "Science",
      level: "Advanced Level",
      teacher: "Mr. Perera",
      progress: 75,
      nextClass: "Tomorrow, 10:00 AM",
      assignments: { pending: 2, completed: 8 },
      materials: 15,
      latestGrade: "A",
      lastAccessed: "2 hours ago",
      clsDate: "Sat 8.00 am",
      studentCount: 24,
      lastVideoWatched: {
        id: 1,
        title: "Calculus - Lesson 1",
        url: "https://www.youtube.com/watch?v=9Qa0J4KuGqA",
        duration: "45 min",
        progress: 65,
        timestamp: "23:45"
      },
      teacherUploads: {
        videoLinks: [
          { 
            id: 1, 
            title: "Calculus - Lesson 1", 
            url: "https://www.youtube.com/watch?v=9Qa0J4KuGqA", 
            duration: "45 min",
            thumbnail: "https://img.youtube.com/vi/9Qa0J4KuGqA/maxresdefault.jpg",
            description: "Introduction to differential calculus"
          }
        ],
        notes: [
          { id: 1, title: "Calculus Complete Notes.pdf", type: "pdf", size: "2.4 MB", downloadUrl: "/downloads/calculus.pdf" }
        ]
      }
    }
  ];

  const getMockPendingSubjects = (): Subject[] => [
    {
      id: 4,
      name: "Chemistry",
      stream: "Science",
      level: "Advanced Level",
      teacher: "Dr. Rathnayake",
      progress: 0,
      assignments: { pending: 0, completed: 0 },
      materials: 0,
      lastAccessed: "Never",
      studentCount: 0,
      teacherUploads: { videoLinks: [], notes: [] },
      price: 2000,
      status: "payment_pending",
      paymentDue: "Jan 20, 2024",
      examDate: "Aug 2024"
    }
  ];

  const filteredSubjects = enrolledSubjects.filter(subject => 
    streamFilter === "all" || subject.stream.toLowerCase() === streamFilter.toLowerCase()
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6 flex flex-col items-center justify-center">
        <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-600">Loading your subjects...</p>
      </div>
    );
  }

  if (error && enrolledSubjects.length === 0 && pendingSubjects.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6 flex flex-col items-center justify-center">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 max-w-md text-center">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-red-600 text-2xl">⚠️</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Error Loading Subjects</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg font-medium transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6 flex flex-col">
      {/* Header */}
      <MySubjectsHeader enrolledCount={enrolledSubjects.length} />

      {/* Stream Filter */}
      <StreamFilter 
        streamFilter={streamFilter}
        onStreamFilterChange={setStreamFilter}
      />

      {/* Error Alert */}
      {error && (
        <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <span className="text-yellow-600">⚠️</span>
            <div>
              <p className="text-yellow-800 font-medium">Using demo data</p>
              <p className="text-yellow-700 text-sm">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Content based on active tab */}
      {activeTab === "enrolled" && (
        <>
          {filteredSubjects.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredSubjects.map((subject) => (
                <EnrolledSubjectCard key={subject.id} subject={subject} />
              ))}
            </div>
          ) : (
            <EmptyState />
          )}
        </>
      )}

      {activeTab === "pending" && (
        <>
          {pendingSubjects.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {pendingSubjects.map((subject) => (
                <PendingSubjectCard key={subject.id} subject={subject} />
              ))}
            </div>
          ) : (
            <EmptyState 
              title="No Pending Subjects"
              message="You have no pending subject enrollments."
              actionText="Explore Subjects"
              onAction={() => window.location.href = "/subjects"}
            />
          )}
        </>
      )}

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default MySubjects;