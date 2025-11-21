import React, { useMemo, useState, useEffect } from "react";
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
import InvitationsPage from "./Pages/InvitationsPage";
import MockInterview from "./Pages/MockInterview";
import TeamDetailsPage from "./components/Team/TeamDetailsPage";
import IntroPage from "./Pages/IntroPage";
import Chat from "./components/Chat/Chat";
import ProjectDetailPage from "./components/Project/ProjectDetailPage";
import Settings from "./components/Settings/Settings";
import Dashboard from "./components/Settings/Dashboard";

const PrivateRoute = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = await localStorage.getItem("user");
        if (user) {
          const userObj = JSON.parse(user);
          setIsLoggedIn(!!userObj?.email);
        } else {
          setIsLoggedIn(false);
        }
      } catch (error) {
        console.error("Error checking auth:", error);
        setIsLoggedIn(false);
      } finally {
        setCheckingAuth(false);
      }
    };

    checkAuth();
  }, []);

  if (checkingAuth) {
    return <div>Loading...</div>; // Or a proper loading component
  }

  return isLoggedIn ? children : <Navigate to="/auth" replace />;
};

const PublicRoute = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = await localStorage.getItem("user");
        if (user) {
          const userObj = JSON.parse(user);
          setIsLoggedIn(!!userObj?.email);
        } else {
          setIsLoggedIn(false);
        }
      } catch (error) {
        console.error("Error checking auth:", error);
        setIsLoggedIn(false);
      } finally {
        setCheckingAuth(false);
      }
    };

    checkAuth();
  }, []);

  if (checkingAuth) {
    return <div>Loading...</div>;
  }

  return !isLoggedIn ? children : <Navigate to="/" replace />;
};

const appRoutes = [
  {
    path: "/",
    element: <HomePage />,
    authRequired: true,
    sidebar: "left+right",
  },
  {
    path: "/settings",
    element: <Settings />,
    authRequired: true,
    sidebar: "none",
  },
  {
    path: "/auth",
    element: <AuthPage />,
    authRequired: false, // Public route
    sidebar: "none",
  },
  {
    path: "/add-project",
    element: <AddProject />,
    authRequired: true,
    sidebar: "left+right",
  },
  {
    path: "/project-dashboard",
    element: <ProjectsDashboard />,
    authRequired: true,
    sidebar: "left+right",
  },
  {
    path: "/project/:projectId",
    element: <ProjectDetailPage />,
    authRequired: true,
    sidebar: "team",
  },
  {
    path: "/dashboard",
    element: <Dashboard />,
    authRequired: true,
    sidebar: "none",
  },
  {
    path: "/under-progress",
    element: <UnderProgress />,
    authRequired: true,
    sidebar: "left+right",
  },
  {
    path: "/team-project",
    element: <ProjectPage />,
    authRequired: true,
    sidebar: "team",
  },
  {
    path: "/my-team",
    element: <MyTeam />,
    authRequired: true,
    sidebar: "team",
  },
  {
    path: "/team/:teamId/kanban",
    element: <KanbanBoard />,
    authRequired: true,
    sidebar: "none",
  },
  {
    path: "/team/:teamId/chat",
    element: <Chat />,
    authRequired: true,
    sidebar: "none",
  },
  {
    path: "/team/:teamId",
    element: <TeamDetailsPage />,
    authRequired: true,
    sidebar: "team",
  },
  {
    path: "/team/:teamId/dashboard",
    element: <TeamDashboard />,
    authRequired: true,
    sidebar: "team",
  },
  {
    path: "/invitations",
    element: <InvitationsPage />,
    authRequired: true,
    sidebar: "team",
  },
  {
    path: "/mock-interview",
    element: <MockInterview />,
    authRequired: true,
    sidebar: "none",
  },
];

const Layout = ({ children }) => {
  const location = useLocation();
  const currentRoute = appRoutes.find((r) =>
    location.pathname.match(new RegExp(`^${r.path.replace(/:\w+/g, "[^/]+")}$`))
  );
  const sidebarType = currentRoute?.sidebar || "none";

  return (
    <div className="min-h-screen max-w-screen p-4 bg-gradient-to-br from-indigo-100 to-purple-100 bg-fixed font-['Comic_Neue']">
      <div className="w-full p-3 m-2.5">
        <Navbar />
      </div>

      <div className="flex flex-row">
        {sidebarType === "left+right" && (
          <div className="hidden md:block min-w-[260px] xl:w-[280px]">
            <LeftSidebar />
          </div>
        )}
        {sidebarType === "team" && (
          <div className="hidden md:block min-w-[260px] xl:w-[280px]">
            <TeamSideBar />
          </div>
        )}

        <div className="flex-1 px-4">{children}</div>

        {sidebarType === "left+right" && (
          <div className="hidden xl:block min-w-[260px]">
            <RightSidebar />
          </div>
        )}
      </div>
    </div>
  );
};

const App = () => {
  const [introSeen, setIntroSeen] = useState(true);

  useEffect(() => {
    const seen = localStorage.getItem("introSeen");
    if (!seen) {
      setIntroSeen(false);
    }
  }, []);

  const handleIntroFinish = () => {
    localStorage.setItem("introSeen", "true");
    setIntroSeen(true);
  };

  return (
    <Router>
      {!introSeen ? (
        <Routes>
          <Route
            path="*"
            element={<IntroPage onFinish={handleIntroFinish} />}
          />
        </Routes>
      ) : (
        <Layout>
          <Routes>
            {appRoutes.map(({ path, element, authRequired }, index) => (
              <Route
                key={index}
                path={path}
                element={
                  authRequired ? (
                    <PrivateRoute>{element}</PrivateRoute>
                  ) : (
                    <PublicRoute>{element}</PublicRoute>
                  )
                }
              />
            ))}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Layout>
      )}
    </Router>
  );
};

export default App;
