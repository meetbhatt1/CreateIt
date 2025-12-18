/**
 * schemas.js
 * -----------------------
 * Canonical request bodies derived from:
 * - Mongoose models
 * - Controllers
 * - Route expectations
 *
 * ❗ DO NOT hardcode IDs here
 * IDs will be injected automatically in Step 5
 */

window.schemas = {};

/* =========================
   AUTH
========================= */

schemas.auth = {
    signup: {
        fullName: "Meet Bhatt",
        email: "meet@test.com",
        phone: "9876543210",
        password: "password123",
        dob: "2002-05-10",
        preferredLanguage: ["JavaScript"],
        purpose: "contributor"
    },

    login: {
        email: "meet@test.com",
        password: "password123"
    },

    sendOTP: {
        email: "meet@test.com"
    },

    verifyOTP: {
        email: "meet@test.com",
        otp: "123456"
    }
};

/* =========================
   PROJECT
========================= */
/**
 * Controller: createProject
 * Model: projectModel.js
 */
schemas.project = {
    create: {
        title: "CreateIt Phase 2",
        description: "Backend stabilization & Jira integration",
        domain: "Web Dev",
        techStack: ["Node.js", "MongoDB", "Socket.IO"],
        collaborationType: "Team Only",
        status: "in-progress",
        visibility: "private",

        ownerId: "__USER_ID__"
    }
};


/* =========================
   TEAM
========================= */
/**
 * Controller: createTeam
 * Model: Team.js
 */
schemas.team = {
    create: {
        title: "Core Backend Team",
        description: "Handles APIs and sockets",
        visibility: true,
        projectId: "__PROJECT_ID__",
        members: [
            {
                role: "Core Member",
                languages: ["JavaScript", "Node.js"]
            },
            {
                role: "Contributor",
                languages: ["MongoDB"]
                // userId optional (invite flow)
            }
        ]
    },

    invite: {
        userId: "__USER_ID__",
        role: "Contributor",
        languages: ["MongoDB"]
    },

    joinRequest: {
        role: "Contributor"
    }
};

/* =========================
   TASK
========================= */
/**
 * Controller: createTask
 * Model: TaskModel.js
 */
schemas.task = {
    create: {
        title: "Fix JWT auth bug",
        description: "Socket auth mismatch",
        priority: "high",        // enum ✔
        status: "todo",          // enum ✔
        assignee: "Meet",
        xp: 10
        // projectId injected automatically
    },

    update: {
        status: "inProgress"     // enum ✔
    }
};

/* =========================
   CHAT
========================= */
/**
 * Model: ChatRoom.js
 */
schemas.chat = {
    createRoom: {
        name: "Team Chat",
        description: "Core discussion",
        slug: "team-__TEAM_ID__"
    },

    message: {
        type: "text",
        message: "Hello team 👋"
    }
};

/* =========================
   JIRA
========================= */
/**
 * JIRA mostly uses params, not body
 */
schemas.jira = {
    issues: {
        projectKey: "CRE"
    }
};
