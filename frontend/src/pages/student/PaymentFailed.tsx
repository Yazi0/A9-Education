import { Link } from "react-router-dom";
import { XCircle, ArrowLeft, RefreshCw } from "lucide-react";
import StudentLayout from "../../layouts/StudentLayout";

const PaymentFailed = () => {
  return (
    <StudentLayout>
      <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl shadow-xl max-w-2xl mx-auto my-10">
        <div className="p-6 bg-red-100 rounded-full mb-8">
          <XCircle className="text-red-600" size={64} />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Payment Failed</h1>
        <p className="text-gray-600 text-center px-10 mb-10 text-lg">
          We encountered an error processing your payment. Please try again or contact support if the issue persists. No funds were captured during this attempt.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 w-full px-10">
          <button
            onClick={() => window.history.back()}
            className="flex-1 py-4 bg-blue-600 text-white rounded-xl font-bold flex items-center justify-center hover:bg-blue-700 transition-all shadow-lg"
          >
            <RefreshCw className="mr-2" size={20} /> Try Again
          </button>
          <Link
            to="/student/subjects"
            className="flex-1 py-4 bg-gray-100 text-gray-700 rounded-xl font-bold flex items-center justify-center hover:bg-gray-200 transition-all border border-gray-200"
          >
            <ArrowLeft className="mr-2" size={20} /> Back to Subjects
          </Link>
        </div>
      </div>
    </StudentLayout>
  );
};

export default PaymentFailed;
