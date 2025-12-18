import mongoose from "mongoose";

const { Schema, Types } = mongoose;

const projectSchema = new Schema({
    title: {
        type: String,
        required: [true, 'Project title is required']
    },
    description: {
        type: String,
        required: [true, 'Project description is required']
    },
    domain: {
        type: String,
        enum: ['Web Dev', 'Mobile', 'AI/ML', 'DevOps', 'Blockchain'],
        required: [true, 'Project domain is required']
    },
    techStack: [{
        type: String
    }],
    collaborationType: {
        type: String,
        enum: ['Open Source', 'Team Only', 'Mentored'],
        required: [true, 'Collaboration type is required']
    },
    owner: {
        type: Types.ObjectId,
        ref: 'User',
        required: [true, 'Project owner is required']
    },
    status: {
        type: String,
        enum: ['in-progress', 'completed'],
        default: 'in-progress',
        required: true
    },
    visibility: {
        type: String,
        enum: ['private', 'public'],
        default: 'private',
        required: true
    },
    members: [{
        user: { type: Types.ObjectId, ref: 'User', required: false },
        role: {
            type: String,
            enum: ['Core Member', 'Maintainer', 'Reviewer', 'Contributor'],
            required: true
        },
        joinedAt: { type: Date, default: Date.now }
    }],
    jira: {
        projectKey: String,   // e.g. CRE-TEAM1
        synced: { type: Boolean, default: false }
    },
    team: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Team",
        required: false
    },
    // accessRequests: [{
    //     user: { type: Types.ObjectId, ref: 'User', required: true },
    //     message: String,
    //     status: {
    //         type: String,
    //         enum: ['Pending', 'Approved', 'Rejected'],
    //         default: 'Pending'
    //     },
    //     requestedAt: { type: Date, default: Date.now }
    // }]
    zipFiles: {
        frontend: String,
        backend: String,
        envFile: String || null,
        dbFile: String
    },
    screenshots: [String]
}, { timestamps: true });
// });

export default mongoose.models.Project || mongoose.model("Project", projectSchema); 