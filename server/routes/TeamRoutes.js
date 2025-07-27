import express from 'express';
import {
    createTeam,
    getTeamDetails,
    inviteUser,
    acceptInvite,
    joinPublicTeam,
    getTeamsByUser,
    getUserInvitations,
    respondToInvite
} from '../controllers/TeamController.js';
import { auth } from '../middleware/AuthMiddleware.js';

const router = express.Router();

// Create a new team
router.post('/team', auth, createTeam);
// Get team details
router.get('/:teamId', auth, getTeamDetails);
// Invite a user to a team
router.post('/:teamId/invite', auth, inviteUser);
// Accept an invite
router.post('/invite/accept/:token', auth, acceptInvite);
router.get('/user/invitations', auth, getUserInvitations);
router.post('/invite/:inviteId/respond', auth, respondToInvite);
// Join a public team
router.post('/:teamId/join', auth, joinPublicTeam);
// Get team by user
router.get('/user/:id', getTeamsByUser);

export default router;