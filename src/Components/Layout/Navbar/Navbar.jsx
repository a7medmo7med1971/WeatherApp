import React, { useState } from "react";
import { Cloud, Menu, X } from "lucide-react";
import { Link } from "react-router-dom";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-gradient-to-r from-blue-600 via-purple-600 to-purple-700 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <div className="bg-white/20 backdrop-blur-sm p-2 rounded-lg">
              <Cloud className="w-7 h-7 text-white" />
            </div>
            <Link to={"/"} className="text-2xl font-bold text-white tracking-tight">
              Climate Intelligence
            </Link>
          </div>

          <div className="hidden md:block">
            <div className="flex items-center space-x-1">
              <Link
                to={"/Dashboard"}
                className="text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-white/20 backdrop-blur-sm transition-all duration-200"
              >
                Dashboard
              </Link>
              <Link
                to={"/DashboardGovsEgypt"}
                className="text-white/90 px-4 py-2 rounded-lg text-sm font-medium hover:bg-white/20 hover:text-white backdrop-blur-sm transition-all duration-200"
              >
                Layers
              </Link>
              <Link
                to={"#analytics"}
                className="text-white/90 px-4 py-2 rounded-lg text-sm font-medium hover:bg-white/20 hover:text-white backdrop-blur-sm transition-all duration-200"
              >
                Analytics
              </Link>
              <Link
                to={"#alerts"}
                className="text-white/90 px-4 py-2 rounded-lg text-sm font-medium hover:bg-white/20 hover:text-white backdrop-blur-sm transition-all duration-200"
              >
                Alerts
              </Link>
              <button className="ml-4 bg-white text-purple-600 px-5 py-2 rounded-lg text-sm font-semibold hover:bg-purple-50 transition-all duration-200 shadow-md hover:shadow-lg">
                Get Started
              </button>
            </div>
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-white p-2 rounded-lg hover:bg-white/20 transition-all duration-200"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-white/10 backdrop-blur-md">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link
              to={"/Dashboard"}
              className="text-white block px-3 py-2 rounded-lg text-base font-medium hover:bg-white/20 transition-all duration-200"
            >
              Dashboard
            </Link>
            <Link
                to={"/DashboardGovsEgypt"}
              className="text-white/90 block px-3 py-2 rounded-lg text-base font-medium hover:bg-white/20 hover:text-white transition-all duration-200"
            >
              Layers
            </Link>
            <Link
              to={"#analytics"}
              className="text-white/90 block px-3 py-2 rounded-lg text-base font-medium hover:bg-white/20 hover:text-white transition-all duration-200"
            >
              Analytics
            </Link>
            <Link
              to={"#alerts"}
              className="text-white/90 block px-3 py-2 rounded-lg text-base font-medium hover:bg-white/20 hover:text-white transition-all duration-200"
            >
              Alerts
            </Link>
            <button className="w-full mt-2 bg-white text-purple-600 px-4 py-2 rounded-lg text-base font-semibold hover:bg-purple-50 transition-all duration-200">
              Get Started
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}