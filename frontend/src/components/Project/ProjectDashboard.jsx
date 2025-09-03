import React, { useState, useEffect } from "react";
import axios from "axios";
import API from "../../utils/API";

export default function ProjectsDashboard() {
  const [projects, setProjects] = useState([]);
  const [error, setError] = useState("");

  const fakeProject = {
    _id: "dummy-project-id",
    title: "Sample AI Project",
    description: "A demo AI/ML project for showcasing dashboard layout.",
    domain: "AI/ML",
    techStack: ["Python", "TensorFlow", "React"],
    collaborationType: "Mentored",
    owner: "Anonymous",
    members: [
      {
        user: null,
        role: "Contributor",
        joinedAt: new Date(),
      },
    ],
  };

  const fetchMyProjects = async () => {
    try {
      const userId = await localStorage.getItem("userId");
      // const res = await axios.get(`${API}/projects/my-projects/${userId}`);
      const res = await axios.get(`${API}/projects/my-projects/${userId}`);
      console.log(res?.data);
      if (res.data.projects.length === 0) {
        setProjects([fakeProject]);
      } else {
        setProjects(res.data.projects);
      }
    } catch (err) {
      setError("Failed to load projects");
    }
  };

  useEffect(() => {
    fetchMyProjects();
  }, []);

  const handleDelete = async (projectId) => {
    // Prevent deleting the fake project
    if (projectId === "dummy-project-id") return;

    try {
      await axios.delete(`/api/projects/${projectId}`);
      setProjects((prev) => prev.filter((p) => p._id !== projectId));
    } catch (err) {
      setError("Delete failed - you can only delete your own projects");
    }
  };

  return (
    <div className="min-h-screen bg-white-40 py-10 px-4 sm:px-8">
      <h1 className="text-3xl font-bold text-center mb-6">My Projects</h1>

      {error && (
        <div className="text-red-400 text-center mt-50 align-middle font-extrabold text-3xl">
          {error}
        </div>
      )}

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
        {projects.map((project) => (
          <div
            key={project._id}
            className="bg-white rounded-2xl shadow-md p-6 flex flex-col justify-between"
          >
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {project.title}
              </h3>
              <p className="text-gray-600 text-sm mb-2">
                {project.description}
              </p>
              <p className="text-gray-500 text-sm">
                <strong>Domain:</strong> {project.domain}
              </p>
              <p className="text-gray-500 text-sm">
                <strong>Collab Type:</strong> {project.collaborationType}
              </p>
              <p className="text-gray-500 text-sm">
                <strong>Tech Stack:</strong>{" "}
                {project.techStack?.join(", ") || "N/A"}
              </p>
            </div>
            <div className="mt-4 text-right">
              {project._id !== "dummy-project-id" ? (
                <button
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition"
                  onClick={() => handleDelete(project._id)}
                >
                  Delete Project
                </button>
              ) : (
                <span className="text-gray-400 italic text-sm">
                  This is a demo project
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
