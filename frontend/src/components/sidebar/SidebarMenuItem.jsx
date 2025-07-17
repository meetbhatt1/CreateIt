import React from 'react';

export const SidebarMenuItem = ({ href, children, isActive = false }) => {
  return (
    <li className="mb-4 px-4">
      <a 
        href={href}
        className={`block p-4 rounded-2xl font-medium transition-all duration-300 relative
          ${isActive 
            ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white translate-x-3 -rotate-1 shadow-lg font-bold'
            : 'text-gray-600 hover:bg-gradient-to-r hover:from-indigo-500 hover:to-purple-600 hover:text-white hover:translate-x-3 hover:-rotate-1 hover:shadow-lg'
          }
        `}
      >
        {children}
      </a>
    </li>
  );
}; 