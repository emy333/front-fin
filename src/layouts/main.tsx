import { ReactNode, useEffect, useState } from 'react';
import { AppSidebar } from '@/components/app-sidebar';
import ButtonDark from '@/components/ButtonDarkMode';
import { Toaster } from "@/components/ui/toaster"
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar"
import { LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface MainLayoutProps {
    children: ReactNode;
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
            <AppSidebar />
            <SidebarInset>
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
