// import Team from '../models/Team.js';
// import Invite from '../models/Invite.js';

// export const createTeam = async (req, res) => {
//     const team = await Team.create({
//         const [title,description,visibility,owner,members] = req.body
//         });
//     res.status(201).json(team);
// };

// export const inviteUser = async (req, res) => {
//     const invite = await Invite.create({
//         team: req.params.teamId,
//         email: req.body.email,
//         token: Math.random().toString(36).slice(2)
//     });
//     res.json({ inviteToken: invite.token });
// };

// export const acceptInvite = async (req, res) => {
//     const invite = await Invite.findOne({ token: req.params.token });
//     if (!invite) return res.status(404).send('Invalid invite');

//     await Team.findByIdAndUpdate(invite.team, {
//         $addToSet: { members: { user: userId, role: 'member' } }
//     });

//     res.json({ success: true });
// };

// export const joinTeam = async (req, res) => {
//     const team = await Team.findById(req.params.teamId);
//     if (team.visibility !== 'public') {
//         return res.status(403).send('This team is private');
//     }

//     team.members.push({ user: userId, role: 'member' });
//     await team.save();
//     res.json(team);
// };

import Team from '../models/Team.js';
import Invite from '../models/Invite.js';
import User from '../models/userModel.js';
import crypto from 'crypto';
import mongoose from 'mongoose';

// Helper function to generate token
const generateToken = () => crypto.randomBytes(32).toString('hex');

export const createTeam = async (req, res) => {
    try {
        const { title, description, visibility, members } = req.body;
        const ownerId = req.user._id; // From authenticated user
        console.log("Authenticated User ID:", ownerId); // Should match token's _id

        // Validate input
        if (!title || !description || visibility === undefined || !members || !members.length) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        // Prepare members array
        const membersData = [{
            user: ownerId,
            role: members[0].role,
            languages: members[0].languages,
            status: 'accepted'
        }];

        // Process additional members
        const invites = [];
        for (let i = 1; i < members.length; i++) {
            const member = members[i];

            if (member.userId) {
                // Existing user
                const user = await User.findById(member.userId);
                if (!user) {
                    return res.status(404).json({ message: `User not found for ID: ${member.userId}` });
                }

                membersData.push({
                    user: member.userId,
                    role: member.role,
                    languages: member.languages,
                    status: 'pending'
                });

                invites.push({
                    team: null, // Will be set after team creation
                    email: user.email,
                    role: member.role,
                    languages: member.languages,
                    token: generateToken()
                });
            } else {
                // Public request (no specific user)
                membersData.push({
                    user: null,
                    role: member.role,
                    languages: member.languages,
                    status: 'pending'
                });
            }
        }

        // Create team
        const team = await Team.create({
            title,
            description,
            visibility: visibility === "1",
            owner: ownerId,
            members: membersData
        });

        // Create invites for existing users
        for (const inviteData of invites) {
            inviteData.team = team._id;
            await Invite.create(inviteData);
            // TODO: Send email notification with invite token
        }

        res.status(201).json({ message: "Team Created SuccessFully", team });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getTeamsByUser = async (req, res) => {
    try {
        const userId = new mongoose.Types.ObjectId(req.params.id);

        const teams = await Team.aggregate([
            {
                $match: {
                    $or: [
                        { owner: userId },
                        { "members.user": userId }
                    ]
                }
            },
            {
                $lookup: {
                    from: "users", // collection name in MongoDB (should be lowercase plural of your model name)
                    localField: "owner",
                    foreignField: "_id",
                    as: "owner"
                }
            },
            {
                $unwind: "$owner"
            },
            {
                $lookup: {
                    from: "users",
                    localField: "members.user",
                    foreignField: "_id",
                    as: "memberDetails"
                }
            },
            {
                $sort: {
                    createdAt: -1
                }
            }
        ]);

        res.status(200).json(teams);
    } catch (error) {
        console.error("Error in getTeamsByUser (aggregate):", error);
        res.status(500).json({ message: "Server error", error });
    }
};


export const getTeamDetails = async (req, res) => {
    try {
        const team = await Team.findById(req.params.teamId)
            .populate('owner', 'username email')
            .populate('members.user', 'username email');

        if (!team) {
            return res.status(404).json({ message: 'Team not found' });
        }

        res.json(team);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const inviteUser = async (req, res) => {
    try {
        const { email, role, languages } = req.body;
        const teamId = req.params.teamId;

        const team = await Team.findById(teamId);
        if (!team) {
            return res.status(404).json({ message: 'Team not found' });
        }

        if (team.owner.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Only team owner can invite users' });
        }

        const token = generateToken();
        const invite = await Invite.create({
            team: teamId,
            email,
            role,
            languages,
            token
        });

        // TODO: Send email with invite link
        res.json({ inviteToken: token });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const acceptInvite = async (req, res) => {
    try {
        const { token } = req.params;
        const userId = req.user._id;

        const invite = await Invite.findOne({ token });
        if (!invite) {
            return res.status(404).json({ message: 'Invalid or expired invite token' });
        }

        const team = await Team.findById(invite.team);
        if (!team) {
            return res.status(404).json({ message: 'Team not found' });
        }

        // Update member status
        const memberIndex = team.members.findIndex(
            m => !m.user && m.role === invite.role
        );

        if (memberIndex !== -1) {
            team.members[memberIndex].user = userId;
            team.members[memberIndex].status = 'accepted';
        } else {
            // Add as new member if slot not found
            team.members.push({
                user: userId,
                role: invite.role,
                languages: invite.languages,
                status: 'accepted'
            });
        }

        await team.save();
        await invite.deleteOne();

        res.json({ success: true, team });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const joinPublicTeam = async (req, res) => {
    try {
        const teamId = req.params.teamId;
        const userId = req.user._id;

        const team = await Team.findById(teamId);
        if (!team) {
            return res.status(404).json({ message: 'Team not found' });
        }

        if (!team.visibility) {
            return res.status(403).json({ message: 'This team is private' });
        }

        // Check if user is already a member
        const isMember = team.members.some(
            m => m.user && m.user.toString() === userId.toString()
        );

        if (isMember) {
            return res.status(400).json({ message: 'You are already a member of this team' });
        }

        // Find an open slot
        const openSlotIndex = team.members.findIndex(
            m => !m.user && m.status === 'pending'
        );

        if (openSlotIndex !== -1) {
            team.members[openSlotIndex].user = userId;
            team.members[openSlotIndex].status = 'accepted';
        } else {
            // Add as new member if no open slots
            team.members.push({
                user: userId,
                role: 'Member',
                status: 'accepted'
            });
        }

        await team.save();
        res.json({ success: true, team });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};