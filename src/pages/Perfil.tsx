import MainLayout from "@/layouts/main";
import { useGetPerfil } from "@/hooks/useGetUserById";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import axiosInstance from "@/services/api";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const perfilSchema = z.object({
    nome_completo: z.string().min(1, "Nome completo é obrigatório"),
    email: z.string().email("Email inválido").min(1, "Email é obrigatório"),
    senhaAtual: z.string().optional(),
    novaSenha: z.string().optional(),
}).refine(data => {
    if (data.senhaAtual || data.novaSenha) {
        return data.senhaAtual && data.novaSenha;
    }
    return true;
}, {
    message: "Para alterar a senha, preencha os dois campos.",
    path: ["novaSenha"],
});


type PerfilData = z.infer<typeof perfilSchema>;

export const Perfil = () => {
    const [idUsuario, setIdUsuario] = useState<number | null>(null);

    useEffect(() => {
        const storedId = localStorage.getItem("userId");
        if (storedId) {
            setIdUsuario(Number(storedId));
        }
    }, []);

    const { data: perfilData, isLoading, error } = useGetPerfil(idUsuario ?? 0);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isDirty, isSubmitting },
    } = useForm<PerfilData>({
        resolver: zodResolver(perfilSchema),
        defaultValues: {
            nome_completo: "",
            email: "",
        },
    });

    useEffect(() => {
        if (perfilData) {
            reset({
                nome_completo: perfilData.nome_completo,
                email: perfilData.email,
            });
        }
    }, [perfilData, reset]);

    const atualizarPerfil = async (formData: PerfilData) => {
        const token = localStorage.getItem("token");
        if (!idUsuario || !token) return;

        try {
            const response = await axiosInstance.put(`/usuarios/${idUsuario}`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.data.success) {
                toast.success("Perfil atualizado com sucesso!");
                reset({
                    nome_completo: formData.nome_completo,
                    email: formData.email,
                    senhaAtual: "",
                    novaSenha: "",
                });
            } else {
                toast.error("Erro: " + (response.data.msg || response.data.message || "Erro desconhecido"));
            }
        } catch (error: any) {
            const msgErro = error?.response?.data?.msg || error?.response?.data?.message || error.message || "Erro ao atualizar perfil.";
            console.error("Erro ao atualizar perfil:", msgErro);
            toast.error(msgErro);
        }
    };




    return (
        <MainLayout>
            <div className="mb-10 px-4 md:px-0">
                <h1 className="text-3xl font-bold mb-6">Meu Perfil</h1>

                {isLoading ? (
                    <p className="text-gray-500">Carregando dados...</p>
                ) : error ? (
                    <p className="text-red-500">Erro ao carregar perfil.</p>
                ) : perfilData ? (
                    <form
                        onSubmit={handleSubmit(atualizarPerfil)}
                        className="max-w-xl space-y-6"
                    >
                        <Card className="shadow-sm border border-border bg-card">
                            <CardContent className="space-y-5 py-6">
                                {/* Nome */}
                                <div>
                                    <label className="block text-sm font-medium mb-1">
                                        Nome Completo:
                                    </label>
                                    <Input
                                        type="text"
                                        {...register("nome_completo")}
                                        placeholder="Digite seu nome completo"
                                        className="bg-background text-foreground placeholder:text-muted-foreground"
                                    />
                                    {errors.nome_completo && (
                                        <p className="text-red-500 text-xs mt-1">
                                            {errors.nome_completo.message}
                                        </p>
                                    )}
                                </div>

                                {/* Email */}
                                <div>
                                    <label className="block text-sm font-medium mb-1">
                                        Email:
                                    </label>
                                    <Input
                                        type="email"
                                        {...register("email")}
                                        placeholder="exemplo@email.com"
                                        className="bg-background text-foreground placeholder:text-muted-foreground"
                                    />
                                    {errors.email && (
                                        <p className="text-red-500 text-xs mt-1">
                                            {errors.email.message}
                                        </p>
                                    )}
                                </div>

                                {/* Data de Criação */}
                                <div>
                                    <label className="block text-sm font-medium mb-1">
                                        Data de Criação:
                                    </label>
                                    <Input
                                        type="date"
                                        disabled
                                        value={
                                            perfilData.createdAt &&
                                                !isNaN(new Date(perfilData.createdAt).getTime())
                                                ? new Date(perfilData.createdAt)
                                                    .toISOString()
                                                    .split("T")[0]
                                                : ""
                                        }
                                        className="cursor-not-allowed bg-muted text-muted-foreground"
                                    />
                                </div>
                                {/* Campo: Senha Atual */}
                                <div>
                                    <label className="block text-sm font-medium mb-1">Senha Atual:</label>
                                    <Input
                                        type="password"
                                        {...register("senhaAtual")}
                                        placeholder="Digite sua senha atual"
                                        className="bg-background text-foreground placeholder:text-muted-foreground"
                                    />
                                </div>

                                {/* Campo: Nova Senha */}
                                <div>
                                    <label className="block text-sm font-medium mb-1">Nova Senha:</label>
                                    <Input
                                        type="password"
                                        {...register("novaSenha")}
                                        placeholder="Digite sua nova senha"
                                        className="bg-background text-foreground placeholder:text-muted-foreground"
                                    />
                                    {errors.novaSenha && (
                                        <p className="text-red-500 text-xs mt-1">{errors.novaSenha.message}</p>
                                    )}
                                </div>

                            </CardContent>
                        </Card>

                        {/* Botões de ação */}
                        {isDirty && (
                            <div className="flex justify-end gap-3 pt-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() =>
                                        reset({
                                            nome_completo: perfilData.nome_completo,
                                            email: perfilData.email,
                                            senhaAtual: "",
                                            novaSenha: "",
                                        })
                                    }
                                >
                                    Descartar
                                </Button>

                                <Button
                                    type="submit"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? "Salvando..." : "Salvar Alterações"}
                                </Button>
                            </div>
                        )}
                    </form>
                ) : (
                    <p className="text-sm text-gray-500">Perfil não encontrado.</p>
                )}
            </div>
        </MainLayout>
    );
};
