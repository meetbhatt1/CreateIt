import React from 'react';

export const StatItem = ({ number, label }) => {
  return (
    <div className="text-center">
      <div className="text-3xl font-bold text-purple-600 font-['Fredoka']">{number}</div>
      <div className="text-gray-600 font-semibold text-sm">{label}</div>
    </div>
  );
}; 