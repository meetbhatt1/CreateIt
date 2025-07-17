import React from 'react';

export const ProjectCard = ({ title, author, description, stats = { stars: 0, forks: 0, views: 0 }, rotation = 'rotate-1' }) => {
  return (
    <div className={`bg-gradient-to-br from-gray-50 to-gray-200 rounded-2xl p-6 transition-all duration-300 border-3 border-gray-300 ${rotation} hover:-translate-y-2 hover:-rotate-2 hover:shadow-xl hover:border-purple-400 relative overflow-hidden group`}>
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rotate-45 scale-150"></div>
      <div className="relative z-10">
        <h3 className="font-bold text-gray-800 mb-2 text-lg font-['Fredoka']">{title}</h3>
        <div className="text-indigo-500 font-semibold mb-3">{author}</div>
        <p className="text-gray-600 mb-4 leading-relaxed">{description}</p>
        <div className="flex justify-between text-purple-600 font-semibold">
          <span>{stats.stars}</span>
          <span>{stats.forks}</span>
          <span>{stats.views}</span>
        </div>
      </div>
    </div>
  );
};
