import React, { useState } from "react";
import { Button } from "../ui/UI_Components";
import { useNavigate } from "react-router-dom";

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
      due: "Tomorrow",
      xp: 50,
    },
    {
      id: "2",
      title: "Add Confetti 🎉",
      description:
        "Implement confetti animation when users complete tasks. Because who doesn't love confetti?",
      priority: "medium",
      assignee: "Sarah Dev",
      avatar: "SD",
      due: "Next Week",
      xp: 30,
    },
  ],
  inProgress: [
    {
      id: "3",
      title: "Design Dashboard ✨",
      description:
        'Create a dashboard that makes users say "Wow!" instead of "Where\'s the button?"',
      priority: "high",
      assignee: "Alex Designer",
      avatar: "AD",
      due: "Friday",
      xp: 75,
    },
    {
      id: "4",
      title: "API Integration 🔌",
      description:
        "Connect with coffee machine API to brew ☕ when builds fail. Critical for developer sanity!",
      priority: "low",
      assignee: "Caffeine Dev",
      avatar: "CD",
      due: "Next Month",
      xp: 40,
    },
  ],
  review: [
    {
      id: "5",
      title: "Cat Filter 🐱",
      description:
        "Add cat ears filter to user profile pictures. Because every app needs more cats!",
      priority: "medium",
      assignee: "Felix Dev",
      avatar: "FD",
      due: "Today",
      xp: 35,
    },
  ],
  done: [
    {
      id: "6",
      title: "Fix Typo ✏️",
      description:
        'Changed "teh" to "the". Saved the company from international embarrassment.',
      priority: "low",
      assignee: "Grammar Dev",
      avatar: "GD",
      due: "Yesterday",
      xp: 15,
    },
    {
      id: "7",
      title: "Setup CI/CD 🚀",
      description:
        'Implemented automated deployment pipeline. No more "works on my machine" excuses!',
      priority: "high",
      assignee: "Ops Dev",
      avatar: "OD",
      due: "Last Week",
      xp: 60,
    },
  ],
};

const KanbanBoard = () => {
  const navigate = useNavigate();
  const [columns, setColumns] = useState(initialColumns);
  const [draggedTask, setDraggedTask] = useState(null);

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

  return (
    <div className="min-h-screen flex-col text-[#2d3748] font-[fredoka]">
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
      <div className="max-w-[100%]">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Object.entries(columns).map(([status, tasks]) => (
            <div
              key={status}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => handleDrop(e, status)}
              className="bg-white rounded-xl p-4 shadow-lg border border-indigo-200"
            >
              <div className="font-bold text-white bg-gradient-to-r from-purple-400 to-indigo-500 rounded-lg text-center py-2 mb-4">
                {status.toUpperCase()} ({tasks.length})
              </div>
              <div className="space-y-4">
                {tasks.map((task) => (
                  <div
                    key={task.id}
                    draggable
                    onDragStart={() => handleDragStart(task, status)}
                    className="bg-gray-50 border border-gray-300 rounded-xl p-4 shadow-sm cursor-grab hover:shadow-md"
                  >
                    <div className="font-bold text-lg">{task.title}</div>
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
    </div>
  );
};
export default KanbanBoard;
