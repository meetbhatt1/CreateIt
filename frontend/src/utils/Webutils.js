import { HomePage, ProjectPage, UnderProgress, InvitationsPage, MockInterview } from "../Pages";
import { ProjectsDashboard, AddProject, MyTeam, KanbanBoard, TeamDashboard } from "../components";

// Route configuration
export const ROUTES = {
    HOME: "/",
    AUTH: "/auth",
    ADD_PROJECT: "/add-project",
    UNDER_PROGRESS: "/under-progress",
    PROJECT_DASHBOARD: "/project-dashboard",
    TEAM_PROJECT: "/team-project",
    MY_TEAM: "/my-team",
    KANBAN_BOARD: "/kanban-board",
    TEAM_DASHBOARD: "/team-dashboard",
    INVITATIONS: "/invitations",
    MOCK_INTERVIEW: "/mock-interview",
};

export const SIDEBAR_CONFIG = {
    LEFT: [
        ROUTES.HOME,
        ROUTES.ADD_PROJECT,
        ROUTES.UNDER_PROGRESS
    ],
    TEAM: [
        ROUTES.TEAM_DASHBOARD,
        ROUTES.PROJECT_DASHBOARD,
        ROUTES.MY_TEAM,
        ROUTES.INVITATIONS
    ],
    RIGHT: [
        ROUTES.HOME,
        ROUTES.ADD_PROJECT,
        ROUTES.UNDER_PROGRESS
    ]
};
