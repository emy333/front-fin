import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import axiosInstance from "@/services/api";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { FiCheckCircle, FiMail, FiLock, FiKey } from "react-icons/fi";
import { PasswordInput } from "@/components/inputPassword";



const emailSchema = z.object({
    email: z.string().email("E-mail inválido"),
});

const codigoSchema = z.object({
    codigo: z.string().length(6, "Digite o código de 6 dígitos"),
});

const senhaSchema = z
    .object({
        novaSenha: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
        confirmarSenha: z.string(),
    })
    .refine((data) => data.novaSenha === data.confirmarSenha, {
        message: "As senhas não coincidem",
        path: ["confirmarSenha"],
    });

type EmailFormData = z.infer<typeof emailSchema>;
type CodigoFormData = z.infer<typeof codigoSchema>;
type SenhaFormData = z.infer<typeof senhaSchema>;

function InputWithIconAndError({
    id,
    label,
    type = "text",
    register,
    error,
    Icon,
}: {
    id: string;
    label: string;
    type?: string;
    register: any;
    error?: string;
    Icon?: React.ElementType;
}) {
    return (
        <div className="relative">
            <Label htmlFor={id} className="mb-2 block font-semibold text-purple">
                {label}
            </Label>
            <div className="relative flex items-center">
                {Icon && <Icon className="absolute left-3 text-gray-400" size={20} />}
                <Input
                    type={type}
                    id={id}
                    {...register(id)}
                    className={Icon ? "pl-10" : ""}
                    autoComplete="off"
                />
            </div>
            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        </div>
    );
}

function StepIndicator({ currentStep }: { currentStep: number }) {
    const steps = [
        { label: "E-mail", icon: FiMail },
        { label: "Código", icon: FiKey },
        { label: "Senha", icon: FiLock },
    ];

    return (
        <div className="flex justify-center space-x-8 mb-8">
            {steps.map(({ label, icon: Icon }, idx) => {
                const stepNumber = idx + 1;
                const active = currentStep === stepNumber;
                const completed = currentStep > stepNumber;

                return (
                    <div
                        key={label}
                        className={`flex flex-col items-center cursor-pointer select-none`}
                    >
                        <div
                            className={`
                rounded-full w-12 h-12 flex items-center justify-center
                ${completed
                                    ? "bg-purple text-white shadow-lg"
                                    : active
                                        ? "bg-blue-500 text-white shadow-md"
                                        : "bg-gray-200 text-gray-500"
                                }
              `}
                        >
                            {completed ? <FiCheckCircle size={28} /> : <Icon size={24} />}
                        </div>
                        <span
                            className={`mt-2 text-sm font-medium ${active ? "text-blue-600" : "text-gray-500"
                                }`}
                        >
                            {label}
                        </span>

                    </div>
                );
            })}
        </div>
    );
}

export default function RedefinirSenha() {
    const navigate = useNavigate();

    const [step, setStep] = useState(1);
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);

    const emailForm = useForm<EmailFormData>({
        resolver: zodResolver(emailSchema),
        mode: "onTouched",
    });
    const codigoForm = useForm<CodigoFormData>({
        resolver: zodResolver(codigoSchema),
        mode: "onTouched",
    });
    const senhaForm = useForm<SenhaFormData>({
        resolver: zodResolver(senhaSchema),
        mode: "onTouched",
    });

    const solicitarCodigo: SubmitHandler<EmailFormData> = async (data) => {
        setLoading(true);
        try {
            await axiosInstance.post("/usuarios/solicitacod", { email: data.email });
            setEmail(data.email);
            setStep(2);
            toast.success("Código enviado para seu e-mail.");
        } catch (error: any) {
            toast.error(error.response?.data?.msg || "Erro ao solicitar código.");
        } finally {
            setLoading(false);
        }
    };

    const verificarCodigo: SubmitHandler<CodigoFormData> = async (data) => {
        setLoading(true);
        try {
            await axiosInstance.post("/usuarios/verificacod", {
                email,
                codigo: data.codigo,
            });
            setStep(3);
            toast.success("Código validado.");
        } catch (error: any) {
            toast.error(error.response?.data?.msg || "Erro ao verificar código.");
        } finally {
            setLoading(false);
        }
    };

    const redefinirSenha: SubmitHandler<SenhaFormData> = async (data) => {
        setLoading(true);
        try {
            await axiosInstance.post("/usuarios/redefinirsenha", {
                email,
                codigo: codigoForm.getValues("codigo"),
                novaSenha: data.novaSenha,
            });
            toast.success("Senha redefinida com sucesso, agora faça login novamente.");
            navigate("/auth");
        } catch (error: any) {
            toast.error(error.response?.data?.msg || "Erro ao redefinir senha.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-r from-blue-50 to-indigo-50 flex flex-col items-center justify-center p-4">
            <Card className="w-full max-w-md shadow-lg rounded-lg overflow-hidden">
                <CardContent className="px-8 py-10">
                    <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
                        Redefinir Senha
                    </h1>

                    <StepIndicator currentStep={step} />

                    {step === 1 && (
                        <form
                            onSubmit={emailForm.handleSubmit(solicitarCodigo)}
                            className="space-y-6"
                            noValidate
                        >
                            <InputWithIconAndError
                                id="email"
                                label="E-mail"
                                type="email"
                                register={emailForm.register}
                                error={emailForm.formState.errors.email?.message?.toString()}
                                Icon={FiMail}
                            />
                            <Button
                                type="submit"
                                className="w-full"
                                disabled={loading}
                                variant="default"
                            >
                                {loading ? "Enviando código..." : "Enviar Código"}
                            </Button>
                        </form>
                    )}

                    {step === 2 && (
                        <form
                            onSubmit={codigoForm.handleSubmit(verificarCodigo)}
                            className="space-y-6"
                            noValidate
                        >
                            <InputWithIconAndError
                                id="codigo"
                                label="Código de 6 dígitos"
                                register={codigoForm.register}
                                error={codigoForm.formState.errors.codigo?.message?.toString()}
                                Icon={FiKey}
                            />

                            <div className="flex flex-col gap-3">
                                <Button
                                    type="submit"
                                    disabled={loading}
                                >
                                    {loading ? "Verificando..." : "Verificar Código"}
                                </Button>


                            </div>
                        </form>
                    )}

                    {step === 3 && (
                        <form
                            onSubmit={senhaForm.handleSubmit(redefinirSenha)}
                            className="space-y-6"
                            noValidate
                        >
                            <PasswordInput
                                id="novaSenha"
                                label="Nova Senha"
                                register={senhaForm.register}
                                error={senhaForm.formState.errors.novaSenha?.message}
                            />
                            <PasswordInput
                                id="confirmarSenha"
                                label="Confirmar Senha"
                                register={senhaForm.register}
                                error={senhaForm.formState.errors.confirmarSenha?.message}
                            />
                           
                            <div className="flex justify-between items-center">
                                <Button
                                    type="submit"
                                    disabled={loading}
                                    className="flex-grow w-full"
                                    variant="default"
                                >
                                    {loading ? "Redefinindo..." : "Redefinir Senha"}
                                </Button>

                            </div>
                        </form>
                    )}

                    <p className="mt-8 text-center text-sm text-gray-500">
                        Já tem conta?{" "}
                        <button
                            onClick={() => navigate("/auth")}
                            className="text-purple font-semibold hover:underline"
                            type="button"
                        >
                            Faça login
                        </button>
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
