import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../../redux/AuthSlice";
import { Button } from "./UI_Components";
import { BellIcon } from "lucide-react";

export const Navbar = ({ heading = "🚀 CreateIt" }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const user = JSON.parse(localStorage.getItem("user"));
  const userName = user?.fullName;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout()); // Clear Redux state
    localStorage.removeItem("token"); // Remove token
    localStorage.removeItem("user"); // Remove user data
    navigate("/auth");
  };

  const unreadCount = 99;

  return (
    <header className="col-span-full font-[fredoka] bg-gradient-to-r from-[#667eea] to-[#764ba2] rounded-[25px] shadow-[0_8px_25px_rgba(102,126,234,0.4)] flex justify-between items-center px-8 py-1.75 relative z-[1000] -rotate-[1deg] mb-2">
      <div className="font-fredoka text-[2.2rem] font-bold text-white [text-shadow:3px_3px_0px_rgba(0,0,0,0.2)] rotate-2">
        {heading}
      </div>
      <div className="relative flex fles-row justify-between">
        <div className="mx-5 cursor-pointer transition-all duration-300">
          <Link to="/invitations">
            <Button variant="secondary" className="flex flex-row max-h-[55px]">
              <BellIcon className="h-7 w-7" />
              {unreadCount > 0 && (
                <span className="ml-2 bg-red-500 text-center text-white rounded-full max-h-[30px] p-1 text-xs">
                  {unreadCount}
                </span>
              )}
            </Button>
          </Link>
        </div>
        <button
          className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white border-4 border-white rounded-full w-[55px] h-[55px] font-bold text-xl transition-all duration-300 rotate-12 hover:-rotate-12 hover:scale-110 shadow-lg"
          onClick={() => setDropdownOpen((open) => !open)}
        >
          😎
        </button>
        <div
          className={`absolute top-[70px] right-0 bg-white rounded-[20px] shadow-[0_10px_30px_rgba(102,126,234,0.3)] p-6 min-w-[220px] border-[3px] border-[#b794f6] rotate-2 z-50 transition-all duration-200 ${
            dropdownOpen ? "block" : "hidden"
          }`}
        >
          <div className="text-indigo-500 font-bold text-lg mb-4 pb-2 border-b-2 border-dashed border-indigo-200">
            Hey there, {userName}! 👋
          </div>

          <div className="py-2 cursor-pointer transition-all duration-300 rounded-[10px] pl-2  hover:text-indigo-400 hover:bg-gray-100 hover:translate-x-1.5">
            <button onClick={() => navigate("/dashboard")}>📊 Dashboard</button>
          </div>
          <div className="py-2 cursor-pointer transition-all duration-300 rounded-[10px] pl-2  hover:text-indigo-400 hover:bg-gray-100 hover:translate-x-1.5">
            <button onClick={() => navigate("/settings")}>⚙️ Settings</button>
          </div>
          <div
            onClick={handleLogout}
            className="py-2 cursor-pointer transition-all duration-300 rounded-[10px] pl-2  hover:text-indigo-400 hover:bg-gray-100 hover:translate-x-1.5"
          >
            👋 Logout
          </div>
        </div>
      </div>
    </header>
  );
};
