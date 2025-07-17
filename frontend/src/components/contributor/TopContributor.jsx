import React from "react";
import { Card } from "../ui/Card";
import { Contributor } from "../contributor/Contributor";

export const TopContributors = () => {
  const contributors = [
    { name: "Rahul S.", avatar: "R" },
    { name: "Priya P.", avatar: "P" },
    { name: "Amit K.", avatar: "A" },
  ];

  return (
    <Card className="mb-8 relative">
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-800 font-['Fredoka']">
        🏆 Campus Code Stars! 🌟
      </h2>
      <div className="flex justify-center gap-8">
        {contributors.map((contributor, index) => (
          <Contributor key={index} {...contributor} />
        ))}
      </div>
      <div className="absolute top-5 right-8 text-2xl opacity-70">🎉</div>
    </Card>
  );
};
