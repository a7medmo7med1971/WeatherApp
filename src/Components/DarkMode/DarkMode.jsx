import React, { useEffect, useState } from "react";
import { FaMoon, FaSun } from "react-icons/fa";

export default function DarkModeToggle() {
  const [darkMode, setDarkMode] = useState(false);

  // تفعيل أو إلغاء الوضع الليلي
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("light");
    }
  }, [darkMode]);

  return (
    <button
      onClick={() => setDarkMode(!darkMode)}
      className="fixed top-6 right-6 p-3 rounded-full shadow-lg 
      bg-gradient-to-r from-sky-400 via-blue-500 to-indigo-500 
      text-white transition-all duration-500 hover:scale-110 hover:shadow-2xl z-50"
      aria-label="تبديل الوضع الليلي"
    >
      {darkMode ? <FaSun className="text-xl" /> : <FaMoon className="text-xl" />}
    </button>
  );
}
