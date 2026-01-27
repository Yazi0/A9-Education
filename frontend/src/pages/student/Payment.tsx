// Updated Payment.tsx
import { useParams, useNavigate } from "react-router-dom";
import { CheckCircle, Lock, Shield, CreditCard, Calendar, BookOpen } from "lucide-react";

const Payment = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Mock subject data based on ID
  const subject = {
    id: parseInt(id || "2"),
    name: "Science",
    grade: "8",
    teacher: "Mrs. Silva",
    price: 1500,
    description: "Explore physics, chemistry, and biology through experiments",
    duration: "16 weeks",
    nextBatch: "Jan 25, 2024"
  };

  const paymentMethods = [
    { id: 1, name: "Credit/Debit Card", icon: "💳", description: "Visa, MasterCard, Amex" },
    { id: 2, name: "Bank Transfer", icon: "🏦", description: "Direct bank payment" },
    { id: 3, name: "Mobile Wallet", icon: "📱", description: "Dialog, Mobitel, Airtel" },
    { id: 4, name: "Cash", icon: "💵", description: "Pay at our office" }
  ];

  const handlePayment = () => {
    // In real app, process payment here
    alert(`Payment successful! You are now enrolled in ${subject.name}.`);
    navigate("/student/my-subjects");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Complete Enrollment</h1>
          <p className="text-gray-600 mt-2">Secure payment for your selected subject</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Subject Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Subject Summary */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-start mb-6">
                <div className="p-4 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl mr-4">
                  <BookOpen className="text-white" size={28} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{subject.name} – Grade {subject.grade}</h2>
                  <p className="text-gray-600 mt-1">Teacher: {subject.teacher}</p>
                  <p className="text-gray-600 mt-2">{subject.description}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 p-4 rounded-xl">
                  <p className="text-sm text-gray-500">Course Fee</p>
                  <p className="text-2xl font-bold text-gray-900">Rs. {subject.price}</p>
                </div>
                <div className="bg-green-50 p-4 rounded-xl">
                  <p className="text-sm text-gray-500">Duration</p>
                  <p className="text-lg font-semibold text-gray-900">{subject.duration}</p>
                </div>
                <div className="bg-amber-50 p-4 rounded-xl">
                  <p className="text-sm text-gray-500">Next Batch Starts</p>
                  <p className="text-lg font-semibold text-gray-900">{subject.nextBatch}</p>
                </div>
              </div>
            </div>

            {/* Payment Methods */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Select Payment Method</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {paymentMethods.map((method) => (
                  <label
                    key={method.id}
                    className="flex items-center p-4 border-2 border-gray-200 rounded-xl cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-all"
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      defaultChecked={method.id === 1}
                      className="w-5 h-5 text-blue-600"
                    />
                    <div className="ml-4">
                      <div className="flex items-center">
                        <span className="text-2xl mr-3">{method.icon}</span>
                        <span className="font-semibold">{method.name}</span>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">{method.description}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Payment Button */}
            <button
              onClick={handlePayment}
              className="w-full py-4 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all flex items-center justify-center"
            >
              <Lock className="mr-2" size={20} />
              Pay Rs. {subject.price} & Enroll Now
            </button>

            {/* Security Note */}
            <div className="flex items-center justify-center text-sm text-gray-500">
              <Shield className="mr-2" size={16} />
              <span>Your payment is secured with SSL encryption</span>
            </div>
          </div>

          {/* Right Column - Payment Summary */}
          <div className="space-y-6">
            {/* Order Summary */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Course Fee</span>
                  <span className="font-medium">Rs. {subject.price}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Platform Fee</span>
                  <span className="font-medium">Rs. 0</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax</span>
                  <span className="font-medium">Rs. 0</span>
                </div>
                <div className="border-t pt-4">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total Amount</span>
                    <span>Rs. {subject.price}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Benefits */}
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl shadow-lg p-6 text-white">
              <h3 className="text-xl font-bold mb-4">What You Get</h3>
              <ul className="space-y-3">
                <li className="flex items-center">
                  <CheckCircle className="mr-3" size={20} />
                  <span>Full course access</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="mr-3" size={20} />
                  <span>Interactive live classes</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="mr-3" size={20} />
                  <span>Study materials & notes</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="mr-3" size={20} />
                  <span>Teacher support</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="mr-3" size={20} />
                  <span>Certificate of completion</span>
                </li>
              </ul>
            </div>

            {/* Need Help */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Need Help?</h3>
              <p className="text-gray-600 text-sm mb-4">
                Contact our support team for assistance with payments or enrollment.
              </p>
              <button className="w-full py-2.5 border border-blue-600 text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition-colors">
                Contact Support
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;