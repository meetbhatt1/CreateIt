// components/developer/SuggestedDevelopers.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import API from "../../utils/API";
import { Card } from "../ui/Card";

export const SuggestedDevelopers = () => {
  const [suggestedDevelopers, setSuggestedDevelopers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchSuggestedDevelopers();
  }, []);

  const fetchSuggestedDevelopers = async () => {
    try {
      const response = await axios.get(`${API}/users/suggested`);
      setSuggestedDevelopers(response.data.users || []);
    } catch (error) {
      console.error("Error fetching suggested developers:", error);
      // Fallback to static data if API fails
      setSuggestedDevelopers([
        {
          _id: "688a1b2345cde67f8912b348",
          fullName: "Emily Watson",
          collegeName: "Harvard University",
          rating: 4.2,
          xp: 540,
          preferredLanguage: ["JavaScript", "Vue", "Python"],
          profileImage: "🎨",
        },
        {
          _id: "688a1b2345cde67f8912b347",
          fullName: "Mike Rodriguez",
          collegeName: "UC Berkeley",
          rating: 4.3,
          xp: 670,
          preferredLanguage: ["Java", "Spring Boot", "React"],
          profileImage: "🤖",
        },
        {
          _id: "68709e00efede65f3c1729b9",
          fullName: "Jane Doe",
          collegeName: "ABC Institute of Technology",
          rating: 4.1,
          xp: 450,
          preferredLanguage: ["JavaScript"],
          profileImage: "🦸‍♀️",
        },
        {
          _id: "6882a1b3ee09d7f208f409ad",
          fullName: "Test Sub One",
          collegeName: "ABC Institute of Technology",
          rating: 4.0,
          xp: 380,
          preferredLanguage: ["JavaScript"],
          profileImage: "🦸‍♀️",
        },
        {
          _id: "687125ee51ab5932115bf252",
          fullName: "Jane Doe",
          collegeName: "ABC Institute of Technology",
          rating: 4.2,
          xp: 520,
          preferredLanguage: ["JavaScript"],
          profileImage: "🦸‍♀️",
        },
      ]);
    }
  };

  return (
    <Card className="p-6">
      <h3 className="text-xl font-bold text-center mb-6 text-gray-800 pb-3 border-b-3 border-dashed border-blue-400 font-['Fredoka']">
        👥 Suggested Devs
      </h3>

      <div className="space-y-4">
        {suggestedDevelopers.slice(0, 4).map((developer) => (
          <div
            key={developer._id}
            className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer border border-gray-100"
            onClick={() => navigate(`/profile/${developer._id}`)}
          >
            <div className="flex-shrink-0">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center text-lg">
                {developer.profileImage || "👨‍💻"}
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-gray-800 truncate text-sm">
                {developer.fullName}
              </h4>
              <p className="text-xs text-gray-500 truncate">
                {developer.collegeName}
              </p>
              <div className="flex flex-wrap gap-1 mt-1">
                {developer.preferredLanguage?.slice(0, 2).map((lang, index) => (
                  <span
                    key={index}
                    className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded text-xs"
                  >
                    {lang}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex-shrink-0 text-right">
              <div className="flex items-center space-x-1 text-yellow-500 text-sm">
                <span>⭐</span>
                <span className="font-medium">{developer.rating || "4.5"}</span>
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {developer.xp || "250"} XP
              </div>
            </div>
          </div>
        ))}
      </div>

      <button
        className="w-full mt-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white py-2 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-600 transition-all duration-300 text-sm"
        onClick={() => navigate("/developers")}
      >
        Find More Developers
      </button>
    </Card>
  );
};
