import QRCode from "react-qr-code";

const StudentSuccess = () => {
  const studentId = "STU123456";

  const downloadQR = () => {
    const svg = document.getElementById("qr-code");
    const serializer = new XMLSerializer();
    const source = serializer.serializeToString(svg!);

    const blob = new Blob([source], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `${studentId}-QR.svg`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-lg text-center w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Registration Successful 🎉</h2>

        <p className="mb-2 font-semibold">Student ID</p>
        <p className="text-lg mb-6">{studentId}</p>

        <div className="flex justify-center mb-6">
          <QRCode id="qr-code" value={studentId} size={160} />
        </div>

        <button
          onClick={downloadQR}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
        >
          Download QR Code
        </button>
      </div>
    </div>
  );
};

export default StudentSuccess;
