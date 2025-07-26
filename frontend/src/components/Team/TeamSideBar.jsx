import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Card } from "../ui/Card";
import { SidebarMenuItem } from "../sidebar/SidebarMenuItem";

export const TeamSideBar = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  const menuItems = [
    { href: "/team-dashboard", label: "DashBoard" },
    { href: "/project-dashboard", label: "Projects" },
    { href: "/kanban-board", label: "Tasks" },
    { href: "/my-team", label: "My Teams" },
    { href: "/under-progress", label: "📝 Your Requests" },
    { href: "/", label: "Back To Home" },
  ];
  const navigate = useNavigate();

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
