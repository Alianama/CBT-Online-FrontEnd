"use client";
import { Power, HelpCircle } from "lucide-react";
import LanguageContext from "@/context/LanguageContext.tsx";
import { useContext } from "react";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar.tsx";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog.tsx";
import { useNavigate } from "react-router-dom";

export function NavSignout() {
  const { locale } = useContext(LanguageContext);
  const navigate = useNavigate();
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <Button
          onClick={() => window.open("https://cbtsite.tawk.help/", "_blank")}
          className="bg-primary w-full flex items-center gap-2 hover:bg-primary/90 transition-colors"
        >
          <HelpCircle className="size-4" />
          <span className="font-medium">
            {locale === "id" ? "Bantuan" : "Help"}
          </span>
        </Button>
      </SidebarMenuItem>
      <div className="h-px w-full bg-neutral-800/30 my-2" />
      <SidebarMenuItem>
        <Dialog>
          <DialogTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-neutral-900 flex item-center data-[state=open]:text-sidebar-accent-foreground "
            >
              <div className="flex aspect-square m-1 size-6 items-center justify-center text-sm rounded-lg bg-neutral-900 text-sidebar-primary-foreground">
                <Power className="size-3" />
              </div>
              Sign Out
            </SidebarMenuButton>
          </DialogTrigger>
          <DialogContent>
            <DialogTitle>Logout</DialogTitle>
            <DialogHeader>
              {locale === "id" ? "Konfirmasi" : "Confirmation"}
              <DialogDescription>
                {locale === "id"
                  ? "Apakah anda ingin Logout?"
                  : "Do you want to logout?"}
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className=" justify-center flex-row gap-10 flex">
              <DialogClose className="bg-primary text-sm text-secondary px-10 rounded-md w-min ">
                {locale === "id" ? "Tidak" : "No"}
              </DialogClose>
              <Button
                aria-label="Close"
                onClick={() => navigate("/logout")}
                className="bg-red-600 text-sm text-secondary px-10  rounded-md w-min"
              >
                {locale === "id" ? "Ya" : "Yes"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
