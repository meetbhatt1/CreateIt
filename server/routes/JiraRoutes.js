import express from "express";
import { auth } from "../middleware/AuthMiddleware.js";
import {
    checkJiraConnection,
    getUserJiraProjects,
    getJiraIssuesForKanban,
    disconnectJira
} from "../controllers/JiraController.js";
import {
    initiateJiraOAuth,
    handleJiraOAuthCallback
} from "../controllers/JiraOAuthController.js";

const router = express.Router();

// OAuth routes
router.get("/oauth/initiate", auth, initiateJiraOAuth);
router.get("/oauth/callback", handleJiraOAuthCallback);

// JIRA data routes
router.get("/connection", auth, checkJiraConnection);
router.get("/projects", auth, getUserJiraProjects);
router.get("/project/:projectKey/issues", auth, getJiraIssuesForKanban);
router.post("/disconnect", auth, disconnectJira);

export default router;
