import {
  Target,
  HeartHandshake,
} from "lucide-react";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

const About = () => {
  return (
    <div className="bg-gray-50 text-gray-800">
      <Navbar />

      {/* Hero Section */}
      <section className="relative bg-red-200 text-gray-900">
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            About <span className="text-red-900">Us</span>
          </h1>
          <p className="max-w-3xl mx-auto text-lg text-gray-400">
            An island-wide online learning platform connecting qualified teachers
            and motivated students across Sri Lanka.
          </p>
        </div>
      </section>

      {/* Who We Are */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Who We Are</h2>
          <p className="text-gray-600 leading-relaxed text-lg">
            A9 Education is a modern digital education platform designed to
            empower teachers and students across the island. We enable qualified
            teachers to teach online and students from any location to learn
            without barriers.
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-10 max-w-6xl mx-auto">

            <div className="p-8 rounded-xl shadow-md border">
              <div className="flex items-center gap-3 mb-4">
                <Target className="text-red-600" />
                <h3 className="text-2xl font-semibold">Our Mission</h3>
              </div>
              <p className="text-gray-600 leading-relaxed">
                To provide equal access to quality education by connecting
                experienced teachers with students island-wide through a secure
                and user-friendly online platform.
              </p>
            </div>

            <div className="p-8 rounded-xl shadow-md border">
              <div className="flex items-center gap-3 mb-4">
                <HeartHandshake className="text-red-600" />
                <h3 className="text-2xl font-semibold">Our Vision</h3>
              </div>
              <p className="text-gray-600 leading-relaxed">
                To become Sri Lanka’s most trusted online education ecosystem,
                empowering lifelong learning for students and sustainable
                teaching opportunities for educators.
              </p>
            </div>

          </div>
        </div>
      </section>
      <Footer />

    </div>
  );
};


export default About;
