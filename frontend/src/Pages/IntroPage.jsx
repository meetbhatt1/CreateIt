import React, { useState } from "react";
import { Button } from "../components/ui/UI_Components";
import { useNavigate } from "react-router-dom";

// ✅ Reusable Feature Button inside Modal
const FeatureButton = ({ title, description, to, onClick }) => (
  <button
    onClick={onClick}
    className="block w-full text-left bg-indigo-600 text-white rounded-xl p-5 shadow hover:bg-indigo-700 cursor-pointer transition"
  >
    <h3 className="text-lg font-semibold">{title}</h3>
    <p className="text-sm mt-2">{description}</p>
  </button>
);

// ✅ Modal Component
const Modal = ({ open, onClose, children }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose}></div>

      {/* Modal Content */}
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-3xl p-8 z-10">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          ✖
        </button>
        {children}
      </div>
    </div>
  );
};

const IntroPage = ({ onFinish }) => {
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);

  const steps = [
    {
      number: 1,
      title: "Sign Up & Set Profile",
      description:
        "Create your profile and set preferences like domain interests, tech stack, etc.",
    },
    {
      number: 2,
      title: "Create or Join Projects",
      description:
        "Start your own project or join public/open-source projects to collaborate with others.",
    },
    {
      number: 3,
      title: "Build & Manage Your Team",
      description:
        "Invite members, assign roles like Core Member, Contributor, Reviewer, etc.",
    },
    {
      number: 4,
      title: "Collaborate & Grow",
      description:
        "Contribute code, complete tasks, participate in discussions, and track project progress.",
    },
  ];

  const features = [
    {
      title: "Mock Interviews",
      description:
        "Schedule and conduct mock interviews with your peers to prepare for the real ones.",
      to: "/mock-interview",
    },
    {
      title: "Project Board",
      description:
        "Manage all your projects, team, tasks, and milestones in one place.",
      to: "/project-dashboard",
    },
    {
      title: "Explore Projects",
      description:
        "Browse and filter open-source projects by domain, stack, or team size.",
      to: "/under-progress",
    },
    {
      title: "Team Hub",
      description:
        "View your teams, approve requests, and assign responsibilities.",
      to: "/my-team",
    },
  ];

  const handleFeatureClick = (path) => {
    localStorage.setItem("introSeen", "true");
    if (onFinish) onFinish();
    setModalOpen(false);
    localStorage.setItem("pathToGo", path);
    navigate(path);
  };

  return (
    <div className="bg-gradient-to-br from-indigo-100 to-white min-h-screen flex flex-col items-center px-6 py-12 font-sans">
      <h1 className="text-4xl font-bold text-indigo-700 mb-4">
        👋 Welcome to CreateIt
      </h1>
      <p className="text-center text-gray-700 max-w-2xl mb-8 text-lg">
        CreateIt is a collaborative platform where you can join or create
        projects, manage teams, practice mock interviews, and build your
        portfolio with real-world experience.
      </p>

      {/* Steps Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10 w-full max-w-5xl">
        {steps.map((step, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow-lg p-6 border-t-4 border-indigo-500"
          >
            <h2 className="text-xl font-semibold text-indigo-600 mb-2">
              {step.number}. {step.title}
            </h2>
            <p className="text-gray-600">{step.description}</p>
          </div>
        ))}
      </div>

      {/* CTA Button */}
      <Button
        onClick={() => setModalOpen(true)}
        className="text-white px-6 py-3 rounded-lg font-medium shadow"
      >
        🚀 Get Started
      </Button>

      {/* Replay Intro button */}
      <button
        onClick={() => {
          localStorage.removeItem("introSeen");
          navigate(0); // reload app to show intro again
        }}
        className="mt-4 text-sm text-gray-500 hover:underline"
      >
        🔄 Replay Intro
      </button>

      {/* Modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <h2 className="text-2xl font-bold text-indigo-700 mb-6 text-center">
          What would you like to do first?
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {features.map((feature, index) => (
            <FeatureButton
              key={index}
              title={feature.title}
              description={feature.description}
              onClick={() => handleFeatureClick(feature.to)}
            />
          ))}
        </div>
      </Modal>
    </div>
  );
};

export default IntroPage;
