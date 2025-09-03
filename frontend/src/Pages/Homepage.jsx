import React, { useEffect, useState } from "react";
import { TopContributors } from "../components/contributor/TopContributor";
import { LanguageSection } from "../components/language/LanguageSection";
import { InterviewSection } from "../components/question/InterviewSection";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import API from "../utils/API";
import { Button } from "../components/ui/UI_Components";

export const HomePage = () => {
  const [projects, setProjects] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${API}/projects/all`)
      .then((res) => res.json())
      .then((data) => setProjects(data.projects || []));
  }, []);

  const groupByTech = (tech) =>
    projects.filter((p) => p.techStack && p.techStack.includes(tech));

  return (
    <main className="p-4 overflow-y-auto -rotate-1">
      <Button className="mb-4" onClick={() => navigate("/add-project")}>
        Add Project
      </Button>
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
        title="🟢 Node Central"
        projects={groupByTech("Node")}
        iconBg="from-purple-600 to-purple-800"
      />
      <InterviewSection />
    </main>
  );
};
