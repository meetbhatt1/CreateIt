import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Card } from "../ui/Card";
import { SidebarMenuItem } from "../sidebar/SidebarMenuItem";
import axios from "axios";
import API from "../../utils/API";

export const LeftSidebar = () => {
  const location = useLocation();
  const [teamID, setTeamID] = useState();
  const currentPath = location.pathname;

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const res = await axios.get(`${API}/team/user/${user._id}`);
        setTeamID(res?.data[0]?._id);
      } catch (err) {
        console.error("Error fetching teams:", err);
      }
    };

    fetchTeams();
  }, []);

  const menuItems = [
    { href: "/", label: "🏠 Home" },
    {
      href: `/team/${teamID || "6895ab36bc5ef279d41fc77f"}/dashboard`,
      label: "👥 Your Squad",
    },
    { href: "/under-progress", label: "💻 Project Crew" },
    { href: "/project-dashboard", label: "⭐Your Contributions" },
    { href: "/mock-interview", label: "🎯 Mock Interviews" },
  ];
  const navigate = useNavigate();

  return (
    <Card className="p-6 rotate-1" rotation="rotate-1" hoverRotation="rotate-1">
      <ul className="space-y-0">
        {menuItems.map((item, index) => (
          <SidebarMenuItem
            key={`${item.href}-${index}`}
            onClick={() => navigate(item.href)}
            isActive={
              item.href === "/"
                ? currentPath === "/"
                : currentPath.startsWith(item.href)
            }
          >
            {item.label}
          </SidebarMenuItem>
        ))}
      </ul>
    </Card>
  );
};
