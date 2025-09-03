// src/components/language/LanguageSection.jsx
import React from "react";
import { Card } from "../ui/Card";
import { ProjectCard } from "../ui/ProjectCard";
import { Button } from "../ui/UI_Components";
import { useNavigate } from "react-router-dom";

export const LanguageSection = ({
  title,
  icon,
  projects,
  iconBg = "from-indigo-500 to-purple-600",
}) => {
  const navigate = useNavigate();

  return (
    <Card
      className="mb-8 relative"
      rotation="-rotate-1"
      hoverRotation="rotate-1"
    >
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-4 font-['Fredoka']">
          <div
            className={`w-10 h-10 rounded-2xl bg-gradient-to-r ${iconBg} shadow-lg border-2 border-white`}
          ></div>
          {title}
        </h2>
        <Button variant="primary">See More Cool Stuff!</Button>
      </div>

      {/* Projects grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project, index) => (
          <div
            key={project._id}
            onClick={() => navigate(`/project/${project._id}`)}
            className="cursor-pointer"
          >
            <ProjectCard
              {...project}
              rotation={index % 2 === 0 ? "rotate-1" : "-rotate-1"}
            />
          </div>
        ))}
      </div>

      <div className="absolute top-5 right-8 text-2xl opacity-70">✨</div>
    </Card>
  );
};
