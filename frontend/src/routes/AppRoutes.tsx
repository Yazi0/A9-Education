import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/auth/Login";
import StudentSuccess from "../pages/auth/StudentSuccess";
import StudentDashboard from "../pages/student/StudentDashboard";
import TeacherDashboard from "../pages/teacher/TeacherDashboard";
import LoadingRedirect from "../pages/LoadingRedirect";
import Profile from "../pages/student/Profile";
import Subjects from "../pages/student/Subjects";
import SubjectContent from "../pages/student/SubjectContent";
import Payment from "../pages/student/Payment";
import PaymentSuccess from "../pages/student/PaymentSuccess";
import PaymentFailed from "../pages/student/PaymentFailed";
import UploadVideo from "../pages/teacher/UploadVideo";
import UploadNotes from "../pages/teacher/UploadNotes";
import MyStudents from "../pages/teacher/MyStudents";
import MySubjects from "../pages/student/MySubjects";
import ClassVideos from "../pages/student/ClassVideos";
import StudyMaterials from "../pages/student/StudyMaterials";
import About from "../pages/About";
import Contact from "../pages/Contact";
import Teachers from "../pages/Teachers";
import StudentTeachers from "../pages/student/Teachers";
import Subject from "../pages/Subject";
import AllMaterials from "../pages/student/AllMaterials";

// Admin
import AdminLogin from "../pages/admin/AdminLogin";
import AdminOverview from "../pages/admin/AdminOverview";
import AdminUsers from "../pages/admin/AdminUsers";
import AdminApplications from "../pages/admin/AdminApplications";
import AdminSubjects from "../pages/admin/AdminSubjects";
import AdminEnrollments from "../pages/admin/AdminEnrollments";
import AdminPayments from "../pages/admin/AdminPayments";
import TeacherApply from "../pages/auth/TeacherApply";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoadingRedirect />} />
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register/student/success" element={<StudentSuccess />} />
        <Route path="/register/teacher/apply" element={<TeacherApply />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/subject" element={<Subject />} />
        <Route path="/teachers" element={<Teachers />} />

        {/* Student Routes */}
        <Route path="/studentdashboard" element={<StudentDashboard />} />
        <Route path="/student/teachers" element={<StudentTeachers />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/subjects" element={<Subjects />} />
        <Route path="/subject-content" element={<SubjectContent />} />
        <Route path="/student/payment/:id" element={<Payment />} />
        <Route path="/student/payment-success" element={<PaymentSuccess />} />
        <Route path="/student/payment-failed" element={<PaymentFailed />} />
        <Route path="/student/my-subjects" element={<MySubjects />} />
        <Route path="/student/classvideos/:classId" element={<ClassVideos />} />
        <Route path="/student/studymaterials/:classId" element={<StudyMaterials />} />
        <Route path="/student/all-materials" element={<AllMaterials />} />

        {/* Teacher Routes */}
        <Route path="/teacherdashboard" element={<TeacherDashboard />} />
        <Route path="/teacher/upload-video" element={<UploadVideo />} />
        <Route path="/teacher/upload-notes" element={<UploadNotes />} />
        <Route path="/teacher/students" element={<MyStudents />} />

        {/* Admin Routes */}
        <Route path="/A9-admin" element={<AdminLogin />} />
        <Route path="/A9-admin/dashboard" element={<AdminOverview />} />
        <Route path="/A9-admin/users" element={<AdminUsers />} />
        <Route path="/A9-admin/applications" element={<AdminApplications />} />
        <Route path="/A9-admin/subjects" element={<AdminSubjects />} />
        <Route path="/A9-admin/enrollments" element={<AdminEnrollments />} />
        <Route path="/A9-admin/payments" element={<AdminPayments />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;

