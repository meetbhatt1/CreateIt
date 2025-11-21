import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/UI_Components";

const Settings = () => {
  const [activeSection, setActiveSection] = useState("profile");
  const navigate = useNavigate();

  // Mock user data
  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
  const mockUser = {
    name: currentUser.fullName || "User",
    level: 12,
    xp: 2847,
  };

  // Profile state
  const [profileData, setProfileData] = useState({
    name: currentUser.fullName || "User",
    email: currentUser.email || "user@example.com",
    bio: "Full-stack developer passionate about open source and collaborative coding.",
    location: "Ahmedabad, Gujarat",
    website: "https://github.com/meetbhatt1",
    skills: ["React", "Node.js", "Python", "TailwindCSS"],
  });

  // Notifications state
  const [notifications, setNotifications] = useState({
    emailUpdates: true,
    projectInvites: true,
    taskAssignments: true,
    weeklyDigest: false,
    marketingEmails: false,
  });

  // Privacy state
  const [privacy, setPrivacy] = useState({
    profileVisible: true,
    showEmail: false,
    showLocation: true,
    allowDirectMessages: true,
  });

  // Appearance state
  const [appearance, setAppearance] = useState({
    theme: "current",
    accentColor: "purple",
    reducedMotion: false,
    cardRotations: true,
    hoverEffects: true,
  });

  // Settings sections
  const sections = [
    { id: "profile", label: "Profile", icon: "👤" },
    { id: "notifications", label: "Notifications", icon: "🔔" },
    { id: "privacy", label: "Privacy & Security", icon: "🛡️" },
    { id: "data", label: "Data & Storage", icon: "💾" },
    { id: "appearance", label: "Appearance", icon: "🎨" },
  ];

  // Simple toggle switch component - updated to match theme
  const ToggleSwitch = ({ checked, onChange, id }) => (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
        checked ? "bg-indigo-600" : "bg-gray-300"
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-lg ${
          checked ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  );

  // Badge component for skills - updated to match theme
  const Badge = ({ children, onRemove }) => (
    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm bg-indigo-100 text-indigo-800 border border-indigo-200">
      {children}
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="text-indigo-500 hover:text-indigo-700 focus:outline-none text-lg"
        >
          ×
        </button>
      )}
    </span>
  );

  return (
    <div className="min-h-screen font-[fredoka]">
      {/* Main Content */}
      <div>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="flex">
              <Button
                variant="primary"
                onClick={() => navigate(`/`)}
                className="h-12 font-bold"
              >
                ← Back
              </Button>
              <h1 className="text-6xl w-[90%] font-bold text-[#667eea] mb-4 [text-shadow:3px_3px_0px_rgba(0,0,0,0.2)]">
                Settings ⚙️
              </h1>
            </div>
            <p className="text-2xl text-[#764ba2] [text-shadow:2px_2px_0px_rgba(0,0,0,0.1)]">
              Customize your CreateIt experience
            </p>
          </div>

          {/* Settings Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Navigation Sidebar */}
            <div className="bg-white/95 backdrop-blur-sm rounded-[25px] p-6 shadow-[0_8px_25px_rgba(102,126,234,0.3)] border-4 border-indigo-200 transition-all duration-300 lg:col-span-1">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 [text-shadow:1px_1px_0px_rgba(0,0,0,0.1)]">
                Settings
              </h2>
              <div className="space-y-3">
                {sections.map(({ id, label, icon }) => (
                  <button
                    key={id}
                    onClick={() => setActiveSection(id)}
                    className={`w-full text-left px-4 py-4 rounded-2xl transition-all duration-300 border-2 font-semibold ${
                      activeSection === id
                        ? "bg-indigo-100 text-indigo-700 border-indigo-300 scale-105 shadow-lg"
                        : "text-gray-600 border-transparent hover:bg-gray-100 hover:border-gray-200 hover:scale-102"
                    }`}
                  >
                    <span className="text-xl mr-3">{icon}</span>
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Settings Content */}
            <div className="lg:col-span-3 space-y-8">
              {/* Profile Section */}
              {activeSection === "profile" && (
                <div className="bg-white/95 backdrop-blur-sm rounded-[25px] p-8 shadow-[0_8px_25px_rgba(102,126,234,0.3)] border-4 border-indigo-200 transition-all duration-300">
                  <div className="flex items-center gap-3 mb-8">
                    <span className="text-3xl">👤</span>
                    <h2 className="text-3xl font-bold text-gray-800 [text-shadow:1px_1px_0px_rgba(0,0,0,0.1)]">
                      Profile Settings
                    </h2>
                  </div>

                  <div className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label
                          htmlFor="name"
                          className="block text-sm font-medium text-gray-700 mb-3"
                        >
                          Full Name
                        </label>
                        <input
                          id="name"
                          type="text"
                          value={profileData.name}
                          onChange={(e) =>
                            setProfileData({
                              ...profileData,
                              name: e.target.value,
                            })
                          }
                          className="w-full px-4 py-3 border-2 border-gray-300 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="email"
                          className="block text-sm font-medium text-gray-700 mb-3"
                        >
                          Email Address
                        </label>
                        <input
                          id="email"
                          type="email"
                          value={profileData.email}
                          onChange={(e) =>
                            setProfileData({
                              ...profileData,
                              email: e.target.value,
                            })
                          }
                          className="w-full px-4 py-3 border-2 border-gray-300 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="bio"
                        className="block text-sm font-medium text-gray-700 mb-3"
                      >
                        Bio
                      </label>
                      <textarea
                        id="bio"
                        value={profileData.bio}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            bio: e.target.value,
                          })
                        }
                        rows={4}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none transition-all"
                        placeholder="Tell us about yourself..."
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label
                          htmlFor="location"
                          className="block text-sm font-medium text-gray-700 mb-3"
                        >
                          Location
                        </label>
                        <input
                          id="location"
                          type="text"
                          value={profileData.location}
                          onChange={(e) =>
                            setProfileData({
                              ...profileData,
                              location: e.target.value,
                            })
                          }
                          className="w-full px-4 py-3 border-2 border-gray-300 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="website"
                          className="block text-sm font-medium text-gray-700 mb-3"
                        >
                          Website
                        </label>
                        <input
                          id="website"
                          type="url"
                          value={profileData.website}
                          onChange={(e) =>
                            setProfileData({
                              ...profileData,
                              website: e.target.value,
                            })
                          }
                          className="w-full px-4 py-3 border-2 border-gray-300 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Skills
                      </label>
                      <div className="flex flex-wrap gap-3 mb-4">
                        {profileData.skills.map((skill, index) => (
                          <Badge
                            key={skill}
                            onRemove={() => {
                              const newSkills = profileData.skills.filter(
                                (_, i) => i !== index
                              );
                              setProfileData({
                                ...profileData,
                                skills: newSkills,
                              });
                            }}
                          >
                            {skill}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex gap-3">
                        <input
                          type="text"
                          placeholder="Add a skill..."
                          className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                          onKeyPress={(e) => {
                            if (e.key === "Enter") {
                              const input = e.target;
                              const skill = input.value.trim();
                              if (
                                skill &&
                                !profileData.skills.includes(skill)
                              ) {
                                setProfileData({
                                  ...profileData,
                                  skills: [...profileData.skills, skill],
                                });
                                input.value = "";
                              }
                            }
                          }}
                        />
                        <button
                          type="button"
                          className="px-6 py-3 border-2 border-indigo-300 bg-indigo-100 text-indigo-700 rounded-2xl hover:bg-indigo-200 transition-all font-semibold"
                        >
                          Add
                        </button>
                      </div>
                    </div>

                    <div className="flex gap-4 pt-6">
                      <button className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl font-bold hover:scale-105 transition-all shadow-lg">
                        💾 Save Changes
                      </button>
                      <button className="px-8 py-4 border-2 border-gray-300 rounded-2xl hover:bg-gray-50 transition-all font-semibold">
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Notifications Section */}
              {activeSection === "notifications" && (
                <div className="bg-white/95 backdrop-blur-sm rounded-[25px] p-8 shadow-[0_8px_25px_rgba(102,126,234,0.3)] border-4 border-indigo-200  hover: transition-all duration-300">
                  <div className="flex items-center gap-3 mb-8">
                    <span className="text-3xl">🔔</span>
                    <h2 className="text-3xl font-bold text-gray-800 [text-shadow:1px_1px_0px_rgba(0,0,0,0.1)]">
                      Notification Preferences
                    </h2>
                  </div>

                  <div className="space-y-6">
                    {Object.entries(notifications).map(([key, value]) => (
                      <div
                        key={key}
                        className="flex items-center justify-between p-6 border-2 border-gray-200 rounded-2xl hover:border-indigo-200 transition-all"
                      >
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-800 text-lg capitalize">
                            {key.replace(/([A-Z])/g, " $1").toLowerCase()}
                          </h3>
                          <p className="text-sm text-gray-600 mt-2">
                            {key === "emailUpdates" &&
                              "Receive email notifications for important updates"}
                            {key === "projectInvites" &&
                              "Get notified when someone invites you to a project"}
                            {key === "taskAssignments" &&
                              "Receive notifications when tasks are assigned to you"}
                            {key === "weeklyDigest" &&
                              "Weekly summary of your activity and achievements"}
                            {key === "marketingEmails" &&
                              "Promotional emails about new features and events"}
                          </p>
                        </div>
                        <ToggleSwitch
                          checked={value}
                          onChange={(checked) =>
                            setNotifications({
                              ...notifications,
                              [key]: checked,
                            })
                          }
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Privacy Section */}
              {activeSection === "privacy" && (
                <div className="bg-white/95 backdrop-blur-sm rounded-[25px] p-8 shadow-[0_8px_25px_rgba(102,126,234,0.3)] border-4 border-indigo-200 - hover: transition-all duration-300">
                  <div className="flex items-center gap-3 mb-8">
                    <span className="text-3xl">🛡️</span>
                    <h2 className="text-3xl font-bold text-gray-800 [text-shadow:1px_1px_0px_rgba(0,0,0,0.1)]">
                      Privacy & Security
                    </h2>
                  </div>

                  <div className="space-y-8">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800 mb-6">
                        Profile Visibility
                      </h3>
                      <div className="space-y-6">
                        {Object.entries(privacy).map(([key, value]) => (
                          <div
                            key={key}
                            className="flex items-center justify-between p-6 border-2 border-gray-200 rounded-2xl hover:border-indigo-200 transition-all"
                          >
                            <div className="flex-1">
                              <h4 className="font-semibold text-gray-800 text-lg capitalize">
                                {key.replace(/([A-Z])/g, " $1").toLowerCase()}
                              </h4>
                              <p className="text-sm text-gray-600 mt-2">
                                {key === "profileVisible" &&
                                  "Make your profile visible to other users"}
                                {key === "showEmail" &&
                                  "Display your email address on your profile"}
                                {key === "showLocation" &&
                                  "Show your location on your profile"}
                                {key === "allowDirectMessages" &&
                                  "Allow other users to send you direct messages"}
                              </p>
                            </div>
                            <ToggleSwitch
                              checked={value}
                              onChange={(checked) =>
                                setPrivacy({ ...privacy, [key]: checked })
                              }
                            />
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="border-t-2 border-gray-200 pt-8">
                      <h3 className="text-xl font-semibold text-gray-800 mb-6">
                        Security Actions
                      </h3>
                      <div className="space-y-4">
                        <button className="w-full text-left px-6 py-4 border-2 border-gray-200 rounded-2xl hover:border-indigo-200 hover:bg-indigo-50 transition-all font-semibold">
                          🔒 Change Password
                        </button>
                        <button className="w-full text-left px-6 py-4 border-2 border-gray-200 rounded-2xl hover:border-indigo-200 hover:bg-indigo-50 transition-all font-semibold">
                          🔐 Two-Factor Authentication
                        </button>
                        <button className="w-full text-left px-6 py-4 border-2 border-gray-200 rounded-2xl hover:border-indigo-200 hover:bg-indigo-50 transition-all font-semibold">
                          🔗 Connected Apps
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Data & Storage Section */}
              {activeSection === "data" && (
                <div className="bg-white/95 backdrop-blur-sm rounded-[25px] p-8 shadow-[0_8px_25px_rgba(102,126,234,0.3)] border-4 border-indigo-200  hover: transition-all duration-300">
                  <div className="flex items-center gap-3 mb-8">
                    <span className="text-3xl">💾</span>
                    <h2 className="text-3xl font-bold text-gray-800 [text-shadow:1px_1px_0px_rgba(0,0,0,0.1)]">
                      Data & Storage
                    </h2>
                  </div>

                  <div className="space-y-8">
                    <div className="p-6 bg-indigo-50 rounded-2xl border-2 border-indigo-200">
                      <h3 className="font-semibold text-gray-800 mb-4 text-lg">
                        Storage Usage
                      </h3>
                      <div className="space-y-3">
                        <div className="flex justify-between text-sm font-medium">
                          <span>Projects & Files</span>
                          <span>1.2 GB</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div
                            className="bg-gradient-to-r from-indigo-500 to-purple-500 h-3 rounded-full"
                            style={{ width: "24%" }}
                          />
                        </div>
                        <p className="text-xs text-gray-600">
                          1.2 GB of 5 GB used
                        </p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-xl font-semibold text-gray-800">
                        Data Management
                      </h3>
                      <button className="w-full text-left px-6 py-4 border-2 border-gray-200 rounded-2xl hover:border-indigo-200 hover:bg-indigo-50 transition-all font-semibold">
                        📥 Export My Data
                      </button>
                      <button className="w-full text-left px-6 py-4 border-2 border-gray-200 rounded-2xl hover:border-indigo-200 hover:bg-indigo-50 transition-all font-semibold">
                        📋 Download Activity Log
                      </button>
                      <button className="w-full text-left px-6 py-4 border-2 border-red-200 text-red-600 rounded-2xl hover:bg-red-50 transition-all font-semibold">
                        🗑️ Delete Account
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Appearance Section */}
              {activeSection === "appearance" && (
                <div className="bg-white/95 backdrop-blur-sm rounded-[25px] p-8 shadow-[0_8px_25px_rgba(102,126,234,0.3)] border-4 border-indigo-200 - hover: transition-all duration-300">
                  <div className="flex items-center gap-3 mb-8">
                    <span className="text-3xl">🎨</span>
                    <h2 className="text-3xl font-bold text-gray-800 [text-shadow:1px_1px_0px_rgba(0,0,0,0.1)]">
                      Appearance
                    </h2>
                  </div>

                  <div className="space-y-8">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800 mb-6">
                        Theme
                      </h3>
                      <div className="grid grid-cols-3 gap-6">
                        {["current", "light", "dark"].map((theme) => (
                          <button
                            key={theme}
                            onClick={() =>
                              setAppearance({ ...appearance, theme })
                            }
                            className={`p-6 border-4 rounded-2xl text-center cursor-pointer transition-all hover:scale-105 ${
                              appearance.theme === theme
                                ? "border-indigo-500 bg-indigo-50 shadow-lg"
                                : "border-gray-200 hover:border-gray-300"
                            } ${
                              theme === "current"
                                ? "bg-gradient-to-br from-indigo-400 to-purple-500 text-white"
                                : theme === "light"
                                ? "bg-white text-gray-800"
                                : "bg-gray-900 text-white"
                            }`}
                          >
                            <div
                              className={`w-full h-20 rounded-xl mb-3 ${
                                theme === "current"
                                  ? "bg-white/20"
                                  : theme === "light"
                                  ? "bg-gray-100"
                                  : "bg-gray-700"
                              }`}
                            ></div>
                            <p className="font-semibold capitalize">{theme}</p>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-xl font-semibold text-gray-800 mb-6">
                        Accent Color
                      </h3>
                      <div className="flex gap-4">
                        {[
                          { color: "purple", bg: "bg-purple-500" },
                          { color: "blue", bg: "bg-blue-500" },
                          { color: "green", bg: "bg-green-500" },
                          { color: "pink", bg: "bg-pink-500" },
                          { color: "orange", bg: "bg-orange-500" },
                        ].map(({ color, bg }) => (
                          <button
                            key={color}
                            onClick={() =>
                              setAppearance({
                                ...appearance,
                                accentColor: color,
                              })
                            }
                            className={`w-14 h-14 rounded-full cursor-pointer border-4 border-white shadow-lg ${bg} hover:scale-110 transition-transform ${
                              appearance.accentColor === color
                                ? "ring-4 ring-indigo-300"
                                : ""
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-xl font-semibold text-gray-800 mb-6">
                        Animation Settings
                      </h3>
                      <div className="space-y-6">
                        {[
                          { key: "reducedMotion", label: "Reduced Motion" },
                          { key: "cardRotations", label: "Card Rotations" },
                          { key: "hoverEffects", label: "Hover Effects" },
                        ].map(({ key, label }) => (
                          <div
                            key={key}
                            className="flex items-center justify-between p-4 border-2 border-gray-200 rounded-2xl hover:border-indigo-200 transition-all"
                          >
                            <span className="font-semibold text-lg">
                              {label}
                            </span>
                            <ToggleSwitch
                              checked={appearance[key]}
                              onChange={(checked) =>
                                setAppearance({ ...appearance, [key]: checked })
                              }
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
