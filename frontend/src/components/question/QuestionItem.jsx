import React from 'react';

export const QuestionItem = ({ question, difficulty, rotation = '-rotate-1' }) => {
  return (
    <div className={`bg-gradient-to-r from-gray-50 to-gray-200 rounded-2xl p-6 mb-4 border-l-6 border-3 border-gray-300 transition-all duration-300 ${rotation} hover:translate-x-3 hover:rotate-1 hover:shadow-lg`}>
      <div className="text-gray-800 font-semibold mb-2">{question}</div>
      <div className="text-purple-600 font-semibold text-sm">{difficulty}</div>
    </div>
  );
}; 