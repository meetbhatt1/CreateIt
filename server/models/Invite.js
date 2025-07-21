import mongoose from "mongoose";

const inviteSchema = new mongoose.Schema({
    team: { type: mongoose.Schema.Types.ObjectId, ref: 'Team' },
    email: String,
    role: String,
    token: String
});

export default mongoose.model('Invite', inviteSchema);