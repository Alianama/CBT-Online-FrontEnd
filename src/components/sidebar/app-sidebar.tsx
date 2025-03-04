"use client"
import type * as React from "react"
import {useContext} from "react";
import {
    AudioWaveform,
    BookMarked,
    Calendar1,
    ClipboardList,
    FileCheck,
    GalleryVerticalEnd,
    House,
    Map,
    Pencil,
} from "lucide-react"
import {NavSubmenu} from "./nav-submenu.tsx"
import {NavPrimary} from "./nav-primary.tsx"
import {NavUser} from "./nav-user.tsx"
import {TeamSwitcher} from "./team-switcher.tsx"
import {Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail} from "@/components/ui/sidebar.tsx"
import LangContext from "@/context/LangContext.tsx";

const data = {
    user: {
        name: "Ali Purnama",
        email: "ali@gmail.com",
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
            icon: Pencil,
            isActive: true,
            items: [
                {
                    title: "Ujian",
                    url: "/exam",
                    icon: ClipboardList
                },
                {
                    title: "Jadwal Ujian",
                    url: "/schedule",
                    icon: Calendar1
                },
                {
                    title: "Hasil Ujian",
                    url: "/result",
                    icon: FileCheck
                },
            ],
        },
    ],
    utils: {
        id: [
            {
                name: "Beranda",
                url: "/",
                icon: House,
            },
            {
                name: "Materi",
                url: "/materi",
                icon: BookMarked,
            },
            {
                name: "Laporan",
                url: "#",
                icon: Map,
            },
        ],
        en: [
            {
                name: "Home",
                url: "/",
                icon: House,
            },
            {
                name: "Lesson",
                url: "/materi",
                icon: BookMarked,
            },
            {
                name: "Report",
                url: "#",
                icon: Map,
            },
        ]
    }
}

export function AppSidebar({...props}: React.ComponentProps<typeof Sidebar>) {
    const {locale} = useContext(LangContext);
    return (
        <Sidebar collapsible="icon" {...props}>
            <SidebarHeader>
                <TeamSwitcher teams={data.teams}/>
            </SidebarHeader>
            <SidebarContent>
                <NavPrimary utils={locale === "id" ? data.utils.id : data.utils.en}/>
                <NavSubmenu items={data.navMain}/>
            </SidebarContent>
            <SidebarFooter>
                <NavUser user={data.user}/>
            </SidebarFooter>
            <SidebarRail/>
        </Sidebar>
    )
}
