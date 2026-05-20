import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { CheckCircle, Lock, Shield, BookOpen, Loader2 } from "lucide-react";
import StudentLayout from "../../layouts/StudentLayout";
import axiosInstance from "../../api/axios";
import { API_ENDPOINTS } from "../../api/endpoints";

const Payment = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [subject, setSubject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    const fetchSubject = async () => {
      try {
        const response = await axiosInstance.get(API_ENDPOINTS.SUBJECTS.DETAIL(id!));
        setSubject(response.data);
      } catch (error) {
        console.error("Failed to fetch subject", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSubject();
  }, [id]);

  const handlePayment = async () => {
    setProcessing(true);
    try {
      const response = await axiosInstance.post(API_ENDPOINTS.PAYMENTS.CREATE_SESSION, {
        subject_id: id
      });
      // Redirect to Stripe Checkout
      window.location.href = response.data.url;
    } catch (error) {
      console.error("Payment failed", error);
      alert("Failed to initiate payment. Please try again.");
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <StudentLayout>
        <div className="flex items-center justify-center h-full">
          <Loader2 className="animate-spin text-blue-600" size={48} />
        </div>
      </StudentLayout>
    );
  }

  if (!subject) {
    return (
      <StudentLayout>
        <div className="text-center py-20">
          <h2 className="text-2xl font-bold text-gray-800">Subject not found</h2>
          <button onClick={() => navigate(-1)} className="mt-4 text-blue-600">Go Back</button>
        </div>
      </StudentLayout>
    );
  }

  return (
    <StudentLayout>
      <div className="max-w-6xl mx-auto flex-1 w-full">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Complete Enrollment</h1>
          <p className="text-gray-600 mt-2">Secure payment for your selected subject</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-start mb-6">
                <div className="p-4 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl mr-4">
                  <BookOpen className="text-white" size={28} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{subject.name} – Grade {subject.grade}</h2>
                  <p className="text-gray-600 mt-1">Teacher: {subject.teacher_name || "N/A"}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-blue-50 p-4 rounded-xl">
                  <p className="text-sm text-gray-500">Course Fee</p>
                  <p className="text-2xl font-bold text-gray-900">Rs. {subject.price}</p>
                </div>
                <div className="bg-green-50 p-4 rounded-xl">
                  <p className="text-sm text-gray-500">Duration</p>
                  <p className="text-lg font-semibold text-gray-900">{subject.duration || "Self-paced"}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Payment Method</h3>
              <p className="text-gray-600 mb-6">You will be redirected to Stripe to securely complete your payment via Credit/Debit card.</p>
              
              <button
                onClick={handlePayment}
                disabled={processing}
                className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white rounded-xl font-bold shadow-lg transition-all flex items-center justify-center disabled:opacity-50"
              >
                {processing ? (
                  <Loader2 className="animate-spin mr-2" size={20} />
                ) : (
                  <Lock className="mr-2" size={20} />
                )}
                {processing ? "Redirecting..." : `Pay Rs. ${subject.price} with Card`}
              </button>
            </div>

            <div className="flex items-center justify-center text-sm text-gray-500">
              <Shield className="mr-2" size={16} />
              <span>Payments are processed securely via Stripe (SSL Encrypted)</span>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Course Fee</span>
                  <span className="font-medium">Rs. {subject.price}</span>
                </div>
                <div className="border-t pt-4">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>Rs. {subject.price}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl shadow-lg p-6 text-white text-sm">
              <h3 className="text-lg font-bold mb-4">Course Benefits</h3>
              <ul className="space-y-3">
                <li className="flex items-center"><CheckCircle className="mr-2" size={16} /> Lifetime access to content</li>
                <li className="flex items-center"><CheckCircle className="mr-2" size={16} /> Interactive live sessions</li>
                <li className="flex items-center"><CheckCircle className="mr-2" size={16} /> PDF Study materials</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </StudentLayout>
  );
};

export default Payment;