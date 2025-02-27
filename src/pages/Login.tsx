import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Moon, Sun } from "lucide-react";

export function Login({
    className,
    ...props
}: React.ComponentProps<"div">) {
    const [darkMode, setDarkMode] = useState(() => {
        return localStorage.getItem("darkMode") === "true";
    });

    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
        localStorage.setItem("darkMode", darkMode.toString());
    }, [darkMode]);
    

    return (
        <div className={cn("flex flex-col gap-6 min-h-screen justify-center items-center", className)} {...props}>
            <Button
                onClick={() => setDarkMode(!darkMode)}
                className="absolute top-4 right-4"
                variant="outline"
            >
                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </Button>
            <Card className="overflow-hidden w-full max-w-4xl h-[80vh]">
                <CardContent className="grid p-0 md:grid-cols-2 h-full">
                    <form className="p-6 md:p-8 flex flex-col justify-center h-full">
                        <div className="flex flex-col gap-6">
                            <div className="flex flex-col items-center text-center">
                                <h1 className="text-3xl font-bold">Bem-vindo ao FinFácil</h1>
                                <p className="text-lg text-zinc-500 dark:text-zinc-400">
                                    Controle suas finanças de forma simples.
                                </p>
                            </div>
                            <div className="grid gap-3">
                                <Label htmlFor="email">E-mail</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="Digite seu e-mail"
                                    required
                                    className="h-12 text-lg"
                                />
                            </div>
                            <div className="grid gap-3">
                                <Label htmlFor="password">Senha</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="Digite sua senha"
                                    required
                                    className="h-12 text-lg"
                                />
                            </div>
                            <Button type="submit" className="w-full h-12 text-lg">
                                Entrar
                            </Button>
                            <p className="text-center text-sm text-zinc-500 dark:text-zinc-400">
                                Ainda não tem uma conta?{" "}
                                <a href="/cadastro" className="text-blue-600 font-medium hover:underline">
                                    Criar uma conta
                                </a>
                            </p>
                        </div>
                    </form>
                    <div className="relative hidden md:block bg-zinc-100 dark:bg-zinc-800 w-full h-full">
                        <img
                            src="/placeholder.svg"
                            alt="Gerencie suas finanças com facilidade"
                            className="absolute inset-0 w-full h-full object-cover dark:brightness-[0.2] dark:grayscale"
                        />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}