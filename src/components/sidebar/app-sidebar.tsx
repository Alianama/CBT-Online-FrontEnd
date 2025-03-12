"use client"
import type * as React from "react"
import {useContext, useEffect, useState} from "react";
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
import {NavPrimary} from "./nav-primary.tsx"
import {NavUser} from "./nav-user.tsx"
import {TeamSwitcher} from "./team-switcher.tsx"
import {Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail} from "@/components/ui/sidebar.tsx"
import LangContext from "@/context/LangContext.tsx";
import {getAuthData} from "@/utils/storage.ts";

const data = {
    teams: [
        {
            name: "Siswa",
            logo: GalleryVerticalEnd,
            plan: "SMAN 8 Tamsel",
            url: "/"
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
                url: "/lesson",
                icon: BookMarked,
            },
            {
                name: "Laporan",
                url: "#",
                icon: Map,
            },
            {
                name: "Ujian",
                url: "/exam",
                icon: ClipboardList
            },
            {
                name: "Jadwal Ujian",
                url: "/schedule",
                icon: Calendar1
            },
            {
                name: "Hasil Ujian",
                url: "/result",
                icon: FileCheck
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
                url: "/lesson",
                icon: BookMarked,
            },
            {
                name: "Report",
                url: "#",
                icon: Map,
            },
            {
                name: "Exam",
                url: "/exam",
                icon: ClipboardList
            },
            {
                name: "Exam Schedule",
                url: "/schedule",
                icon: Calendar1
            },
            {
                name: "Exam Result",
                url: "/result",
                icon: FileCheck
            },
        ]
    }
}

export function AppSidebar({...props}: React.ComponentProps<typeof Sidebar>) {
    const {locale} = useContext(LangContext);
    const [name, setName] = useState("");
    const [nis, setNis] = useState<string | undefined>();
    const avatar = "/avatars/shadcn.jpg"
    useEffect(() => {
        const authData = getAuthData();
        if (!authData || !authData.userData) {
            console.error("User data not found");
            return;
        }
        let userData;
        try {
            userData = typeof authData.userData === "object"
                ? authData.userData
                : JSON.parse(authData.userData);
            if (!userData || typeof userData !== "object") {
                console.error("Invalid User data");
            }
            const {nama_siswa, nis,} = userData;
            setName(nama_siswa);
            setNis(nis);
        } catch (error) {
            console.error("Failed to parse user data:", error);
        }
    }, []);
    return (
        <Sidebar collapsible="icon" {...props}>
            <SidebarHeader>
                <TeamSwitcher teams={data.teams}/>
            </SidebarHeader>
            <SidebarContent>
                <NavPrimary utils={locale === "id" ? data.utils.id : data.utils.en}/>
                {/*<NavSubmenu items={data.navMain}/>*/}
            </SidebarContent>
            <SidebarFooter>
                <NavUser user={{name, nis, avatar}}/>
            </SidebarFooter>
            <SidebarRail/>
        </Sidebar>
    )
}
