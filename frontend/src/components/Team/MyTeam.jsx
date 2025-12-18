// src/pages/MyTeam.jsx
import React, { useEffect, useState } from "react";
import { Button } from "../ui/UI_Components";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import API from "../../utils/API";
import { Card } from "../ui/Card";
import {
  Users,
  LucidePlus,
} from "lucide-react";

export const MyTeam = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const [myProjects, setMyProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);

      // Fetch user's projects (workspaces) - where user is owner or team member
      const projectsRes = await axios.get(`${API}/projects/my-projects/${user._id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      console.log("PROJECTS RES : ", projectsRes.data);
      if (projectsRes.status === 200 && projectsRes.data.success) {
        setMyProjects(projectsRes.data.projects);
      }
    } catch (error) {
      console.log("Error fetching projects:", error);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchData();
  }, []);

  const ProjectCard = ({ project }) => {
    const isOwner = project.owner?._id === user._id || project.owner === user._id;
    const isMember = project.members?.some(
      (m) => m.user?._id === user._id || m.user === user._id
    );

    return (
      <div className="bg-white shadow-purple-300 rounded-xl shadow-2xl border-l-4 border-purple-500 hover:shadow-xl transition-all cursor-pointer"
        onClick={() => navigate(`/projects/${project._id}`)}>
        <div className="p-3 border-b border-gray-200 flex justify-between items-center">
          <h3 className="font-bold text-lg text-gray-800 truncate">
            {project.title}
          </h3>
          <span
            className={`text-xs font-semibold px-2.5 py-1 rounded-full ${project.status === 'completed'
              ? "bg-green-100 text-green-700"
              : "bg-blue-100 text-blue-700"
              }`}
          >
            {project.status === 'completed' ? "Completed" : "In Progress"}
          </span>
        </div>

        <div className="p-4">
          <p className="text-gray-600 mb-3 text-sm line-clamp-2">
            {project.description}
          </p>

          <div className="flex items-center mb-3">
            <span
              className={
                isOwner
                  ? "bg-purple-500 text-white text-xs font-bold px-2.5 py-1 rounded-full mr-2"
                  : "bg-blue-500 text-white text-xs font-bold px-2.5 py-1 rounded-full mr-2"
              }
            >
              {isOwner ? "Owner" : "Member"}
            </span>
            <span className="text-xs text-gray-500">
              {project.members?.filter((m) => m.user).length || 0} member{(project.members?.filter((m) => m.user).length || 0) !== 1 ? "s" : ""}
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              size="sm"
              variant="primary"
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/projects/${project._id}`);
              }}
              className="text-xs"
            >
              Open Workspace
            </Button>
            {project.team && (
              <Button
                size="sm"
                variant="outline"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/projects/${project._id}/team`);
                }}
                className="text-xs"
              >
                Team Settings
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 rounded-3xl shadow-xl shadow-purple-400 border-3 border-indigo-200 p-4 transition-all">
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="font-[fredoka] text-purple-600 text-[2.2rem] font-bold flex items-center">
            <Users className="mr-2 text-purple-600" size={28} />
            My Workspaces
          </h1>
          <Button
            variant="primary"
            onClick={() => navigate("/add-project")}
            className="flex items-center gap-2"
          >
            <LucidePlus size={20} />
            Create New Project
          </Button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
          </div>
        ) : (
          <>
            {myProjects.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {myProjects.map((project) => (
                  <ProjectCard key={project._id} project={project} />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-xl p-8 text-center shadow-sm">
                <div className="mx-auto bg-gray-100 p-4 rounded-full w-16 h-16 flex items-center justify-center mb-4">
                  <Users className="text-gray-500" size={24} />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  No Workspaces Yet
                </h3>
                <p className="text-gray-600 mb-6">
                  You're not part of any projects yet. Create your first project
                  to get started!
                </p>
                <Button
                  variant="primary"
                  onClick={() => navigate("/add-project")}
                >
                  Create Your First Project
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
