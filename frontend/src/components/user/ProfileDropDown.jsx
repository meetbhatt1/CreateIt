import React from 'react';

export const ProfileDropdown = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  
  return (
    <div className="absolute top-16 right-0 bg-white rounded-2xl shadow-xl p-6 min-w-[220px] border-3 border-purple-300 rotate-2 z-50">
      <div className="text-indigo-500 font-bold text-lg mb-4 pb-2 border-b-2 border-dashed border-indigo-200">
        Hey there, buddy! 👋
      </div>
      <div className="space-y-2">
        <div className="p-3 cursor-pointer hover:bg-gray-100 rounded-lg hover:translate-x-1 transition-all duration-300">
          ⚙️ Settings
        </div>
        <div className="p-3 cursor-pointer hover:bg-gray-100 rounded-lg hover:translate-x-1 transition-all duration-300">
          👋 Logout
        </div>
      </div>
    </div>
  );
}; 