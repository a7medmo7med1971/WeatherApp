import React, { useState, useEffect } from "react";
import { FaArrowUp } from "react-icons/fa";

export default function BackToTopButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 200) {
        // يظهر الزر لما المستخدم ينزل أكتر من 200px
        setVisible(true);
      } else {
        // يخفي الزر تمامًا لما يكون في الأعلى
        setVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    visible && (
      <button
  onClick={scrollToTop}
  className="fixed bottom-24 right-4 p-4 rounded-full shadow-lg 
  bg-gradient-to-r from-sky-400 via-blue-500 to-indigo-500 
  text-white transition-all duration-300 hover:scale-110 
  hover:shadow-2xl animate-pulse hover:animate-none z-50 cursor-pointer"
  aria-label="الرجوع لأعلى الصفحة"
>
  <FaArrowUp className="text-xl drop-shadow-md" />
</button>

    )
  );
}
