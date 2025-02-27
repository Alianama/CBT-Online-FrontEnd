import {SidebarInset, SidebarProvider, SidebarTrigger,} from "@/components/ui/sidebar";
import * as React from "react";
import {AppSidebar} from "@/components/app-sidebar.tsx";
import {Separator} from "@/components/ui/separator.tsx";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb.tsx";
import {ModeToggle} from "@/components/Theme/mode-toggle.tsx";
import {useNavigate} from "react-router-dom";
import LangContext from "@/context/LangContext.tsx";
import {Button} from "@/components/ui/button.tsx";

export default function Layout({
                                   children,
                                   data,
                               }: {
    data: { name: string; url: string }[];
    children: React.ReactNode;
}) {
    const navigate = useNavigate();
    const {locale, toggleLocale} = React.useContext(LangContext);
    return (
        <SidebarProvider>
            <AppSidebar/>

            <SidebarInset>
                <header
                    className="flex h-16 pr-4 justify-between shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
                    <div className="flex items-center gap-2 px-4">
                        <SidebarTrigger className="-ml-1"/>
                        <Separator orientation="vertical" className="mr-2 h-4"/>
                        <Breadcrumb>
                            <BreadcrumbList>
                                <BreadcrumbItem className="hidden md:block">
                                    <BreadcrumbLink onClick={() => navigate("/")}>
                                        Home
                                    </BreadcrumbLink>
                                </BreadcrumbItem>
                                {data.map((item, index) => (
                                    <React.Fragment key={index}>
                                        <BreadcrumbSeparator className="hidden md:block"/>
                                        <BreadcrumbItem>
                                            <BreadcrumbPage>{item.name}</BreadcrumbPage>
                                        </BreadcrumbItem>
                                    </React.Fragment>
                                ))}
                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>
                    <div className="flex items-center gap-2">
                        <ModeToggle/>
                        <Button
                            className="bg-primary px-3"
                            onClick={toggleLocale}
                        >
                            {locale === "en" ? "id" : "en"}
                        </Button>
                    </div>
                </header>
                <div className="px-5 pt-0">{children}</div>
            </SidebarInset>
        </SidebarProvider>
    );
}
