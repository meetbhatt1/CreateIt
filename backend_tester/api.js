/**
 * api.js
 * -----------------------
 * Central fetch wrapper + response interception
 */

const API_BASE = "http://localhost:8000/api";

state.loadToken();

async function api(path, method = "GET", body) {
    const res = await fetch(API_BASE + path, {
        method,
        headers: {
            "Content-Type": "application/json",
            ...(state.token && { Authorization: "Bearer " + state.token })
        },
        body: body ? JSON.stringify(body) : undefined
    });

    const data = await res.json();
    captureStateFromResponse(path, data);
    updateDebugPanel();

    return data;
}

/* =========================
   AUTO-CAPTURE LOGIC
========================= */

function captureStateFromResponse(path, data) {
    // AUTH
    if (data?.token) {
        state.setToken(data.token);
        state.user.id = data.user?._id || state.user.id;
        state.user.email = data.user?.email || state.user.email;
    }

    // PROJECT
    if (data?.project?._id) {
        state.project.id = data.project._id;
    }

    // TEAM
    if (data?.team?._id) {
        state.team.id = data.team._id;
    }

    // TASK
    if (data?._id && path.includes("/task")) {
        state.task.id = data._id;
    }

    // CHAT
    if (data?.room?._id) {
        state.chat.roomId = data.room._id;
        state.chat.slug = data.room.slug;
    }

    // JIRA
    if (data?.connected !== undefined) {
        state.jira.connected = data.connected;
    }
}

function updateDebugPanel() {
    const el = document.getElementById("debugOutput");
    if (el) el.textContent = state.debug();
}
