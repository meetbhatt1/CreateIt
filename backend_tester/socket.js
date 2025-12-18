/**
 * socket.js
 * -----------------------
 * Live Socket.IO tester for CreateIt
 */

let socket = null;

/* =========================
   CONNECT
========================= */

function connectSocket() {
    if (!state.token) {
        alert("Login first (JWT required)");
        return;
    }

    socket = io("http://localhost:8000", {
        auth: {
            token: state.token
        }
    });

    socket.on("connect", () => {
        logSocket("✅ Connected", { id: socket.id });
    });

    socket.on("disconnect", () => {
        logSocket("❌ Disconnected");
    });

    socket.on("chat:joined", (data) => {
        state.chat.roomId = data.roomId;
        state.chat.slug = data.slug;
        logSocket("🏠 Joined room", data);
        updateDebugPanel();
    });

    socket.on("chat:message", (msg) => {
        logSocket("💬 Message", msg);
    });

    socket.on("chat:typing", (data) => {
        logSocket("✍️ Typing", data);
    });

    socket.on("chat:deleted", (data) => {
        logSocket("🗑️ Message deleted", data);
    });

    socket.on("chat:error", (err) => {
        logSocket("⚠️ Error", err);
    });
}

/* =========================
   CHAT ACTIONS
========================= */

function joinTeamRoom() {
    if (!socket) return alert("Connect socket first");
    if (!state.team.id) return alert("Create / load a team first");

    const slug = `team-${state.team.id}`;

    socket.emit("chat:join", {
        slug,
        name: "Team Chat",
        description: "Backend test room"
    });
}

function sendMessage() {
    if (!socket) return alert("Socket not connected");
    if (!state.chat.roomId) return alert("Join a room first");

    const text = document.getElementById("chatMessage").value;

    socket.emit("chat:send", {
        roomId: state.chat.roomId,
        type: "text",
        message: text
    });
}

function typing(isTyping) {
    if (!socket || !state.chat.roomId) return;

    socket.emit("chat:typing", {
        roomId: state.chat.roomId,
        isTyping
    });
}

function deleteMessage() {
    if (!socket || !state.chat.roomId) return;

    const messageId = document.getElementById("deleteMessageId").value;

    socket.emit("chat:delete", {
        messageId,
        roomId: state.chat.roomId
    });
}

/* =========================
   UI LOGGING
========================= */

function logSocket(event, data = {}) {
    const out = document.getElementById("chatOutput");
    const line = `[${new Date().toLocaleTimeString()}] ${event}\n` +
        JSON.stringify(data, null, 2) + "\n\n";

    out.textContent = line + out.textContent;
}
