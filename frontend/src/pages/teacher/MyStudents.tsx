import { useState } from "react";
import { Users, CreditCard, CheckCircle, XCircle, Calendar, Filter, Search, Mail, Phone, MapPin, User, ChevronDown, ChevronUp } from "lucide-react";
import TeacherDashboard from "./TeacherDashboard";

// Define TypeScript interfaces
interface Student {
  id: number;
  name: string;
  studentId: string;
  grade: string;
  district: string;
  email: string;
  phone: string;
  joinDate: string;
  paidMonths: string[];
  totalPaid: number;
  status: 'active' | 'pending' | 'inactive';
}

type StudentKey = keyof Student;

const MyStudents = () => {
  const [selectedGrade, setSelectedGrade] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [paymentMonth, setPaymentMonth] = useState("");
  const [paymentAmount, setPaymentAmount] = useState("");
  const [sortConfig, setSortConfig] = useState<{ key: StudentKey; direction: 'asc' | 'desc' }>({ 
    key: 'name', 
    direction: 'asc' 
  });
  
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const grades = [
    "Grade 6", "Grade 7", "Grade 8", "Grade 9", 
    "Grade 10", "Grade 11", "Grade 12"
  ];

  const initialStudents: Student[] = [
    {
      id: 1,
      name: "Yasiru Nimsara",
      studentId: "STU/GAL/G-8/S00001",
      grade: "Grade 8",
      district: "Galle",
      email: "yasiru.nimsara@example.com",
      phone: "+94 77 123 4567",
      joinDate: "2023-01-15",
      paidMonths: ["January", "February", "March", "April"],
      totalPaid: 40000,
      status: "active"
    },
    {
      id: 2,
      name: "Kamal Perera",
      studentId: "STU/COL/G-10/S00002",
      grade: "Grade 10",
      district: "Colombo",
      email: "kamal.perera@example.com",
      phone: "+94 71 234 5678",
      joinDate: "2023-02-20",
      paidMonths: ["January", "February", "March", "April", "May"],
      totalPaid: 50000,
      status: "active"
    },
    {
      id: 3,
      name: "Samantha Silva",
      studentId: "STU/KAN/G-11/S00003",
      grade: "Grade 11",
      district: "Kandy",
      email: "samantha.silva@example.com",
      phone: "+94 76 345 6789",
      joinDate: "2023-03-10",
      paidMonths: ["January", "February"],
      totalPaid: 20000,
      status: "pending"
    },
    {
      id: 4,
      name: "Nimal Fernando",
      studentId: "STU/GAM/G-9/S00004",
      grade: "Grade 9",
      district: "Gampaha",
      email: "nimal.fernando@example.com",
      phone: "+94 72 456 7890",
      joinDate: "2023-01-05",
      paidMonths: ["January", "February", "March", "April", "May", "June"],
      totalPaid: 60000,
      status: "active"
    },
    {
      id: 5,
      name: "Chamari Jayasuriya",
      studentId: "STU/MAT/G-12/S00005",
      grade: "Grade 12",
      district: "Matara",
      email: "chamari.j@example.com",
      phone: "+94 78 567 8901",
      joinDate: "2023-02-28",
      paidMonths: ["January", "February", "March"],
      totalPaid: 30000,
      status: "inactive"
    },
    {
      id: 6,
      name: "Dasun Shanaka",
      studentId: "STU/KAL/G-7/S00006",
      grade: "Grade 7",
      district: "Kalutara",
      email: "dasun.s@example.com",
      phone: "+94 70 678 9012",
      joinDate: "2023-03-15",
      paidMonths: ["January", "February", "March", "April"],
      totalPaid: 40000,
      status: "active"
    },
    {
      id: 7,
      name: "Harshani Ratnayake",
      studentId: "STU/NUW/G-8/S00007",
      grade: "Grade 8",
      district: "Nuwara Eliya",
      email: "harshani.r@example.com",
      phone: "+94 74 789 0123",
      joinDate: "2023-01-20",
      paidMonths: ["January", "February"],
      totalPaid: 20000,
      status: "pending"
    },
    {
      id: 8,
      name: "Ravindu Kumarasinghe",
      studentId: "STU/HAM/G-10/S00008",
      grade: "Grade 10",
      district: "Hambantota",
      email: "ravindu.k@example.com",
      phone: "+94 75 890 1234",
      joinDate: "2023-02-10",
      paidMonths: ["January", "February", "March", "April", "May", "June", "July"],
      totalPaid: 70000,
      status: "active"
    }
  ];

  const [students, setStudents] = useState<Student[]>(initialStudents);

  const handleSort = (key: StudentKey) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedStudents = [...students].sort((a, b) => {
    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];
    
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortConfig.direction === 'asc' 
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }
    
    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return sortConfig.direction === 'asc' 
        ? aValue - bValue
        : bValue - aValue;
    }
    
    return 0;
  });

  const filteredStudents = sortedStudents.filter(student => {
    const matchesGrade = selectedGrade === "all" || student.grade === selectedGrade;
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.district.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesGrade && matchesSearch;
  });

  const handlePaymentClick = (student: Student) => {
    setSelectedStudent(student);
    setPaymentMonth("");
    setPaymentAmount("10000"); // Default payment amount
    setShowPaymentModal(true);
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudent || !paymentMonth || !paymentAmount) return;

    // Update student's paid months and total
    const updatedStudents = students.map(student => {
      if (student.id === selectedStudent.id) {
        const updatedPaidMonths = [...student.paidMonths, paymentMonth];
        const updatedTotalPaid = student.totalPaid + parseInt(paymentAmount);
        const updatedStatus: 'active' | 'pending' | 'inactive' = updatedPaidMonths.length >= 3 ? "active" : student.status;
        return {
          ...student,
          paidMonths: updatedPaidMonths,
          totalPaid: updatedTotalPaid,
          status: updatedStatus
        };
      }
      return student;
    });

    setStudents(updatedStudents);
    setShowPaymentModal(false);
    setSelectedStudent(null);
    alert(`Payment of LKR ${paymentAmount} recorded for ${selectedStudent.name} for ${paymentMonth}`);
  };

  const getStatusBadge = (status: 'active' | 'pending' | 'inactive') => {
    const styles = {
      active: "bg-green-100 text-green-800",
      pending: "bg-yellow-100 text-yellow-800",
      inactive: "bg-red-100 text-red-800"
    };
    
    const icons = {
      active: <CheckCircle className="w-4 h-4" />,
      pending: <Calendar className="w-4 h-4" />,
      inactive: <XCircle className="w-4 h-4" />
    };

    const styleClass = styles[status];
    const icon = icons[status];

    return (
      <span className={`px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 ${styleClass}`}>
        {icon}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const getRemainingMonths = (paidMonths: string[]) => {
    return months.filter(month => !paidMonths.includes(month));
  };

  // Statistics
  const totalStudents = students.length;
  const activeStudents = students.filter(s => s.status === "active").length;
  const totalRevenue = students.reduce((sum, student) => sum + student.totalPaid, 0);
  const averagePayment = Math.round(totalRevenue / students.length);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50 p-4 md:p-8">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-white rounded-xl shadow-sm">
            <Users className="w-8 h-8 text-indigo-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Students</h1>
            <p className="text-gray-600 mt-1">Manage and track your students' progress and payments</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto">
        <button
          onClick={() => window.history.back()}
          className="mb-6 px-5 py-2.5 bg-indigo-600 text-white rounded-xl shadow-lg hover:bg-indigo-700 transition"
        >
          Back
        </button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Total Students</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{totalStudents}</p>
            </div>
            <div className="p-3 bg-indigo-50 rounded-xl">
              <Users className="w-6 h-6 text-indigo-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Active Students</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{activeStudents}</p>
            </div>
            <div className="p-3 bg-green-50 rounded-xl">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                LKR {totalRevenue.toLocaleString()}
              </p>
            </div>
            <div className="p-3 bg-blue-50 rounded-xl">
              <CreditCard className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Avg. Payment</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                LKR {averagePayment.toLocaleString()}
              </p>
            </div>
            <div className="p-3 bg-purple-50 rounded-xl">
              <Calendar className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search students by name, ID, or district..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-700">Grade:</span>
            </div>
            <select
              value={selectedGrade}
              onChange={(e) => setSelectedGrade(e.target.value)}
              className="px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
            >
              <option value="all">All Grades</option>
              {grades.map(grade => (
                <option key={grade} value={grade}>{grade}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Students Table */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th 
                  className="p-4 text-left text-sm font-semibold text-gray-700 cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('name')}
                >
                  <div className="flex items-center gap-2">
                    Student
                    {sortConfig.key === 'name' && (
                      sortConfig.direction === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                    )}
                  </div>
                </th>
                <th className="p-4 text-left text-sm font-semibold text-gray-700">ID</th>
                <th 
                  className="p-4 text-left text-sm font-semibold text-gray-700 cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('grade')}
                >
                  <div className="flex items-center gap-2">
                    Grade
                    {sortConfig.key === 'grade' && (
                      sortConfig.direction === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                    )}
                  </div>
                </th>
                <th 
                  className="p-4 text-left text-sm font-semibold text-gray-700 cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('district')}
                >
                  <div className="flex items-center gap-2">
                    District
                    {sortConfig.key === 'district' && (
                      sortConfig.direction === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                    )}
                  </div>
                </th>
                <th className="p-4 text-left text-sm font-semibold text-gray-700">Paid Months</th>
                <th className="p-4 text-left text-sm font-semibold text-gray-700">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredStudents.map((student) => (
                <tr key={student.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-indigo-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{student.name}</p>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Mail className="w-3 h-3" />
                          {student.email}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Phone className="w-3 h-3" />
                          {student.phone}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-lg font-mono">
                      {student.studentId}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm font-medium rounded-lg">
                      {student.grade}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-700">{student.district}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="space-y-2">
                      <div className="flex flex-wrap gap-1">
                        {student.paidMonths.slice(0, 4).map((month, idx) => (
                          <span key={idx} className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded">
                            {month.substring(0, 3)}
                          </span>
                        ))}
                        {student.paidMonths.length > 4 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                            +{student.paidMonths.length - 4}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500">
                        Total: <span className="font-semibold">LKR {student.totalPaid.toLocaleString()}</span>
                      </p>
                    </div>
                  </td>
                  <td className="p-4">
                    {getStatusBadge(student.status)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredStudents.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No students found</p>
            <p className="text-sm text-gray-400 mt-1">Try adjusting your search or filter</p>
          </div>
        )}

        {/* Summary Footer */}
        <div className="bg-gray-50 p-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Showing <span className="font-semibold">{filteredStudents.length}</span> of <span className="font-semibold">{students.length}</span> students
            </p>
            <div className="text-sm text-gray-600">
              <span className="font-semibold">Monthly Target:</span> LKR 100,000
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyStudents;