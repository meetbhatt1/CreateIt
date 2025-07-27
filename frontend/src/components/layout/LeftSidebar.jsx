import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Card } from "../ui/Card";
import { SidebarMenuItem } from "../sidebar/SidebarMenuItem";

export const LeftSidebar = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  const menuItems = [
    { href: "/", label: "🏠 Home" },
    { href: "/my-team", label: "👥 Your Squad" },
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
