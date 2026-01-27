import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import type { Class } from "../../components/models/Class";
import ClassesHeader from "../../components/common/ClassesHeader";
import Stats from "../../components/common/Stats";
import SearchFilter from "../../components/common/SearchFilter";
import ClassCard from "../../components/common/ClassCard";
import Summary from "../../components/common/Summary";
import PaymentPopup from "../../components/common/PaymentPopup";


const Classes = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [levelFilter, setLevelFilter] = useState("all");
  const [streamFilter, setStreamFilter] = useState("all");
  const [showPaymentPopup, setShowPaymentPopup] = useState(false);
  const [selectedClass, setSelectedClass] = useState<Class | null>(null);

  // Move classes data to a separate file if it grows large
  const classes: Class[] = [
    {
      id: 1,
      name: "Combined Mathematics",
      stream: "Science",
      level: "Advanced Level",
      teacher: "Mr. Perera",
      rating: 4.8,
      enrolled: 24,
      price: 2000,
      paid: true,
      duration: "2 Years",
      description: "Complete A/L Mathematics syllabus covering calculus, algebra, and statistics",
      topics: ["Calculus", "Algebra", "Statistics", "Trigonometry"],
      examDate: "Aug 2024",
      classType: "Regular"
    },
    {
      id: 2,
      name: "Physics",
      stream: "Science",
      level: "Advanced Level",
      teacher: "Mrs. Silva",
      rating: 4.9,
      enrolled: 32,
      price: 1800,
      paid: false,
      duration: "2 Years",
      description: "Master physics concepts with practical experiments and past paper practice",
      topics: ["Mechanics", "Waves", "Electricity", "Modern Physics"],
      examDate: "Aug 2024",
      classType: "Regular"
    },
    // ... rest of the classes data
  ];

  const filteredClasses = classes.filter(cls => {
    const matchesSearch = cls.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         cls.teacher.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLevel = levelFilter === "all" || cls.level.toLowerCase().includes(levelFilter);
    const matchesStream = streamFilter === "all" || cls.stream.toLowerCase() === streamFilter;
    
    return matchesSearch && matchesLevel && matchesStream;
  });

  const handleViewMyClasses = () => {
    navigate("/student/my-subjects");
  };

  const handleBackToDashboard = () => {
    navigate("/studentdashboard");
  };

  const handleEnrollClick = (cls: Class) => {
    setSelectedClass(cls);
    setShowPaymentPopup(true);
  };

  const handlePaymentComplete = () => {
    setShowPaymentPopup(false);
    navigate("/student/my-subjects");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6">
      {/* Header */}
      <ClassesHeader
        onBackToDashboard={handleBackToDashboard}
        onViewMyClasses={handleViewMyClasses}
        enrolledCount={classes.filter(c => c.paid).length}
      />

      {/* Stats */}
      <Stats classes={classes} />

      {/* Search and Filter */}
      <SearchFilter
        searchTerm={searchTerm}
        levelFilter={levelFilter}
        streamFilter={streamFilter}
        onSearchChange={setSearchTerm}
        onLevelFilterChange={setLevelFilter}
        onStreamFilterChange={setStreamFilter}
      />

      {/* Classes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredClasses.map((cls) => (
          <ClassCard
            key={cls.id}
            cls={cls}
            onEnrollClick={handleEnrollClick}
          />
        ))}
      </div>

      {/* Empty State */}
      {filteredClasses.length === 0 && (
        <div className="text-center py-12">
          <div className="inline-block p-4 bg-gray-100 rounded-full mb-4">
            <Search className="text-gray-400" size={48} />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No classes found</h3>
          <p className="text-gray-600">Try adjusting your search filters</p>
        </div>
      )}

      {/* Summary */}
      <Summary classes={classes} />

      {/* Payment Popup */}
      {selectedClass && (
        <PaymentPopup
          selectedClass={selectedClass}
          showPaymentPopup={showPaymentPopup}
          onClose={() => setShowPaymentPopup(false)}
          onPaymentComplete={handlePaymentComplete}
        />
      )}
    </div>
  );
};

export default Classes;