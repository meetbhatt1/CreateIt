// src/components/User/UserDashboard.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Button } from "../ui/UI_Components";
import API from "../../utils/API";

export const TeamDashboard = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${API}/team/user/${user._id}`);
        setTeams(res?.data || []);
      } catch (err) {
        console.error("Error fetching teams:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTeams();
  }, [user._id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin h-12 w-12 rounded-full border-4 border-purple-500 border-t-transparent"></div>
      </div>
    );
  }

  const totalTeams = teams.length;
  const totalMembers = teams.reduce(
    (acc, team) =>
      acc +
      (Array.isArray(team.members)
        ? team.members.filter((m) => m.user).length
        : 0),
    0
  );
  const openPositions = teams.reduce(
    (acc, team) =>
      acc +
      (Array.isArray(team.members)
        ? team.members.filter((m) => !m.user).length
        : 0),
    0
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          Welcome, {user.email}
        </h1>
        <Button variant="primary" onClick={() => navigate("/team-project")}>
          + Create New Team
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        <div className="bg-white shadow-md rounded-xl p-6">
          <h3 className="text-gray-500 text-sm">My Teams</h3>
          <p className="text-3xl font-bold">{totalTeams}</p>
        </div>
        <div className="bg-white shadow-md rounded-xl p-6">
          <h3 className="text-gray-500 text-sm">
            Total Members (across teams)
          </h3>
          <p className="text-3xl font-bold">{totalMembers}</p>
        </div>
        <div className="bg-white shadow-md rounded-xl p-6">
          <h3 className="text-gray-500 text-sm">Open Positions</h3>
          <p className="text-3xl font-bold">{openPositions}</p>
        </div>
      </div>

      {/* Teams Overview */}
      <div className="bg-white shadow-md rounded-xl p-6 mb-10">
        <h2 className="text-xl font-bold text-gray-800 mb-4">My Teams</h2>
        {teams.length === 0 ? (
          <p className="text-gray-500">You don’t have any teams yet.</p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {teams.map((team) => {
              const memberCount = Array.isArray(team.members)
                ? team.members.filter((m) => m.user).length
                : 0;

              return (
                <div
                  key={team._id}
                  className="border rounded-lg p-4 shadow-sm cursor-pointer hover:shadow-lg transition"
                  onClick={() => navigate(`/team/${team._id}`)}
                >
                  <h3 className="font-semibold text-gray-800">{team.title}</h3>
                  <p className="text-gray-600 text-sm line-clamp-2">
                    {team.description}
                  </p>
                  <div className="flex justify-between items-center mt-4">
                    <span
                      className={`px-2 py-1 text-xs rounded ${
                        team.visibility
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {team.visibility ? "Public" : "Private"}
                    </span>
                    <span className="text-gray-500 text-sm">
                      {memberCount} member{memberCount !== 1 ? "s" : ""}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Recent Activity (placeholder, can hook into activity logs later) */}
      <div className="bg-white shadow-md rounded-xl p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          Recent Activity
        </h2>
        <ul className="space-y-3 text-sm text-gray-600">
          <li>👤 You joined "Password Generator" team</li>
          <li>📌 Task assigned: "Setup backend APIs"</li>
          <li>✅ Completed task: "Design homepage"</li>
        </ul>
      </div>
    </div>
  );
};
