"use client"
import {type LucideIcon} from "lucide-react"
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"
import {useLocation, useNavigate} from "react-router-dom";

export function NavUtils({utils}: {
    utils: {
        name: string
        url: string
        icon: LucideIcon
    }[]
}) {
    const navigate = useNavigate();
    const location = useLocation();
    return (
        <SidebarGroup>
            <SidebarGroupLabel>CBT</SidebarGroupLabel>
            <SidebarMenu>
                {utils.map((item) => (
                    <SidebarMenuItem key={item.name}>
                        <SidebarMenuButton
                            isActive={location.pathname === item.url}
                            onClick={() => navigate(`${item.url}`)}
                            tooltip={item.name}
                        >
                            {item.icon && <item.icon/>}
                            <span>{item.name}</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                ))}
            </SidebarMenu>
        </SidebarGroup>
    );
}
