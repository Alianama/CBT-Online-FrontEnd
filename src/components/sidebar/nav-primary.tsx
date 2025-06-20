"use client";
import { type LucideIcon } from "lucide-react";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar.tsx";
import { useLocation, useNavigate } from "react-router-dom";
import { useGlobal } from "@/context/GlobalContext.tsx";

export function NavPrimary({
  utils,
}: {
  utils: {
    name: string;
    url: string;
    icon: LucideIcon;
  }[];
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const { school } = useGlobal();
  return (
    <SidebarGroup>
      <SidebarGroupLabel>{school}</SidebarGroupLabel>
      <SidebarMenu>
        {utils.map((item) => (
          <SidebarMenuItem key={item.name}>
            <SidebarMenuButton
              isActive={location.pathname === item.url}
              onClick={() => navigate(`${item.url}`)}
              tooltip={item.name}
            >
              {item.icon && <item.icon />}
              <span>{item.name}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
