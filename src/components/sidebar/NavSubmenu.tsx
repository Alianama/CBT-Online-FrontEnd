"use client"
import {ChevronRight, type LucideIcon} from "lucide-react"
import {Collapsible, CollapsibleContent, CollapsibleTrigger} from "@/components/ui/collapsible.tsx"
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
} from "@/components/ui/sidebar.tsx"
import {useNavigate} from "react-router-dom";

export function NavSubmenu({items}: {
    items: {
        title: string
        url: string
        icon?: LucideIcon
        isActive?: boolean
        items?: {
            title: string
            url: string
            icon?: LucideIcon
        }[]
    }[]
}) {
    const navigate = useNavigate();
    return (
        <SidebarGroup>
            <SidebarGroupLabel>CBT</SidebarGroupLabel>
            <SidebarMenu>
                {items.map((item) => (
                    <Collapsible key={item.title} asChild defaultOpen={item.isActive} className="group/collapsible">
                        <SidebarMenuItem>
                            <CollapsibleTrigger asChild>
                                <SidebarMenuButton tooltip={item.title}>
                                    {item.icon && <item.icon/>}
                                    <span>{item.title}</span>
                                    <ChevronRight
                                        className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90"
                                    />
                                </SidebarMenuButton>
                            </CollapsibleTrigger>
                            <CollapsibleContent>
                                <SidebarMenuSub>
                                    {item.items?.map((subItem) => (
                                        <SidebarMenuSubItem key={subItem.title}>
                                            <SidebarMenuSubButton onClick={() => navigate(`${subItem.url}`)}>
                                                {subItem.icon && <subItem.icon/>}
                                                <span>{subItem.title}</span>
                                            </SidebarMenuSubButton>
                                        </SidebarMenuSubItem>
                                    ))}
                                </SidebarMenuSub>
                            </CollapsibleContent>
                        </SidebarMenuItem>
                    </Collapsible>
                ))}
            </SidebarMenu>
        </SidebarGroup>
    );
}
