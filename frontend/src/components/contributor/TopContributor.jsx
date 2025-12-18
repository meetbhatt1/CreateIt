// components/contributor/TopContributor.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import API from "../../utils/API";
import { Card } from "../ui/Card";

export const TopContributors = () => {
  const [topContributors, setTopContributors] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTopContributors();
  }, []);

  const fetchTopContributors = async () => {
    try {
      const response = await axios.get(`${API}/users/top-contributors`);
      setTopContributors(response.data.users || []);
    } catch (error) {
      console.error("Error fetching top contributors:", error);
      // Fallback to static data if API fails
      setTopContributors([
        {
          _id: "688a1b2345cde67f8912b345",
          fullName: "Alex Chen",
          collegeName: "Stanford University",
          rating: 4.8,
          xp: 1250,
          preferredLanguage: ["Python", "JavaScript", "Go"],
          profileImage: "🚀",
        },
        {
          _id: "688a1b2345cde67f8912b349",
          fullName: "David Kim",
          collegeName: "Caltech",
          rating: 4.7,
          xp: 1100,
          preferredLanguage: ["C++", "Python", "Rust"],
          profileImage: "🔥",
        },
        {
          _id: "68866d263df2ca4abbc384ce",
          fullName: "Meet Bhatt",
          collegeName: "LDRP",
          rating: 4.5,
          xp: 890,
          preferredLanguage: ["JavaScript", "React", "Node.js"],
          profileImage: "🤓",
        },
        {
          _id: "688a1b2345cde67f8912b346",
          fullName: "Sarah Johnson",
          collegeName: "MIT",
          rating: 4.6,
          xp: 920,
          preferredLanguage: ["React", "TypeScript", "Node.js"],
          profileImage: "👩‍💻",
        },
        {
          _id: "6886f02d70d98fc0a9bacbc1",
          fullName: "harshbarad",
          collegeName: "LDRP",
          rating: 4.3,
          xp: 760,
          preferredLanguage: ["JavaScript", "Python", "Java"],
          profileImage: "🤓",
        },
      ]);
    }
  };

  return (
    <Card className="p-6">
      <h3 className="text-xl font-bold text-center mb-6 text-gray-800 pb-3 border-b-3 border-dashed border-purple-400 font-['Fredoka']">
        🏆 Top Coders
      </h3>

      <div className="space-y-4">
        {topContributors.slice(0, 5).map((contributor, index) => (
          <div
            key={contributor._id}
            className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer border border-gray-100"
            onClick={() => navigate(`/profile/${contributor._id}`)}
          >
            <div className="flex-shrink-0">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${
                  index === 0
                    ? "bg-yellow-500"
                    : index === 1
                    ? "bg-gray-400"
                    : index === 2
                    ? "bg-orange-500"
                    : "bg-purple-500"
                }`}
              >
                {index + 1}
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-gray-800 truncate text-sm">
                {contributor.fullName}
              </h4>
              <p className="text-xs text-gray-500 truncate">
                {contributor.collegeName}
              </p>
              <div className="flex items-center space-x-2 mt-1">
                <span className="text-xs text-yellow-600 font-medium">
                  ⭐ {contributor.rating || "4.5"}
                </span>
                <span className="text-xs text-blue-600 font-medium">
                  💎 {contributor.xp || "0"} XP
                </span>
              </div>
            </div>

            <div className="flex-shrink-0">
              <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                {contributor.preferredLanguage?.[0] || "JS"}
              </div>
            </div>
          </div>
        ))}
      </div>

      <button
        className="w-full mt-4 bg-gradient-to-r from-purple-500 to-indigo-500 text-white py-2 rounded-lg font-semibold hover:from-purple-600 hover:to-indigo-600 transition-all duration-300 text-sm"
        onClick={() => navigate("/leaderboard")}
      >
        View Leaderboard
      </button>
    </Card>
  );
};
