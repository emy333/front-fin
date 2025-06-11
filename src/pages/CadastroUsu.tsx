import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Eye, EyeOff } from "lucide-react";
import axiosInstance from "@/services/api";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const registerSchema = z.object({
  name: z.string().min(1, "Digite seu nome completo"),
  email: z.string().email("E-mail inválido"),
  password: z.string().min(6, "A senha deve ter no mínimo 6 caracteres"),
});

export function Cadastro({ className, ...props }: React.ComponentProps<"div">) {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);


  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.post("/usuarios", {
        nome_completo: data.name,
        email: data.email,
        senha: data.password,
      });

      if (response.status === 201) {
        toast.success("Cadastro realizado com sucesso! Agora é só fazer login!");
        navigate("/auth");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Erro ao realizar o cadastro.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6 min-h-screen justify-center items-center p-4", className)} {...props}>

      <Card className="overflow-hidden w-full max-w-lg md:max-w-4xl shadow-lg">
        <CardContent className="grid p-0 md:grid-cols-2 h-full">
          {/* Formulário */}
          <form onSubmit={handleSubmit(onSubmit)} className="p-4 md:p-8 flex flex-col justify-center w-full">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl md:text-3xl font-bold">Bem-vindo ao FinFácil</h1>
                <p className="text-md md:text-lg text-zinc-500 dark:text-zinc-400">
                  Controle suas finanças de forma simples.
                </p>
              </div>

              {/* Nome Completo */}
              <div className="grid gap-3">
                <Label htmlFor="name">Nome Completo</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Digite seu nome completo"
                  {...register("name")}
                  className="w-full h-12 text-lg"
                />
                {errors.name?.message && <p className="text-red-500 text-sm">{String(errors.name.message)}</p>}
              </div>

              {/* E-mail */}
              <div className="grid gap-3">
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Digite um e-mail"
                  {...register("email")}
                  className="w-full h-12 text-lg"
                />
                {errors.email?.message && <p className="text-red-500 text-sm">{String(errors.email.message)}</p>}
              </div>

              {/* Senha */}
              <div className="grid gap-3 relative">
                <Label htmlFor="password">Senha</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Digite uma senha"
                    {...register("password")}
                    className="w-full h-12 text-lg pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-zinc-500 dark:text-zinc-400"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.password?.message && <p className="text-red-500 text-sm">{String(errors.password.message)}</p>}
              </div>

              {/* Botão de Cadastro */}
              <Button type="submit" className="w-full h-12 text-lg" disabled={isLoading}>
                {isLoading ? "Cadastrando..." : "Cadastrar"}
              </Button>

              <p className="text-center text-sm text-zinc-500 dark:text-zinc-400">
                Já possui cadastro?{" "}
                <a href="/auth" className="text-blue-600 font-medium hover:underline">
                  Entrar
                </a>
              </p>
            </div>
          </form>

          {/* Imagem - Oculta em telas pequenas */}
          <div className="hidden md:flex items-center justify-center bg-purple-100 dark:bg-purple-950 w-full">
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
