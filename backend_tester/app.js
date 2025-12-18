/**
 * app.js
 * -----------------------
 * UI logic + action handlers
 */

/* =========================
   TAB HANDLING
========================= */

const tabs = document.querySelectorAll(".tabs button");
const panels = document.querySelectorAll(".panel");

tabs.forEach(btn => {
    btn.addEventListener("click", () => {
        const target = btn.dataset.tab;

        // deactivate all
        tabs.forEach(b => b.classList.remove("active"));
        panels.forEach(p => p.classList.remove("active"));

        // activate selected
        btn.classList.add("active");
        document.getElementById(target).classList.add("active");

        // preload schemas (Step 2)
        preloadSchemas(target);
    });
});

// Default tab on load
document.querySelector('[data-tab="auth"]').click();

/* =========================
   SCHEMA PRELOAD
========================= */

function preloadSchemas(tab) {
    if (tab === "team") {
        teamPayload.value = JSON.stringify(
            schemas.team.create,
            null,
            2
        );
    }

    if (tab === "project") {
        projectPayload.value = JSON.stringify(
            schemas.project.create,
            null,
            2
        );
    }

    if (tab === "task") {
        taskPayload.value = JSON.stringify(
            schemas.task.create,
            null,
            2
        );
    }

    updateDebugPanel();
}

/* =========================
   ACTION HANDLERS (STEP 5)
========================= */

async function login() {
    const payload = {
        email: loginEmail.value,
        password: loginPassword.value
    };

    const res = await api("/auth/login", "POST", payload);
    authOutput.textContent = JSON.stringify(res, null, 2);
}

async function createProject() {
    const payload = withInjectedIds(
        JSON.parse(projectPayload.value)
    );

    const res = await api("/projects/create", "POST", payload);
    projectOutput.textContent = JSON.stringify(res, null, 2);
}

async function createTeam() {
    const payload = withInjectedIds(
        JSON.parse(teamPayload.value)
    );

    const res = await api("/team/team", "POST", payload);
    teamOutput.textContent = JSON.stringify(res, null, 2);
}

async function createTask() {
    const payload = withInjectedIds(
        JSON.parse(taskPayload.value)
    );

    const res = await api("/task", "POST", payload);
    taskOutput.textContent = JSON.stringify(res, null, 2);
}

async function checkJira() {
    const res = await api("/jira/connection");
    jiraOutput.textContent = JSON.stringify(res, null, 2);
}

async function loadMyTeams() {
    if (!state.user.id) {
        alert("Login first");
        return;
    }

    const teams = await api(`/team/user/${state.user.id}`);

    const select = document.getElementById("teamSelect");
    select.innerHTML = `<option value="">-- Select a team --</option>`;

    teams.forEach(team => {
        const option = document.createElement("option");
        option.value = team._id;
        option.textContent = `${team.title} (${team._id.slice(-5)})`;
        select.appendChild(option);
    });

    teamOutput.textContent = JSON.stringify(teams, null, 2);
}

function selectTeam() {
    const select = document.getElementById("teamSelect");
    const teamId = select.value;

    if (!teamId) return;

    state.team.id = teamId;
    updateDebugPanel();
}

async function inviteUser() {
    if (!state.team.id) {
        alert("Select a team first");
        return;
    }

    const payload = {
        userId: inviteUserId.value.trim(),
        role: inviteRole.value || "Contributor",
        languages: inviteLanguages.value
            ? inviteLanguages.value.split(",").map(l => l.trim())
            : []
    };

    const res = await api(
        `/team/${state.team.id}/invite`,
        "POST",
        payload
    );

    teamOutput.textContent = JSON.stringify(res, null, 2);
}

async function loadInvites() {
    const res = await api(`/team/${state.user.id}/invitations`);

    const select = document.getElementById("inviteSelect");
    select.innerHTML = `<option value="">-- Select Invite --</option>`;

    res.pending.forEach(invite => {
        const opt = document.createElement("option");
        opt.value = invite._id;
        opt.textContent = `${invite.teamName} → ${invite.role}`;
        select.appendChild(opt);
    });

    teamOutput.textContent = JSON.stringify(res, null, 2);
}

async function acceptInvite() {
    const inviteId = inviteSelect.value;
    if (!inviteId) return;

    const res = await api(
        `/team/invite/${inviteId}/respond`,
        "POST",
        { accepted: true }
    );

    teamOutput.textContent = JSON.stringify(res, null, 2);
}

async function rejectInvite() {
    const inviteId = inviteSelect.value;
    if (!inviteId) return;

    const res = await api(
        `/team/invite/${inviteId}/respond`,
        "POST",
        { accepted: false }
    );

    teamOutput.textContent = JSON.stringify(res, null, 2);
}

/* =========================
   JIRA
========================= */

async function connectJira() {
    const res = await api("/jira/oauth/initiate");
    jiraOutput.textContent = JSON.stringify(res, null, 2);

    if (res.authUrl) {
        window.open(res.authUrl, "_blank");
    }
}

async function checkJira() {
    const res = await api("/jira/status");
    jiraOutput.textContent = JSON.stringify(res, null, 2);
}

async function getJiraProjects() {
    const res = await api("/jira/projects");
    jiraOutput.textContent = JSON.stringify(res, null, 2);
}

async function getJiraIssues() {
    const key = document.getElementById("jiraProjectKey").value.trim();
    if (!key) return alert("Enter project key");

    const res = await api(`/jira/issues/${key}`);
    jiraOutput.textContent = JSON.stringify(res, null, 2);
}


function withInjectedIds(schema) {
    const cloned = JSON.parse(JSON.stringify(schema));

    // Replace USER
    if (cloned.ownerId === "__USER_ID__") {
        cloned.ownerId = state.user.id;
    }

    // Replace PROJECT
    if (cloned.projectId === "__PROJECT_ID__") {
        cloned.projectId = state.project.id;
    }

    // Replace TEAM
    if (cloned.teamId === "__TEAM_ID__") {
        cloned.teamId = state.team.id;
    }

    // Replace chat slug
    if (typeof cloned.slug === "string") {
        cloned.slug = cloned.slug.replace("__TEAM_ID__", state.team.id || "");
    }

    return cloned;
}
