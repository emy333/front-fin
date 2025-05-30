import React, { useState } from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useGetCredores } from "@/hooks/useGetCredores";
import "react-datepicker/dist/react-datepicker.css";
import { format, parseISO } from "date-fns"
import axiosInstance from "@/services/api";
import { tiposPagamento, categoria } from "@/constants";
import { ScrollArea } from "../ui/scroll-area";
import { toast } from "sonner";
import { useGetGatosFixosParcelados } from "@/hooks/useGetGastosFixosParcelados";
import { useGetGatosVariaveis } from "@/hooks/useGetGastosVariaveis";

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
        credores: z.string().optional(),
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
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-[50%]">
                <DialogHeader>
                    <h1 className="font-bold text-lg">Adicionar Saída</h1>
                </DialogHeader>
                <ScrollArea className="max-h-[70vh] p-2">

                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 ">
                            <div className="flex flex-col md:flex-col xl:flex-row gap-4">
                                <FormField
                                    control={form.control}
                                    name="descricao"
                                    render={({ field }) => (
                                        <FormItem className="flex-1">
                                            <FormLabel>Descrição *</FormLabel>
                                            <FormControl>
                                                <Input className="border-stone-700 " placeholder="" {...field} />
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
                                                <Select
                                                    value={field.value}
                                                    onValueChange={field.onChange}
                                                >
                                                    <SelectTrigger className=" border-stone-700 ">
                                                        <SelectValue placeholder="Selecione o tipo de pagamento" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <ScrollArea className="h-[20vh] p-2">
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

                            <div className="flex flex-col md:flex-col xl:flex-row gap-4">
                                <FormField
                                    control={form.control}
                                    name="credores"
                                    render={({ field }) => (
                                        <FormItem className="flex-1">
                                            <FormLabel>Credor</FormLabel>
                                            <FormControl>
                                                <Select
                                                    value={field.value ? String(field.value) : "Selecionar Credor"}
                                                    onValueChange={field.onChange}
                                                >
                                                    <SelectTrigger className=" border-stone-700 ">
                                                        <SelectValue>
                                                            {credores.find((credor: any) => String(credor.id_credor) === field.value)?.descricao || "Selecione o credor"}
                                                        </SelectValue>
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <ScrollArea className="h-20 p-2">                                                            {credores.length > 0 ? (
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
                                                    className=" border-stone-700 "
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

                            <div className="flex flex-col md:flex-col xl:flex-row gap-4">
                                <FormField
                                    control={form.control}
                                    name="data_vencimento"
                                    render={({ field }) => (
                                        <FormItem className="flex-1 space-y-2">
                                            <FormLabel>Data da Movimentação/Vencimento *</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="date"
                                                    {...field}
                                                    className="p-3 border border-stone-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 transition duration-300 ease-in-out dark:text-white"
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
                                        <FormItem className="flex-1 space-y-2">
                                            <FormLabel>Categoria</FormLabel>
                                            <FormControl>
                                                <Select value={field.value} onValueChange={field.onChange}>
                                                    <SelectTrigger className="p-3 border border-stone-700">
                                                        <SelectValue placeholder="Selecione a Categoria" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <ScrollArea className="h-[20vh] p-2">
                                                            {categoria.map((categoria) => (
                                                                <SelectItem className="uppercase" key={categoria.value} value={categoria.value}>
                                                                    {categoria.descricao}
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

                            <div className="flex flex-col md:flex-col xl:flex-row gap-4">
                                <FormField
                                    control={form.control}
                                    name="parcela_atual"
                                    render={({ field }) => (
                                        <FormItem className="flex-1">
                                            <FormLabel>Parcela Atual</FormLabel>
                                            <FormControl>
                                                <Input
                                                    className=" border-stone-700 "
                                                    type="number"
                                                    value={field.value ?? ''}
                                                    onChange={(e) => {
                                                        const parsedValue = parseInt(e.target.value, 10);
                                                        field.onChange(isNaN(parsedValue) ? undefined : parsedValue);
                                                    }}
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
                                            <FormLabel>Total de Parcela</FormLabel>
                                            <FormControl>
                                                <Input
                                                    className=" border-stone-700 "
                                                    type="number"
                                                    value={field.value ?? ''}
                                                    onChange={(e) => {
                                                        const parsedValue = parseInt(e.target.value, 10);
                                                        field.onChange(isNaN(parsedValue) ? undefined : parsedValue);
                                                    }}
                                                    onBlur={field.onBlur}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="flex flex-col md:flex-col xl:flex-row gap-4">
                                <FormField
                                    control={form.control}
                                    name="gasto_fixo"
                                    render={({ field }) => (
                                        <FormItem className="flex-1">
                                            <FormLabel>Gasto recorrente?</FormLabel>
                                            <FormControl>
                                                <Select
                                                    {...field}
                                                    value={field.value !== undefined ? String(field.value) : ""}
                                                    onValueChange={(value) => field.onChange(value === "true")}
                                                >
                                                    <SelectTrigger className="w-full border-stone-700">
                                                        <SelectValue placeholder="Selecione se é Gasto Fixo" />
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
                                        <FormItem className="flex-1" >
                                            <div className="flex items-center">
                                                <FormControl>
                                                    <Checkbox
                                                        checked={field.value}
                                                        onCheckedChange={field.onChange}
                                                    />
                                                </FormControl>
                                                <FormLabel className="pl-2">Já foi pago?</FormLabel>
                                            </div>

                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <DialogFooter>
                                <Button
                                    type="submit"
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <>
                                            <svg
                                                aria-hidden="true"
                                                className="w-5 h-5 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                                                viewBox="0 0 100 101"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                                                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                                            </svg>
                                            Salvando ...
                                        </>
                                    ) : (
                                        <>
                                            Salvar
                                        </>
                                    )}

                                </Button>
                            </DialogFooter>
                        </form>
                    </Form>
                </ScrollArea>
            </DialogContent>
        </Dialog>

    );
};

export default AdicionarSaida;
