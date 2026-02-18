import StudentLayout from "../../layouts/StudentLayout";

const SubjectContent = () => {
  return (
    <StudentLayout>
      <div className="max-w-6xl mx-auto flex-1 w-full">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Mathematics – Grade 8
          </h2>
          <p className="text-gray-600">Access your lesson videos and study materials below.</p>
        </div>

        {/* Video */}
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 mb-8">
          <div className="aspect-video w-full rounded-xl overflow-hidden bg-black mb-4">
            <video
              controls
              controlsList="nodownload"
              className="w-full h-full"
            >
              <source src="/sample-video.mp4" type="video/mp4" />
            </video>
          </div>
          <p className="text-sm text-gray-500">
            Download disabled for copyright protection.
          </p>
        </div>

        {/* Notes */}
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 mb-8">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Study Notes</h3>
          <ul className="space-y-3">
            <li className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-red-50 transition-colors cursor-pointer border border-transparent hover:border-red-100">
              <span className="w-8 h-8 bg-red-100 text-red-600 rounded-full flex items-center justify-center mr-3 font-bold text-sm">01</span>
              <span className="text-gray-700">Lesson 01 – Introduction and Fundamentals</span>
            </li>
            <li className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-red-50 transition-colors cursor-pointer border border-transparent hover:border-red-100">
              <span className="w-8 h-8 bg-red-100 text-red-600 rounded-full flex items-center justify-center mr-3 font-bold text-sm">02</span>
              <span className="text-gray-700">Lesson 02 – Algebra Basics and Equations</span>
            </li>
          </ul>
        </div>
      </div>
    </StudentLayout>
  );
};

export default SubjectContent;
