import React, { useEffect, useState } from "react";
import { TopContributors } from "../components/contributor/TopContributor";
import { LanguageSection } from "../components/language/LanguageSection";
import { InterviewSection } from "../components/question/InterviewSection";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export const HomePage = () => {
  const [projects, setProjects] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:8000/api/projects/all")
      .then((res) => res.json())
      .then((data) => setProjects(data.projects || []));
  }, []);

  const groupByTech = (tech) =>
    projects.filter((p) => p.techStack && p.techStack.includes(tech));

  return (
    <main className="p-4 overflow-y-auto -rotate-1">
      <button
        onClick={() => navigate("/add-project")}
        className="mb-4 bg-indigo-500 text-white px-4 py-2 rounded"
      >
        Add Project
      </button>
      <TopContributors />
      <LanguageSection
        title="🐍 Python Playground"
        projects={groupByTech("Python")}
        iconBg="from-indigo-500 to-purple-600"
      />
      <LanguageSection
        title="⚛️ React Universe"
        projects={groupByTech("React")}
        iconBg="from-indigo-600 to-indigo-800"
      />
      <LanguageSection
        title="🟢 Node.js Central"
        projects={groupByTech("Node.js")}
        iconBg="from-purple-600 to-purple-800"
      />
      <InterviewSection />
    </main>
  );
};
