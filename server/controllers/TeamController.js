import Team from '../models/Team.js';
import Invite from '../models/Invite.js';

const userId = "684b019e16f5ced3e620753f"

export const createTeam = async (req, res) => {
    const team = await Team.create({
        name: req.body.name,
        owner: userId,
        members: [{ user: userId, role: 'owner' }],
        visibility: req.body.visibility || 'private' // 'public' or 'private'
    });
    res.status(201).json(team);
};

export const inviteUser = async (req, res) => {
    const invite = await Invite.create({
        team: req.params.teamId,
        email: req.body.email,
        token: Math.random().toString(36).slice(2)
    });
    res.json({ inviteToken: invite.token });
};

export const acceptInvite = async (req, res) => {
    const invite = await Invite.findOne({ token: req.params.token });
    if (!invite) return res.status(404).send('Invalid invite');

    await Team.findByIdAndUpdate(invite.team, {
        $addToSet: { members: { user: userId, role: 'member' } }
    });

    res.json({ success: true });
};

export const joinTeam = async (req, res) => {
    const team = await Team.findById(req.params.teamId);
    if (team.visibility !== 'public') {
        return res.status(403).send('This team is private');
    }

    team.members.push({ user: userId, role: 'member' });
    await team.save();
    res.json(team);
};