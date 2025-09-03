import React, { useEffect, useMemo, useRef, useState } from "react";
import { getSocket } from "../../utils/socket";
import axios from "axios";

/* -------------------------
   Helpers & Utilities
   ------------------------- */
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
  avatar = "MB",
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
   UI Primitives
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

const Pill = ({ children, className }) => (
  <span
    className={classNames(
      "text-xs px-2 py-0.5 rounded-full bg-indigo-600 text-white",
      className
    )}
  >
    {children}
  </span>
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
   Room Creation Modal
   ------------------------- */
function CreateRoomModal({ isOpen, onClose, onCreateRoom }) {
  const [roomName, setRoomName] = useState("");
  const [roomDescription, setRoomDescription] = useState("");
  const [roomSlug, setRoomSlug] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!roomName.trim() || !roomSlug.trim()) return;

    setIsLoading(true);
    await onCreateRoom({
      name: roomName.trim(),
      description: roomDescription.trim(),
      slug: roomSlug.trim(),
    });
    setIsLoading(false);
    setRoomName("");
    setRoomDescription("");
    setRoomSlug("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="bg-white rounded-lg w-full max-w-md p-6">
        <h2 className="text-xl font-bold mb-4">Create New Room</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Room Name</label>
            <input
              type="text"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
              placeholder="Enter room name"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Room Slug</label>
            <input
              type="text"
              value={roomSlug}
              onChange={(e) => setRoomSlug(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
              placeholder="Enter unique slug"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">
              Description (Optional)
            </label>
            <textarea
              value={roomDescription}
              onChange={(e) => setRoomDescription(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
              placeholder="Enter room description"
              rows={3}
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading || !roomName.trim() || !roomSlug.trim()}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md disabled:opacity-50"
            >
              {isLoading ? "Creating..." : "Create Room"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* -------------------------
   Join Room Modal
   ------------------------- */
function JoinRoomModal({ isOpen, onClose, onJoinRoom, availableRooms }) {
  const [selectedRoom, setSelectedRoom] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedRoom) return;

    onJoinRoom(selectedRoom);
    setSelectedRoom("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="bg-white rounded-lg w-full max-w-md p-6">
        <h2 className="text-xl font-bold mb-4">Join a Room</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">
              Select Room
            </label>
            <select
              value={selectedRoom}
              onChange={(e) => setSelectedRoom(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
              required
            >
              <option value="">Choose a room to join</option>
              {availableRooms.map((room) => (
                <option key={room._id} value={room.slug}>
                  {room.name} ({room.slug}) - {room.members?.length || 0}{" "}
                  members
                </option>
              ))}
            </select>
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!selectedRoom}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md disabled:opacity-50"
            >
              Join Room
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* -------------------------
   Main App
   ------------------------- */
export default function DevChat() {
  const [modeView, setModeView] = useState("group");
  const [chats, setChats] = useState({ private: [], group: [] });
  const [messages, setMessages] = useState({});
  const [activeChatId, setActiveChatId] = useState(null);
  const [filter, setFilter] = useState("all");
  const [q, setQ] = useState("");
  const [showCodeModal, setShowCodeModal] = useState(false);
  const [codeModalContent, setCodeModalContent] = useState("");
  const [roomJoined, setRoomJoined] = useState(null);
  const [showCreateRoom, setShowCreateRoom] = useState(false);
  const [showJoinRoom, setShowJoinRoom] = useState(false);
  const [availableRooms, setAvailableRooms] = useState([]);
  const [users, setUsers] = useState([]);
  const [typingUsers, setTypingUsers] = useState({});
  const socketRef = useRef(null);

  const activeChat =
    (chats[modeView] || []).find((c) => c.id === activeChatId) ||
    chats[modeView][0];

  // Initialize socket connection
  useEffect(() => {
    const token = localStorage.getItem("token");
    const socket = getSocket(token);
    socketRef.current = socket;

    // Set up event listeners
    socket.on("chat:joined", (data) => {
      setRoomJoined(data.roomId);
      setChats((prev) => ({
        ...prev,
        group: [
          ...prev.group,
          {
            id: data.roomId,
            name: data.slug,
            avatar: data.slug.slice(0, 2).toUpperCase(),
            slug: data.slug,
          },
        ],
      }));
      setActiveChatId(data.roomId);

      // Fetch message history
      fetchMessageHistory(data.slug);
    });

    // In the socket message handler, replace this section:
    socket.on("chat:message", (payload) => {
      setMessages((prev) => {
        const roomKey = payload.room;
        const existingMessages = prev[roomKey] || [];

        // If this is a confirmation of our optimistic message
        if (payload.tempId) {
          const updatedMessages = existingMessages.map((msg) =>
            msg._id === payload._id
              ? createMessage({
                  text: payload.message,
                  type: payload.type,
                  own: true,
                  sender: "You",
                  avatar: "MB",
                  meta: payload.meta || {},
                  timestamp: new Date(payload.createdAt).toLocaleTimeString(
                    [],
                    {
                      hour: "2-digit",
                      minute: "2-digit",
                    }
                  ),
                  _id: payload._id, // replace with real ID
                })
              : msg
          );
          return { ...prev, [roomKey]: updatedMessages };
        }

        const msg = createMessage({
          text: payload.message,
          type: payload.type,
          own: payload.sender === getCurrentUserId(),
          sender:
            payload.sender === getCurrentUserId()
              ? "You"
              : `User ${payload.sender}`,
          avatar:
            payload.sender === getCurrentUserId()
              ? "MB"
              : (
                  payload.senderAvatar || String(payload.sender).slice(0, 2)
                ).toUpperCase(),
          meta: payload.meta || {},
          timestamp: new Date(payload.createdAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          _id: payload._id,
        });

        return { ...prev, [roomKey]: [...existingMessages, msg] };
      });
    });

    socket.on("chat:typing", (data) => {
      setTypingUsers((prev) => ({
        ...prev,
        [data.userId]: data.isTyping ? Date.now() : null,
      }));
    });

    socket.on("chat:error", (error) => {
      console.error("Socket error:", error);
      alert(error.message || "An error occurred");
    });

    // Fetch available rooms
    fetchAvailableRooms();

    return () => {
      if (socketRef.current) {
        socketRef.current.off("chat:joined");
        socketRef.current.off("chat:message");
        socketRef.current.off("chat:typing");
        socketRef.current.off("chat:error");
      }
    };
  }, []);

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

  const getCurrentUserId = () => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    return user._id || null;
  };

  const fetchAvailableRooms = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "http://localhost:8000/api/chat/available-rooms",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response?.data?.success) {
        setAvailableRooms(response.data.rooms);
      }
    } catch (error) {
      console.error("Failed to fetch available rooms:", error);
    }
  };

  const fetchMessageHistory = async (slug) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `http://localhost:8000/api/chat/rooms/${slug}/history?limit=30`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data) {
        const data = response.data;

        const formattedMessages = (data.messages || []).map((msg) =>
          createMessage({
            text: msg.message,
            type: msg.type,
            own: msg.sender._id === getCurrentUserId(),
            sender: msg.sender.name || `User ${msg.sender._id}`,
            avatar: (
              msg.sender.avatar || String(msg.sender._id).slice(0, 2)
            ).toUpperCase(),
            meta: msg.meta || {},
            timestamp: new Date(msg.createdAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
            _id: msg._id,
          })
        );

        setMessages((prev) => ({ ...prev, [slug]: formattedMessages }));
      }
    } catch (error) {
      console.error("Failed to fetch message history:", error);
    }
  };

  const handleCreateRoom = async (roomData) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:8000/api/chat/rooms",
        roomData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response?.data);
      if (response.data) {
        // Join the room after creation
        handleJoinRoom(response.data.room.slug);
        fetchAvailableRooms(); // Refresh room list
      }
    } catch (error) {
      console.error("Failed to create room:", error);
      alert(error.response?.data?.message || "Failed to create room");
    }
  };

  const handleJoinRoom = async (slug) => {
    try {
      // First join via HTTP API to become a member
      const token = localStorage.getItem("token");
      await axios.post(
        `http://localhost:8000/api/chat/rooms/${slug}/join`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Then join via socket
      socketRef.current.emit("chat:join", {
        slug,
        name: slug,
        description: `Room for ${slug}`,
      });

      // Refresh available rooms to update member counts
      fetchAvailableRooms();
    } catch (error) {
      console.error("Failed to join room:", error);
      alert(error.response?.data?.message || "Failed to join room");
    }
  };

  const handleLeaveRoom = () => {
    if (roomJoined) {
      try {
        // Remove from local state
        setChats((prev) => ({
          ...prev,
          group: prev.group.filter((c) => c.id !== roomJoined),
        }));
        setRoomJoined(null);
        setActiveChatId(null);

        // Refresh available rooms
        fetchAvailableRooms();
      } catch (error) {
        console.error("Failed to leave room:", error);
      }
    }
  };

  const handleSendMessage = ({ type = "text", text = "", meta = {} }) => {
    if (!roomJoined) return;
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
    setMessages((prev) => {
      const copy = { ...prev };
      const arr = copy[roomJoined] ? [...copy[roomJoined], msg] : [msg];
      copy[roomJoined] = arr;
      return copy;
    });

    try {
      socketRef.current.emit("chat:send", {
        roomId: roomJoined,
        type,
        message: text,
        meta,
        tempId,
      });
    } catch (error) {
      console.error("Failed to send message:", error);
      setMessages((prev) => ({
        ...prev,
        [roomJoined]: (prev[roomJoined] || []).filter((m) => m.id !== tempId),
      }));
    }
  };

  const editMessage = (id) => {
    const cur = messages[roomJoined] || [];
    const idx = cur.findIndex((m) => m.id === id);
    if (idx === -1) return;

    const newText = window.prompt("Edit message", cur[idx].message);
    if (newText == null) return;

    const next = [...cur];
    next[idx] = {
      ...next[idx],
      message: newText,
      edited: true,
      timestamp: nowTime(),
    };

    setMessages((prev) => ({ ...prev, [roomJoined]: next }));
  };

  const deleteMessage = (id) => {
    if (!confirm("Delete message?")) return;

    setMessages((prev) => ({
      ...prev,
      [roomJoined]: (prev[roomJoined] || []).filter((m) => m.id !== id),
    }));

    // Emit socket event
    if (roomJoined) {
      socketRef.current.emit("chat:delete", {
        messageId: id,
        roomId: roomJoined,
      });
    }
  };

  const togglePin = (id) => {
    setMessages((prev) => {
      const arr = (prev[roomJoined] || []).map((m) =>
        m.id === id ? { ...m, pinned: !m.pinned } : m
      );
      return { ...prev, [roomJoined]: arr };
    });
  };

  const reactMessage = (id, emoji) => {
    setMessages((prev) => {
      const arr = (prev[roomJoined] || []).map((m) => {
        if (m.id !== id) return m;
        const reactions = { ...m.reactions };
        const users = reactions[emoji] || [];
        if (users.includes("you"))
          reactions[emoji] = users.filter((u) => u !== "you");
        else reactions[emoji] = [...users, "you"];
        return { ...m, reactions };
      });
      return { ...prev, [roomJoined]: arr };
    });
  };

  // Filtering + search
  const visibleMessages = useMemo(() => {
    const list = messages[roomJoined] || [];
    return list.filter((m) => {
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
  }, [messages, roomJoined, filter, q]);

  const openCodeModal = (code) => {
    setCodeModalContent(code);
    setShowCodeModal(true);
  };

  // Get active typing users for current room
  const activeTypingUsers = useMemo(() => {
    return Object.keys(typingUsers).filter((userId) => typingUsers[userId]);
  }, [typingUsers]);

  return (
    <div className="h-screen bg-gradient-to-br from-indigo-50 to-white p-4">
      <div className="max-w-[1400px] mx-auto h-full grid grid-cols-12 gap-4">
        {/* Sidebar */}
        <aside className="col-span-3 bg-white rounded-2xl shadow p-3 flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold">DevChat</h3>
            <div className="text-xs text-gray-500">Dev-first</div>
          </div>

          <div className="flex gap-2 mb-3">
            <button
              onClick={() => setModeView("private")}
              className={classNames(
                "px-3 py-1 rounded",
                modeView === "private"
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-100"
              )}
            >
              Private
            </button>
            <button
              onClick={() => setModeView("group")}
              className={classNames(
                "px-3 py-1 rounded",
                modeView === "group"
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-100"
              )}
            >
              Groups
            </button>
          </div>

          <div className="mb-3">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search messages & files..."
              className="w-full rounded-xl border px-3 py-2 text-sm"
            />
          </div>

          <div className="flex gap-2 mb-3 text-xs">
            {MESSAGE_FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={classNames(
                  "px-2 py-1 rounded text-sm",
                  filter === f ? "bg-indigo-600 text-white" : "bg-gray-100"
                )}
              >
                {f}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto">
            {modeView === "group" ? (
              <>
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-medium">Rooms</h4>
                  <div className="flex gap-1">
                    <button
                      onClick={() => setShowJoinRoom(true)}
                      className="text-xs p-1 bg-indigo-100 text-indigo-700 rounded"
                    >
                      Join
                    </button>
                    <button
                      onClick={() => setShowCreateRoom(true)}
                      className="text-xs p-1 bg-indigo-600 text-white rounded"
                    >
                      New
                    </button>
                  </div>
                </div>
                {chats.group.map((c) => (
                  <div
                    key={c.id}
                    onClick={() => setActiveChatId(c.id)}
                    className={classNames(
                      "p-2 rounded cursor-pointer hover:bg-gray-50 flex items-center gap-3 mb-1",
                      activeChatId === c.id ? "bg-indigo-50" : ""
                    )}
                  >
                    <Avatar text={c.avatar} size="sm" />
                    <div className="flex-1">
                      <div className="font-medium">{c.name}</div>
                      <div className="text-xs text-gray-500">
                        {c.lastMessage || "No messages yet"}
                      </div>
                    </div>
                  </div>
                ))}
              </>
            ) : (
              <>
                <h4 className="font-medium mb-2">Direct Messages</h4>
                <div className="text-gray-500 text-sm p-2">
                  Will be added soon
                </div>
              </>
            )}
          </div>

          <div className="pt-3 border-t mt-3">
            <div className="text-xs text-gray-500">
              Tip: drag & drop files anywhere to attach
            </div>
          </div>
        </aside>

        {/* Main */}
        <main className="col-span-9 bg-white rounded-2xl shadow flex flex-col overflow-hidden">
          {/* Header */}
          <div className="p-4 border-b flex items-center justify-between">
            <div className="flex items-center gap-3">
              {roomJoined && <Avatar text={activeChat?.avatar || "U"} />}
              <div>
                <div className="font-semibold">
                  {activeChat?.name || "No chat selected"}
                </div>
                <div className="text-xs text-gray-500">
                  {roomJoined
                    ? "Group chat"
                    : "Select a chat to start messaging"}
                  {activeTypingUsers.length > 0 && " • Typing..."}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {roomJoined && (
                <button
                  onClick={handleLeaveRoom}
                  className="px-3 py-1 text-sm bg-rose-100 text-rose-700 rounded-md"
                >
                  Leave Room
                </button>
              )}
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
                {roomJoined || activeChatId
                  ? "No messages yet. Start a conversation!"
                  : "Select a chat to start messaging"}
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
          {activeChatId && <Composer onSendMessage={handleSendMessage} />}
        </main>
      </div>

      {/* Modals */}
      <CreateRoomModal
        isOpen={showCreateRoom}
        onClose={() => setShowCreateRoom(false)}
        onCreateRoom={handleCreateRoom}
      />

      <JoinRoomModal
        isOpen={showJoinRoom}
        onClose={() => setShowJoinRoom(false)}
        onJoinRoom={handleJoinRoom}
        availableRooms={availableRooms}
      />

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
