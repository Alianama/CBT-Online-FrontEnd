"use client";
import { BadgeCheck, ChevronsUpDown } from "lucide-react";
import { Avatar, AvatarImage } from "@/components/ui/avatar.tsx";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu.tsx";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar.tsx";
import useSidebar from "@/hooks/useSIdebar.tsx";
import { useNavigate } from "react-router-dom";
import { useGlobal } from "@/context/GlobalContext.tsx";

export function NavUser() {
  const navigate = useNavigate();
  const { generalUser, userPicture } = useGlobal();
  const { isMobile } = useSidebar();
  const handleClickProfile = () => {
    document.body.style.pointerEvents = "auto";
    navigate(`/profile`);
  };
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage
                  src={userPicture}
                  alt={generalUser?.nama}
                />
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">
                  {generalUser?.nama}
                </span>
                <span className="truncate text-xs">
                  NIS: {generalUser?.nis}
                </span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage
                    src={userPicture}
                    alt={generalUser?.nama}
                  />
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">
                    {generalUser?.nama}
                  </span>
                  <span className="truncate text-xs">
                    NIS: {generalUser?.nis}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />

            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={handleClickProfile}>
                <BadgeCheck />
                Profile
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
