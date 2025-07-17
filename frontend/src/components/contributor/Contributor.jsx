import React from 'react';

export const Contributor = ({ name, avatar }) => {
  return (
    <div className="text-center transition-all duration-300 hover:-translate-y-3 hover:rotate-6">
      <div className="w-20 h-20 rounded-full bg-gradient-to-r from-purple-400 to-purple-600 flex items-center justify-center text-white font-bold text-2xl mb-3 shadow-lg border-4 border-white">
        {avatar}
      </div>
      <div className="text-gray-600 font-semibold">{name}</div>
    </div>
  );
}; 