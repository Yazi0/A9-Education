import {
  Mail,
  Phone,
  MapPin,
  Send,
  Globe,
  MessageSquareText,
} from "lucide-react";
import { useState } from "react";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

const Contact = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Message sent successfully! (connect backend later)");
    setForm({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <div className="bg-gray-50 text-gray-800">
    <Navbar />

      {/* Hero */}
      <section className="bg-red-200 text-gray-900 py-20">
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Contact <span className="text-red-800">Us</span>
          </h1>
          <p className="max-w-3xl mx-auto text-lg text-black/70">
            Have questions? Need support? We’re here to help teachers and students across the island.
          </p>
        </div>
      </section>

      {/* Contact Content */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">

          {/* Contact Info */}
          <div>
            <h2 className="text-3xl font-bold mb-6">Get in Touch</h2>
            <p className="text-gray-600 mb-8">
              Reach out to us for inquiries about courses, teacher registration,
              student enrollment, or technical support.
            </p>

            <div className="space-y-5">
              <ContactItem
                icon={<Phone />}
                title="Phone"
                value="+94 11 234 5678"
              />
              <ContactItem
                icon={<Mail />}
                title="Email"
                value="info@a9education.com"
              />
              <ContactItem
                icon={<MapPin />}
                title="Address"
                value="Colombo, Sri Lanka (Island-wide Online Platform)"
              />
              <ContactItem
                icon={<Globe />}
                title="Service Area"
                value="All districts in Sri Lanka"
              />
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white p-8 rounded-xl shadow-md border">
            <h3 className="text-2xl font-semibold mb-6 flex items-center gap-2">
              <MessageSquareText className="text-red-600" />
              Send Us a Message
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                value={form.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
              />

              <input
                type="email"
                name="email"
                placeholder="Your Email"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
              />

              <input
                type="text"
                name="subject"
                placeholder="Subject"
                value={form.subject}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
              />

              <textarea
                name="message"
                rows={5}
                placeholder="Your Message"
                value={form.message}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 outline-none resize-none"
              />

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 bg-red-700 text-white py-3 rounded-lg font-semibold hover:bg-red-800 transition"
              >
                <Send />
                Send Message
              </button>
            </form>
          </div>

        </div>
      </section>

      {/* CTA */}
      <section className="bg-red-700 text-white py-14">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            We’re Ready to Help You Learn & Teach
          </h2>
          <p className="text-red-100 max-w-2xl mx-auto">
            Join thousands of teachers and students building a better future
            through online education.
          </p>
        </div>
      </section>
      <Footer   />

    </div>
  );
};

type ContactItemProps = {
  icon: React.ReactNode;
  title: string;
  value: string;
};

const ContactItem = ({ icon, title, value }: ContactItemProps) => (
  <div className="flex items-start gap-4">
    <div className="w-11 h-11 flex items-center justify-center bg-red-100 text-red-600 rounded-lg">
      {icon}
    </div>
    <div>
      <h4 className="font-semibold">{title}</h4>
      <p className="text-gray-600">{value}</p>
    </div>
  </div>
);

export default Contact;
