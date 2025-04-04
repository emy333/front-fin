import { ReactNode, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/toaster";
import ButtonDark from "@/components/ButtonDarkMode";
import {
  LogOut,
  LayoutDashboard,
  PiggyBank,
  Banknote,
  Users,
} from "lucide-react";

interface MainLayoutProps {
  children: ReactNode;
}

const menuItems = [
  { title: "Dashboard", url: "/", icon: <LayoutDashboard className="w-5 h-5" /> },
  { title: "Entradas", url: "/entradas", icon: <PiggyBank className="w-5 h-5" /> },
  { title: "Saídas", url: "/saidas", icon: <Banknote className="w-5 h-5" /> },
  { title: "Credores", url: "/credores", icon: <Users className="w-5 h-5" /> },
];

const MainLayout = ({ children }: MainLayoutProps) => {
  const [isDark, setIsDark] = useState(false);
  const navigate = useNavigate();
  const nomeUser = localStorage.getItem("userName");

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

    setIsDark(savedTheme === "dark" || (!savedTheme && prefersDark));
  }, []);

  useEffect(() => {
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
              <SidebarMenuButton size="sm" asChild>
                <a href="/" className="flex items-center">
                  <span className="text-2xl font-bold tracking-wide text-gray-900 dark:text-white">
                    FinFácil
                  </span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <div className="px-3 py-2 text-lg font-semibold text-gray-800 dark:text-white">
                Seja Bem-vindo(a), <span className="text-purple-950">{nomeUser}</span>!
              </div>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>

        <SidebarContent>
          <SidebarGroup>
            <SidebarMenu>
              {menuItems.map(({ title, url, icon }) => (
                <SidebarMenuItem key={title}>
                  <SidebarMenuButton asChild>
                    <a
                      href={url}
                      className="flex items-center gap-2 px-3 py-2 font-medium rounded-md transition-colors hover:bg-muted"
                    >
                      {icon}
                      {title}
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>

        <SidebarRail />
      </Sidebar>

      <SidebarInset className="pb-16">
        <header className="flex h-16 items-center border-b px-4">
          <SidebarTrigger />
          <div className="ml-auto flex items-center gap-2">
            <Button onClick={handleLogout} variant="outline">
              <LogOut className="w-5 h-5 mr-2" />
              Sair
            </Button>
            <ButtonDark setIsDark={setIsDark} />
          </div>
        </header>

        <main className="flex-1 p-4">{children}</main>
        <Toaster />
      </SidebarInset>
    </SidebarProvider>
  );
};

export default MainLayout;
