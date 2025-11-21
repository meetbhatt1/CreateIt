// src/pages/MyTeam.jsx
import React, { useEffect, useState } from "react";
import { Button, Dropdown } from "../ui/UI_Components";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import API from "../../utils/API";
import { Card } from "../ui/Card";
import {
  ArrowLeft,
  Users,
  UserPlus,
  Check,
  X,
  LucidePlus,
  LucidePlusCircle,
} from "lucide-react";

export const MyTeam = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const [myTeams, setMyTeams] = useState([]);
  const [publicTeams, setPublicTeams] = useState([]);
  const [joinRequests, setJoinRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("myTeams"); // "myTeams", "public", "requests"

  const fetchData = async () => {
    try {
      setLoading(true);

      // Fetch user's teams
      const myTeamsRes = await axios.get(`${API}/team/user/${user._id}`);
      if (myTeamsRes.status === 200) setMyTeams(myTeamsRes.data);

      // Fetch public teams
      const publicRes = await axios.get(`${API}/team/public`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (publicRes.status === 200) setPublicTeams(publicRes.data);

      // Fetch join requests for teams I own
      const requestsRes = await axios.get(`${API}/team/owner/requests`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (requestsRes.status === 200) setJoinRequests(requestsRes.data);
    } catch (error) {
      console.log("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const requestToJoinTeam = async (teamId, role) => {
    try {
      await axios.post(
        `${API}/team/${teamId}/request-join`,
        { role },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      fetchData();
      alert("Join request sent! The team owner will review your application.");
    } catch (error) {
      console.error(
        "Join request failed:",
        error.response?.data?.message || error.message
      );
      alert(
        "Failed to send join request: " +
          (error.response?.data?.message || error.message)
      );
    }
  };

  const respondToJoinRequest = async (requestId, accepted) => {
    try {
      await axios.post(
        `${API}/team/request/${requestId}/respond`,
        { accepted },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      // Update UI
      setJoinRequests(
        joinRequests.map((req) =>
          req._id === requestId
            ? { ...req, status: accepted ? "accepted" : "rejected" }
            : req
        )
      );

      if (accepted) {
        alert("Request accepted! User has been added to the team.");
      } else {
        alert("Request rejected.");
      }

      // Refresh team data
      fetchData();
    } catch (error) {
      console.error("Error responding to request:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Calculate filled and open slots
  const getSlotInfo = (team) => {
    const filledSlots = team.members.filter((m) => m.user).length;
    const openSlots = team.members.filter((m) => !m.user).length;
    return { filledSlots, openSlots };
  };

  const TeamCard = ({ team, isMine }) => {
    const { filledSlots, openSlots } = getSlotInfo(team);
    const isMember = team.members.some(
      (m) => m.user?._id === user._id || m.user === user._id
    );
    const isOwner = team.owner?._id === user._id || team.owner === user._id;

    // State for selected role
    const [selectedRole, setSelectedRole] = useState("");

    // Get available open roles
    const openRoles = Array.from(
      new Set(
        team.members
          .filter((m) => !m.user) // Only open slots
          .map((m) => m.role) // Get role names
      )
    );

    // Prepare dropdown options
    const roleOptions = openRoles.map((role, index) => ({
      value: index.toString(),
      label: role,
    }));

    return (
      <div className="bg-gray-100 shadow-purple-300 rounded-xl shadow-2xl border-l-4 border-purple-500 hover:shadow-xl transition-all">
        <div className="p-3 border-b border-gray-200 flex justify-between items-center">
          <h3 className="font-bold text-lg text-gray-800 truncate">
            {team.title}
          </h3>
          <span
            className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
              team.visibility
                ? "bg-green-100 text-green-700"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            {team.visibility ? "Public" : "Private"}
          </span>
        </div>

        <div className="p-4">
          <p className="text-gray-600 mb-3 text-sm line-clamp-2">
            {team.description}
          </p>

          <div className="flex items-center mb-3">
            <span
              className={
                isMine
                  ? isOwner
                    ? "bg-purple-500 text-white text-xs font-bold px-2.5 py-1 rounded-full mr-2"
                    : "bg-blue-500 text-white text-xs font-bold px-2.5 py-1 rounded-full mr-2"
                  : "bg-yellow-400 text-gray-800 text-xs font-bold px-2.5 py-1 rounded-full mr-2"
              }
            >
              {isMine ? (isOwner ? "Owner" : "Member") : "Open"}
            </span>
            <span className="text-xs text-gray-500">
              {filledSlots} member{filledSlots !== 1 ? "s" : ""}
              {openSlots > 0 &&
                ` • ${openSlots} open slot${openSlots > 1 ? "s" : ""}`}
            </span>
          </div>

          {/* Show available roles */}
          {!isMine &&
            openSlots > 0 &&
            team.visibility &&
            openRoles.length > 0 && (
              <div className="mb-3">
                <Dropdown
                  label="Select a role to apply for"
                  options={roleOptions}
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  placeholder="Choose a role"
                />
              </div>
            )}

          <div className="flex flex-wrap gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => navigate(`/team/${team._id}`)}
              className="text-xs"
            >
              View Details
            </Button>

            {!isMine &&
              openSlots > 0 &&
              team.visibility &&
              openRoles.length > 0 && (
                <Button
                  size="sm"
                  variant="primary"
                  onClick={() =>
                    requestToJoinTeam(
                      team._id,
                      openRoles[parseInt(selectedRole)]
                    )
                  }
                  disabled={!selectedRole}
                  className="text-xs"
                >
                  Apply to Join
                </Button>
              )}

            {isMine && (
              <Button
                size="sm"
                variant="secondary"
                onClick={() => navigate(`/team/${team._id}/chat`)}
                className="text-xs"
              >
                Project Chat
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  };

  const JoinRequestCard = ({ request }) => {
    return (
      <div className="bg-white rounded-lg shadow p-4 mb-4 border-l-4 border-purple-500">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center mb-2">
              <div className="bg-purple-100 p-2 rounded-full mr-3">
                <UserPlus size={18} className="text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">
                  {request.user.username}
                </h3>
                <p className="text-xs text-gray-500">Wants to join your team</p>
              </div>
            </div>

            <div className="ml-10">
              <p className="text-sm text-gray-700">
                <span className="font-medium">Team:</span> {request.team.title}
              </p>
              <p className="text-sm text-gray-700">
                <span className="font-medium">Role:</span> {request.role}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Requested: {new Date(request.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          {request.status === "pending" ? (
            <div className="flex gap-2">
              <button
                onClick={() => respondToJoinRequest(request._id, true)}
                className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-full"
              >
                <Check size={18} />
              </button>
              <button
                onClick={() => respondToJoinRequest(request._id, false)}
                className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full"
              >
                <X size={18} />
              </button>
            </div>
          ) : (
            <span
              className={`px-3 py-1 rounded-full text-sm ${
                request.status === "accepted"
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {request.status}
            </span>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 rounded-3xl shadow-xl shadow-purple-400 border-3 border-indigo-200 p-4 transition-all">
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="font-[fredoka] text-purple-600 text-[2.2rem] font-bold flex items-center">
            <Users className="mr-2 text-purple-600" size={28} />
            Team Collaboration
          </h1>
          <Button
            variant="primary"
            onClick={() => navigate("/team-project")}
            className="flex items-center gap-2"
          >
            <LucidePlus size={20} />
            Create New Team
          </Button>
        </div>

        {/* Tabs */}
        <div className="mb-6 border-b border-gray-200">
          <ul className="flex flex-wrap -mb-px">
            <li className="mr-2">
              <button
                className={`inline-block py-4 px-4 text-sm font-medium rounded-t-lg ${
                  activeTab === "myTeams"
                    ? "text-purple-600 border-b-2 border-purple-600"
                    : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
                onClick={() => setActiveTab("myTeams")}
              >
                My Teams
              </button>
            </li>
            <li className="mr-2">
              <button
                className={`inline-block py-4 px-4 text-sm font-medium rounded-t-lg ${
                  activeTab === "public"
                    ? "text-purple-600 border-b-2 border-purple-600"
                    : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
                onClick={() => setActiveTab("public")}
              >
                Public Teams
              </button>
            </li>
            <li className="mr-2">
              <button
                className={`inline-block py-4 px-4 text-sm font-medium rounded-t-lg ${
                  activeTab === "requests"
                    ? "text-purple-600 border-b-2 border-purple-600"
                    : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
                onClick={() => setActiveTab("requests")}
              >
                Join Requests
                {joinRequests.filter((r) => r.status === "pending").length >
                  0 && (
                  <span className="ml-2 bg-purple-500 text-white text-xs px-2 py-0.5 rounded-full">
                    {joinRequests.filter((r) => r.status === "pending").length}
                  </span>
                )}
              </button>
            </li>
          </ul>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
          </div>
        ) : (
          <>
            {/* My Teams Tab */}
            {activeTab === "myTeams" && (
              <>
                {myTeams.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {myTeams.map((team) => (
                      <TeamCard key={team._id} team={team} isMine={true} />
                    ))}
                  </div>
                ) : (
                  <div className="bg-white rounded-xl p-8 text-center shadow-sm">
                    <div className="mx-auto bg-gray-100 p-4 rounded-full w-16 h-16 flex items-center justify-center mb-4">
                      <Users className="text-gray-500" size={24} />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">
                      No Teams Yet
                    </h3>
                    <p className="text-gray-600 mb-6">
                      You're not part of any teams yet. Create your first team
                      to get started!
                    </p>
                    <Button
                      variant="primary"
                      onClick={() => navigate("/team-project")}
                    >
                      Create Your First Team
                    </Button>
                  </div>
                )}
              </>
            )}

            {/* Public Teams Tab */}
            {activeTab === "public" && (
              <>
                {publicTeams.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {publicTeams.map((team) => (
                      <TeamCard key={team._id} team={team} isMine={false} />
                    ))}
                  </div>
                ) : (
                  <div className="bg-white rounded-xl p-8 text-center shadow-sm">
                    <div className="mx-auto bg-gray-100 p-4 rounded-full w-16 h-16 flex items-center justify-center mb-4">
                      <Users className="text-gray-500" size={24} />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">
                      No Public Teams Available
                    </h3>
                    <p className="text-gray-600">
                      There are no public teams available at the moment. Check
                      back later!
                    </p>
                  </div>
                )}
              </>
            )}

            {/* Join Requests Tab */}
            {activeTab === "requests" && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                  <UserPlus className="mr-2 text-purple-600" size={20} />
                  Join Requests
                </h2>

                {joinRequests.length > 0 ? (
                  <>
                    {joinRequests.filter((r) => r.status === "pending").length >
                      0 && (
                      <>
                        <h3 className="text-md font-medium text-gray-700 mb-3">
                          Pending Requests
                        </h3>
                        <div className="mb-6">
                          {joinRequests
                            .filter((r) => r.status === "pending")
                            .map((request) => (
                              <JoinRequestCard
                                key={request._id}
                                request={request}
                              />
                            ))}
                        </div>
                      </>
                    )}

                    {joinRequests.filter((r) => r.status !== "pending").length >
                      0 && (
                      <>
                        <h3 className="text-md font-medium text-gray-700 mb-3">
                          Request History
                        </h3>
                        <div>
                          {joinRequests
                            .filter((r) => r.status !== "pending")
                            .map((request) => (
                              <JoinRequestCard
                                key={request._id}
                                request={request}
                              />
                            ))}
                        </div>
                      </>
                    )}
                  </>
                ) : (
                  <div className="text-center py-10">
                    <div className="mx-auto bg-gray-100 p-4 rounded-full w-16 h-16 flex items-center justify-center mb-4">
                      <UserPlus className="text-gray-500" size={24} />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                      No Join Requests
                    </h3>
                    <p className="text-gray-600">
                      You don't have any pending join requests at the moment.
                    </p>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
