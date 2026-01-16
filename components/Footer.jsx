"use client";

import Link from "next/link";
import { useAppContext } from "../context/AppContext";

function Footer() {
  const { darkMode, toggleDarkMode } = useAppContext();

  return (
    <div className="glassmorphism control-panel rounded-2xl p-4 mt-8 mb-4 flex flex-col md:flex-row justify-between items-center">
      <div className="flex space-x-3 mb-4 md:mb-0">
        <button
          onClick={toggleDarkMode}
          className="icon-btn w-10 h-10 rounded-full bg-white dark:bg-gray-700 bg-opacity-20 flex items-center justify-center"
        >
          {darkMode ? (
            <svg
              className="w-5 h-5 text-blue-200"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
                clipRule="evenodd"
              ></path>
            </svg>
          ) : (
            <svg
              className="w-5 h-5 text-gray-700"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"></path>
            </svg>
          )}
        </button>
      </div>

      <div className="w-full md:w-1/2">
        <div className="flex items-center justify-center md:justify-end">
          <span className="text-gray-600 text-sm">
            Interested in my <strong>expertise</strong>?
          </span>
          <Link
            href={"/contact"}
            className="ml-2 text-purple-600 font-medium hover:underline"
          >
            <strong>Contact Me!</strong>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Footer;
