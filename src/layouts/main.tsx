import { ReactNode, useEffect, useState } from "react";
import ButtonDark from "@/components/ButtonDarkMode";
import { Toaster } from "@/components/ui/toaster";
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
} from "@/components/ui/sidebar";
import {
  LogOut,
  LayoutDashboard,
  PiggyBank,
  Banknote,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface MainLayoutProps {
  children: ReactNode;
}

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/",
      icon: <LayoutDashboard className="w-5 h-5" />,
    },
    {
      title: "Entradas",
      url: "/entradas",
      icon: <PiggyBank className="w-5 h-5 " />,
    },
    {
      title: "Saídas",
      url: "/saidas",
      icon: <Banknote className="w-5 h-5 " />,
    },
    {
      title: "Credores",
      url: "/credores",
      icon: <Users className="w-5 h-5" />,
    },
  ],
};

const MainLayout = ({ children }: MainLayoutProps) => {
  const [isDark, setIsDark] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;

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
                <a href="/" className="flex ">
                  <span className="text-2xl font-semibold tracking-wide text-gray-900 dark:text-white">
                    FinFácil
                  </span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarMenu>
              {data.navMain.map((item) => {

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <a
                        href={item.url}
                        className={`flex items-center gap-2 font-medium px-3 py-2 rounded-md transition-all
                        }`}
                      >
                        {item.icon}
                        {item.title}
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
        <SidebarRail />
      </Sidebar>
      <SidebarInset className="pb-16">
        <header className="flex h-16 shrink-0 items-center gap-2 border-b">
          <div className="flex items-center gap-2 px-3 w-full">
            <SidebarTrigger />
            <div className="ml-auto">
              <Button onClick={handleLogout} variant="outline" className="mr-2">
                <LogOut className="w-5 h-5 mr-2" /> Sair
              </Button>
              <ButtonDark setIsDark={setIsDark} />
            </div>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4">{children}</div>
        <Toaster />
      </SidebarInset>
    </SidebarProvider>
  );
};

export default MainLayout;
