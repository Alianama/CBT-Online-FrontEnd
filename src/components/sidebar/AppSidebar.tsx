"use client";
import type * as React from "react";
import { useContext } from "react";
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
} from "lucide-react";
import { NavPrimary } from "./nav-primary.tsx";
import { NavUser } from "./nav-user.tsx";
import { NavSignout } from "./nav-signout.tsx";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar.tsx";
import LanguageContext from "@/context/LanguageContext.tsx";

const data = {
  teams: [
    {
      name: "Siswa",
      logo: GalleryVerticalEnd,
      plan: "SMAN 8 Tamsel",
      url: "/",
    },
    {
      name: "Guru",
      logo: AudioWaveform,
      plan: "SMAN 8 Tamsel",
      url: "guru",
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
          icon: ClipboardList,
        },
        {
          title: "Jadwal Ujian",
          url: "/schedule",
          icon: Calendar1,
        },
        {
          title: "Hasil Ujian",
          url: "/result",
          icon: FileCheck,
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
        icon: ClipboardList,
      },
      {
        name: "Agenda",
        url: "/agenda",
        icon: Calendar1,
      },
      {
        name: "Hasil Ujian",
        url: "/result",
        icon: FileCheck,
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
        icon: ClipboardList,
      },
      {
        name: "Agenda",
        url: "/agenda",
        icon: Calendar1,
      },
      {
        name: "Exam Result",
        url: "/result",
        icon: FileCheck,
      },
    ],
  },
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { locale } = useContext(LanguageContext);
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <NavUser />
      </SidebarHeader>
      <SidebarContent>
        <NavPrimary utils={locale === "id" ? data.utils.id : data.utils.en} />
      </SidebarContent>
      <SidebarFooter>
        <NavSignout />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
