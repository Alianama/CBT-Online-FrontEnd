"use client"
import type * as React from "react"
import {AudioWaveform, Frame, GalleryVerticalEnd, Map, PieChart, SquareTerminal,} from "lucide-react"
import {NavSubmenu} from "./nav-submenu.tsx"
import {NavUtils} from "./nav-utils.tsx"
import {NavUser} from "./nav-user"
import {TeamSwitcher} from "./team-switcher"
import {Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail} from "@/components/ui/sidebar"
import LangContext from "@/context/LangContext.tsx";
import {useContext} from "react";


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
    utils: {
        id: [
            {
                name: "Beranda",
                url: "/",
                icon: Frame,
            },
            {
                name: "Materi",
                url: "/materi",
                icon: PieChart,
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
                icon: Frame,
            },
            {
                name: "Lesson",
                url: "/materi",
                icon: PieChart,
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
              <NavUtils utils={locale === "id" ? data.utils.id : data.utils.en}/>
              <NavSubmenu items={data.navMain}/>
          </SidebarContent>
          <SidebarFooter>
              <NavUser user={data.user}/>
          </SidebarFooter>
          <SidebarRail/>
      </Sidebar>
    )
}
