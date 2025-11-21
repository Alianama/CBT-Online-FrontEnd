import type * as React from "react";
import { useContext } from "react";
import {
  BookMarked,
  Calendar1,
  ClipboardList,
  FileCheck,
  House,
  UserPen} from "lucide-react";
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
      {
        name: "Profil",
        url: "/profile",
        icon: UserPen ,
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
      {
        name: "Profil",
        url: "/profile",
        icon: UserPen ,
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
