// src/components/Team/KanbanBoard.jsx
import React, { useState, useEffect } from "react";
import { Button } from "../ui/UI_Components";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import API from "../../utils/API";
import { ArrowLeft, ExternalLink } from "lucide-react";

const teamMembers = ["John Smith", "Sarah Dev", "Alex Designer"];

const KanbanBoard = () => {
  const navigate = useNavigate();
  const params = useParams();
  const projectId = params.projectId;
  const [columns, setColumns] = useState({
    todo: [],
    inProgress: [],
    review: [],
    done: [],
  });

  const [draggedTask, setDraggedTask] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [editingStatus, setEditingStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // JIRA integration state
  const [dataSource, setDataSource] = useState("createit"); // "createit" | "jira"
  const [jiraConnected, setJiraConnected] = useState(false);
  const [jiraProjects, setJiraProjects] = useState([]);
  const [selectedJiraProject, setSelectedJiraProject] = useState(null);
  const [jiraLoading, setJiraLoading] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));

  // Redirect if no projectId
  useEffect(() => {
    if (!projectId) {
      navigate("/my-team");
    }
  }, [projectId, navigate]);

  // Check JIRA connection status
  useEffect(() => {
    const checkJiraConnection = async () => {
      try {
        const res = await axios.get(`${API}/jira/connection`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setJiraConnected(res.data.connected);
        if (res.data.connected) {
          // Fetch JIRA projects
          const projectsRes = await axios.get(`${API}/jira/projects`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          });
          setJiraProjects(projectsRes.data.projects || []);
        }
      } catch (err) {
        console.error("Failed to check JIRA connection", err);
        setJiraConnected(false);
      }
    };
    checkJiraConnection();
  }, []);

  const fetchTasks = async (projectId) => {
    if (!projectId) return;

    try {
      setLoading(true);
      const res = await axios.get(`${API}/task/${projectId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const grouped = {
        todo: [],
        inProgress: [],
        review: [],
        done: [],
      };

      res.data.forEach((task) => {
        if (grouped[task.status]) {
          grouped[task.status].push(task);
        }
      });

      setColumns(grouped);
    } catch (err) {
      console.error("Failed to fetch tasks", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchJiraIssues = async (projectKey) => {
    if (!projectKey) return;

    try {
      setJiraLoading(true);
      const res = await axios.get(`${API}/jira/project/${projectKey}/issues`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setColumns(res.data);
    } catch (err) {
      console.error("Failed to fetch JIRA issues", err);
      alert("Failed to fetch JIRA issues. Please check your JIRA connection.");
    } finally {
      setJiraLoading(false);
    }
  };

  useEffect(() => {
    if (projectId && dataSource === "createit") {
      fetchTasks(projectId);
    } else if (dataSource === "jira" && selectedJiraProject) {
      fetchJiraIssues(selectedJiraProject.key);
    }
  }, [projectId, dataSource, selectedJiraProject]);

  const handleDataSourceChange = (source) => {
    setDataSource(source);
    if (source === "createit") {
      setSelectedJiraProject(null);
      if (projectId) {
        fetchTasks(projectId);
      }
    }
  };

  const handleJiraConnect = async () => {
    try {
      const res = await axios.get(`${API}/jira/oauth/initiate`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      // Redirect to Atlassian OAuth
      window.location.href = res.data.authUrl;
    } catch (err) {
      console.error("Failed to initiate JIRA OAuth", err);
      alert("Failed to connect JIRA. Please try again.");
    }
  };


  // -------------------------------
  // 🚀 Kanban Functions
  // -------------------------------
  const handleDragStart = (task, from) => {
    setDraggedTask({ ...task, from });
  };

  const handleDrop = async (e, to) => {
    e.preventDefault();
    if (!draggedTask || draggedTask.from === to) return;

    // Disable drag-drop for JIRA tasks in Phase-1
    if (draggedTask.isJira) {
      alert("JIRA tasks are read-only. Changes must be made in JIRA.");
      setDraggedTask(null);
      return;
    }

    try {
      await axios.put(
        `${API}/task/${draggedTask._id}`,
        { status: to },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (dataSource === "createit") {
        fetchTasks(projectId); // refresh board
      }
    } catch (err) {
      console.error("Failed to update status", err);
    }

    setDraggedTask(null);
  };


  const addTask = async (status) => {
    try {
      const res = await axios.post(
        `${API}/task`,
        {
          title: "New Task ✨",
          description: "Edit me",
          priority: "medium",
          status,
          due: new Date(),
          xp: 10,
          assignee: user.fullName,
          projectId,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setColumns((prev) => ({
        ...prev,
        [status]: [...prev[status], res.data],
      }));
    } catch (err) {
      console.error("Failed to create task", err);
    }
  };


  const deleteTask = async (status, id, task) => {
    // Disable deletion for JIRA tasks in Phase-1
    if (task?.isJira) {
      alert("JIRA tasks are read-only. Please delete in JIRA.");
      return;
    }

    if (!window.confirm("Delete task?")) return;

    await axios.delete(`${API}/task/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (dataSource === "createit") {
      fetchTasks(projectId);
    }
  };


  const openEditModal = (status, task) => {
    // Disable editing for JIRA tasks in Phase-1
    if (task.isJira) {
      alert("JIRA tasks are read-only. Please edit in JIRA.");
      return;
    }
    setEditingTask({ ...task });
    setEditingStatus(status);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingTask(null);
    setEditingStatus(null);
  };

  const saveTask = async () => {
    if (!editingTask.title.trim()) {
      alert("Task title is required!");
      return;
    }

    try {
      await axios.put(
        `${API}/task/${editingTask._id}`,
        {
          title: editingTask.title,
          description: editingTask.description,
          priority: editingTask.priority,
          xp: editingTask.xp,
          assignee: editingTask.assignee,
          due: editingTask.due,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      fetchTasks(projectId);
      closeModal();
    } catch (err) {
      console.error("Failed to update task", err);
      alert("Failed to update task. Please try again.");
    }
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

  if (!projectId) {
    return null; // Will redirect via useEffect
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
              onClick={() => navigate(-1)}
              className="flex items-center max-w-[20%]"
            >
              <ArrowLeft size={16} />
              Back
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
          <div className="flex items-center gap-4">
            {/* Data Source Toggle */}
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-sm">
              <span className="text-sm text-gray-600 font-medium">Data Source:</span>
              <button
                onClick={() => handleDataSourceChange("createit")}
                className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                  dataSource === "createit"
                    ? "bg-purple-500 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                CreateIt
              </button>
              {jiraConnected && (
                <button
                  onClick={() => handleDataSourceChange("jira")}
                  className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                    dataSource === "jira"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  JIRA
                </button>
              )}
              {!jiraConnected && (
                <button
                  onClick={handleJiraConnect}
                  className="px-3 py-1 rounded text-sm font-medium bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors"
                  title="Connect JIRA"
                >
                  + Connect JIRA
                </button>
              )}
            </div>
            
            {/* JIRA Project Selector */}
            {dataSource === "jira" && jiraProjects.length > 0 && (
              <select
                value={selectedJiraProject?.key || ""}
                onChange={(e) => {
                  const project = jiraProjects.find(p => p.key === e.target.value);
                  setSelectedJiraProject(project);
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="">Select JIRA Project</option>
                {jiraProjects.map((project) => (
                  <option key={project.id} value={project.key}>
                    {project.name} ({project.key})
                  </option>
                ))}
              </select>
            )}

            {dataSource === "createit" && (
              <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-sm">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-gray-600">Auto-saved</span>
              </div>
            )}
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
                  {dataSource === "createit" && (
                    <Button
                      size="sm"
                      onClick={() => addTask(status)}
                      className="bg-green-500 hover:bg-green-600"
                    >
                      +
                    </Button>
                  )}
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
                    key={task._id || task.id}
                    draggable={!task.isJira}
                    onDragStart={() => !task.isJira && handleDragStart(task, status)}
                    className={`bg-gradient-to-br from-white to-gray-50 border border-gray-300 rounded-xl p-4 shadow-sm transition-all ${
                      task.isJira 
                        ? "cursor-default opacity-95" 
                        : "cursor-grab hover:shadow-md active:cursor-grabbing"
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="font-bold text-lg text-gray-800 flex-1 pr-2">
                        {task.title}
                        {task.isJira && task.jiraIssueKey && (
                          <span className="ml-2 text-xs text-blue-600 font-normal">
                            ({task.jiraIssueKey})
                          </span>
                        )}
                      </div>
                      <div className="flex gap-1">
                        {!task.isJira && (
                          <>
                            <button
                              onClick={() => openEditModal(status, task)}
                              className="text-blue-500 hover:text-blue-700 transition-colors"
                              title="Edit task"
                            >
                              ✎
                            </button>
                            <button
                              onClick={() => deleteTask(status, task._id || task.id, task)}
                              className="text-red-500 hover:text-red-700 transition-colors"
                              title="Delete task"
                            >
                              ✕
                            </button>
                          </>
                        )}
                        {task.isJira && task.jiraUrl && (
                          <a
                            href={task.jiraUrl.replace('/rest/api/3/issue/', '/browse/')}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 hover:text-blue-700 transition-colors"
                            title="Open in JIRA"
                          >
                            <ExternalLink size={16} />
                          </a>
                        )}
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
                      {!task.isJira && (
                        <div className="text-sm font-bold text-green-600 bg-green-50 px-2 py-1 rounded">
                          +{task.xp || 0} XP
                        </div>
                      )}
                      {task.isJira && (
                        <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">
                          JIRA
                        </span>
                      )}
                    </div>

                    <div className="flex justify-between items-center pt-3 border-t border-dashed border-gray-300">
                      <div className="flex items-center gap-2">
                        <div className="bg-indigo-500 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">
                          {task.avatar || getAvatar(task.assignee || "U")}
                        </div>
                        <span className="text-sm text-gray-700">
                          {task.assignee || "Unassigned"}
                        </span>
                      </div>
                      {task.due && (
                        <div className="text-xs text-purple-600 font-medium flex items-center gap-1">
                          📅 {new Date(task.due).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {tasks.length === 0 && (
                  <div className="text-center py-8 text-gray-400">
                    <div className="text-4xl mb-2">📭</div>
                    <p className="text-sm">
                      {dataSource === "jira" 
                        ? selectedJiraProject 
                          ? "No JIRA issues in this status"
                          : "Select a JIRA project to view issues"
                        : "No tasks yet"}
                    </p>
                    {dataSource === "createit" && (
                      <Button
                        size="sm"
                        onClick={() => addTask(status)}
                        className="mt-2 bg-gray-100 hover:bg-gray-200 text-gray-600"
                      >
                        + Add First Task
                      </Button>
                    )}
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
