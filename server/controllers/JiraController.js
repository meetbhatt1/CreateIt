import { isJiraConnected, removeJiraCredentials } from "../services/jiraOAuthService.js";
import { getJiraProjects, getJiraIssuesGrouped } from "../services/jiraDataService.js";

/**
 * Check if user has JIRA connected
 */
export const checkJiraConnection = async (req, res) => {
    try {
        const userId = req.user._id;
        const connected = await isJiraConnected(userId);
        res.json({ connected });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * Get JIRA projects for the authenticated user
 */
export const getUserJiraProjects = async (req, res) => {
    try {
        const userId = req.user._id;
        const projects = await getJiraProjects(userId);
        res.json({ projects });
    } catch (error) {
        console.error("Error fetching JIRA projects:", error);
        res.status(500).json({ message: error.message || "Failed to fetch JIRA projects" });
    }
};

/**
 * Get JIRA issues for a project, grouped by status for Kanban
 */
export const getJiraIssuesForKanban = async (req, res) => {
    try {
        const userId = req.user._id;
        const { projectKey } = req.params;

        if (!projectKey) {
            return res.status(400).json({ message: "Project key is required" });
        }

        const grouped = await getJiraIssuesGrouped(userId, projectKey);
        res.json(grouped);
    } catch (error) {
        console.error("Error fetching JIRA issues:", error);
        res.status(500).json({ message: error.message || "Failed to fetch JIRA issues" });
    }
};

/**
 * Disconnect JIRA account
 */
export const disconnectJira = async (req, res) => {
    try {
        const userId = req.user._id;
        await removeJiraCredentials(userId);
        res.json({ message: "JIRA account disconnected successfully" });
    } catch (error) {
        console.error("Error disconnecting JIRA:", error);
        res.status(500).json({ message: error.message || "Failed to disconnect JIRA" });
    }
};


