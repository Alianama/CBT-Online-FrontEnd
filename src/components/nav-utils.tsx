// "use client"
// import {Folder, Forward, type LucideIcon, MoreHorizontal, Trash2} from "lucide-react"
// import {
//     DropdownMenu,
//     DropdownMenuContent,
//     DropdownMenuItem,
//     DropdownMenuSeparator,
//     DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu"
// import {
//     SidebarGroup,
//     SidebarGroupLabel,
//     SidebarMenu,
//     SidebarMenuAction,
//     SidebarMenuButton,
//     SidebarMenuItem,
//     useSidebar,
// } from "@/components/ui/sidebar"
//
// export function NavUtils({utils}: {
//     utils: {
//         name: string
//         url: string
//         icon: LucideIcon
//     }[]
// }) {
//     const {isMobile} = useSidebar()
//     return (
//         <SidebarGroup className="group-data-[collapsible=icon]:hidden">
//             <SidebarGroupLabel>Utils</SidebarGroupLabel>
//             <SidebarMenu>
//                 {utils.map((item) => (
//                     <SidebarMenuItem key={item.name}>
//                         <SidebarMenuButton asChild>
//                             <a href={item.url}>
//                                 <item.icon/>
//                                 <span>{item.name}</span>
//                             </a>
//                         </SidebarMenuButton>
//                         <DropdownMenu>
//                                 <DropdownMenuTrigger asChild>
//                                 <SidebarMenuAction showOnHover>
//                                     <MoreHorizontal/>
//                                     <span className="sr-only">More</span>
//                                 </SidebarMenuAction>
//                             </DropdownMenuTrigger>
//                             <DropdownMenuContent
//                                 className="w-48 rounded-lg"
//                                 side={isMobile ? "bottom" : "right"}
//                                 align={isMobile ? "end" : "start"}
//                             >
//                                 <DropdownMenuItem>
//                                     <Folder className="text-muted-foreground"/>
//                                     <span>View Project</span>
//                                 </DropdownMenuItem>
//                                 <DropdownMenuItem>
//                                     <Forward className="text-muted-foreground"/>
//                                     <span>Share Project</span>
//                                 </DropdownMenuItem>
//                                 <DropdownMenuSeparator/>
//                                 <DropdownMenuItem>
//                                     <Trash2 className="text-muted-foreground"/>
//                                     <span>Delete Project</span>
//                                 </DropdownMenuItem>
//                             </DropdownMenuContent>
//                         </DropdownMenu>
//                     </SidebarMenuItem>
//                 ))}
//                 {/*<SidebarMenuItem>*/}
//                 {/*    <SidebarMenuButton className="text-sidebar-foreground/70">*/}
//                 {/*        <MoreHorizontal className="text-sidebar-foreground/70"/>*/}
//                 {/*        <span>More</span>*/}
//                 {/*    </SidebarMenuButton>*/}
//                 {/*</SidebarMenuItem>*/}
//             </SidebarMenu>
//         </SidebarGroup>
//     )
// }
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
    const location = useLocation(); // Use location to track the current route
    return (
        <SidebarGroup>
            <SidebarGroupLabel>CBT</SidebarGroupLabel>
            <SidebarMenu>
                {utils.map((item) => (
                    <SidebarMenuItem key={item.name}>
                        <SidebarMenuButton
                            isActive={location.pathname === item.url}
                            // className={`
                            //     ${location.pathname === item.url
                            //     ? 'bg-primary text-white'
                            //     : 'hover:bg-primary'}
                            // `}
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
