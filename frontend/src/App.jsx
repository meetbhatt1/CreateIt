import React from "react";
import "./App.css";
import { Navbar } from "./components/ui/Navbar";
import { LeftSidebar } from "./components/layout/LeftSidebar";
import { RightSidebar } from "./components/layout/RightSideBar";
import { HomePage } from "./Pages/Homepage";
import AuthPage from "./Pages/AuthPage";
import ProjectsDashboard from "./components/Project/ProjectDashboard";
import AddProject from "./components/Project/AddProject";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import ProjectPage from "./Pages/ProjectPage";
import { UnderProgress } from "./Pages/UnderProgress";
import { MyTeam } from "./components/Team/MyTeam";
import KanbanBoard from "./Pages/KanbanBoard";

const App = () => {
  const user = localStorage.getItem("user");
  console.log("USER__", user);
  const isLoggedIn = user && user.length > 0;

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 bg-fixed font-['Comic_Neue']">
        <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] xl:grid-cols-[280px_1fr_300px] grid-rows-[80px_1fr] min-h-screen gap-4 p-4">
          <Navbar />
          <div className="hidden md:block">
            <LeftSidebar />
          </div>
          <div>
            {/* <ProjectPage /> */}
            <Routes>
              <Route
                path="/"
                element={isLoggedIn ? <HomePage /> : <Navigate to="/auth" />}
              />
              <Route
                path="/auth"
                element={isLoggedIn ? <Navigate to="/" /> : <AuthPage />}
              />
              <Route
                path="/add-project"
                element={isLoggedIn ? <AddProject /> : <Navigate to="/auth" />}
              />
              <Route
                path="/project-dashboard"
                element={
                  isLoggedIn ? <ProjectsDashboard /> : <Navigate to="/auth" />
                }
              />
              <Route
                path="/under-progress"
                element={
                  isLoggedIn ? <UnderProgress /> : <Navigate to="/auth" />
                }
              />
              <Route
                path="/team-project"
                element={isLoggedIn ? <ProjectPage /> : <Navigate to="/auth" />}
              />
              <Route
                path="/my-team"
                element={isLoggedIn ? <MyTeam /> : <Navigate to="/auth" />}
              />
              <Route
                path="/kanban-board"
                element={isLoggedIn ? <KanbanBoard /> : <Navigate to="/auth" />}
              />
            </Routes>
          </div>
          <div className="hidden xl:block">
            <RightSidebar />
          </div>
        </div>
      </div>
    </Router>
    // <KanbanBoard />
  );
};

export default App;
