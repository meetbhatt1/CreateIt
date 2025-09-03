// src/components/Team/TeamDashboard.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Button } from "../ui/UI_Components";
import API from "../../utils/API";

const TeamDetailsPage = () => {
  const { teamId } = useParams();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const [team, setTeam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("Developer");
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    const fetchTeamData = async () => {
      try {
        setLoading(true);

        const teamRes = await axios.get(`${API}/team/user/${user._id}`);

        setTeam(teamRes?.data[0]);
        setIsOwner(teamRes?.data[0]?.owner?._id == user?._id);
      } catch (error) {
        console.error("Failed to fetch team data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTeamData();
  }, [teamId, user._id]);

  const handleInviteSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        `${API}/team/${teamId}/invite`,
        { email: inviteEmail, role: inviteRole },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      alert(`Invitation sent to ${inviteEmail}`);
      setInviteEmail("");
    } catch (error) {
      console.error("Failed to send invitation:", error);
      alert("Failed to send invitation");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (!team) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-700">Team not found</h2>
        <p className="text-gray-500 mt-2">
          The team you're looking for doesn't exist or you don't have access
        </p>
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => navigate("/my-team")}
        >
          Back to My Teams
        </Button>
      </div>
    );
  }

  const filledSlots = Array.isArray(team?.members)
    ? team.members.filter((m) => m.user).length
    : 0;

  const openSlots = Array.isArray(team?.members)
    ? team.members.filter((m) => !m.user).length
    : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Team Header */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">{team.title}</h1>
            <p className="text-gray-600 mt-2">{team.description}</p>
            <div className="flex items-center mt-4">
              <span
                className={`px-3 py-1 rounded-full text-sm ${
                  team.visibility
                    ? "bg-green-100 text-green-800"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                {team.visibility ? "Public" : "Private"}
              </span>
              <span className="mx-4 text-gray-400">|</span>
              <span className="text-gray-600">
                {filledSlots} member{filledSlots !== 1 ? "s" : ""}
                {openSlots > 0 &&
                  `, ${openSlots} open slot${openSlots > 1 ? "s" : ""}`}
              </span>
            </div>
          </div>

          {isOwner && (
            <Button
              variant="secondary"
              // onClick={() => navigate("/team-project")}
            >
              Edit Project
            </Button>
          )}
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200 mb-8">
        <nav className="flex space-x-8">
          {["overview", "members", "settings"].map((tab) => (
            <button
              key={tab}
              className={`py-4 px-1 text-sm font-medium border-b-2 ${
                activeTab === tab
                  ? "border-purple-500 text-purple-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-xl shadow-md p-6">
        {activeTab === "overview" && (
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-6">
              Team Overview
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div className="bg-green-50 rounded-lg p-4">
                <h3 className="font-semibold text-green-800">Team Members</h3>
                <p className="text-3xl font-bold mt-2">{filledSlots}</p>
              </div>

              <div className="bg-purple-50 rounded-lg p-4">
                <h3 className="font-semibold text-purple-800">
                  Completion Rate
                </h3>
                <p className="text-3xl font-bold mt-2">82%</p>
              </div>
            </div>

            <div className="mb-8">
              <h3 className="font-semibold text-gray-700 mb-3">
                Recent Activity
              </h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16" />
                  <div className="ml-4">
                    <p className="font-medium">
                      Alex Johnson created a new task
                    </p>
                    <p className="text-gray-500 text-sm">
                      Design homepage wireframes
                    </p>
                    <p className="text-gray-400 text-xs mt-1">2 hours ago</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16" />
                  <div className="ml-4">
                    <p className="font-medium">Sam Wilson joined the team</p>
                    <p className="text-gray-500 text-sm">
                      Frontend Developer role
                    </p>
                    <p className="text-gray-400 text-xs mt-1">Yesterday</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16" />
                  <div className="ml-4">
                    <p className="font-medium">Project Alpha updated</p>
                    <p className="text-gray-500 text-sm">
                      Progress increased to 75%
                    </p>
                    <p className="text-gray-400 text-xs mt-1">2 days ago</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "members" && (
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-6">
              Team Members
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {team.members
                .filter((member) => member.user)
                .map((member) => (
                  <div
                    key={member._id}
                    className="border rounded-lg p-4 flex items-center"
                  >
                    <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16" />
                    <div className="ml-4 flex-1">
                      <h3 className="font-bold">
                        {member?._id || "Unknown User"}
                      </h3>
                      <p className="text-gray-600">{member.role}</p>
                      <div className="mt-2 flex flex-wrap gap-1">
                        {member.languages?.map((lang, i) => (
                          <span
                            key={i}
                            className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded"
                          >
                            {lang}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="text-right">
                      <span
                        className={`px-2 py-1 text-xs rounded ${
                          member.status === "accepted"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {member.status}
                      </span>
                    </div>
                  </div>
                ))}
            </div>

            {openSlots > 0 && (
              <div className="mb-8">
                <h3 className="font-semibold text-gray-700 mb-4">
                  Open Positions
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {team.members
                    .filter((member) => !member.user)
                    .map((position, index) => (
                      <div
                        key={index}
                        className="border border-dashed border-purple-300 rounded-lg p-4 bg-purple-50"
                      >
                        <h4 className="font-bold text-purple-800">
                          {position.role}
                        </h4>
                        <p className="text-gray-600 mt-1">
                          Looking for team member
                        </p>
                        <div className="mt-3">
                          <p className="text-sm text-gray-700">
                            Required skills:
                          </p>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {position.languages?.map((lang, i) => (
                              <span
                                key={i}
                                className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded"
                              >
                                {lang}
                              </span>
                            ))}
                          </div>
                        </div>
                        {!isOwner && (
                          <Button
                            variant="outline"
                            className="mt-4 w-full"
                            onClick={() =>
                              alert("Request sent to join this position")
                            }
                          >
                            Request to Join
                          </Button>
                        )}
                      </div>
                    ))}
                </div>
              </div>
            )}

            {isOwner && (
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="font-semibold text-gray-700 mb-4">
                  Invite New Members
                </h3>
                <form onSubmit={handleInviteSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={inviteEmail}
                        onChange={(e) => setInviteEmail(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        placeholder="user@example.com"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Role
                      </label>
                      <select
                        value={inviteRole}
                        onChange={(e) => setInviteRole(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      >
                        <option>Developer</option>
                        <option>Designer</option>
                        <option>Project Manager</option>
                        <option>QA Tester</option>
                      </select>
                    </div>

                    <div className="flex items-end">
                      <Button
                        type="submit"
                        variant="primary"
                        className="w-full"
                      >
                        Send Invitation
                      </Button>
                    </div>
                  </div>
                </form>
              </div>
            )}
          </div>
        )}

        {activeTab === "settings" && (
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-6">
              Team Settings
            </h2>

            <div className="space-y-6">
              <div className="border rounded-lg p-5">
                <h3 className="font-semibold text-lg mb-4">General Settings</h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Team Name
                    </label>
                    <input
                      type="text"
                      defaultValue={team.title}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      defaultValue={team.description}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      rows="3"
                    ></textarea>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Visibility
                    </label>
                    <div className="flex items-center space-x-4">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="visibility"
                          value="public"
                          defaultChecked={team.visibility}
                          className="h-4 w-4 text-purple-600"
                        />
                        <span className="ml-2 text-gray-700">Public</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="visibility"
                          value="private"
                          defaultChecked={!team.visibility}
                          className="h-4 w-4 text-purple-600"
                        />
                        <span className="ml-2 text-gray-700">Private</span>
                      </label>
                    </div>
                  </div>

                  <div className="pt-4">
                    <Button variant="primary">Save Changes</Button>
                  </div>
                </div>
              </div>

              <div className="border rounded-lg p-5">
                <h3 className="font-semibold text-lg mb-4">Danger Zone</h3>

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-medium">Transfer Ownership</h4>
                      <p className="text-sm text-gray-600 mt-1">
                        Transfer team ownership to another member
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      className="border-red-500 text-red-500"
                    >
                      Transfer
                    </Button>
                  </div>

                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-medium">Delete Team</h4>
                      <p className="text-sm text-gray-600 mt-1">
                        Permanently delete this team and all its data
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      className="border-red-500 text-red-500"
                    >
                      Delete Team
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeamDetailsPage;
