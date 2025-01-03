import { ReactNode, useEffect, useState } from 'react';
import { AppSidebar } from '@/components/app-sidebar';
import ButtonDark from '@/components/ButtonDarkMode';

import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar"

interface MainLayoutProps {
    children: ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
    const [isDark, setIsDark] = useState(false);

    useEffect(() => {
        const savedTheme = localStorage.getItem("theme");
        const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

        setIsDark(savedTheme === "dark" || (savedTheme === null && prefersDark));

        document.documentElement.classList.toggle("dark", isDark);
    }, [isDark]); 

    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <header className="flex h-16 shrink-0 items-center gap-2 border-b">
                    <div className="flex items-center gap-2 px-3 w-full">
                        <SidebarTrigger />
                        <div className="ml-auto">
                            <ButtonDark setIsDark={setIsDark} />
                        </div>
                    </div>
                </header>
                <div className="flex flex-1 flex-col gap-4 p-4 ">
                    {children}
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
};

export default MainLayout;
