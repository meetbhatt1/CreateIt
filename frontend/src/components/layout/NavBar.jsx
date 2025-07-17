import React, { useState } from "react";

export const NavBar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  return (
    <div
      className="col-span-full bg-gradient-to-r from-[#667eea] to-[#764ba2] rounded-[25px] shadow-[0_8px_25px_rgba(102,126,234,0.4)] \
flex justify-between items-center px-8 relative z-[1000] -rotate-[1deg] m-3 top-2 p-2.5"
    >
      <h1
        className="font-fredoka text-[2.2rem] font-bold text-white \
  [text-shadow:3px_3px_0px_rgba(0,0,0,0.2)] "
      >
        DevVerse
      </h1>
      <div className="relative">
        <button
          className="bg-gradient-to-r from-indigo-400 to-indigo-600 text-white \
border-4 border-white rounded-full w-[55px] h-[55px] cursor-pointer font-bold text-[1.3rem] \
transition-all duration-300 shadow-[0_4px_15px_rgba(0,0,0,0.3)] rotate-[15deg] \
hover:rotate-[-15deg] hover:scale-110 hover:shadow-[0_6px_20px_rgba(90,103,216,0.5)]"
          onClick={() => setDropdownOpen(!dropdownOpen)}
        >
          😎
        </button>
        <div
          className={`absolute top-[70px] right-0 bg-white rounded-[20px] \
shadow-[0_10px_30px_rgba(102,126,234,0.3)] p-6 min-w-[220px] \
border-[3px] border-[#b794f6] rotate-[2deg] ${
            dropdownOpen ? "block" : "hidden"
          }`}
        >
          <div className="text-indigo-400 text-[1.1rem] mb-4 pb-2 border-b-2 border-dashed border-indigo-100">
            Hello, Meet!
          </div>
          <div
            className="py-2 cursor-pointer transition-all duration-300 rounded-[10px] pl-2  \
hover:text-indigo-400 hover:bg-gray-100 hover:translate-x-1.5"
          >
            Dashboard
          </div>
          <div
            className="py-2 cursor-pointer transition-all duration-300 rounded-[10px] pl-2  \
hover:text-indigo-400 hover:bg-gray-100 hover:translate-x-1.5"
          >
            Settings
          </div>
          <div
            className="py-2 cursor-pointer transition-all duration-300 rounded-[10px] pl-2  \
hover:text-indigo-400 hover:bg-gray-100 hover:translate-x-1.5"
          >
            LogOut
          </div>
        </div>
      </div>
    </div>
  );
} 