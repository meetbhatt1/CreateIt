import express from 'express';
import {
    createTeam,
    inviteUser,
    acceptInvite,
    joinTeam
} from '../controllers/TeamController.js';

const router = express.Router();

router.post('/', createTeam);
router.post('/:teamId/invites', inviteUser);
router.get('/invites/:token', acceptInvite);
router.post('/:teamId/join', joinTeam);

export default router;