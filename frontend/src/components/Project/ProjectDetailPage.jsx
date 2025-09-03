// src/components/Project/ProjectDetailPage.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Globe, Users, FileText } from "lucide-react";
import { Button } from "../ui/UI_Components";
import API from "../../utils/API";

const ProjectDetailPage = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [isOwner, setIsOwner] = useState(false);
  const [filePreviews, setFilePreviews] = useState({}); // store preview snippets

  // Fetch project details
  useEffect(() => {
    const fetchProject = async () => {
      try {
        if (!projectId) return console.log("No id");
        setLoading(true);
        const res = await axios.get(`${API}/projects/${projectId}`);
        setProject(res.data);
        setIsOwner(res.data?.ownerId === user?._id);
      } catch (error) {
        console.error("Failed to fetch project:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [projectId, user?._id]);

  // Fetch file previews (first 20 lines)
  useEffect(() => {
    const fetchFilePreviews = async () => {
      if (!project?.zipFiles) return;

      const previews = {};
      for (const fileKey of ["frontend", "backend", "envFile", "dbFile"]) {
        const filePath = project.zipFiles[fileKey];
        if (filePath) {
          try {
            const res = await fetch(`/${filePath}`);
            const text = await res.text();
            // Take first 20 lines
            previews[fileKey] = text.split("\n").slice(0, 20).join("\n");
          } catch (err) {
            console.error(`Error fetching ${fileKey} preview:`, err);
          }
        }
      }
      setFilePreviews(previews);
    };

    fetchFilePreviews();
  }, [project]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin h-12 w-12 border-4 border-purple-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-700">Project not found</h2>
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => navigate("/")}
        >
          Back to Projects
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Project Header */}
      <div className="bg-white shadow-lg rounded-xl p-6 mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              {project.title}
            </h1>
            <p className="text-gray-600 mt-2">{project.description}</p>
            <div className="mt-4 flex items-center gap-3">
              <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm flex items-center gap-1">
                <Globe className="w-4 h-4" /> {project.domain}
              </span>
              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm flex items-center gap-1">
                <Users className="w-4 h-4" /> {project.collaborationType}
              </span>
            </div>
          </div>

          {isOwner && (
            <Button
              variant="secondary"
              onClick={() => navigate(`/projects/${projectId}/edit`)}
            >
              Edit Project
            </Button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-8">
        <nav className="flex space-x-8">
          {["overview", "files", "screenshots", "settings"].map((tab) => (
            <button
              key={tab}
              className={`py-4 px-1 text-sm font-medium border-b-2 ${
                activeTab === tab
                  ? "border-purple-500 text-purple-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-xl shadow-md p-6">
        {/* Overview */}
        {activeTab === "overview" && (
          <div>
            <h2 className="text-xl font-bold mb-6">Project Overview</h2>
            <p className="text-gray-700 mb-4">{project.description}</p>

            <h3 className="font-semibold mb-2">Tech Stack</h3>
            <div className="flex flex-wrap gap-2 mb-6">
              {project.techStack?.map((tech, i) => (
                <span
                  key={i}
                  className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Files */}
        {activeTab === "files" && (
          <div>
            <h2 className="text-xl font-bold mb-6">Uploaded Files</h2>
            <ul className="space-y-6">
              {["frontend", "backend", "envFile", "dbFile"].map((fileKey) => {
                const filePath = project.zipFiles?.[fileKey];

                return (
                  <li
                    key={fileKey}
                    className="border rounded-lg p-4 shadow-sm bg-gray-50"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <FileText className="w-5 h-5 text-purple-500" />
                        <span className="capitalize">{fileKey}</span>
                      </div>
                      {filePath ? (
                        <a
                          href={`/${filePath}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-purple-600 hover:underline"
                        >
                          Download
                        </a>
                      ) : (
                        <span className="text-gray-400">Not uploaded</span>
                      )}
                    </div>

                    {/* Code Snippet Preview */}
                    {filePreviews[fileKey] && (
                      <pre className="bg-black text-green-400 text-sm rounded-lg p-3 overflow-x-auto mt-2 max-h-64">
                        <code>{filePreviews[fileKey]}</code>
                      </pre>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        {/* Screenshots */}
        {activeTab === "screenshots" && (
          <div>
            <h2 className="text-xl font-bold mb-6">Project Screenshots</h2>
            {project.screenshots?.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {project.screenshots.map((img, i) => (
                  <img
                    key={i}
                    src={img}
                    alt={`Screenshot ${i + 1}`}
                    className="rounded-lg shadow-md"
                  />
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No screenshots uploaded.</p>
            )}
          </div>
        )}

        {/* Settings */}
        {activeTab === "settings" && isOwner && (
          <div>
            <h2 className="text-xl font-bold mb-6">Project Settings</h2>
            <div className="space-y-4">
              <Button
                variant="outline"
                onClick={() => navigate(`/projects/${projectId}/edit`)}
              >
                Edit Project Info
              </Button>
              <Button
                variant="outline"
                className="border-red-500 text-red-500"
                onClick={() => alert("Delete project functionality")}
              >
                Delete Project
              </Button>
            </div>
          </div>
        )}

        {activeTab === "settings" && !isOwner && (
          <p className="text-gray-500">
            Only the project owner can modify settings.
          </p>
        )}
      </div>
    </div>
  );
};

export default ProjectDetailPage;
