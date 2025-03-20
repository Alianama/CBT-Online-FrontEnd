"use client"
import * as React from "react"
import {ChevronsUpDown,Power,} from "lucide-react"
import LangContext from "@/context/LangContext.tsx";
import {useContext} from "react";
import {
    DropdownMenu,
    // DropdownMenuContent,
    // DropdownMenuItem,
    // DropdownMenuLabel,
    // DropdownMenuShortcut,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu.tsx"
import {SidebarMenu, SidebarMenuButton, SidebarMenuItem} from "@/components/ui/sidebar.tsx"
// import useSidebar from "@/hooks/useSIdebar.tsx";
import {useNavigate} from "react-router-dom";
import {Button} from "@/components/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog.tsx";

export function TeamSwitcher({teams}: {
    teams: {
        name: string
        logo: React.ElementType
        plan: string
        url: string
    }[]
}) {
    // const {isMobile} = useSidebar()
    const [activeTeam] = React.useState(teams[0])
    const navigate = useNavigate()
    const {locale } = useContext(LangContext)

    return (
        <SidebarMenu>

            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton
                            size="lg"
                            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                        >
                            <div
                                className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-sidebar-primary-foreground">
                                <activeTeam.logo className="size-4"/>
                            </div>
                            <div className="grid flex-1 text-left text-sm leading-tight">
                                <span className="truncate font-semibold">{activeTeam.name}</span>
                                <span className="truncate text-xs">{activeTeam.plan}</span>
                            </div>
                            <ChevronsUpDown className="ml-auto"/>
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    {/*<DropdownMenuContent*/}
                    {/*    className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"*/}
                    {/*    align="start"*/}
                    {/*    side={isMobile ? "bottom" : "right"}*/}
                    {/*    sideOffset={4}*/}
                    {/*>*/}
                    {/*    <DropdownMenuLabel className="text-xs text-muted-foreground">Teams</DropdownMenuLabel>*/}
                    {/*    {teams.map((team, index) => (*/}
                    {/*        <DropdownMenuItem key={team.name} onClick={() => {*/}
                    {/*            navigate(`${team.url}`);*/}
                    {/*            setActiveTeam(team);*/}
                    {/*        }} className="gap-2 p-2">*/}
                    {/*            <div*/}
                    {/*                className="flex size-6 items-center justify-center rounded-sm border">*/}
                    {/*                <team.logo className="size-4 shrink-0"/>*/}
                    {/*            </div>*/}
                    {/*            <span>{team.name}</span>*/}
                    {/*            <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>*/}
                    {/*        </DropdownMenuItem>*/}
                    {/*    ))}*/}

                    {/*</DropdownMenuContent>*/}
                </DropdownMenu>

                <Dialog>
                    <DialogTrigger asChild>
                        <SidebarMenuButton size="lg"
                                           className="data-[state=open]:bg-neutral-900 data-[state=open]:text-sidebar-accent-foreground " >
                            <div
                              className="flex aspect-square size-8 items-center justify-center rounded-lg bg-neutral-900 text-sidebar-primary-foreground">
                                <Power  className="size-4"/>
                            </div>
                            Sign Out
                        </SidebarMenuButton>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogTitle>Logout</DialogTitle>
                        <DialogHeader>
                            {locale === "id" ? "Konfirmasi" : "Confirmation"}
                            <DialogDescription>
                                {locale === "id" ? "Apakah anda ingin Logout?" : "Do you want to logout?"}
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter className=" justify-center flex-row gap-10 flex">
                            <DialogClose
                              className="bg-primary text-sm text-secondary px-10 rounded-md w-min ">{locale === "id" ? "Tidak" : "No"}
                            </DialogClose>
                            <Button aria-label="Close" onClick={() => navigate("/logout")}
                                    className="bg-red-600 text-sm text-secondary px-10  rounded-md w-min">
                                {locale === "id" ? "Ya" : "Yes"}
                            </Button>
                        </DialogFooter>

                    </DialogContent>
                </Dialog>
            </SidebarMenuItem>
        </SidebarMenu>
    )
}
