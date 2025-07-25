import { useEffect, useState } from "react";
import { Button } from "../ui/UI_Components";
import axios from "axios";

export const MyTeam = () => {
  const fetchUserProjects = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/team/user", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      });
      console.log(response?.data);
    } catch (error) {
      console.log("Error Fetching Project : ", error);
    }
  };
  useEffect(() => {
    fetchUserProjects();
  });

  const [teams] = useState([
    {
      id: 1,
      name: "Design Team",
      description:
        "Working on product redesign for Q4 release. Collaboration between UX and UI designers.",
      visibility: "private",
      role: "Owner",
      memberCount: 8,
      members: Array(3).fill(""),
    },
    {
      id: 2,
      name: "Marketing Team",
      description:
        "Planning and executing marketing campaigns across all channels for product launches.",
      visibility: "public",
      role: "Member",
      memberCount: 12,
      members: Array(3).fill(""),
    },
    {
      id: 3,
      name: "Engineering Team",
      description:
        "Building and maintaining core product features with agile development methodology.",
      visibility: "private",
      role: "Owner",
      memberCount: 4,
      members: Array(4).fill(""),
    },
  ]);

  return (
    <div className="container bg-gray-100 mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
          My Teams
        </h2>
        <Button
          variant="secondary"
          className="btn-primary flex items-center px-4 py-2 text-white transition-all"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
              clipRule="evenodd"
            />
          </svg>
          Create New Team
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {teams.map((team) => (
          <div
            key={team.id}
            className="bg-white rounded-xl shadow-md overflow-hidden border-l-5 border-purple-400 hover:shadow-lg transition-shadow duration-300"
          >
            <div className="p-5 border-b border-gray-100 flex justify-between items-center">
              <h3 className="font-bold text-lg text-gray-800 truncate">
                {team.name}
              </h3>
              <span
                className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                  team.visibility === "private"
                    ? "bg-gray-100 text-gray-600"
                    : "bg-green-100 text-green-600"
                }`}
              >
                {team.visibility === "private" ? "Private" : "Public"}
              </span>
            </div>

            <div className="p-5">
              <p className="text-gray-600 mb-4">{team.description}</p>

              <div className="flex items-center mb-4">
                <span
                  className={`text-xs font-medium px-2.5 py-1 rounded-full mr-2 ${
                    team.role === "Owner"
                      ? "bg-blue-100 text-blue-600"
                      : "bg-cyan-100 text-cyan-600"
                  }`}
                >
                  {team.role}
                </span>
                <span className="text-sm text-gray-500">
                  {team.memberCount}{" "}
                  {team.memberCount === 1 ? "Member" : "Members"}
                </span>
              </div>

              <div className="flex items-center">
                {team.members.map((_, index) => (
                  <div
                    key={index}
                    className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white -ml-2 first:ml-0 overflow-hidden"
                  >
                    {index < 3 ? (
                      <div className="w-full h-full bg-gray-300 flex items-center justify-center text-xs text-gray-500">
                        {index + 1}
                      </div>
                    ) : null}
                  </div>
                ))}
                {team.memberCount > 3 && (
                  <div className="w-8 h-8 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center text-xs text-gray-500 ml-2">
                    +{team.memberCount - 3}
                  </div>
                )}
              </div>
            </div>

            <div className="px-5 py-4 bg-gray-50 flex justify-between">
              <button className="text-blue-600 hover:text-blue-800 font-medium text-sm">
                View Team
              </button>
              <div className="flex space-x-2">
                {team.role === "Owner" && (
                  <button className="text-gray-600 hover:text-gray-800 font-medium text-sm">
                    Invite
                  </button>
                )}
                <button className="text-red-600 hover:text-red-800 font-medium text-sm">
                  Leave
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
