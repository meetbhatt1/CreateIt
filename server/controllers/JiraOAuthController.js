import axios from "axios";
import { storeJiraCredentials } from "../services/jiraOAuthService.js";
import crypto from "crypto";

/**
 * Initiate Atlassian OAuth flow
 */
export const initiateJiraOAuth = async (req, res) => {
    try {
        const userId = req.user._id;
        
        // Generate state token for CSRF protection
        const state = crypto.randomBytes(32).toString('hex');
        
        // Store state in session or return it to client to verify in callback
        // For simplicity, we'll include userId in state (in production, use session storage)
        const stateWithUserId = `${state}:${userId}`;
        
        const clientId = process.env.ATLASSIAN_CLIENT_ID;
        const redirectUri = process.env.ATLASSIAN_REDIRECT_URI || `${process.env.FRONTEND_URL || 'http://localhost:3000'}/jira/callback`;
        const scope = 'read:jira-work write:jira-work manage:jira-project offline_access';
        
        const authUrl = `https://auth.atlassian.com/authorize?` +
            `audience=api.atlassian.com&` +
            `client_id=${clientId}&` +
            `scope=${encodeURIComponent(scope)}&` +
            `redirect_uri=${encodeURIComponent(redirectUri)}&` +
            `state=${stateWithUserId}&` +
            `response_type=code&` +
            `prompt=consent`;

        res.json({ authUrl, state: stateWithUserId });
    } catch (error) {
        console.error("Error initiating JIRA OAuth:", error);
        res.status(500).json({ message: "Failed to initiate JIRA OAuth" });
    }
};

/**
 * Handle OAuth callback and exchange code for tokens
 */
export const handleJiraOAuthCallback = async (req, res) => {
    try {
        const { code, state } = req.query;

        if (!code || !state) {
            return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/jira/error?message=missing_params`);
        }

        // Extract userId from state
        const [stateToken, userId] = state.split(':');
        if (!userId) {
            return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/jira/error?message=invalid_state`);
        }

        // Exchange authorization code for access token
        const tokenResponse = await axios.post(
            'https://auth.atlassian.com/oauth/token',
            {
                grant_type: 'authorization_code',
                client_id: process.env.ATLASSIAN_CLIENT_ID,
                client_secret: process.env.ATLASSIAN_CLIENT_SECRET,
                code: code,
                redirect_uri: process.env.ATLASSIAN_REDIRECT_URI || `${process.env.FRONTEND_URL || 'http://localhost:3000'}/jira/callback`
            },
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );

        const { access_token, refresh_token, expires_in } = tokenResponse.data;

        // Get cloud ID (site ID) from access token
        const cloudResponse = await axios.get(
            'https://api.atlassian.com/oauth/token/accessible-resources',
            {
                headers: {
                    'Authorization': `Bearer ${access_token}`,
                    'Accept': 'application/json'
                }
            }
        );

        const cloudId = cloudResponse.data[0]?.id;
        if (!cloudId) {
            return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/jira/error?message=no_cloud_id`);
        }

        // Store credentials
        await storeJiraCredentials(userId, access_token, refresh_token, cloudId, expires_in);

        // Redirect to success page
        res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/jira/success`);
    } catch (error) {
        console.error("Error in JIRA OAuth callback:", error);
        const errorMessage = error.response?.data?.error_description || error.message || 'unknown_error';
        res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/jira/error?message=${encodeURIComponent(errorMessage)}`);
    }
};


