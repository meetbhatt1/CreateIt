import React, { useEffect, useMemo, useRef, useState } from "react";
import { getSocket } from "../../utils/socket";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "../ui/UI_Components";
import API from "../../utils/API";

const EMOJIS = [
  "👍",
  "👎",
  "🚀",
  "🔥",
  "🐛",
  "✅",
  "❌",
  "🧪",
  "💡",
  "🎯",
  "😄",
  "🤔",
];
const CODE_LANGS = [
  "javascript",
  "python",
  "java",
  "csharp",
  "cpp",
  "go",
  "bash",
  "ts",
  "rust",
];
const MESSAGE_FILTERS = ["all", "code", "files", "pinned", "text"];

function classNames(...xs) {
  return xs.filter(Boolean).join(" ");
}

function nowTime() {
  return new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function createMessage({
  text = "",
  type = "text",
  own = true,
  sender = "You",
  avatar = sender.toString().substring(0, 0),
  meta = {},
  timestamp = nowTime(),
  _id = null,
}) {
  return {
    id: _id || Date.now().toString(36) + Math.random().toString(36).slice(2, 8),
    sender,
    avatar,
    message: text,
    timestamp,
    type,
    own,
    pinned: false,
    reactions: {},
    edited: false,
    ...meta,
  };
}

/* -------------------------
   UI MATERIALS
   ------------------------- */
const Surface = ({ className, children }) => (
  <div className={classNames("bg-white rounded-2xl shadow-sm", className)}>
    {children}
  </div>
);

const IconBtn = ({ children, title, onClick, className }) => (
  <button
    title={title}
    onClick={onClick}
    className={classNames(
      "p-2 rounded-md hover:bg-gray-100 transition",
      className
    )}
  >
    {children}
  </button>
);

const Avatar = ({ text, size = "md" }) => (
  <div
    className={classNames(
      "rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center font-bold",
      size === "sm" ? "w-8 h-8 text-sm" : "w-12 h-12 text-base"
    )}
  >
    {(text || "U").slice(0, 2).toUpperCase()}
  </div>
);

/* -------------------------
   Code block with controls
   ------------------------- */
function CodeBlock({
  code,
  language = "text",
  compact = false,
  onExpand,
  allowRun = true,
}) {
  const [expanded, setExpanded] = useState(false);
  const [running, setRunning] = useState(false);
  const [output, setOutput] = useState(null);

  useEffect(() => {
    if (!expanded) {
      setOutput(null);
      setRunning(false);
    }
  }, [expanded]);

  const doCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      alert("Copied to clipboard");
    } catch (e) {
      alert("Copy failed", e.message);
    }
  };

  const doDownload = () => {
    const ext =
      language === "javascript" ? "js" : language === "python" ? "py" : "txt";
    const blob = new Blob([code], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `snippet.${ext}`;
    link.click();
  };

  const runJS = () => {
    if (language !== "javascript") return;
    setRunning(true);
    setOutput(null);
    try {
      const logs = [];
      const fakeConsole = {
        log: (...args) => logs.push(args.map((a) => String(a)).join(" ")),
      };
      const fn = new Function("console", `"use strict";\n${code}`);
      const res = fn(fakeConsole);
      setOutput({ logs, return: res });
    } catch (err) {
      setOutput({ error: String(err) });
    } finally {
      setRunning(false);
    }
  };

  return (
    <div className="bg-gray-900 text-gray-100 rounded-lg p-3 font-mono text-sm relative">
      <div className="flex items-center justify-between mb-2">
        <div className="text-xs text-gray-300">{language}</div>
        <div className="flex items-center gap-2">
          <button
            className="text-xs px-2 py-1 bg-gray-800 rounded-md hover:bg-gray-700"
            onClick={doCopy}
          >
            Copy
          </button>
          <button
            className="text-xs px-2 py-1 bg-gray-800 rounded-md hover:bg-gray-700"
            onClick={() => {
              setExpanded(!expanded);
              onExpand && onExpand(!expanded);
            }}
          >
            {expanded ? "Collapse" : "Expand"}
          </button>
          <button
            className="text-xs px-2 py-1 bg-gray-800 rounded-md hover:bg-gray-700"
            onClick={doDownload}
          >
            Download
          </button>
          {allowRun && language === "javascript" && (
            <button
              className={classNames(
                "text-xs px-2 py-1 rounded-md",
                running ? "bg-yellow-500" : "bg-green-500"
              )}
              onClick={runJS}
            >
              {running ? "Running..." : "Run (JS)"}
            </button>
          )}
        </div>
      </div>

      <pre
        className={classNames(
          "rounded-md p-2 overflow-x-auto",
          !expanded && compact ? "max-h-40 overflow-hidden" : ""
        )}
      >
        <code>{code}</code>
      </pre>

      {output && (
        <div className="mt-2 bg-black/60 p-2 rounded text-xs">
          {output.error ? (
            <div className="text-rose-400">Error: {output.error}</div>
          ) : (
            <>
              {output.logs && output.logs.length > 0 && (
                <div>
                  <strong>Console:</strong>
                  <pre className="whitespace-pre-wrap">
                    {output.logs.join("\n")}
                  </pre>
                </div>
              )}
              {"return" in output && (
                <div>
                  <strong>Return:</strong>{" "}
                  <pre className="whitespace-pre-wrap">
                    {String(output.return)}
                  </pre>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}

/* -------------------------
   File preview / attachment
   ------------------------- */
function FilePreview({ file }) {
  const ext = (file.name.split(".").pop() || "").toUpperCase();
  const human = `${Math.round(file.size / 1024)} KB`;
  const url = URL.createObjectURL(file);
  return (
    <div className="flex items-center gap-3 bg-gray-50 p-2 rounded">
      <div className="w-12 min-h-12 bg-indigo-200 rounded flex items-center justify-center font-semibold">
        {ext}
      </div>
      <div className="flex-1">
        <div className="font-medium truncate">{file.name}</div>
        <div className="text-xs text-gray-500">
          {human} • {file.type || "file"}
        </div>
      </div>
      <div className="flex gap-2">
        <a
          href={url}
          download={file.name}
          className="text-sm px-2 py-2 min-h-3 rounded bg-white hover:bg-gray-100"
        >
          Download
        </a>
      </div>
    </div>
  );
}

/* -------------------------
   Message component
   ------------------------- */
function MessageItem({
  m,
  onTogglePin,
  onReact,
  onEdit,
  onDelete,
  onExpandCode,
}) {
  const [showActions, setShowActions] = useState(false);
  return (
    <div
      className={classNames(
        "flex gap-3 p-2",
        m.own ? "justify-end" : "justify-start"
      )}
    >
      {!m.own && <Avatar text={m.avatar} />}
      <div className="max-w-3xl w-full">
        <div className="flex items-start gap-3">
          <div
            className={classNames(
              "rounded-xl p-3",
              m.own ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-900",
              "flex-1"
            )}
          >
            <div className="text-xs text-gray-400 flex items-center justify-between">
              <div>
                <strong className="mr-2">{m.sender}</strong>
                <span className="text-[11px]">
                  {m.timestamp}
                  {m.edited ? " • edited" : ""}
                </span>
              </div>
              <div className="flex items-center gap-1">
                {m.pinned && (
                  <span className="text-yellow-300 text-xs">📌</span>
                )}
                <button
                  onClick={() => setShowActions((s) => !s)}
                  className="text-sm px-1"
                >
                  ⋯
                </button>
              </div>
            </div>

            <div className="mt-2">
              {m.type === "text" && (
                <div className="whitespace-pre-wrap">{m.message}</div>
              )}
              {m.type === "code" && (
                <CodeBlock
                  code={m.message}
                  language={m.meta?.language || "text"}
                  compact={true}
                  onExpand={(opening) => {
                    if (opening) onExpandCode && onExpandCode(m.message);
                  }}
                />
              )}
              {m.type === "file" &&
                (m.meta?.fileObj ? (
                  <FilePreview file={m.meta.fileObj} />
                ) : (
                  <div className="bg-white p-2 rounded">{m.meta?.fileName}</div>
                ))}
            </div>

            <div className="mt-2 flex items-center gap-2">
              <div className="flex gap-1">
                {Object.entries(m.reactions || {}).map(([emo, users]) => (
                  <button
                    key={emo}
                    onClick={() => onReact(m.id, emo)}
                    className="text-xs px-2 py-0.5 bg-white/10 rounded"
                  >
                    {emo} {users.length}
                  </button>
                ))}
              </div>
              <div className="ml-auto flex items-center gap-2">
                <button onClick={() => onReact(m.id, "👍")} className="text-xs">
                  👍
                </button>
                <button onClick={() => onTogglePin(m.id)} className="text-xs">
                  {m.pinned ? "Unpin" : "Pin"}
                </button>
                <button onClick={() => onEdit(m.id)} className="text-xs">
                  Edit
                </button>
                <button
                  onClick={() => onDelete(m.id)}
                  className="text-xs text-rose-500"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>

        {m.meta?.tags && m.meta.tags.length > 0 && (
          <div className="mt-2 flex gap-2">
            {m.meta.tags.map((t) => (
              <span key={t} className="text-xs bg-gray-200 px-2 py-0.5 rounded">
                {t}
              </span>
            ))}
          </div>
        )}
      </div>
      {m.own && <Avatar text={m.avatar} />}
    </div>
  );
}

/* -------------------------
   Composer
   ------------------------- */
function Composer({ onSendMessage }) {
  const [mode, setMode] = useState("text");
  const [text, setText] = useState("");
  const [code, setCode] = useState("// paste code here");
  const [language, setLanguage] = useState("javascript");
  const [tags, setTags] = useState([]);
  const [file, setFile] = useState(null);
  const fileRef = useRef();

  useEffect(() => {
    const handleDragOver = (e) => {
      e.preventDefault();
    };
    const handleDrop = (e) => {
      e.preventDefault();
      if (e.dataTransfer?.files?.length) {
        setFile(e.dataTransfer.files[0]);
        setMode("file");
      }
    };
    window.addEventListener("dragover", handleDragOver);
    window.addEventListener("drop", handleDrop);
    return () => {
      window.removeEventListener("dragover", handleDragOver);
      window.removeEventListener("drop", handleDrop);
    };
  }, []);

  function pickFile() {
    fileRef.current?.click();
  }
  function onFilePicked(e) {
    const f = e.target.files?.[0];
    if (f) {
      setFile(f);
      setMode("file");
    }
  }
  function toggleTag(t) {
    setTags((prev) =>
      prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]
    );
  }

  function send() {
    if (mode === "text") {
      if (!text.trim()) return;
      onSendMessage({ type: "text", text: text.trim() });
      setText("");
    } else if (mode === "code") {
      if (!code.trim()) return;
      onSendMessage({ type: "code", text: code, meta: { language, tags } });
      setCode("// paste code here");
      setTags([]);
    } else if (mode === "file") {
      if (!file) return;
      onSendMessage({
        type: "file",
        text: "",
        meta: {
          fileName: file.name,
          fileSize: file.size,
          fileType: file.type,
          fileObj: file,
        },
      });
      setFile(null);
    }
  }

  return (
    <div className="p-3 border-t bg-white">
      <div className="flex items-center gap-2 mb-2">
        <div className="flex gap-1 rounded-xl bg-gray-100 p-1">
          <button
            className={classNames(
              "px-2 py-1 rounded text-sm",
              mode === "text" ? "bg-white shadow" : ""
            )}
            onClick={() => setMode("text")}
            type="button"
          >
            Text
          </button>
          <button
            className={classNames(
              "px-2 py-1 rounded text-sm",
              mode === "code" ? "bg-white shadow" : ""
            )}
            onClick={() => setMode("code")}
            type="button"
          >
            Code
          </button>
          <button
            className={classNames(
              "px-2 py-1 rounded text-sm",
              mode === "file" ? "bg-white shadow" : ""
            )}
            onClick={() => setMode("file")}
            type="button"
          >
            File
          </button>
        </div>

        <div className="ml-auto flex items-center gap-2 text-xs">
          <div className="text-gray-500">Quick tags:</div>
          {["bug", "snippet", "todo", "review"].map((t) => (
            <button
              key={t}
              onClick={() => toggleTag(t)}
              className={classNames(
                "px-2 py-0.5 rounded text-xs",
                tags.includes(t) ? "bg-indigo-600 text-white" : "bg-gray-100"
              )}
              type="button"
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {mode === "text" && (
        <div className="flex gap-2">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={2}
            className="flex-1 rounded-xl border px-3 py-2"
            placeholder="Write a message... (Shift+Enter -> newline)"
          />
          <div className="flex flex-col gap-2">
            <button
              onClick={() => {
                setText((t) => t + " 👍");
              }}
              className="px-3 py-2 rounded bg-gray-100"
              type="button"
            >
              👍
            </button>
            <button
              onClick={send}
              className="px-4 py-2 rounded bg-indigo-600 text-white"
              type="button"
            >
              Send
            </button>
          </div>
        </div>
      )}

      {mode === "code" && (
        <div className="space-y-2">
          <div className="flex gap-2 items-center">
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="px-2 py-1 border rounded"
            >
              {CODE_LANGS.map((l) => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
            </select>
            <div className="flex gap-1">
              {["bug", "snippet", "todo", "optimize"].map((t) => (
                <button
                  key={t}
                  onClick={() => toggleTag(t)}
                  className={classNames(
                    "px-2 py-0.5 rounded text-xs",
                    tags.includes(t)
                      ? "bg-indigo-600 text-white"
                      : "bg-gray-100"
                  )}
                  type="button"
                >
                  {t}
                </button>
              ))}
            </div>
            <div className="ml-auto text-xs text-gray-500">JS run enabled</div>
          </div>
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            rows={8}
            className="w-full font-mono text-sm rounded-lg border p-2 bg-gray-50"
          />
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setCode("// example\nconsole.log('hello')");
              }}
              className="px-3 py-1 rounded bg-gray-100"
              type="button"
            >
              Insert example
            </button>
            <button
              onClick={send}
              className="px-4 py-2 rounded bg-indigo-600 text-white"
              type="button"
            >
              Share snippet
            </button>
          </div>
        </div>
      )}

      {mode === "file" && (
        <div className="space-y-2">
          <input
            ref={fileRef}
            type="file"
            onChange={onFilePicked}
            className="hidden"
          />
          <div className="flex items-center gap-3">
            <div className="flex-1">
              {file ? (
                <FilePreview file={file} />
              ) : (
                <div className="text-sm text-gray-500">
                  No file selected - drag & drop a file or pick one
                </div>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <button
                onClick={pickFile}
                className="px-3 py-2 rounded bg-white border"
                type="button"
              >
                Choose
              </button>
              <button
                onClick={send}
                className="px-3 py-2 rounded bg-indigo-600 text-white"
                type="button"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* -------------------------
   Team Members Sidebar
   ------------------------- */
function TeamMembersSidebar({ team, members, currentUser, navigate }) {
  return (
    <div className="bg-white rounded-2xl shadow p-3 h-full">
      <Button
        className="w-[100%] mb-5"
        variant="primary"
        onClick={() => navigate(`/my-team`)}
      >
        Back To project
      </Button>
      <h3 className="text-lg place-self-center font-semibold mb-3">
        Team Members
      </h3>
      <div className="space-y-2">
        {members.map((member) => (
          <div
            key={member._id}
            className="flex items-center gap-3 p-2 rounded hover:bg-gray-50"
          >
            <Avatar text={member.name} size="sm" />
            <div className="flex-1">
              <div className="font-medium text-sm">
                {member.name}
                {member._id === currentUser?._id && " (You)"}
              </div>
              <div className="text-xs text-gray-500">
                {member.role || "Member"}
              </div>
            </div>
            {member.isOnline && (
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-4 pt-3 border-t">
        <h4 className="font-medium text-sm mb-2">Team Info</h4>
        <div className="text-xs text-gray-600 space-y-1">
          <div>
            <strong>Project:</strong> {team?.title || "N/A"}
          </div>
          <div>
            <strong>Description:</strong> {team?.description || "N/A"}
          </div>
          <div>
            <strong>Created:</strong>{" "}
            {team?.createdAt
              ? new Date(team.createdAt).toLocaleDateString()
              : "N/A"}
          </div>
          <div>
            <strong>Members:</strong> {members.length}
          </div>
        </div>
      </div>
    </div>
  );
}

/* -------------------------
   Main Team Chat Component
   ------------------------- */
export default function TeamChat() {
  const params = useParams();
  const teamId = params.teamId;
  const navigate = useNavigate();
  const [team, setTeam] = useState(null);
  const [members, setMembers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [filter, setFilter] = useState("all");
  const [q, setQ] = useState("");
  const [showCodeModal, setShowCodeModal] = useState(false);
  const [codeModalContent, setCodeModalContent] = useState("");
  const [typingUsers, setTypingUsers] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const socketRef = useRef(null);
  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");

  const teamRoomSlug = `team-${teamId}`;

  // Initialize team chat
  useEffect(() => {
    if (!teamId) {
      setError("No team ID provided");
      setIsLoading(false);
      return;
    }

    const initializeTeamChat = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const token = localStorage.getItem("token");

        if (!token) {
          throw new Error("No authentication token found");
        }

        // Fetch team details
        const teamResponse = await axios.get(`${API}/team/${teamId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (teamResponse.data) {
          const teamData = teamResponse.data;
          setTeam(teamData);
          console.log("Team data:", teamData);

          // Extract members from the team data structure
          const formattedMembers = extractMembersFromTeamData(
            teamData,
            currentUser
          );
          setMembers(formattedMembers);
        }

        // Initialize socket connection
        const socket = getSocket(token);
        socketRef.current = socket;

        // Join team room via socket
        socket.emit("chat:join", {
          slug: teamRoomSlug,
          name: teamResponse.data?.title || `Team ${teamId}`,
          description:
            teamResponse.data?.description || "Team collaboration space",
        });

        // Set up socket listeners
        socket.on("chat:joined", (data) => {
          console.log("Joined team room:", data);
          // Fetch message history after joining
          fetchMessageHistory();
        });

        socket.on("chat:message", (payload) => {
          // Only process messages for our team room
          if (payload.room === teamRoomSlug) {
            handleIncomingMessage(payload);
          }
        });

        socket.on("chat:typing", (data) => {
          setTypingUsers((prev) => ({
            ...prev,
            [data.userId]: data.isTyping ? Date.now() : null,
          }));
        });

        socket.on("chat:error", (error) => {
          console.error("Chat error:", error);
          setError(error.message || "An error occurred in chat");
        });

        socket.on("chat:deleted", (data) => {
          setMessages((prev) => prev.filter((m) => m.id !== data.messageId));
        });
      } catch (error) {
        console.error("Failed to initialize team chat:", error);
        setError(error.response?.data?.message || "Failed to load team chat");
      } finally {
        setIsLoading(false);
      }
    };

    // Helper function to extract members from team data
    const extractMembersFromTeamData = (teamData, currentUser) => {
      const members = [];

      // Add owner as a member
      if (teamData.owner) {
        members.push({
          _id: teamData.owner._id,
          name: teamData.owner.email.split("@")[0], // Use email prefix as name
          email: teamData.owner.email,
          role: "Owner",
          isOnline: true,
        });
      }

      // Add team members
      if (teamData.members && Array.isArray(teamData.members)) {
        teamData.members.forEach((member) => {
          if (member.user && member.status === "accepted") {
            members.push({
              _id: member.user._id,
              name: member.user.email.split("@")[0], // Use email prefix as name
              email: member.user.email,
              role: member.role || "Member",
              isOnline: Math.random() > 0.3, // Random online status for demo
            });
          }
        });
      }

      // Ensure current user is in the list
      const currentUserInMembers = members.some(
        (member) => member._id === currentUser._id
      );
      if (!currentUserInMembers && currentUser._id) {
        members.push({
          _id: currentUser._id,
          name: currentUser.name || currentUser.email.split("@")[0],
          email: currentUser.email,
          role: "Member",
          isOnline: true,
        });
      }

      return members;
    };

    // Helper function to handle incoming messages
    const handleIncomingMessage = (payload) => {
      setMessages((prev) => {
        // If this is a confirmation of our optimistic message
        if (payload.tempId) {
          return prev.map((msg) =>
            msg.id === payload.tempId
              ? createMessage({
                  text: payload.message,
                  type: payload.type,
                  own: true,
                  sender: "You",
                  avatar: "YO",
                  meta: payload.meta || {},
                  timestamp: new Date(payload.createdAt).toLocaleTimeString(
                    [],
                    {
                      hour: "2-digit",
                      minute: "2-digit",
                    }
                  ),
                  _id: payload._id,
                })
              : msg
          );
        }

        const isOwnMessage = payload.sender?._id === currentUser._id;

        const msg = createMessage({
          text: payload.message,
          type: payload.type,
          own: isOwnMessage,
          sender: payload.sender?.name || "Unknown User",
          avatar: (
            payload.sender?.avatar ||
            String(payload.sender?.name || "U").slice(0, 2)
          ).toUpperCase(),
          meta: payload.meta || {},
          timestamp: new Date(payload.createdAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          _id: payload._id,
        });

        return [...prev, msg];
      });
    };

    initializeTeamChat();

    return () => {
      if (socketRef.current) {
        socketRef.current.off("chat:joined");
        socketRef.current.off("chat:message");
        socketRef.current.off("chat:typing");
        socketRef.current.off("chat:error");
        socketRef.current.off("chat:deleted");
      }
    };
  }, [teamId]);

  // Clean up typing indicators after 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      setTypingUsers((prev) => {
        const updated = { ...prev };
        Object.keys(updated).forEach((userId) => {
          if (updated[userId] && now - updated[userId] > 3000) {
            updated[userId] = null;
          }
        });
        return updated;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const fetchMessageHistory = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${API}/chat/rooms/${teamRoomSlug}/history`,
        {
          headers: { Authorization: `Bearer ${token}` },
          params: { limit: 50 },
        }
      );

      if (response.data) {
        const data = response.data;
        const messageArray = data.messages || [];

        const formattedMessages = messageArray.map((msg) => {
          const isOwnMessage = msg.sender?._id === currentUser._id;

          return createMessage({
            text: msg.message,
            type: msg.type,
            own: isOwnMessage,
            sender: msg.sender?.name || "Unknown User",
            avatar: (
              msg.sender?.avatar || String(msg.sender?.name || "U").slice(0, 2)
            ).toUpperCase(),
            meta: msg.meta || {},
            timestamp: new Date(msg.createdAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
            _id: msg._id,
          });
        });

        setMessages(formattedMessages);
      }
    } catch (error) {
      console.error("Failed to fetch message history:", error);
      // Start with empty messages if history can't be loaded
      setMessages([]);
    }
  };

  const handleSendMessage = ({ type = "text", text = "", meta = {} }) => {
    if (!teamId || !socketRef.current) return;

    const tempId =
      Date.now().toString(36) + Math.random().toString(36).slice(2, 8);

    // Create optimistic message
    const msg = createMessage({
      text,
      type,
      own: true,
      sender: "You",
      avatar: "YO",
      meta,
      _id: tempId,
    });

    // Update local state immediately (optimistic update)
    setMessages((prev) => [...prev, msg]);

    try {
      socketRef.current.emit("chat:send", {
        roomId: teamRoomSlug, // Use the team room slug as roomId
        type,
        message: text,
        meta,
        tempId,
      });
    } catch (error) {
      console.error("Failed to send message:", error);
      // Remove optimistic message on error
      setMessages((prev) => prev.filter((m) => m.id !== tempId));
      setError("Failed to send message");
    }
  };

  const editMessage = (id) => {
    const idx = messages.findIndex((m) => m.id === id);
    if (idx === -1) return;

    const newText = window.prompt("Edit message", messages[idx].message);
    if (newText == null) return;

    const next = [...messages];
    next[idx] = {
      ...next[idx],
      message: newText,
      edited: true,
      timestamp: nowTime(),
    };

    setMessages(next);
  };

  const deleteMessage = (id) => {
    if (!confirm("Delete message?")) return;

    // Optimistic delete
    setMessages((prev) => prev.filter((m) => m.id !== id));

    // Emit socket event
    if (socketRef.current) {
      socketRef.current.emit("chat:delete", {
        messageId: id,
        roomId: teamRoomSlug,
      });
    }
  };

  const togglePin = (id) => {
    setMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, pinned: !m.pinned } : m))
    );
  };

  const reactMessage = (id, emoji) => {
    setMessages((prev) =>
      prev.map((m) => {
        if (m.id !== id) return m;
        const reactions = { ...m.reactions };
        const users = reactions[emoji] || [];
        if (users.includes("you"))
          reactions[emoji] = users.filter((u) => u !== "you");
        else reactions[emoji] = [...users, "you"];
        return { ...m, reactions };
      })
    );
  };

  // Filtering + search
  const visibleMessages = useMemo(() => {
    return messages.filter((m) => {
      if (filter === "code" && m.type !== "code") return false;
      if (filter === "files" && m.type !== "file") return false;
      if (filter === "pinned" && !m.pinned) return false;
      if (
        q &&
        !(m.message || "").toLowerCase().includes(q.toLowerCase()) &&
        !(m.meta?.fileName || "").toLowerCase().includes(q.toLowerCase())
      )
        return false;
      return true;
    });
  }, [messages, filter, q]);

  const openCodeModal = (code) => {
    setCodeModalContent(code);
    setShowCodeModal(true);
  };

  // Get active typing users
  const activeTypingUsers = useMemo(() => {
    return Object.keys(typingUsers).filter((userId) => typingUsers[userId]);
  }, [typingUsers]);

  if (isLoading) {
    return (
      <div className="h-screen bg-gradient-to-br from-indigo-50 to-white p-4 flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg font-semibold">Loading Team Chat...</div>
          <div className="text-gray-500">Setting up your project workspace</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen bg-gradient-to-br from-indigo-50 to-white p-4 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="text-lg font-semibold text-rose-600 mb-2">
            Error Loading Chat
          </div>
          <div className="text-gray-500 mb-4">{error}</div>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!team) {
    return (
      <div className="h-screen bg-gradient-to-br from-indigo-50 to-white p-4 flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg font-semibold text-rose-600">
            Team Not Found
          </div>
          <div className="text-gray-500">
            The requested team could not be loaded
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-h-screen">
      <div className="max-w-[1400px] mx-auto h-full grid grid-cols-12 gap-4">
        {/* Team Members Sidebar */}
        <aside className="col-span-3">
          <TeamMembersSidebar
            team={team}
            members={members}
            currentUser={currentUser}
            navigate={navigate}
          />
        </aside>

        {/* Main Chat Area */}
        <main className="col-span-9 bg-white rounded-2xl shadow flex flex-col overflow-hidden">
          {/* Header */}
          <div className="p-4 border-b flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar text={team.title} />
              <div>
                <div className="font-semibold">{team.title}</div>
                <div className="text-xs text-gray-500">
                  Team Chat • {members.length} members
                  {activeTypingUsers.length > 0 && " • Typing..."}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <IconBtn
                title="Pinned filter"
                onClick={() =>
                  setFilter((f) => (f === "pinned" ? "all" : "pinned"))
                }
              >
                📌
              </IconBtn>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {visibleMessages.length === 0 ? (
              <div className="text-center text-gray-400 py-12">
                {messages.length === 0
                  ? "No messages yet. Start the conversation with your team!"
                  : "No messages match your current filter"}
              </div>
            ) : (
              visibleMessages.map((m) => (
                <MessageItem
                  key={m.id}
                  m={m}
                  onTogglePin={togglePin}
                  onReact={reactMessage}
                  onEdit={editMessage}
                  onDelete={deleteMessage}
                  onExpandCode={openCodeModal}
                />
              ))
            )}
          </div>

          {/* Composer */}
          <Composer onSendMessage={handleSendMessage} />
        </main>
      </div>

      {/* Code Modal */}
      {showCodeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setShowCodeModal(false)}
          />
          <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-lg p-4 z-10">
            <div className="flex justify-between items-center mb-3">
              <div className="font-semibold">Expanded Code</div>
              <button
                onClick={() => setShowCodeModal(false)}
                className="px-2 py-1 rounded"
              >
                Close
              </button>
            </div>
            <div>
              <CodeBlock
                code={codeModalContent}
                language="javascript"
                compact={false}
                onExpand={() => {}}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
