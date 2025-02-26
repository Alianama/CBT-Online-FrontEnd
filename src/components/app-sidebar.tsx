"use client"
import type * as React from "react"
import {AudioWaveform, Frame, GalleryVerticalEnd, Map, PieChart, SquareTerminal,} from "lucide-react"
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
            name: "Siswa",
            logo: GalleryVerticalEnd,
            plan: "SMAN 8 Tamsel",
            url: "siwa"
        },
        {
            name: "Guru",
            logo: AudioWaveform,
            plan: "SMAN 8 Tamsel",
            url: "guru"
        },
    ],
    navMain: [
        {
            title: "Ujian Online",
            url: "#",
            icon: SquareTerminal,
            isActive: true,
            items: [
                {
                    title: "Jadwal Ujian",
                    url: "/schedule",
                },
                {
                    title: "Hasil Ujian",
                    url: "/result",
                },
            ],
        },
    ],
    utils: [
        {
            name: "Home",
            url: "/",
            icon: Frame,
        },
        {
            name: "Materi",
            url: "/materi",
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
                <NavUtils utils={data.utils}/>
                <NavSubmenu items={data.navMain}/>
            </SidebarContent>
            <SidebarFooter>
                <NavUser user={data.user}/>
            </SidebarFooter>
            <SidebarRail/>
        </Sidebar>
    )
}
