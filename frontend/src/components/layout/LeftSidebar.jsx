import React from "react";
import { useLocation } from "react-router-dom";
import { Card } from "../ui/Card";
import { SidebarMenuItem } from "../sidebar/SidebarMenuItem";

export const LeftSidebar = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  const menuItems = [
    { href: "/", label: "🏠 Home" },
    { href: "/under_progress", label: "👥 Your Squad" },
    { href: "/team_project", label: "💻 Project Crew" },
    { href: "/project_dashboard", label: "⭐ Your Contributions" },
    { href: "/under_progress", label: "📝 Your Requests" },
    { href: "/under_progress", label: "🎯 Mock Interviews" },
  ];

  return (
    <Card className="p-8 rotate-1" rotation="rotate-1" hoverRotation="rotate-1">
      <ul className="space-y-0">
        {menuItems.map((item, index) => (
          <SidebarMenuItem
            key={`${item.href}-${index}`}
            href={item.href}
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
