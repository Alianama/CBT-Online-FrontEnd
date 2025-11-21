import { Avatar, AvatarImage } from "@/components/ui/avatar.tsx";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar.tsx";
import { useGlobal } from "@/context/GlobalContext.tsx";
import { useNavigate } from "react-router-dom";


export function NavUser() {
  const { generalUser, userPicture } = useGlobal();
  const navigate = useNavigate();
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          onClick={() => navigate("/profile")}
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
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
