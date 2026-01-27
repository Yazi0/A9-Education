import React, { useState } from 'react';
import { X, Lock, Shield, CheckCircle, CreditCard, Building, Smartphone, Wallet } from 'lucide-react';
import type { BankDetails, CardDetails, Class, MobileDetails, MobileProvider, PaymentMethod } from '../models/Class';


interface PaymentPopupProps {
  selectedClass: Class;
  showPaymentPopup: boolean;
  onClose: () => void;
  onPaymentComplete: () => void;
}

const PaymentPopup: React.FC<PaymentPopupProps> = ({
  selectedClass,
  showPaymentPopup,
  onClose,
  onPaymentComplete,
}) => {
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [paymentStep, setPaymentStep] = useState<"method" | "details">("method");
  const [cardDetails, setCardDetails] = useState<CardDetails>({
    cardNumber: "",
    cardName: "",
    expiryDate: "",
    cvv: ""
  });
  const [bankDetails, setBankDetails] = useState<BankDetails>({
    accountNumber: "",
    bankName: "",
    branch: ""
  });
  const [mobileDetails, setMobileDetails] = useState<MobileDetails>({
    provider: "dialog",
    mobileNumber: "",
    pin: ""
  });

  const paymentMethods: PaymentMethod[] = [
    { id: "card", name: "Credit/Debit Card", icon: <CreditCard className="text-red-600" size={24} />, description: "Visa, MasterCard, Amex" },
    { id: "bank", name: "Bank Transfer", icon: <Building className="text-blue-600" size={24} />, description: "Direct bank payment" },
    { id: "mobile", name: "Mobile Wallet", icon: <Smartphone className="text-green-600" size={24} />, description: "Dialog, Mobitel, Airtel" },
    { id: "cash", name: "Cash Payment", icon: <Wallet className="text-amber-600" size={24} />, description: "Pay at our office" }
  ];

  const mobileProviders: MobileProvider[] = [
    { id: "dialog", name: "Dialog eZ Cash" },
    { id: "mobitel", name: "Mobitel mCash" },
    { id: "airtel", name: "Airtel Money" },
    { id: "hutch", name: "Hutch Pay" }
  ];

  const banks = [
    "Bank of Ceylon",
    "People's Bank",
    "Commercial Bank",
    "Hatton National Bank",
    "Sampath Bank",
    "NDB Bank",
    "DFCC Bank",
    "Pan Asia Bank"
  ];

  const handlePaymentMethodSelect = (method: string) => {
    setPaymentMethod(method);
    setPaymentStep("details");
  };

  const handlePayment = () => {
    // Validate based on payment method
    let isValid = false;
    
    switch(paymentMethod) {
      case "card":
        isValid = cardDetails.cardNumber.length === 16 && 
                 cardDetails.cardName.trim() !== "" &&
                 cardDetails.expiryDate.length === 5 &&
                 cardDetails.cvv.length === 3;
        break;
      case "bank":
        isValid = bankDetails.accountNumber.length > 5 &&
                 bankDetails.bankName.trim() !== "" &&
                 bankDetails.branch.trim() !== "";
        break;
      case "mobile":
        isValid = mobileDetails.mobileNumber.length === 10 &&
                 mobileDetails.pin.length === 4;
        break;
      case "cash":
        isValid = true; // No validation needed for cash
        break;
    }

    if (!isValid) {
      alert("Please fill in all required payment details correctly.");
      return;
    }

    // Simulate payment processing
    setTimeout(() => {
      alert(`Payment successful! You are now enrolled in ${selectedClass.name}.`);
      onPaymentComplete();
    }, 1500);
  };

  const renderPaymentDetails = () => {
    switch(paymentMethod) {
      case "card":
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Card Number</label>
              <input
                type="text"
                maxLength={16}
                placeholder="1234 5678 9012 3456"
                value={cardDetails.cardNumber}
                onChange={(e) => setCardDetails({...cardDetails, cardNumber: e.target.value.replace(/\D/g, '')})}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Cardholder Name</label>
              <input
                type="text"
                placeholder="John Doe"
                value={cardDetails.cardName}
                onChange={(e) => setCardDetails({...cardDetails, cardName: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Expiry Date</label>
                <input
                  type="text"
                  maxLength={5}
                  placeholder="MM/YY"
                  value={cardDetails.expiryDate}
                  onChange={(e) => {
                    let value = e.target.value.replace(/\D/g, '');
                    if (value.length >= 2) {
                      value = value.slice(0, 2) + '/' + value.slice(2, 4);
                    }
                    setCardDetails({...cardDetails, expiryDate: value});
                  }}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">CVV</label>
                <input
                  type="password"
                  maxLength={3}
                  placeholder="123"
                  value={cardDetails.cvv}
                  onChange={(e) => setCardDetails({...cardDetails, cvv: e.target.value.replace(/\D/g, '')})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500"
                />
              </div>
            </div>
          </div>
        );

      case "bank":
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Bank Name</label>
              <select
                value={bankDetails.bankName}
                onChange={(e) => setBankDetails({...bankDetails, bankName: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500"
              >
                <option value="">Select Bank</option>
                {banks.map((bank) => (
                  <option key={bank} value={bank}>{bank}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Account Number</label>
              <input
                type="text"
                placeholder="Enter your account number"
                value={bankDetails.accountNumber}
                onChange={(e) => setBankDetails({...bankDetails, accountNumber: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Branch</label>
              <input
                type="text"
                placeholder="Enter branch name"
                value={bankDetails.branch}
                onChange={(e) => setBankDetails({...bankDetails, branch: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500"
              />
            </div>
            <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
              <p className="text-sm text-blue-800 font-medium mb-2">Bank Transfer Instructions:</p>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Bank: A9 Education Center Account</li>
                <li>• Account No: 1234567890</li>
                <li>• Bank: Bank of Ceylon, Galle Branch</li>
                <li>• Reference: Your name + {selectedClass?.name}</li>
              </ul>
            </div>
          </div>
        );

      case "mobile":
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Mobile Service Provider</label>
              <select
                value={mobileDetails.provider}
                onChange={(e) => setMobileDetails({...mobileDetails, provider: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500"
              >
                {mobileProviders.map((provider) => (
                  <option key={provider.id} value={provider.id}>{provider.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Mobile Number</label>
              <input
                type="tel"
                placeholder="07X XXX XXXX"
                value={mobileDetails.mobileNumber}
                onChange={(e) => setMobileDetails({...mobileDetails, mobileNumber: e.target.value.replace(/\D/g, '').slice(0, 10)})}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">PIN</label>
              <input
                type="password"
                maxLength={4}
                placeholder="Enter 4-digit PIN"
                value={mobileDetails.pin}
                onChange={(e) => setMobileDetails({...mobileDetails, pin: e.target.value.replace(/\D/g, '')})}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500"
              />
            </div>
            <div className="bg-green-50 p-4 rounded-xl border border-green-200">
              <p className="text-sm text-green-800 font-medium mb-2">Payment Steps:</p>
              <ol className="text-sm text-green-700 space-y-1 list-decimal list-inside">
                <li>Open your mobile wallet app</li>
                <li>Select "Pay Bill" or "Merchant Payment"</li>
                <li>Enter Merchant ID: A9EDU001</li>
                <li>Enter Amount: Rs. {selectedClass?.price}</li>
                <li>Confirm payment with PIN</li>
              </ol>
            </div>
          </div>
        );

      case "cash":
        return (
          <div className="space-y-4">
            <div className="bg-amber-50 p-6 rounded-xl border border-amber-200">
              <div className="flex items-start">
                <Wallet className="text-amber-600 mr-3 mt-1" size={24} />
                <div>
                  <h4 className="text-lg font-bold text-amber-800 mb-2">Cash Payment Instructions</h4>
                  <p className="text-amber-700 mb-4">
                    Visit our office to complete the payment in person. Bring this reference number with you:
                  </p>
                  <div className="bg-white p-4 rounded-lg border border-amber-300">
                    <p className="text-center font-mono text-xl font-bold text-amber-800">
                      REF-{selectedClass?.id}-{Date.now().toString().slice(-6)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-xl border border-gray-200">
              <h5 className="font-bold text-gray-900 mb-3">Office Details:</h5>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-center">
                  <span className="font-medium w-24">Address:</span>
                  <span>A9 Education Center, Galle Road, Galle, Sri Lanka</span>
                </li>
                <li className="flex items-center">
                  <span className="font-medium w-24">Hours:</span>
                  <span>Monday - Friday: 8:00 AM - 6:00 PM</span>
                </li>
                <li className="flex items-center">
                  <span className="font-medium w-24">Contact:</span>
                  <span>+94 91 223 4455</span>
                </li>
                <li className="flex items-center">
                  <span className="font-medium w-24">Email:</span>
                  <span>payments@a9education.lk</span>
                </li>
              </ul>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (!showPaymentPopup) return null;

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="sticky top-0 bg-white z-10 p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Complete Enrollment</h2>
              <p className="text-gray-600 mt-1">{selectedClass.name} - {selectedClass.level}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X size={24} className="text-gray-500" />
            </button>
          </div>
          
          {/* Progress Steps */}
          <div className="flex items-center mt-4">
            <div className={`flex items-center ${paymentStep === "method" ? "text-red-600" : "text-green-600"}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${paymentStep === "method" ? "bg-red-100" : "bg-green-100"}`}>
                1
              </div>
              <span className="ml-2 font-medium">Select Method</span>
            </div>
            <div className={`h-1 w-12 mx-2 ${paymentStep === "details" ? "bg-green-500" : "bg-gray-300"}`}></div>
            <div className={`flex items-center ${paymentStep === "details" ? "text-red-600" : "text-gray-400"}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${paymentStep === "details" ? "bg-red-100" : "bg-gray-100"}`}>
                2
              </div>
              <span className="ml-2 font-medium">Payment Details</span>
            </div>
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-6">
          {paymentStep === "method" ? (
            <div className="space-y-6">
              {/* Order Summary */}
              <div className="bg-gradient-to-r from-red-50 to-red-100 rounded-2xl p-6">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{selectedClass.name}</h3>
                    <p className="text-gray-700">Teacher: {selectedClass.teacher}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Total Amount</p>
                    <p className="text-3xl font-bold text-red-600">Rs. {selectedClass.price}</p>
                  </div>
                </div>
              </div>

              {/* Payment Methods */}
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Choose Payment Method</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {paymentMethods.map((method) => (
                    <button
                      key={method.id}
                      onClick={() => handlePaymentMethodSelect(method.id)}
                      className={`p-6 border-2 rounded-2xl transition-all text-left ${
                        paymentMethod === method.id
                          ? "border-red-500 bg-red-50"
                          : "border-gray-200 hover:border-red-300 hover:bg-red-50"
                      }`}
                    >
                      <div className="flex items-center">
                        <div className="p-3 bg-white rounded-xl mr-4">
                          {method.icon}
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-900">{method.name}</h4>
                          <p className="text-sm text-gray-600 mt-1">{method.description}</p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column - Payment Details */}
              <div className="lg:col-span-2 space-y-6">
                {/* Payment Method Header */}
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center">
                      <div className="p-3 bg-red-100 rounded-xl mr-4">
                        {paymentMethods.find(m => m.id === paymentMethod)?.icon}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">
                          {paymentMethods.find(m => m.id === paymentMethod)?.name}
                        </h3>
                        <p className="text-gray-600">
                          {paymentMethods.find(m => m.id === paymentMethod)?.description}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setPaymentStep("method")}
                      className="text-red-600 hover:text-red-800 font-medium"
                    >
                      Change Method
                    </button>
                  </div>

                  {/* Payment Details Form */}
                  <div className="space-y-6">
                    <h4 className="font-bold text-gray-900 text-lg">Payment Details</h4>
                    {renderPaymentDetails()}
                  </div>
                </div>

                {/* Payment Button */}
                <button
                  onClick={handlePayment}
                  className="w-full py-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all flex items-center justify-center"
                >
                  <Lock className="mr-2" size={20} />
                  Pay Rs. {selectedClass.price} & Complete Enrollment
                </button>

                {/* Security Note */}
                <div className="flex items-center justify-center text-sm text-gray-500">
                  <Shield className="mr-2" size={16} />
                  <span>Your payment is secured with SSL encryption</span>
                </div>
              </div>

              {/* Right Column - Order Summary */}
              <div className="space-y-6">
                {/* Order Summary */}
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Course Fee</span>
                      <span className="font-medium">Rs. {selectedClass.price}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Platform Fee</span>
                      <span className="font-medium text-green-600">FREE</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tax</span>
                      <span className="font-medium">Rs. 0</span>
                    </div>
                    <div className="border-t pt-4">
                      <div className="flex justify-between text-lg font-bold">
                        <span>Total Amount</span>
                        <span className="text-red-600">Rs. {selectedClass.price}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Benefits */}
                <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-2xl shadow-lg p-6 text-white">
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
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentPopup;