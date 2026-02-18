import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Loader2 } from "lucide-react";
import type { Class } from "../../components/models/Class";
import SearchFilter from "../../components/common/SearchFilter";
import ClassCard from "../../components/common/ClassCard";
import Summary from "../../components/common/Summary";
import PaymentPopup from "../../components/common/PaymentPopup";
import api from "../../api/axios";
import StudentLayout from "../../layouts/StudentLayout";

const Classes = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [levelFilter, setLevelFilter] = useState("all");
  const [streamFilter, setStreamFilter] = useState("all");
  const [showPaymentPopup, setShowPaymentPopup] = useState(false);
  const [selectedClass, setSelectedClass] = useState<Class | null>(null);
  const [classes, setClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch subjects from API
        const response = await api.get("subjects/");
        // Also fetch user enrollments to check 'paid' status
        const enrollmentsRes = await api.get("enrollments/my/");

        const subjects = response.data;
        const enrollments = enrollmentsRes.data;

        // Map API data to Class interface
        const mappedClasses: Class[] = subjects.map((subject: any) => {
          // Check if enrolled
          const isEnrolled = enrollments.some((e: any) =>
            e.subject === subject.id || e.subject_id === subject.id
          );

          return {
            id: subject.id,
            name: subject.name || subject.title,
            stream: subject.stream || "General", // Ensure backend sends this or provide default
            level: subject.grade || subject.level || "General", // Ensure backend sends this
            teacher: subject.teacher_name || "TBA", // Ensure backend serializes teacher name
            rating: 4.8, // Placeholder or fetch if available
            enrolled: subject.enrolled_count || 0, // Placeholder
            price: parseFloat(subject.class_fee) || 0,
            paid: isEnrolled,
            duration: "1 Year", // Placeholder or fetch
            description: subject.description || "",
            topics: [], // Placeholder
            examDate: "TBA", // Placeholder
            classType: "Regular" // Placeholder
          };
        });

        setClasses(mappedClasses);
        setError(null);
      } catch (err) {
        console.error("Error fetching classes:", err);
        setError("Failed to load subjects.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredClasses = classes.filter(cls => {
    const matchesSearch = cls.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cls.teacher.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLevel = levelFilter === "all" || cls.level.toLowerCase().includes(levelFilter);
    const matchesStream = streamFilter === "all" || cls.stream.toLowerCase() === streamFilter;

    return matchesSearch && matchesLevel && matchesStream;
  });

  const handleEnrollClick = (cls: Class) => {
    if (cls.paid) {
      // If already enrolled, maybe navigate to it?
      return;
    }
    setSelectedClass(cls);
    setShowPaymentPopup(true);
  };

  const handlePaymentComplete = () => {
    setShowPaymentPopup(false);
    // Refresh data to update 'paid' status
    window.location.reload();
  };

  return (
    <StudentLayout>
      <div className="max-w-6xl mx-auto flex-1 w-full">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">All Subjects</h1>
            <p className="text-gray-600 mt-2">Explore and enroll in our wide range of academic courses to achieve your goals</p>
          </div>
          <div className="mt-4 md:mt-0 px-4 py-2 bg-red-50 text-red-700 rounded-lg text-sm font-medium border border-red-100">
            Available Courses: {classes.length}
          </div>
        </div>

        {/* SummarySection */}
        <Summary classes={classes} />

        <div className="mb-8" />

        {/* Search and Filter */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-8">
          <SearchFilter
            searchTerm={searchTerm}
            levelFilter={levelFilter}
            streamFilter={streamFilter}
            onSearchChange={setSearchTerm}
            onLevelFilterChange={setLevelFilter}
            onStreamFilterChange={setStreamFilter}
          />
        </div>

        {/* Classes Grid */}
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="animate-spin text-red-600" size={48} />
          </div>
        ) : error ? (
          <div className="text-center py-12 text-red-600">
            <p>{error}</p>
            <button onClick={() => window.location.reload()} className="mt-2 underline">Retry</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
            {filteredClasses.map((cls) => (
              <ClassCard
                key={cls.id}
                cls={cls}
                onEnrollClick={handleEnrollClick}
              />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && filteredClasses.length === 0 && (
          <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-gray-300 mb-8">
            <div className="inline-block p-4 bg-gray-50 rounded-full mb-4">
              <Search className="text-gray-400" size={48} />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No classes found</h3>
            <p className="text-gray-600">Try adjusting your search filters to find what you're looking for</p>
          </div>
        )}

      </div>

      {/* Payment Popup */}
      {selectedClass && (
        <PaymentPopup
          selectedClass={selectedClass}
          showPaymentPopup={showPaymentPopup}
          onClose={() => setShowPaymentPopup(false)}
          onPaymentComplete={handlePaymentComplete}
        />
      )}
    </StudentLayout>
  );
};

export default Classes;