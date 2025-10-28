import React from "react";
import { Cloud, Facebook, Twitter, Github, Linkedin, Mail, MapPin, Phone, ArrowRight, CloudRain, Wind, Thermometer } from "lucide-react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="relative bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white mt-20 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-64 h-64 bg-blue-500 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 py-16">
        {/* Top Section with CTA */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 md:p-12 mb-16 shadow-2xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <h3 className="text-3xl md:text-4xl font-bold mb-2">Stay Ahead of the Weather</h3>
              <p className="text-blue-100 text-lg">Get real-time alerts and insights delivered to your inbox</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl px-6 py-3.5 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 min-w-[280px]"
              />
              <button className="bg-white text-purple-600 px-8 py-3.5 rounded-xl hover:bg-purple-50 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl hover:scale-105 flex items-center justify-center gap-2">
                Subscribe
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-3 mb-6">
              <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-3 rounded-xl shadow-lg">
                <Cloud className="w-7 h-7 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Climate Intelligence
              </span>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed mb-6">
              Your trusted source for advanced meteorological insights and real-time weather intelligence worldwide.
            </p>
            
            {/* Stats */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              <div className="bg-white/5 backdrop-blur-sm rounded-lg p-3 border border-white/10">
                <CloudRain className="w-5 h-5 text-blue-400 mb-1" />
                <p className="text-xs text-gray-400">8+ Layers</p>
              </div>
              <div className="bg-white/5 backdrop-blur-sm rounded-lg p-3 border border-white/10">
                <Wind className="w-5 h-5 text-purple-400 mb-1" />
                <p className="text-xs text-gray-400">24/7 Live</p>
              </div>
              <div className="bg-white/5 backdrop-blur-sm rounded-lg p-3 border border-white/10">
                <Thermometer className="w-5 h-5 text-pink-400 mb-1" />
                <p className="text-xs text-gray-400">Global</p>
              </div>
            </div>

            {/* Social Icons */}
            <div className="flex space-x-3">
              <Link
                to="#"
                className="bg-white/10 backdrop-blur-sm p-3 rounded-xl hover:bg-blue-600 transition-all duration-300 hover:scale-110 hover:-translate-y-1 border border-white/10"
              >
                <Facebook className="w-5 h-5" />
              </Link>
              <Link
                to="#"
                className="bg-white/10 backdrop-blur-sm p-3 rounded-xl hover:bg-blue-400 transition-all duration-300 hover:scale-110 hover:-translate-y-1 border border-white/10"
              >
                <Twitter className="w-5 h-5" />
              </Link>
              <Link
                to="https://github.com/a7medmo7med1971"
                className="bg-white/10 backdrop-blur-sm p-3 rounded-xl hover:bg-gray-700 transition-all duration-300 hover:scale-110 hover:-translate-y-1 border border-white/10"
              >
                <Github className="w-5 h-5" />
              </Link>
              <Link
                to="#"
                className="bg-white/10 backdrop-blur-sm p-3 rounded-xl hover:bg-blue-700 transition-all duration-300 hover:scale-110 hover:-translate-y-1 border border-white/10"
              >
                <Linkedin className="w-5 h-5" />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <div className="w-1 h-6 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full"></div>
              Platform
            </h3>
            <ul className="space-y-3">
              {['Dashboard', 'Weather Layers', 'Analytics', 'Weather Alerts', 'API Access', 'Mobile App'].map((item) => (
                <li key={item}>
                  <Link to="/Dashboard" className="text-gray-300 hover:text-white hover:translate-x-2 inline-flex items-center gap-2 transition-all duration-200 group">
                    <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <div className="w-1 h-6 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full"></div>
              Company
            </h3>
            <ul className="space-y-3">
              {['About Us', 'Careers', 'Press Kit', 'Blog', 'Partners', 'Contact'].map((item) => (
                <li key={item}>
                  <Link to="#" className="text-gray-300 hover:text-white hover:translate-x-2 inline-flex items-center gap-2 transition-all duration-200 group">
                    <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <div className="w-1 h-6 bg-gradient-to-b from-pink-500 to-red-500 rounded-full"></div>
              Get in Touch
            </h3>
            <ul className="space-y-4">
              <li>
                <Link to="#" className="flex items-start space-x-3 text-gray-300 hover:text-white transition-colors duration-200 group">
                  <div className="bg-white/10 p-2 rounded-lg group-hover:bg-blue-600 transition-colors">
                    <MapPin className="w-5 h-5 flex-shrink-0" />
                  </div>
                  <span className="text-sm"> Weather Street<br/>Cairo, Egypt</span>
                </Link>
              </li>
              <li>
                <Link to="tel:+201234567890" className="flex items-center space-x-3 text-gray-300 hover:text-white transition-colors duration-200 group">
                  <div className="bg-white/10 p-2 rounded-lg group-hover:bg-purple-600 transition-colors">
                    <Phone className="w-5 h-5 flex-shrink-0" />
                  </div>
                  <span className="text-sm">01099229118</span>
                </Link>
              </li>
              <li>
                <Link to="mailto:info@climateintel.com" className="flex items-center space-x-3 text-gray-300 hover:text-white transition-colors duration-200 group">
                  <div className="bg-white/10 p-2 rounded-lg group-hover:bg-pink-600 transition-colors">
                    <Mail className="w-5 h-5 flex-shrink-0" />
                  </div>
                  <span className="text-sm">info@climateintel.com</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm">
              © {new Date().getFullYear()} Climate Intelligence. Crafted with for weather enthusiasts
            </p>
            <div className="flex flex-wrap justify-center gap-6 text-sm">
              <Link to="#privacy" className="text-gray-400 hover:text-white transition-colors duration-200 hover:underline">
                Privacy Policy
              </Link>
              <Link to="#terms" className="text-gray-400 hover:text-white transition-colors duration-200 hover:underline">
                Terms of Service
              </Link>
              <Link to="#cookies" className="text-gray-400 hover:text-white transition-colors duration-200 hover:underline">
                Cookie Policy
              </Link>
              <Link to="#accessibility" className="text-gray-400 hover:text-white transition-colors duration-200 hover:underline">
                Accessibility
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}