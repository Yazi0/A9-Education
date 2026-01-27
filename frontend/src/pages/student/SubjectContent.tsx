const SubjectContent = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h2 className="text-2xl font-bold mb-4">
        Mathematics – Grade 8
      </h2>

      {/* Video */}
      <div className="bg-white p-4 rounded shadow mb-6">
        <video
          controls
          controlsList="nodownload"
          className="w-full rounded"
        >
          <source src="/sample-video.mp4" type="video/mp4" />
        </video>
        <p className="text-sm text-gray-500 mt-2">
          Download disabled
        </p>
      </div>

      {/* Notes */}
      <div className="bg-white p-4 rounded shadow">
        <h3 className="text-xl font-bold mb-2">Notes</h3>
        <ul className="list-disc ml-6">
          <li>Lesson 01 – Introduction</li>
          <li>Lesson 02 – Algebra Basics</li>
        </ul>
      </div>
    </div>
  );
};

export default SubjectContent;
