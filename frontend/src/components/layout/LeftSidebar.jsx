import React from 'react';
import { Card } from '../ui/Card';
import { SidebarMenuItem } from '../sidebar/SidebarMenuItem';

export const LeftSidebar = () => {
  return (
    <Card className="p-8 rotate-1" rotation="rotate-1" hoverRotation="rotate-1">
      <ul className="space-y-0">
        <SidebarMenuItem href="#" isActive={true}>🏠 Home</SidebarMenuItem>
        <SidebarMenuItem href="#">👥 Your Squad</SidebarMenuItem>
        <SidebarMenuItem href="#">💻 Project Crew</SidebarMenuItem>
        <SidebarMenuItem href="#">⭐ Your Contributions</SidebarMenuItem>
        <SidebarMenuItem href="#">📝 Your Requests</SidebarMenuItem>
        <SidebarMenuItem href="#">🎯 Mock Interviews</SidebarMenuItem>
      </ul>
    </Card>
  );
}; 