import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "../pages/Home"; // ADD HOME

import Login from "../pages/auth/Login";
import StudentSuccess from "../pages/auth/StudentSuccess";
import StudentDashboard from "../pages/student/StudentDashboard";
import TeacherDashboard from "../pages/teacher/TeacherDashboard";
import LoadingRedirect from "../pages/LoadingRedirect";
import Profile from "../pages/student/Profile";
import Subjects from "../pages/student/Subjects";
import SubjectContent from "../pages/student/SubjectContent";
import Payment from "../pages/student/Payment";
import UploadVideo from "../pages/teacher/UploadVideo";
import UploadNotes from "../pages/teacher/UploadNotes";
import MyStudents from "../pages/teacher/MyStudents";
import MySubjects from "../pages/student/MySubjects";
import ClassVideos from "../pages/student/ClassVideos";
import StudyMaterials from "../pages/student/StudyMaterials";
import About from "../pages/About";
import Contact from "../pages/Contact";
import Teachers from "../pages/Teachers";
import Subject from "../pages/Subject";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Loading → Auto Redirect */}
        <Route path="/" element={<LoadingRedirect />} />

        {/* HOME PAGE (Before Login) */}
        <Route path="/home" element={<Home />} />

        {/* Auth */}
        <Route path="/login" element={<Login />} />

        <Route
          path="/register/student/success"
          element={<StudentSuccess />}
        />

        <Route path="/about" element={<About />} />

        <Route path="/contact" element={<Contact />} />

        <Route path="/subject" element={<Subject />} />
        <Route path="/teachers" element={<Teachers />} />

        {/* Student Routes */}
        <Route path="/studentdashboard" element={<StudentDashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/subjects" element={<Subjects />} />
        <Route path="/subject-content" element={<SubjectContent />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/student/my-subjects" element={<MySubjects />} />
        <Route path="/student/classvideos/:classId" element={<ClassVideos />} />
        <Route
          path="/student/studymaterials/:classId"
          element={<StudyMaterials />}
        />

        {/* Teacher Routes */}
        <Route path="/teacherdashboard" element={<TeacherDashboard />} />
        <Route path="/teacher/upload-video" element={<UploadVideo />} />
        <Route path="/teacher/upload-notes" element={<UploadNotes />} />
        <Route path="/teacher/students" element={<MyStudents />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
