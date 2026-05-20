import { Link } from "react-router-dom";
import { CheckCircle, ArrowRight } from "lucide-react";
import StudentLayout from "../../layouts/StudentLayout";

const PaymentSuccess = () => {
  return (
    <StudentLayout>
      <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl shadow-xl max-w-2xl mx-auto my-10">
        <div className="p-6 bg-green-100 rounded-full mb-8">
          <CheckCircle className="text-green-600" size={64} />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Payment Successful!</h1>
        <p className="text-gray-600 text-center px-10 mb-10 text-lg">
          Thank you for enrolling! Your payment has been processed successfully. 
          You can now access your course materials and start learning.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 w-full px-10">
          <Link
            to="/student/my-subjects"
            className="flex-1 py-4 bg-blue-600 text-white rounded-xl font-bold flex items-center justify-center hover:bg-blue-700 transition-all shadow-lg"
          >
            Go to My Subjects <ArrowRight className="ml-2" size={20} />
          </Link>
          <Link
            to="/student/dashboard"
            className="flex-1 py-4 bg-gray-100 text-gray-700 rounded-xl font-bold flex items-center justify-center hover:bg-gray-200 transition-all border border-gray-200"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    </StudentLayout>
  );
};

export default PaymentSuccess;
