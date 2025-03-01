import { ReactNode, useEffect, useState } from 'react';
import ButtonDark from '@/components/ButtonDarkMode';
import { Toaster } from "@/components/ui/toaster"
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarHeader,
    SidebarInset,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarProvider,
    SidebarRail,
    SidebarTrigger,
} from "@/components/ui/sidebar"
import { LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface MainLayoutProps {
    children: ReactNode;
}

const data = {
    navMain: [
        {
            title: "Dashboard",
            url: "/",
        },
        {
            title: "Entradas",
            url: "/entradas",
        },
        {
            title: "Saídas",
            url: "/saidas",
        },
        {
            title: "Credores",
            url: "/credores",
        },

    ],
}


const MainLayout = ({ children }: MainLayoutProps) => {
    const [isDark, setIsDark] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const savedTheme = localStorage.getItem("theme");
        const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

        setIsDark(savedTheme === "dark" || (savedTheme === null && prefersDark));

        document.documentElement.classList.toggle("dark", isDark);
    }, [isDark]);

    const handleLogout = () => {
        localStorage.clear();
        navigate("/auth");
    };

    return (
        <SidebarProvider>
            <Sidebar>
                <SidebarHeader>
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton size="lg" asChild>
                                <a href="#">
                                    <div className="flex flex-col gap-0.5 leading-none">
                                        <span className="font-bold text-lg">FinFácil</span>
                                    </div>
                                </a>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarHeader>
                <SidebarContent>
                    <SidebarGroup>
                        <SidebarMenu>
                            {data.navMain.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild>
                                        <a href={item.url} className="font-medium">
                                            {item.title}
                                        </a>
                                    </SidebarMenuButton>

                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroup>
                </SidebarContent>
                <SidebarRail />
            </Sidebar>
            <SidebarInset className='pb-16'>
                <header className="flex h-16 shrink-0 items-center gap-2 border-b">
                    <div className="flex items-center gap-2 px-3 w-full">
                        <SidebarTrigger />
                        <div className="ml-auto">
                            <Button onClick={handleLogout} variant={"outline"} className='mr-2'>
                                <LogOut /> Sair
                            </Button>
                            <ButtonDark setIsDark={setIsDark} />
                        </div>
                    </div>
                </header>
                <div className="flex flex-1 flex-col gap-4 p-4 ">
                    {children}
                </div>
                <Toaster />
            </SidebarInset>
        </SidebarProvider>

    );
};

export default MainLayout;
