// src/components/Footer.tsx
import {
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Linkedin,
  Mail,
  Phone,
  MapPin,
  Heart,
  ArrowUp,
  Users,
  Award,
  Globe,
  Shield,
} from "lucide-react";

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const quickLinks = [
    { name: "Home", path: "/" },
    { name: "About Us", path: "/about" },
    { name: "Subjects", path: "/courses" },
    { name: "Teachers", path: "/teachers" },
    { name: "Contact", path: "/contact" },
  ];

  const subjects = [
    { name: "Mathematics", level: "O/L & A/L" },
    { name: "Science", level: "O/L & A/L" },
    { name: "English", level: "All Grades" },
    { name: "ICT", level: "O/L & A/L" },
    { name: "Commerce", level: "A/L" },
    { name: "Art", level: "A/L" },
  ];

  const socialLinks = [
    { icon: <Facebook />, name: "Facebook", url: "#" },
    { icon: <Twitter />, name: "Twitter", url: "#" },
    { icon: <Instagram />, name: "Instagram", url: "#" },
    { icon: <Youtube />, name: "YouTube", url: "#" },
    { icon: <Linkedin />, name: "LinkedIn", url: "#" },
  ];

  const contactInfo = [
    { icon: <MapPin />, text: "123 Education Street, Colombo 07, Sri Lanka" },
    { icon: <Phone />, text: "+94 11 234 5678" },
    { icon: <Mail />, text: "info@a9education.com" },
  ];

  return (
    <footer className="relative bg-red-700 text-white">
      {/* Scroll to top */}
      <button
        onClick={scrollToTop}
        className="fixed bottom-6 right-6 z-50 w-12 h-12 bg-white text-red-700 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition"
      >
        <ArrowUp />
      </button>

      {/* Main Footer */}
      <div className="container mx-auto px-4 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-5">
              <img
                src="/icon.png"
                alt="A9 Education Logo"
                className="w-12 h-12 rounded-lg"
              />
              <div>
                <h2 className="text-2xl font-bold">A9 Education</h2>
                <p className="text-sm text-red-200">Future of Learning</p>
              </div>
            </div>

            <p className="text-red-100 mb-6">
              Empowering students with quality education through innovative
              teaching methods and modern technology.
            </p>

            <div className="flex gap-4">
              {socialLinks.map((s, i) => (
                <a
                  key={i}
                  href={s.url}
                  className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center hover:bg-white hover:text-red-700 transition"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-5 flex items-center gap-2">
              <Users /> Quick Links
            </h3>
            <ul className="space-y-2">
              {quickLinks.map((link, i) => (
                <li key={i}>
                  <a
                    href={link.path}
                    className="text-red-100 hover:text-white transition"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Courses */}
          <div>
            <h3 className="text-lg font-semibold mb-5 flex items-center gap-2">
              <Award /> Popular Subjects
            </h3>
            <ul className="space-y-3">
              {subjects.map((subject, i) => (
                <li key={i} className="flex justify-between text-red-100">
                  <span>{subject.name}</span>
                  <span className="text-xs bg-white/20 px-2 py-1 rounded">
                    {subject.level}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-5 flex items-center gap-2">
              <Globe /> Contact Us
            </h3>

            <div className="space-y-4">
              {contactInfo.map((info, i) => (
                <div key={i} className="flex items-start gap-3 text-red-100">
                  {info.icon}
                  <p>{info.text}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 bg-white/20 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="text-green-300" />
                <span className="font-medium">Trust & Safety</span>
              </div>
              <p className="text-sm text-red-100">
                Certified by Ministry of Education • Secure Payments • Privacy Protected
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/20">
        <div className="container mx-auto px-4 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-red-100">
            © {new Date().getFullYear()} A9 Education. All rights reserved.
          </p>

          <div className="flex items-center gap-2 text-sm text-red-100">
            <Heart className="text-pink-300 fill-current" />
            Made with passion for education
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
