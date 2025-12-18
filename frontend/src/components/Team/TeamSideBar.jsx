import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Card } from "../ui/Card";
import { SidebarMenuItem } from "../sidebar/SidebarMenuItem";
import axios from "axios";
import API from "../../utils/API";

export const TeamSideBar = () => {
  const [teamId, setTeamID] = useState();
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        if (!user?._id) return;
        const res = await axios.get(`${API}/team/user/${user._id}`);
        setTeamID(res?.data[0]?._id);
      } catch (err) {
        console.error("Error fetching teams:", err);
      }
    };

    fetchTeams();
  }, []);

  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { href: `/team/${teamId}/dashboard`, label: "Team Dashboard" },
    { href: `/my-team`, label: "My Teams" },
    { href: "/", label: "Home" },
  ];

  return (
    <Card className="p-6" rotation="rotate-0" hoverRotation="rotate-1">
      <p className="text-purple-500 my-2 font-bold justify-self-center text-2xl">
        Team Management
      </p>
      <ul className="space-y-0">
        {menuItems.map((item, index) => (
          <SidebarMenuItem
            key={`${item.href}-${index}`}
            onClick={() => navigate(item.href)}
            isActive={
              item.href === "/"
                ? location.pathname === "/"
                : location.pathname.startsWith(item.href)
            }
          >
            {item.label}
          </SidebarMenuItem>
        ))}
      </ul>
    </Card>
  );
};
