import React, { useState } from "react";
import { 
  GraduationCap, ShieldCheck, Mail, Phone, BookOpen, 
  Award, FileText, CheckCircle, Printer, ArrowLeft, Upload, Loader2 
} from "lucide-react";
import { Link } from "react-router-dom";
import api from "../../api/axios";

const TeacherApply: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    grades: "",
    educational_qualifications: "",
    about: "",
    id_number: "",
    agreement_accepted: false,
  });

  const [idPhoto, setIdPhoto] = useState<File | null>(null);
  const [idPhotoPreview, setIdPhotoPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [submittedData, setSubmittedData] = useState<any>(null);

  const [teacherLevel, setTeacherLevel] = useState<"OL" | "AL">("OL");
  const [alStream, setAlStream] = useState<string>("Biology");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, agreement_accepted: e.target.checked });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setIdPhoto(file);
      setIdPhotoPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (!formData.agreement_accepted) {
      setError("You must accept the terms of the A9 Education Platform agreement.");
      return;
    }

    if (!idPhoto) {
      setError("Please upload a photo of your ID / NIC.");
      return;
    }

    setLoading(true);
    
    // Concatenate level, stream and subject dynamically
    const finalSubject = teacherLevel === 'OL'
      ? `O/L - ${formData.subject}`
      : `A/L ${alStream} - ${formData.subject}`;

    const data = new FormData();
    data.append("name", formData.name);
    data.append("email", formData.email);
    data.append("phone", formData.phone);
    data.append("subject", finalSubject);
    data.append("grades", formData.grades);
    data.append("educational_qualifications", formData.educational_qualifications);
    data.append("about", formData.about);
    data.append("id_number", formData.id_number);
    data.append("id_photo", idPhoto);

    try {
      const response = await api.post("users/applications/apply/", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setSubmittedData(response.data);
      setSuccess(true);
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.email ? "This email address is already registered." : "Failed to submit application. Please check your inputs.");
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (success && submittedData) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 md:p-8">
        {/* Success Card */}
        <div className="w-full max-w-3xl bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 p-8 md:p-12 relative print:shadow-none print:border-none print:p-0">
          
          {/* Header (Hidden in Print) */}
          <div className="text-center mb-8 print:hidden">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 text-green-600 shadow-md">
              <CheckCircle size={36} />
            </div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">Application Submitted!</h1>
            <p className="text-gray-500 mt-2">Your application is successfully registered. You can print/download this receipt.</p>
          </div>

          {/* Printable Receipt Layout */}
          <div className="border border-gray-200 rounded-2xl p-6 md:p-10 bg-gray-50/50 print:bg-white print:border-none print:p-0">
            <div className="flex justify-between items-center border-b pb-6 mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 tracking-tight">A9 EDUCATION ACADEMY</h2>
                <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mt-1">Official Teacher Application Receipt</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-gray-800">Application ID: #{submittedData.id}</p>
                <p className="text-xs text-gray-500 mt-0.5">Date: {new Date(submittedData.created_at).toLocaleDateString()}</p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">Applicant Name</p>
                  <p className="text-sm font-bold text-gray-800 mt-0.5">{submittedData.name}</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">Email Address</p>
                  <p className="text-sm font-bold text-gray-800 mt-0.5">{submittedData.email}</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">Phone Number</p>
                  <p className="text-sm font-bold text-gray-800 mt-0.5">{submittedData.phone}</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">Subject / Field</p>
                  <p className="text-sm font-bold text-gray-800 mt-0.5">{submittedData.subject}</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">Grades Taught</p>
                  <p className="text-sm font-bold text-gray-800 mt-0.5">{submittedData.grades || "N/A"}</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">NIC / Passport Number</p>
                  <p className="text-sm font-bold text-gray-800 mt-0.5">{submittedData.id_number}</p>
                </div>
              </div>

              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">Educational Qualifications</p>
                <p className="text-sm text-gray-700 mt-1 whitespace-pre-wrap">{submittedData.educational_qualifications}</p>
              </div>

              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">About</p>
                <p className="text-sm text-gray-700 mt-1 whitespace-pre-wrap">{submittedData.about}</p>
              </div>

              {/* Agreement Text Clause */}
              <div className="bg-red-50/50 border-l-4 border-red-500 p-4 rounded-r-xl mt-6 print:bg-white print:border-l-2 print:border-gray-300">
                <p className="text-xs font-bold text-red-800 uppercase tracking-wide mb-1 print:text-black">Official Agreement & Clause</p>
                <p className="text-xs italic text-gray-700 leading-relaxed">
                  "I hereby agree to register as a teacher under the A9 Education Online Platform and promise to pay 20% of the class fees collected from each student who joins my class to this platform."
                </p>
                <div className="flex justify-between items-center mt-4 pt-4 border-t border-red-100 print:border-gray-200">
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase font-bold">Applicant Signature</p>
                    <p className="text-sm font-bold text-gray-800 italic mt-0.5">{submittedData.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-gray-400 uppercase font-bold">Status</p>
                    <p className="text-xs font-bold text-amber-600 uppercase mt-0.5">Pending Admin Approval</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons (Hidden in Print) */}
          <div className="flex flex-col sm:flex-row gap-4 mt-8 print:hidden">
            <button
              onClick={handlePrint}
              className="flex-1 py-3 px-6 bg-red-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-red-700 shadow-lg shadow-red-200 transition-all active:scale-[0.98]"
            >
              <Printer size={18} /> Print / Download Receipt
            </button>
            <Link
              to="/"
              className="flex-1 py-3 px-6 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-bold flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 py-12 px-4 md:px-8 flex items-center justify-center">
      <div className="w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden relative border border-gray-100">
        
        {/* Banner */}
        <div className="bg-gradient-to-r from-red-600 to-red-800 p-8 md:p-10 text-white relative">
          <Link to="/" className="absolute top-4 left-4 bg-white/20 p-2 rounded-full hover:bg-white/30 transition-all text-white">
            <ArrowLeft size={16} />
          </Link>
          <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mb-4 shadow-xl ring-2 ring-white/10 mx-auto sm:mx-0">
            <GraduationCap size={36} />
          </div>
          <h1 className="text-3xl font-black tracking-tight text-center sm:text-left">Teacher Application</h1>
          <p className="text-red-100 mt-2 text-center sm:text-left">Apply to join our elite teaching faculty at A9 Academy</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 md:p-10 space-y-6">
          {error && (
            <div className="bg-red-50 text-red-700 p-4 rounded-2xl text-sm font-bold border border-red-100">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:bg-white outline-none transition-all text-sm font-medium"
                placeholder="Enter your full name"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1">
                Email Address <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:bg-white outline-none transition-all text-sm font-medium"
                  placeholder="Enter your email"
                  required
                />
                <Mail className="absolute left-3 top-3 text-gray-400" size={18} />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:bg-white outline-none transition-all text-sm font-medium"
                  placeholder="Enter your phone number"
                  required
                />
                <Phone className="absolute left-3 top-3 text-gray-400" size={18} />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1">
                Teaching Level <span className="text-red-500">*</span>
              </label>
              <select
                value={teacherLevel}
                onChange={(e) => setTeacherLevel(e.target.value as "OL" | "AL")}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:bg-white outline-none transition-all text-sm font-semibold text-gray-700"
              >
                <option value="OL">Ordinary Level (O/L)</option>
                <option value="AL">Advanced Level (A/L)</option>
              </select>
            </div>

            {teacherLevel === "AL" && (
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1">
                  A/L Stream <span className="text-red-500">*</span>
                </label>
                <select
                  value={alStream}
                  onChange={(e) => setAlStream(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:bg-white outline-none transition-all text-sm font-semibold text-gray-700"
                >
                  <option value="Biology">Biology Stream</option>
                  <option value="Maths">Maths Stream</option>
                  <option value="Technology">Technology Stream</option>
                  <option value="Commerce">Commerce Stream</option>
                  <option value="Arts">Arts Stream</option>
                </select>
              </div>
            )}

            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1">
                Subject/Field <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:bg-white outline-none transition-all text-sm font-medium"
                  placeholder="Chemistry, Physics, Combined Maths, etc."
                  required
                />
                <BookOpen className="absolute left-3 top-3 text-gray-400" size={18} />
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1">
              Grades Taught <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="grades"
              value={formData.grades}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:bg-white outline-none transition-all text-sm font-medium"
              placeholder="e.g. Grade 10, Grade 11, Grade 12"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1">
              Educational Qualifications <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <textarea
                name="educational_qualifications"
                value={formData.educational_qualifications}
                onChange={handleInputChange}
                rows={3}
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:bg-white outline-none transition-all text-sm font-medium"
                placeholder="Mention your university degrees, diplomas, and relevant certificates."
                required
              />
              <Award className="absolute left-3 top-3 text-gray-400" size={18} />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1">
              About Yourself <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <textarea
                name="about"
                value={formData.about}
                onChange={handleInputChange}
                rows={3}
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:bg-white outline-none transition-all text-sm font-medium"
                placeholder="Write a brief bio about your teaching career and experience."
                required
              />
              <FileText className="absolute left-3 top-3 text-gray-400" size={18} />
            </div>
          </div>

          {/* Legal Agreement */}
          <div className="bg-red-50/70 border-2 border-dashed border-red-200 p-6 rounded-2xl space-y-4">
            <h3 className="text-sm font-bold text-red-800 uppercase tracking-wide flex items-center gap-1.5">
              <ShieldCheck size={18} /> Mandatory Platform Policy & Agreement
            </h3>
            
            <p className="text-xs italic text-gray-700 leading-relaxed bg-white p-4 rounded-xl border border-red-50 shadow-sm font-medium">
              "I hereby agree to register as a teacher under the A9 Education Online Platform and promise to pay 20% of the class fees collected from each student who joins my class to this platform."
            </p>

            <div className="flex items-start gap-3 pt-2">
              <input
                type="checkbox"
                id="agreement"
                checked={formData.agreement_accepted}
                onChange={handleCheckboxChange}
                className="mt-1 w-4 h-4 rounded text-red-600 focus:ring-red-500 border-gray-300"
              />
              <label htmlFor="agreement" className="text-xs font-bold text-gray-700 cursor-pointer select-none">
                I fully accept and pledge to adhere to this agreement. <span className="text-red-500">*</span>
              </label>
            </div>
          </div>

          {/* ID Details and NIC Upload */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 p-6 rounded-2xl border border-gray-100">
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                NIC / Passport Number <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="id_number"
                value={formData.id_number}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-200 bg-white rounded-xl focus:ring-2 focus:ring-red-500 outline-none transition-all text-sm font-bold text-gray-800"
                placeholder="Enter Identity Card Number"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block">
                NIC Photo Upload <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center gap-3">
                <label className="flex-1 flex items-center justify-center gap-2 border border-gray-200 bg-white hover:bg-gray-50 cursor-pointer py-3 rounded-xl transition-all">
                  <Upload size={16} className="text-gray-400" />
                  <span className="text-xs font-bold text-gray-600">
                    {idPhoto ? idPhoto.name.substring(0, 15) + "..." : "Select NIC Photo"}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
                {idPhotoPreview && (
                  <img
                    src={idPhotoPreview}
                    alt="NIC Preview"
                    className="w-12 h-12 rounded-lg object-cover ring-2 ring-red-500"
                  />
                )}
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 text-white rounded-2xl font-bold transition-all shadow-xl shadow-red-200/50 flex items-center justify-center gap-2 active:scale-[0.99] disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              "Submit Registration Application"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default TeacherApply;
