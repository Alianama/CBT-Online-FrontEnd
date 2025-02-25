"use client"
import type * as React from "react"
import {AudioWaveform, Command, Frame, GalleryVerticalEnd, Map, PieChart, SquareTerminal,} from "lucide-react"
import {NavSubmenu} from "./nav-submenu.tsx"
import {NavUtils} from "./nav-utils.tsx"
import {NavUser} from "./nav-user"
import {TeamSwitcher} from "./team-switcher"
import {Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail} from "@/components/ui/sidebar"
// This is sample data.
const data = {
    user: {
        name: "Ali Purnama",
        email: "ali@gamil.com",
        avatar: "/avatars/shadcn.jpg",
    },
    teams: [
        {
            name: "SMAN8",
            logo: GalleryVerticalEnd,
            plan: "Enterprise",
        },
        {
            name: "Acme Corp.",
            logo: AudioWaveform,
            plan: "Startup",
        },
        {
            name: "Evil Corp.",
            logo: Command,
            plan: "Free",
        },
    ],
    navMain: [
        {
            title: "Dashboard",
            url: "/dashboard",
            icon: SquareTerminal,
            isActive: true,
        },
        {
            title: "Ujian Online",
            url: "#",
            icon: SquareTerminal,
            isActive: true,
            items: [
                {
                    title: "Dashboard",
                    url: "/dashboard",
                },
                {
                    title: "Home",
                    url: "/",
                },
            ],
        },
    ],
    utils: [
        {
            name: "Design Engineering",
            url: "#",
            icon: Frame,
        },
        {
            name: "Sales & Marketing",
            url: "#",
            icon: PieChart,
        },
        {
            name: "Travel",
            url: "#",
            icon: Map,
        },
    ],
}

export function AppSidebar({...props}: React.ComponentProps<typeof Sidebar>) {
    return (
        <Sidebar collapsible="icon" {...props}>
            <SidebarHeader>
                <TeamSwitcher teams={data.teams}/>
            </SidebarHeader>
            <SidebarContent>
                <NavSubmenu items={data.navMain}/>
                <NavUtils projects={data.utils}/>
            </SidebarContent>
            <SidebarFooter>
                <NavUser user={data.user}/>
            </SidebarFooter>
            <SidebarRail/>
        </Sidebar>
    )
}
