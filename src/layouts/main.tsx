import { ReactNode, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
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
  Banknote,
  Users,
  TrendingUp,
} from "lucide-react";

interface MainLayoutProps {
  children: ReactNode;
}

const menuItems = [
  { title: "Dashboard", url: "/", icon: <LayoutDashboard size={18} /> },
  { title: "Entradas", url: "/entradas", icon: <TrendingUp size={18} /> },
  { title: "Saídas", url: "/saidas", icon: <Banknote size={18} /> },
  { title: "Credores", url: "/credores", icon: <Users size={18} /> },
];

const MainLayout = ({ children }: MainLayoutProps) => {
  const [isDark, setIsDark] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
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
              <a href="/" className="flex items-center px-1">
                <span className="text-xl font-bold font-notoGondi text-purple">
                  FinFácil
                </span>
              </a>
              <div className="px-1 text-xm font-medium text-foreground ">
                Seja Bem-vindo(a),{" "}
                <p >{nomeUser}!</p>
              </div>
            </SidebarMenuItem>
          </SidebarMenu>
          <hr className="mb-2" />
        </SidebarHeader>

        <SidebarContent>
          <SidebarGroup>
            <SidebarMenu>
              {menuItems.map(({ title, url, icon }) => {
                const isActive =
                  location.pathname === url ||
                  (url !== "/" && location.pathname.startsWith(url));

                return (
                  <SidebarMenuItem key={title}>
                    <a
                      href={url}
                      className={`flex items-center gap-2 px-2 py-2 font-medium rounded-md ${isActive ? "bg-purple text-background" : ""
                        }`}

                    >
                      {icon}
                      {title}
                    </a>
                  </SidebarMenuItem>
                );
              })}
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
