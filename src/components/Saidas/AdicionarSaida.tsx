import React, { useState } from "react";
import { DialogFooter, DialogHeader } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useGetCredores } from "@/hooks/useGetCredores";
import "react-datepicker/dist/react-datepicker.css";
import { format, parseISO } from "date-fns"
import axiosInstance from "@/services/api";
import { tiposPagamento, categoria } from "@/constants";
import { ScrollArea } from "../ui/scroll-area";
import { toast } from "sonner";
import { useGetGatosFixosParcelados } from "@/hooks/useGetGastosFixosParcelados";
import { useGetGatosVariaveis } from "@/hooks/useGetGastosVariaveis";
import { Sheet, SheetContent } from "../ui/sheet";

interface AddSaidaProps {
    open: boolean;
    setOpen: (value: boolean) => void;
    refetchTotVariados: () => void;
    refetchTotParcelados: () => void;
    periodo: string;
}

const AdicionarSaida: React.FC<AddSaidaProps> = ({ open, setOpen, refetchTotVariados, refetchTotParcelados, periodo }) => {

    const id_usuario = localStorage.getItem('userId');

    const { data: credores = [] } = useGetCredores(Number(id_usuario));
    const { refetch: refetchGastosFixosParcelados } = useGetGatosFixosParcelados(periodo, Number(id_usuario));
    const { refetch: refetchGastosVariados } = useGetGatosVariaveis(periodo, Number(id_usuario));


    const [loading, setLoading] = useState(false);

    const formSchema = z.object({
        descricao: z.string().min(1, { message: "Informe a descrição" }),
        tipo_pagamento: z.string().min(1, { message: "Selecione um tipo de pagamento" }),
        categoria: z.string().optional(),
        credores: z.string().nullable().optional(),
        pago: z.boolean(),
        gasto_fixo: z.boolean(),
        valor: z.preprocess(
            (val) => {
                if (val === null || val === "" || val === 0 || val === undefined) {
                    return undefined;
                }
                if (typeof val === "string") {
                    const parsedValue = parseFloat(val.replace(/[^\d.-]/g, ""));
                    return isNaN(parsedValue) ? undefined : parsedValue;
                }
                return val;
            },
            z.number().min(0.01, { message: "O valor deve ser maior que 0" })
        ),
        parcela_atual: z.preprocess(val => val === "" ? null : val, z.number().nullable().optional()),
        tot_parcela: z.preprocess(val => val === "" ? null : val, z.number().nullable().optional()),

        data_vencimento: z.string().nonempty("A data de vencimento é obrigatória."),
    }).refine(data => {
        const { parcela_atual, tot_parcela } = data;
        return (parcela_atual === null && tot_parcela === null) || (parcela_atual !== null && tot_parcela !== null);
    }, {
        message: "Se 'parcela_atual' for preenchido, 'tot_parcela' também deve ser, e vice-versa.",
        path: ["parcela_atual", "tot_parcela"],
    });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            descricao: "",
            tipo_pagamento: "",
            categoria: "OUTROS",
            credores: undefined,
            pago: false,
            gasto_fixo: false,
            valor: undefined,
            parcela_atual: null,
            tot_parcela: null,
            data_vencimento: "",
        },
    });



    async function onSubmit(values: z.infer<typeof formSchema>) {
        if (values.data_vencimento) {
            const dataISO = parseISO(values.data_vencimento);
            values.data_vencimento = format(dataISO, "yyyy-MM-dd");
        }


        const data = {
            id_usuario: String(id_usuario),
            data_vencimento: values.data_vencimento,
            pago: values.pago,
            descricao: values.descricao,
            id_credor: values.credores,
            tipo_pagamento: values.tipo_pagamento,
            categoria: values.categoria,
            total_parcela: values.tot_parcela,
            parcela_atual: values.parcela_atual,
            valor: values.valor,
            gasto_fixo: values.gasto_fixo,
        }

        setLoading(true);
        try {
            const response = await axiosInstance.post("/saidas", data);
            if (response.status === 201) {
                toast.success("Sucesso ao adicionar a saída!")
                setOpen(false);
                form.reset();
                refetchTotVariados();
                refetchTotParcelados();
                refetchGastosFixosParcelados();
                refetchGastosVariados();

            }

        } catch (e) {
            toast.error("Ocorreu um erro ao adicionar a saída!")
        } finally {
            setLoading(false);
        }

    }

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetContent className="w-full sm:min-w-[40%] max-w-screen-sm max-h-screen flex flex-col">
                <DialogHeader>
                    <h1 className="text-xl font-bold">Adicionar Saída</h1>
                </DialogHeader>

                <ScrollArea className="flex-1 overflow-y-auto w-full rounded-md p-3 mt-2 mb-2">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 p-1">
                            <div className="flex flex-col xl:flex-row gap-4">
                                <FormField
                                    control={form.control}
                                    name="descricao"
                                    render={({ field }) => (
                                        <FormItem className="flex-1">
                                            <FormLabel>Descrição *</FormLabel>
                                            <FormControl>
                                                <Input className="border-stone-700" placeholder="Digite a descrição" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="tipo_pagamento"
                                    render={({ field }) => (
                                        <FormItem className="flex-1">
                                            <FormLabel>Tipo de Pagamento *</FormLabel>
                                            <FormControl>
                                                <Select value={field.value} onValueChange={field.onChange}>
                                                    <SelectTrigger className="border-stone-700">
                                                        <SelectValue placeholder="Selecione o tipo" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <ScrollArea className="h-[20vh]">
                                                            {tiposPagamento.map((tipo) => (
                                                                <SelectItem key={tipo.value} value={tipo.value} className="uppercase">
                                                                    {tipo.descricao}
                                                                </SelectItem>
                                                            ))}
                                                        </ScrollArea>
                                                    </SelectContent>
                                                </Select>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {/* Credor e Valor */}
                            <div className="flex flex-col xl:flex-row gap-4">
                                <FormField
                                    control={form.control}
                                    name="credores"
                                    render={({ field }) => (
                                        <FormItem className="flex-1">
                                            <FormLabel>Credor</FormLabel>
                                            <FormControl>
                                                <Select
                                                    value={field.value ? String(field.value) : ""}
                                                    onValueChange={(value) => field.onChange(value === "null" ? null : value)}
                                                >
                                                    <SelectTrigger className="border-stone-700">
                                                        <SelectValue placeholder="Selecionar credor" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <ScrollArea className="h-28">
                                                            <SelectItem key="null" value="null">Limpar seleção</SelectItem>
                                                            {credores.length > 0 ? (
                                                                credores.map((credor: any) => (
                                                                    <SelectItem
                                                                        key={String(credor.id_credor)}
                                                                        value={String(credor.id_credor)}
                                                                        className="uppercase"
                                                                    >
                                                                        {credor.descricao}
                                                                    </SelectItem>
                                                                ))
                                                            ) : (
                                                                <p className="text-center">Nenhum credor encontrado</p>
                                                            )}
                                                        </ScrollArea>
                                                    </SelectContent>
                                                </Select>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="valor"
                                    render={({ field }) => (
                                        <FormItem className="flex-1">
                                            <FormLabel>Valor Total *</FormLabel>
                                            <FormControl>
                                                <Input
                                                    className="border-stone-700"
                                                    type="number"
                                                    placeholder="Informe o valor"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {/* Data e Categoria */}
                            <div className="flex flex-col xl:flex-row gap-4">
                                <FormField
                                    control={form.control}
                                    name="data_vencimento"
                                    render={({ field }) => (
                                        <FormItem className="flex-1">
                                            <FormLabel>Data da Mov/Vencimento *</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="date"
                                                    {...field}
                                                    className="border-stone-700 p-3 rounded-lg shadow-sm"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="categoria"
                                    render={({ field }) => (
                                        <FormItem className="flex-1">
                                            <FormLabel>Categoria</FormLabel>
                                            <FormControl>
                                                <Select value={field.value} onValueChange={field.onChange}>
                                                    <SelectTrigger className="border-stone-700 p-3">
                                                        <SelectValue placeholder="Selecione a Categoria" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <ScrollArea className="h-[20vh]">
                                                            {categoria.map((cat) => (
                                                                <SelectItem key={cat.value} value={cat.value} className="uppercase">
                                                                    {cat.descricao}
                                                                </SelectItem>
                                                            ))}
                                                        </ScrollArea>
                                                    </SelectContent>
                                                </Select>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {/* Parcelas */}
                            <div className="flex flex-col xl:flex-row gap-4">
                                <FormField
                                    control={form.control}
                                    name="parcela_atual"
                                    render={({ field }) => (
                                        <FormItem className="flex-1">
                                            <FormLabel>Parcela Atual</FormLabel>
                                            <FormControl>
                                                <Input
                                                    className="border-stone-700"
                                                    type="number"
                                                    value={field.value ?? ''}
                                                    onChange={(e) =>
                                                        field.onChange(isNaN(parseInt(e.target.value)) ? undefined : parseInt(e.target.value))
                                                    }
                                                    onBlur={field.onBlur}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="tot_parcela"
                                    render={({ field }) => (
                                        <FormItem className="flex-1">
                                            <FormLabel>Total de Parcelas</FormLabel>
                                            <FormControl>
                                                <Input
                                                    className="border-stone-700"
                                                    type="number"
                                                    value={field.value ?? ''}
                                                    onChange={(e) =>
                                                        field.onChange(isNaN(parseInt(e.target.value)) ? undefined : parseInt(e.target.value))
                                                    }
                                                    onBlur={field.onBlur}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {/* Gasto fixo e Pago */}
                            <div className="flex flex-col xl:flex-row gap-4">
                                <FormField
                                    control={form.control}
                                    name="gasto_fixo"
                                    render={({ field }) => (
                                        <FormItem className="flex-1">
                                            <FormLabel>Gasto recorrente?</FormLabel>
                                            <FormControl>
                                                <Select
                                                    value={field.value !== undefined ? String(field.value) : ""}
                                                    onValueChange={(value) => field.onChange(value === "true")}
                                                >
                                                    <SelectTrigger className="border-stone-700">
                                                        <SelectValue placeholder="Selecione" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="true">Sim</SelectItem>
                                                        <SelectItem value="false">Não</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="pago"
                                    render={({ field }) => (
                                        <FormItem className="flex-1">
                                            <FormLabel>Já foi pago?</FormLabel>
                                            <FormControl>
                                                <Select
                                                    value={field.value !== undefined ? String(field.value) : ""}
                                                    onValueChange={(value) => field.onChange(value === "true")}
                                                >
                                                    <SelectTrigger className="border-stone-700">
                                                        <SelectValue placeholder="Selecione" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="true">Sim</SelectItem>
                                                        <SelectItem value="false">Não</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {/* Botão de envio */}
                            <DialogFooter>
                                <Button type="submit" disabled={loading} className="w-full mt-4">
                                    {loading ? (
                                        <div className="flex items-center justify-center gap-2">
                                            <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-blue-600" />
                                            Processando...
                                        </div>
                                    ) : (
                                        "Salvar Saída"
                                    )}
                                </Button>
                            </DialogFooter>
                        </form>
                    </Form>
                </ScrollArea>
            </SheetContent>
        </Sheet>


    );
};

export default AdicionarSaida;
