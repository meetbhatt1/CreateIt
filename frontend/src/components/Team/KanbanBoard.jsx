// src/pages/KanbanBoard.jsx
import React, { useState, useEffect } from "react";
import { Button } from "../ui/UI_Components";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import API from "../../utils/API";
import { Users, Plus, ArrowLeft, Folder, Calendar, User } from "lucide-react";

// Initial columns structure for new projects
const initialColumns = {
  todo: [],
  inProgress: [],
  review: [],
  done: [],
};

const teamMembers = ["John Smith", "Sarah Dev", "Alex Designer"];

const KanbanBoard = () => {
  const navigate = useNavigate();
  const params = useParams();
  const projectId = params.teamId;
  const [projects, setProjects] = useState([]);
  const [columns, setColumns] = useState(initialColumns);
  const [draggedTask, setDraggedTask] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [editingStatus, setEditingStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showProjectList, setShowProjectList] = useState(!projectId);

  const user = JSON.parse(localStorage.getItem("user"));

  // Fetch user's projects
  const fetchProjects = async () => {
    try {
      setLoading(true);
      const projectsRes = await axios.get(
        `${API}/project/my-projects/${user._id}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      if (projectsRes.status === 200) {
        setProjects(projectsRes.data);
      }
    } catch (error) {
      console.log("Error fetching projects:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch specific project's kanban data
  const fetchProjectData = async (id) => {
    try {
      setLoading(true);
      // For now, we'll use localStorage. Later you can add kanban data to your Project model
      const saved = localStorage.getItem(`kanban-${projectId}`);
      if (saved) {
        setColumns(JSON.parse(saved));
      } else {
        // Set some sample data for new projects
        setColumns({
          todo: [
            {
              id: "1",
              title: "Welcome Task 🎉",
              description:
                "This is your first task. Drag me to different columns!",
              priority: "medium",
              assignee: teamMembers[0],
              avatar: getAvatar(teamMembers[0]),
              due: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
                .toISOString()
                .split("T")[0],
              xp: 25,
            },
          ],
          inProgress: [],
          review: [],
          done: [],
        });
      }
    } catch (error) {
      console.log("Error fetching project data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Create new project
  const handleCreateNewProject = async () => {
    const projectName = prompt("Enter project name:");
    if (!projectName) return;

    const projectDescription =
      prompt("Enter project description:") || "No description";

    try {
      const formData = new FormData();
      formData.append("title", projectName);
      formData.append("description", projectDescription);
      formData.append("owner", user._id);

      const newProjectRes = await axios.post(
        `${API}/project/create`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (newProjectRes.status === 200 || newProjectRes.status === 201) {
        fetchProjects(); // Refresh the list
        // Navigate to the new project's kanban board
        navigate(`/kanban/${newProjectRes.data._id}`);
      }
    } catch (error) {
      console.log("Error creating project:", error);
      alert("Failed to create project. Please try again.");
    }
  };

  useEffect(() => {
    if (projectId) {
      fetchProjectData(projectId);
      setShowProjectList(false);
    } else {
      fetchProjects();
      setShowProjectList(true);
    }
  }, [projectId]);

  useEffect(() => {
    if (projectId) {
      localStorage.setItem(`kanban-${projectId}`, JSON.stringify(columns));
    }
  }, [columns, projectId]);

  // -------------------------------
  // 🚀 Kanban Functions
  // -------------------------------
  const handleDragStart = (task, from) => {
    setDraggedTask({ ...task, from });
  };

  const handleDrop = (e, to) => {
    e.preventDefault();
    if (!draggedTask || draggedTask.from === to) return;

    const updated = { ...columns };
    updated[draggedTask.from] = updated[draggedTask.from].filter(
      (t) => t.id !== draggedTask.id
    );
    updated[to] = [...updated[to], draggedTask];
    setColumns(updated);
    setDraggedTask(null);
  };

  const addTask = (status) => {
    const today = new Date();
    const defaultDue = new Date(today.setDate(today.getDate() + 7))
      .toISOString()
      .split("T")[0];

    const newTask = {
      id: Date.now().toString(),
      title: "New Task ✨",
      description: "Click edit to add details...",
      priority: "medium",
      assignee: teamMembers[0],
      avatar: getAvatar(teamMembers[0]),
      due: defaultDue,
      xp: 10,
    };
    setColumns((prev) => ({
      ...prev,
      [status]: [...prev[status], newTask],
    }));
  };

  const deleteTask = (status, id) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      setColumns((prev) => ({
        ...prev,
        [status]: prev[status].filter((t) => t.id !== id),
      }));
    }
  };

  const openEditModal = (status, task) => {
    setEditingTask({ ...task });
    setEditingStatus(status);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingTask(null);
    setEditingStatus(null);
  };

  const saveTask = () => {
    if (!editingTask.title.trim()) {
      alert("Task title is required!");
      return;
    }

    setColumns((prev) => ({
      ...prev,
      [editingStatus]: prev[editingStatus].map((t) =>
        t.id === editingTask.id
          ? { ...editingTask, avatar: getAvatar(editingTask.assignee) }
          : t
      ),
    }));
    closeModal();
  };

  const sortTasks = (status, by = "priority") => {
    setColumns((prev) => {
      const sorted = [...prev[status]].sort((a, b) => {
        if (by === "priority") {
          const order = { high: 1, medium: 2, low: 3 };
          return order[a.priority] - order[b.priority];
        }
        if (by === "due") return a.due.localeCompare(b.due);
        if (by === "xp") return b.xp - a.xp;
        return 0;
      });
      return { ...prev, [status]: sorted };
    });
  };

  const getAvatar = (name) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const getPriorityColor = (priority) => {
    const colors = {
      high: "bg-red-100 text-red-800 border-red-200",
      medium: "bg-yellow-100 text-yellow-800 border-yellow-200",
      low: "bg-green-100 text-green-800 border-green-200",
    };
    return colors[priority] || colors.medium;
  };

  // -------------------------------
  // 🏠 Project List View
  // -------------------------------
  if (showProjectList) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 p-4">
        <div className="container mx-auto px-4 py-6 max-w-6xl">
          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="font-[fredoka] text-4xl md:text-5xl font-bold text-purple-600 mb-4">
              📋 My Projects
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Organize your work with Kanban boards. Select a project to start
              managing tasks!
            </p>
          </div>

          {/* Actions */}
          <div className="flex justify-between items-center mb-8">
            <Button
              variant="secondary"
              onClick={() => navigate("/")}
              className="flex items-center gap-2"
            >
              <ArrowLeft size={16} />
              Back to Home
            </Button>
            <Button
              variant="primary"
              onClick={handleCreateNewProject}
              className="flex items-center gap-2"
            >
              <Plus size={20} />
              New Project
            </Button>
          </div>

          {/* Projects Grid */}
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
            </div>
          ) : projects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <div
                  key={project._id}
                  className="bg-white rounded-xl p-6 shadow-lg border border-purple-200 hover:shadow-xl transition-all cursor-pointer transform hover:-translate-y-1"
                  onClick={() => navigate(`/kanban/${project._id}`)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="bg-purple-100 p-2 rounded-lg">
                        <Folder className="text-purple-600" size={24} />
                      </div>
                      <div>
                        <h3 className="font-bold text-xl text-gray-800 line-clamp-1">
                          {project.title}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {project.team
                            ? `Team: ${project.team.title}`
                            : "Personal Project"}
                        </p>
                      </div>
                    </div>
                    <span className="bg-green-100 text-green-600 text-xs font-semibold px-2 py-1 rounded-full">
                      Active
                    </span>
                  </div>

                  <p className="text-gray-600 mb-4 line-clamp-2 text-sm">
                    {project.description || "No description provided"}
                  </p>

                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <Calendar size={14} />
                        <span>
                          {project.createdAt
                            ? new Date(project.createdAt).toLocaleDateString()
                            : "New"}
                        </span>
                      </div>
                      {project.owner && (
                        <div className="flex items-center gap-1">
                          <User size={14} />
                          <span>You</span>
                        </div>
                      )}
                    </div>
                    <span className="bg-gray-100 px-2 py-1 rounded text-xs">
                      {project.category || "General"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-purple-200">
              <div className="mx-auto bg-purple-100 p-6 rounded-full w-20 h-20 flex items-center justify-center mb-6">
                <Folder className="text-purple-600" size={32} />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-3">
                No Projects Yet
              </h3>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                Create your first project to start organizing tasks with a
                beautiful Kanban board!
              </p>
              <Button
                variant="primary"
                onClick={handleCreateNewProject}
                size="lg"
              >
                Create Your First Project
              </Button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // -------------------------------
  // 🎨 Kanban Board View
  // -------------------------------
  return (
    <div className="max-h-screen text-[#2d3748] font-[fredoka]">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="flex items-center justify-between w-[90%]">
            <Button
              variant="secondary"
              onClick={() => navigate("/my-team")}
              className="flex items-center max-w-[20%]"
            >
              <ArrowLeft size={16} />
              Back to Projects
            </Button>
            <div className="w-[30%]" />
            <div className="w-[50%]">
              <h1 className="text-3xl md:text-4xl font-extrabold text-purple-600">
                🎨 Kanban Board
              </h1>
              <p className="text-purple-500 font-medium">
                Drag, Drop, and Create with Fun!
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-sm">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-600">Auto-saved</span>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {Object.entries(columns).map(([status, tasks]) => (
            <div
              key={status}
              className="bg-white rounded-lg p-4 shadow-sm border"
            >
              <div className="text-2xl font-bold text-purple-600">
                {tasks.length}
              </div>
              <div className="text-sm text-gray-600 capitalize">{status}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Board */}
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Object.entries(columns).map(([status, tasks]) => (
            <div
              key={status}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => handleDrop(e, status)}
              className="bg-white rounded-2xl p-6 shadow-lg border border-indigo-200 max-h-screen"
            >
              {/* Column Header */}
              <div className="flex justify-between items-center mb-6">
                <div className="font-bold text-white bg-gradient-to-r from-purple-400 to-indigo-500 rounded-xl px-4 py-2 text-center min-w-[120px]">
                  <div className="text-sm opacity-90">
                    {status.toUpperCase()}
                  </div>
                  <div className="text-lg">{tasks.length}</div>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => addTask(status)}
                    className="bg-green-500 hover:bg-green-600"
                  >
                    +
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => sortTasks(status, "priority")}
                    variant="outline"
                  >
                    ⇅
                  </Button>
                </div>
              </div>

              {/* Task Cards */}
              <div className="space-y-4">
                {tasks.map((task) => (
                  <div
                    key={task.id}
                    draggable
                    onDragStart={() => handleDragStart(task, status)}
                    className="bg-gradient-to-br from-white to-gray-50 border border-gray-300 rounded-xl p-4 shadow-sm cursor-grab hover:shadow-md transition-all active:cursor-grabbing"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="font-bold text-lg text-gray-800 flex-1 pr-2">
                        {task.title}
                      </div>
                      <div className="flex gap-1">
                        <button
                          onClick={() => openEditModal(status, task)}
                          className="text-blue-500 hover:text-blue-700 transition-colors"
                          title="Edit task"
                        >
                          ✎
                        </button>
                        <button
                          onClick={() => deleteTask(status, task.id)}
                          className="text-red-500 hover:text-red-700 transition-colors"
                          title="Delete task"
                        >
                          ✕
                        </button>
                      </div>
                    </div>

                    <div className="text-sm text-gray-600 py-2 line-clamp-2">
                      {task.description}
                    </div>

                    <div className="flex items-center justify-between mb-3">
                      <span
                        className={`text-xs font-semibold px-2 py-1 rounded-full border ${getPriorityColor(
                          task.priority
                        )}`}
                      >
                        {task.priority}
                      </span>
                      <div className="text-sm font-bold text-green-600 bg-green-50 px-2 py-1 rounded">
                        +{task.xp} XP
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-3 border-t border-dashed border-gray-300">
                      <div className="flex items-center gap-2">
                        <div className="bg-indigo-500 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">
                          {task.avatar}
                        </div>
                        <span className="text-sm text-gray-700">
                          {task.assignee}
                        </span>
                      </div>
                      <div className="text-xs text-purple-600 font-medium flex items-center gap-1">
                        📅 {new Date(task.due).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                ))}

                {tasks.length === 0 && (
                  <div className="text-center py-8 text-gray-400">
                    <div className="text-4xl mb-2">📭</div>
                    <p className="text-sm">No tasks yet</p>
                    <Button
                      size="sm"
                      onClick={() => addTask(status)}
                      className="mt-2 bg-gray-100 hover:bg-gray-200 text-gray-600"
                    >
                      + Add First Task
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Task Editor Modal */}
      {isModalOpen && editingTask && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-2">
              ✏️ Edit Task
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  value={editingTask.title}
                  onChange={(e) =>
                    setEditingTask({ ...editingTask, title: e.target.value })
                  }
                  placeholder="Task title..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  rows="3"
                  value={editingTask.description}
                  onChange={(e) =>
                    setEditingTask({
                      ...editingTask,
                      description: e.target.value,
                    })
                  }
                  placeholder="Task description..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Priority
                  </label>
                  <select
                    className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    value={editingTask.priority}
                    onChange={(e) =>
                      setEditingTask({
                        ...editingTask,
                        priority: e.target.value,
                      })
                    }
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    XP Value
                  </label>
                  <input
                    type="number"
                    className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    value={editingTask.xp}
                    onChange={(e) =>
                      setEditingTask({
                        ...editingTask,
                        xp: Number(e.target.value),
                      })
                    }
                    min="1"
                    max="1000"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Assignee
                </label>
                <select
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  value={editingTask.assignee}
                  onChange={(e) =>
                    setEditingTask({
                      ...editingTask,
                      assignee: e.target.value,
                      avatar: getAvatar(e.target.value),
                    })
                  }
                >
                  {teamMembers.map((member) => (
                    <option key={member} value={member}>
                      {member}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Due Date
                </label>
                <input
                  type="date"
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  value={editingTask.due}
                  onChange={(e) =>
                    setEditingTask({ ...editingTask, due: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200">
              <Button variant="secondary" onClick={closeModal}>
                Cancel
              </Button>
              <Button
                onClick={saveTask}
                className="bg-green-500 hover:bg-green-600"
              >
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default KanbanBoard;
