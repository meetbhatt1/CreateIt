/**
 * state.js
 * -----------------------
 * Central runtime state for backend tester
 * This is the ONLY place where IDs live
 */

window.state = {
    token: null,

    user: {
        id: null,
        email: null
    },

    project: {
        id: null
    },

    team: {
        id: null
    },

    task: {
        id: null
    },

    chat: {
        roomId: null,
        slug: null
    },

    jira: {
        connected: false
    }
};

/* =========================
   Helpers
========================= */

state.setToken = (token) => {
    state.token = token;
    localStorage.setItem("token", token);
};

state.loadToken = () => {
    state.token = localStorage.getItem("token");
};

state.debug = () => JSON.stringify(state, null, 2);
