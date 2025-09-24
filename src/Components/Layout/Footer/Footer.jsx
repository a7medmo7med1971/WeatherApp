import React from "react";
import { FaFacebookF, FaTwitter, FaGithub } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-gray-800 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 mt-8">
      <div className="max-w-screen-xl mx-auto px-4 py-6">
        <div className="md:flex md:justify-between md:items-start">
          {/* Logo Section */}
          <div className="mb-6 md:mb-0">
            <a href="/" className="flex items-center">
              <span className="self-center text-2xl font-bold whitespace-nowrap text-white">
                WeatherMap
              </span>
            </a>
          </div>

          {/* Links Section */}
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            <div>
              <h2 className="mb-4 text-sm font-semibold text-gray-900 uppercase dark:text-white">
                Resources
              </h2>
              <ul className="space-y-2 text-gray-500 dark:text-gray-400">
                <li>
                  <a href="https://flowbite.com/" className="hover:text-gray-900 dark:hover:text-white">
                    Flowbite
                  </a>
                </li>
                <li>
                  <a href="https://tailwindcss.com/" className="hover:text-gray-900 dark:hover:text-white">
                    Tailwind CSS
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h2 className="mb-4 text-sm font-semibold text-gray-900 uppercase dark:text-white">
                Follow us
              </h2>
              <ul className="space-y-2 text-gray-500 dark:text-gray-400">
                <li>
                  <a href="#" className="hover:text-gray-900 dark:hover:text-white">
                    Github
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-gray-900 dark:hover:text-white">
                    Discord
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h2 className="mb-4 text-sm font-semibold text-gray-900 uppercase dark:text-white">
                Legal
              </h2>
              <ul className="space-y-2 text-gray-500 dark:text-gray-400">
                <li>
                  <a href="#" className="hover:text-gray-900 dark:hover:text-white">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-gray-900 dark:hover:text-white">
                    Terms & Conditions
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Divider */}
        <hr className="my-6 border-gray-200 dark:border-gray-700" />

        {/* Bottom Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <span className="text-sm text-gray-500 dark:text-gray-400 mb-4 sm:mb-0">
            © {new Date().getFullYear()} FreshCart. All Rights Reserved.
          </span>

          {/* Social Icons */}
          <div className="flex space-x-5">
            <a href="#" className="text-gray-500 hover:text-gray-900 dark:hover:text-white">
              <FaFacebookF size={18} />
            </a>
            <a href="#" className="text-gray-500 hover:text-gray-900 dark:hover:text-white">
              <FaTwitter size={18} />
            </a>
            <a href="#" className="text-gray-500 hover:text-gray-900 dark:hover:text-white">
              <FaGithub size={18} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
