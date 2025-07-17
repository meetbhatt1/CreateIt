import React from "react";
import "./App.css";
import { Navbar } from "./components/ui/Navbar";
import { LeftSidebar } from "./components/layout/LeftSidebar";
import { RightSidebar } from "./components/layout/RightSideBar";
import { HomePage } from "./Pages/Homepage";
import AuthPage from "./Pages/AuthPage";
import ProjectsDashboard from "./components/Project/ProjectDashboard";
import { ProjectCard } from "./components/ui/ProjectCard";
import AddProject from "./components/Project/AddProject";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

const App = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 bg-fixed font-['Comic_Neue']">
        <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] xl:grid-cols-[280px_1fr_300px] grid-rows-[80px_1fr] min-h-screen gap-4 p-4">
          <Navbar />
          <div className="hidden md:block">
            <LeftSidebar />
          </div>
          <div>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/add-project" element={<AddProject />} />
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/projects-dashboard" element={<ProjectsDashboard />} />
              {/* Add more routes as needed */}
            </Routes>
          </div>
          <div className="hidden xl:block">
            <RightSidebar />
          </div>
        </div>
      </div>
    </Router>
  );
};

export default App;
