import React from 'react';

export const CategoryItem = ({ name, count }) => {
  return (
    <div className="flex justify-between items-center p-4 mb-3 bg-gray-50 rounded-2xl border-2 border-gray-200 transition-all duration-300 hover:translate-x-2 hover:shadow-lg">
      <span className="text-gray-800 font-semibold">{name}</span>
      <span className="bg-gradient-to-r from-purple-400 to-purple-600 text-white px-4 py-2 rounded-2xl text-sm font-semibold shadow-lg border-2 border-white">
        {count}
      </span>
    </div>
  );
}; 