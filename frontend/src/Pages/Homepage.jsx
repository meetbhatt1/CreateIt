// HomePage.jsx
import React, { useEffect, useMemo, useState } from "react";
import { LanguageSection } from "../components/language/LanguageSection";
import { InterviewSection } from "../components/question/InterviewSection";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import API from "../utils/API";
import { Button } from "../components/ui/UI_Components";

export const HomePage = () => {
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [suggestedDevelopers, setSuggestedDevelopers] = useState([]);
  const [activeTab, setActiveTab] = useState("featured");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProjects();
    fetchUsers();
    fetchSuggestedDevelopers();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      // Fetch only completed, public projects for homepage
      const response = await axios.get(`${API}/project/public/completed`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setProjects(response.data.projects || []);
    } catch (error) {
      console.error("Error fetching projects:", error);
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${API}/users/top-contributors`);
      setUsers(response.data.users || []);
    } catch (error) {
      console.error("Error fetching users:", error);
      setUsers([]);
    }
  };

  const fetchSuggestedDevelopers = async () => {
    try {
      const response = await axios.get(`${API}/users/suggested`);
      setSuggestedDevelopers(response.data.users || []);
    } catch (error) {
      console.error("Error fetching suggested developers:", error);
      // Fallback to some users if suggested endpoint fails
      setSuggestedDevelopers(users.slice(0, 4));
    }
  };

  // Group projects by technology
  const groupByTech = (tech) =>
    projects.filter(
      (p) =>
        p.techStack &&
        p.techStack.some((stack) =>
          stack.toLowerCase().includes(tech.toLowerCase())
        )
    );

  // Get featured projects (most recent or most popular)
  const featuredProjects = useMemo(() => {
    return projects.slice(0, 6).map((project) => ({
      ...project,
      likes: Math.floor(Math.random() * 50) + 10,
      comments: Math.floor(Math.random() * 20) + 5,
      shares: Math.floor(Math.random() * 10) + 1,
    }));
  }, [projects]);

  // Get trending projects (based on engagement)
  const trendingProjects = useMemo(() => {
    return [...projects]
      .sort(() => Math.random() - 0.5)
      .slice(0, 6)
      .map((project) => ({
        ...project,
        likes: Math.floor(Math.random() * 100) + 50,
        comments: Math.floor(Math.random() * 30) + 10,
        shares: Math.floor(Math.random() * 15) + 5,
      }));
  }, [projects]);

  const ProjectCard = ({ project, onClick }) => (
    <div
      className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer border border-gray-100"
      onClick={() => onClick(project)}
    >
      <div className="p-6">
        {/* Project Header */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              {project.title}
            </h3>
            <p className="text-gray-600 text-sm line-clamp-2">
              {project.description}
            </p>
          </div>
          <span className="bg-purple-100 text-purple-600 px-3 py-1 rounded-full text-sm font-medium">
            {project.domain}
          </span>
        </div>

        {/* Tech Stack */}
        <div className="flex flex-wrap gap-2 mb-4">
          {project.techStack?.slice(0, 3).map((tech, index) => (
            <span
              key={index}
              className="bg-blue-100 text-blue-600 px-2 py-1 rounded-lg text-xs font-medium"
            >
              {tech}
            </span>
          ))}
          {project.techStack?.length > 3 && (
            <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-lg text-xs">
              +{project.techStack.length - 3} more
            </span>
          )}
        </div>

        {/* Engagement Metrics */}
        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
          <div className="flex items-center space-x-4">
            <span className="flex items-center space-x-1">
              <span className="text-red-500">❤️</span>
              <span>{project.likes || 0}</span>
            </span>
            <span className="flex items-center space-x-1">
              <span className="text-blue-500">💬</span>
              <span>{project.comments || 0}</span>
            </span>
            <span className="flex items-center space-x-1">
              <span className="text-green-500">🔄</span>
              <span>{project.shares || 0}</span>
            </span>
          </div>
          <span className="text-orange-500 font-medium">
            {project.collaborationType}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-2">
          <button
            className="flex-1 bg-purple-500 text-white py-2 px-4 rounded-lg hover:bg-purple-600 transition-colors text-sm font-medium"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/project/${project._id}`);
            }}
          >
            View Project
          </button>
          <button
            className="flex items-center justify-center w-10 h-10 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              // Like functionality
            }}
          >
            ❤️
          </button>
        </div>
      </div>
    </div>
  );

  const CommunityStats = () => (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      <div className="bg-white rounded-2xl p-6 text-center shadow-lg">
        <div className="text-3xl mb-2">🚀</div>
        <div className="text-2xl font-bold text-purple-600">
          {projects.length}
        </div>
        <div className="text-gray-600 text-sm">Active Projects</div>
      </div>
      <div className="bg-white rounded-2xl p-6 text-center shadow-lg">
        <div className="text-3xl mb-2">👥</div>
        <div className="text-2xl font-bold text-blue-600">{users.length}</div>
        <div className="text-gray-600 text-sm">Developers</div>
      </div>
      <div className="bg-white rounded-2xl p-6 text-center shadow-lg">
        <div className="text-3xl mb-2">💬</div>
        <div className="text-2xl font-bold text-green-600">
          {projects.reduce((acc, proj) => acc + (proj.comments || 0), 0)}
        </div>
        <div className="text-gray-600 text-sm">Discussions</div>
      </div>
      <div className="bg-white rounded-2xl p-6 text-center shadow-lg">
        <div className="text-3xl mb-2">❤️</div>
        <div className="text-2xl font-bold text-red-600">
          {projects.reduce((acc, proj) => acc + (proj.likes || 0), 0)}
        </div>
        <div className="text-gray-600 text-sm">Likes</div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <main className="min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-black text-gray-800 mb-4">
            Welcome to CreateIt 🚀
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Collaborate, Learn, and Build Amazing Projects with Developers
            Worldwide
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              className="bg-purple-500 hover:bg-purple-600 text-white px-8 py-3 rounded-2xl text-lg font-bold transition-all duration-300 hover:scale-105"
              onClick={() => navigate("/add-project")}
            >
              🚀 Add Your Project
            </Button>
            <Button
              className="bg-white hover:bg-gray-100 text-purple-500 border border-purple-500 px-8 py-3 rounded-2xl text-lg font-bold transition-all duration-300 hover:scale-105"
              onClick={() => navigate("/project-dashboard")}
            >
              📁 Browse All Projects
            </Button>
          </div>
        </div>

        {/* Community Stats */}
        <CommunityStats />

        {/* Main Content Tabs */}
        <div className="mb-8">
          <div className="flex space-x-4 mb-6">
            {["featured", "trending", "new"].map((tab) => (
              <button
                key={tab}
                className={`px-6 py-3 rounded-2xl font-bold transition-all duration-300 ${
                  activeTab === tab
                    ? "bg-purple-500 text-white shadow-lg scale-105"
                    : "bg-white text-gray-600 hover:bg-gray-100"
                }`}
                onClick={() => setActiveTab(tab)}
              >
                {tab === "featured" && "⭐ Featured Projects"}
                {tab === "trending" && "🔥 Trending Now"}
                {tab === "new" && "🆕 Latest Projects"}
              </button>
            ))}
          </div>

          {/* Projects Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {(activeTab === "featured"
              ? featuredProjects
              : activeTab === "trending"
              ? trendingProjects
              : projects.slice(0, 6)
            ).map((project) => (
              <ProjectCard
                key={project._id}
                project={project}
                onClick={(proj) => navigate(`/project/${proj._id}`)}
              />
            ))}
          </div>
        </div>

        {/* Language Sections */}
        <div className="space-y-12 mb-12">
          <LanguageSection
            title="🐍 Python Playground"
            description="Discover amazing Python projects from web development to data science"
            projects={groupByTech("Python")}
            iconBg="from-green-500 to-emerald-600"
            onSeeMore={() => navigate("/projects/python")}
          />
          <LanguageSection
            title="⚛️ React Universe"
            description="Explore innovative React applications and components"
            projects={groupByTech("React")}
            iconBg="from-blue-500 to-cyan-600"
            onSeeMore={() => navigate("/projects/react")}
          />
          <LanguageSection
            title="🟢 Node Central"
            description="Powerful backend projects built with Node.js"
            projects={groupByTech("Node")}
            iconBg="from-green-600 to-lime-600"
            onSeeMore={() => navigate("/projects/node")}
          />
          <LanguageSection
            title="📱 Mobile Masters"
            description="Cross-platform and native mobile applications"
            projects={groupByTech("Mobile")}
            iconBg="from-purple-500 to-pink-600"
            onSeeMore={() => navigate("/projects/mobile")}
          />
        </div>

        {/* Interview Section */}
        <div className="mb-8">
          <InterviewSection />
        </div>
      </div>
    </main>
  );
};
