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
  useLocation,
} from "react-router-dom";
import ProjectPage from "./Pages/ProjectPage";
import { UnderProgress } from "./Pages/UnderProgress";
import { MyTeam } from "./components/Team/MyTeam";
import KanbanBoard from "./components/Team/KanbanBoard";
import { TeamDashboard } from "./components/Team/TeamDashBoard";
import { TeamSideBar } from "./components/Team/TeamSideBar";
const Layout = ({ children }) => {
  const location = useLocation();

  const routesWithSidebar = ["/", "/add-project", "/under-progress"];
  const routesWithTeamSidebar = [
    "/team-dashboard",
    "/project-dashboard",
    "/my-team",
  ];
  const routesWithRightSidebar = ["/", "/add-project", "/under-progress"];

  const showSidebar = routesWithSidebar.includes(location.pathname);
  const showRightSidebar = routesWithRightSidebar.includes(location.pathname);
  const showTeamSidebar = routesWithTeamSidebar.includes(location.pathname);

  return (
    <div className="min-h-screen max-w-screen p-4 bg-gradient-to-br from-blue-50 to-purple-50 bg-fixed font-['Comic_Neue']">
      {/* Navbar */}
      <div className="w-full p-3 m-2.5">
        <Navbar />
      </div>

      {/* Main Content */}
      <div className="flex flex-row">
        {/* Left Sidebar */}
        {showSidebar && (
          <div className="hidden md:block min-w-[260px] xl:w-[280px]">
            <LeftSidebar />
          </div>
        )}
        {showTeamSidebar && (
          <div className="hidden md:block min-w-[260px] xl:w-[280px]">
            <TeamSideBar />
          </div>
        )}

        {/* Page Content */}
        <div className="flex-1 px-4">{children}</div>

        {/* Right Sidebar */}
        {showRightSidebar && (
          <div className="hidden xl:block min-w-[260px]">
            <RightSidebar />
          </div>
        )}
      </div>
    </div>
  );
};

const App = () => {
  const user = localStorage.getItem("user");
  const isLoggedIn = user && user.length > 0;

  return (
    <Router>
      <Layout>
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
            element={isLoggedIn ? <UnderProgress /> : <Navigate to="/auth" />}
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
          <Route
            path="/team-dashboard"
            element={isLoggedIn ? <TeamDashboard /> : <Navigate to="/auth" />}
          />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
