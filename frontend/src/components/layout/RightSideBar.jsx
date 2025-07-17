import React from 'react';
import { Card } from '../ui/Card';
import { StatItem } from '../category/StatItem';
import { CategoryItem } from '../category/CategoryItem';

export const RightSidebar = () => {
  const categories = [
    { name: 'Web Dev', count: '234' },
    { name: 'Mobile Apps', count: '156' },
    { name: 'AI/ML', count: '89' },
    { name: 'Data Science', count: '67' },
    { name: 'DevOps', count: '45' }
  ];
  
  return (
    <Card className="-rotate-1">
      {/* Member Statistics */}
      <div className="mb-8">
        <h3 className="text-xl font-bold text-center mb-6 text-gray-800 pb-3 border-b-3 border-dashed border-purple-400 font-['Fredoka']">
          📊 Squad Stats
        </h3>
        <div className="bg-gradient-to-r from-gray-100 to-gray-200 p-6 rounded-2xl mb-6 border-3 border-gray-300 rotate-1 flex justify-between">
          <StatItem number="12.5K" label="Total Coders" />
          <StatItem number="2.8K" label="Active Devs" />
        </div>
      </div>
      
      {/* Categories */}
      <div>
        <h3 className="text-xl font-bold text-center mb-6 text-gray-800 pb-3 border-b-3 border-dashed border-purple-400 font-['Fredoka']">
          🏷️ Hot Categories
        </h3>
        {categories.map((category, index) => (
          <CategoryItem key={index} {...category} />
        ))}
      </div>
    </Card>
  );
}; 