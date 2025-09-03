import React, { useState, useEffect } from "react";
import { Button } from "../ui/UI_Components";
import { useNavigate, useParams } from "react-router-dom";

const initialColumns = {
  todo: [
    {
      id: "1",
      title: "Fix Login Bug 🐛",
      description:
        "Users can't login when cookies are enabled. Need to debug the authentication flow.",
      priority: "high",
      assignee: "John Smith",
      avatar: "JS",
      due: "2025-08-29",
      xp: 50,
    },
  ],
  inProgress: [],
  review: [],
  done: [],
};

// 🧑‍🤝‍🧑 Example assignees (later you can fetch from backend)
const teamMembers = ["John Smith", "Sarah Dev", "Alex Designer"];

const KanbanBoard = () => {
  const navigate = useNavigate();
  const { teamId } = useParams();
  const [columns, setColumns] = useState(() => {
    const saved = localStorage.getItem("kanban-columns");
    return saved ? JSON.parse(saved) : initialColumns;
  });
  const [draggedTask, setDraggedTask] = useState(null);

  // 🔹 Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [editingStatus, setEditingStatus] = useState(null);

  useEffect(() => {
    localStorage.setItem("kanban-columns", JSON.stringify(columns));
  }, [columns]);

  // -------------------------------
  // 🚀 Functions
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
    const defaultDue = today.toISOString().split("T")[0]; // today's date

    const newTask = {
      id: Date.now().toString(),
      title: "New Task ✨",
      description: "Write details...",
      priority: "low",
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
    setColumns((prev) => ({
      ...prev,
      [status]: prev[status].filter((t) => t.id !== id),
    }));
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

  // -------------------------------
  // JSX UI
  // -------------------------------
  return (
    <div className="min-h-screen flex-col text-[#2d3748] font-[fredoka]">
      {/* Header */}
      <div className="flex rotate-[1.5deg] flex-row items-center max-w-[100%]">
        <div className="w-[10%]">
          <Button
            variant="secondary"
            className="rotate-[-1.5deg]"
            onClick={() => navigate("/")}
          >
            Back
          </Button>
        </div>
        <div className="w-[90%]">
          <h1 className="text-5xl font-extrabold text-center ">
            🎨 Kanban Board
          </h1>
          <p className="text-center text-purple-500 font-medium mb-6">
            Drag, Drop, and Create with Fun!
          </p>
        </div>
      </div>

      {/* Board */}
      <div className="max-w-[100%]">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Object.entries(columns).map(([status, tasks]) => (
            <div
              key={status}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => handleDrop(e, status)}
              className="bg-white rounded-xl p-4 shadow-lg border border-indigo-200"
            >
              {/* Column Header */}
              <div className="flex justify-between items-center mb-4">
                <div className="font-bold text-white bg-gradient-to-r from-purple-400 to-indigo-500 rounded-lg text-center px-3 py-2">
                  {status.toUpperCase()} ({tasks.length})
                </div>
                <div className="flex gap-1">
                  <Button size="sm" onClick={() => addTask(status)}>
                    +
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => sortTasks(status, "priority")}
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
                    className="bg-gray-50 border border-gray-300 rounded-xl p-4 shadow-sm cursor-grab hover:shadow-md"
                  >
                    <div className="flex justify-between">
                      <div className="font-bold text-lg">{task.title}</div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => openEditModal(status, task)}
                          className="text-blue-500 font-bold"
                        >
                          ✎
                        </button>
                        <button
                          onClick={() => deleteTask(status, task.id)}
                          className="text-red-500 font-bold"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                    <div className="text-sm text-gray-600 py-1">
                      {task.description}
                    </div>
                    <div className="text-xs text-green-600 font-semibold">
                      +{task.xp} XP
                    </div>
                    <div className="flex justify-between mt-2 pt-2 border-t border-dashed">
                      <div className="flex items-center gap-2">
                        <div className="bg-indigo-400 text-white w-8 h-8 rounded-full flex items-center justify-center">
                          {task.avatar}
                        </div>
                        <span className="text-sm">{task.assignee}</span>
                      </div>
                      <div className="text-xs text-purple-600">
                        📅 {task.due}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal Editor */}
      {isModalOpen && editingTask && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white rounded-2xl shadow-lg p-6 w-96">
            <h2 className="text-xl font-bold mb-4">✏️ Edit Task</h2>
            <div className="space-y-3">
              <input
                type="text"
                className="w-full border p-2 rounded"
                value={editingTask.title}
                onChange={(e) =>
                  setEditingTask({ ...editingTask, title: e.target.value })
                }
              />
              <textarea
                className="w-full border p-2 rounded"
                value={editingTask.description}
                onChange={(e) =>
                  setEditingTask({
                    ...editingTask,
                    description: e.target.value,
                  })
                }
              />
              <select
                className="w-full border p-2 rounded"
                value={editingTask.priority}
                onChange={(e) =>
                  setEditingTask({ ...editingTask, priority: e.target.value })
                }
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>

              {/* Assignee Dropdown */}
              <select
                className="w-full border p-2 rounded"
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

              {/* Due Date */}
              <input
                type="date"
                className="w-full border p-2 rounded"
                value={editingTask.due}
                onChange={(e) =>
                  setEditingTask({ ...editingTask, due: e.target.value })
                }
              />

              <input
                type="number"
                placeholder="XP"
                className="w-full border p-2 rounded"
                value={editingTask.xp}
                onChange={(e) =>
                  setEditingTask({
                    ...editingTask,
                    xp: Number(e.target.value),
                  })
                }
              />
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="secondary" onClick={closeModal}>
                Cancel
              </Button>
              <Button onClick={saveTask}>Save</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default KanbanBoard;
