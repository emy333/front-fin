import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import axiosInstance from "@/services/api";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

const loginSchema = z.object({
    email: z.string().email("E-mail inválido"),
    password: z.string().min(1, "Digite sua senha"),
});

export function Login({ className, ...props }: React.ComponentProps<"div">) {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);

    const [loginError, setLoginError] = useState("");

    const [isLoading, setIsLoading] = useState(false);



    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data: any) => {
        setLoginError("");
        setIsLoading(true);
        try {
            const response = await axiosInstance.post("/auth", {
                email: data.email,
                senha: data.password,
            });

            if (response.status === 200) {
                const { token, id_usuario, nome } = response.data;

                localStorage.setItem("token", token);
                localStorage.setItem("userId", id_usuario);
                localStorage.setItem("userName", nome);

                navigate("/");
            }
        } catch (error: any) {
            if (error.response) {
                setLoginError(error.response.data.msg || "Erro ao fazer login.");
                toast.error(`Falha na operação: ${loginError}`)
            } else {
                setLoginError("Erro ao conectar-se ao servidor.");
                toast.error(`Falha na operação: ${loginError}`)

            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={cn("flex flex-col gap-6 min-h-screen justify-center items-center p-4", className)} {...props}>

            <Card className="overflow-hidden w-full max-w-4xl min-h-[80vh] shadow-lg">
                <CardContent className="grid p-0 md:grid-cols-2 h-full">
                    <form onSubmit={handleSubmit(onSubmit)} className="p-6 md:p-8 flex flex-col justify-center h-full">
                        <div className="flex flex-col gap-6">
                            <div className="flex flex-col items-center text-center">
                                <h1 className="text-3xl font-bold">Bem-vindo ao FinFácil</h1>
                                <p className="text-lg text-zinc-500 ">
                                    Controle suas finanças de forma simples.
                                </p>
                            </div>
                            <div className="grid gap-3">
                                <Label htmlFor="email">E-mail</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="Digite seu e-mail"
                                    {...register("email")}
                                    className="h-12 text-lg"
                                />
                                {errors.email?.message && <p className="text-red-500 text-sm">{String(errors.email.message)}</p>}
                            </div>
                            <div className="grid gap-3 relative">
                                <Label htmlFor="password">Senha</Label>
                                <div className="relative">
                                    <Input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Digite uma senha"
                                        {...register("password")}
                                        className="h-12 text-lg pr-10"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-zinc-500 "
                                    >
                                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                                {errors.password?.message && <p className="text-red-500 text-sm">{String(errors.password.message)}</p>}
                                <div className="text-sm">Esqueceu a senha? <a href="/redefinir-senha" className="font-semibold text-blue-600 hover:underline">Clique aqui</a></div>
                            </div>
                            {loginError && <p className="text-red-500 text-sm">{loginError}</p>}

                            <Button
                                type="submit"
                                className="w-full h-12 text-lg"
                                disabled={isLoading}
                            >
                                {isLoading ? 'Carregando...' : 'Entrar'}
                            </Button>
                            <p className="text-center text-sm text-zinc-500 ">
                                Ainda não tem uma conta?{" "}
                                <a href="/cadastro" className="text-blue-600 font-medium hover:underline">
                                    Criar uma conta
                                </a>
                            </p>
                        </div>
                    </form>
                    <div className="relative hidden md:flex items-center justify-center shadow-sm  bg-gray-100 w-full min-h-[80vh]">
                        <img
                            src="/animacao.svg"
                            alt="Gerencie suas finanças com facilidade"
                            className="w-auto h-auto max-w-full max-h-full"
                        />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
