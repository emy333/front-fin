import React from "react";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useGetCredores } from "@/hooks/useGetCredores";
import { format } from 'date-fns';
import { CalendarDays } from 'lucide-react';
import { ptBR } from "date-fns/locale";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface AddSaidaProps {
    open: boolean;
    setOpen: (value: boolean) => void;
}

const AdicionarSaida: React.FC<AddSaidaProps> = ({ open, setOpen }) => {
    const tiposPagamento = [
        { value: "CRÉDITO", descricao: "Crédito" },
        { value: "DÉBITO", descricao: "Débito" },
        { value: "PIX", descricao: "PIX" },
        { value: "PRAZO", descricao: "A prazo" },
        { value: "OUTROS", descricao: "Outros" },
    ];
    const categoria = [
        { value: "COMIDA", descricao: "Comida" },
        { value: "LAZER", descricao: "Lazer" },
        { value: "COSMÉTICOS", descricao: "Cosméticos" },
        { value: "VESTUÁRIO", descricao: "Vestuário" },
        { value: "OUTROS", descricao: "Outros" },
    ];

    const { data: credores = [] } = useGetCredores(4);


    const formSchema = z.object({
        descricao: z.string().min(1, { message: "Informe a descrição" }),
        tipo_pagamento: z.string().min(1, { message: "Selecione um tipo de pagamento" }),
        categoria: z.string().optional(),
        credores: z.preprocess((val) => (val === undefined ? "" : val), z.string().min(1, { message: "Selecione um credor" })),
        pago: z.boolean(),
        gasto_fixo: z.boolean(),
        valor: z.preprocess((val) => {
            if (val === null || val === '' || val === 0 || val === undefined) {
                return undefined;
            }
            if (typeof val === 'string') {
                const parsedValue = parseFloat(val.replace(/[^\d.-]/g, ''));
                return isNaN(parsedValue) ? undefined : parsedValue;
            }
            return val;
        }, z.number()
            .min(0.01, { message: "O valor deve ser maior que 0" })
        ),
        parcela_atual: z.number().nullable().optional(),
        tot_parcela: z.number().nullable().optional(),
        data_vencimento: z.string().min(1, { message: "Informe a data de vencimento" }),


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
        },
    });

    function onSubmit(values: z.infer<typeof formSchema>) {
        if (values.data_vencimento) {
            const formattedDate = format(new Date(values.data_vencimento), 'dd/MM/yyyy');
            values.data_vencimento = formattedDate;
        }
        console.log(values);
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-[50%]">
                <DialogHeader>
                    <h1 className="font-bold text-lg">Adicionar Saída</h1>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
                        <div className="flex flex-col sm:flex-row gap-4">
                            <FormField
                                control={form.control}
                                name="descricao"
                                render={({ field }) => (
                                    <FormItem className="flex-1">
                                        <FormLabel>Descrição</FormLabel>
                                        <FormControl>
                                            <Input placeholder="" {...field} />
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
                                        <FormLabel>Tipo de Pagamento</FormLabel>
                                        <FormControl>
                                            <Select
                                                value={field.value}
                                                onValueChange={field.onChange}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Selecione o tipo de pagamento" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {tiposPagamento.map((tipo) => (
                                                        <SelectItem
                                                            key={tipo.value}
                                                            value={tipo.value}
                                                        >
                                                            {tipo.descricao}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4">
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
                                                <SelectTrigger>
                                                    <SelectValue>
                                                        {credores.find((credor: any) => String(credor.id_credor) === field.value)?.descricao || "Selecione o credor"}
                                                    </SelectValue>
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {credores.map((credor: any) => (
                                                        <SelectItem key={String(credor.id_credor)} value={String(credor.id_credor)}>
                                                            {credor.descricao}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
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
                                            <Select
                                                value={field.value}
                                                onValueChange={field.onChange}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Selecione a Categoria" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {categoria.map((categoria) => (
                                                        <SelectItem
                                                            key={categoria.value}
                                                            value={categoria.value}
                                                        >
                                                            {categoria.descricao}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <FormField
                                control={form.control}
                                name="valor"
                                render={({ field }) => (
                                    <FormItem className="flex-1">
                                        <FormLabel>Valor</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                placeholder="Informe o valor"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="gasto_fixo"
                                render={({ field }) => (
                                    <FormItem className="flex-1">
                                        <FormLabel>Gasto Fixo?</FormLabel>
                                        <FormControl>
                                            <Select {...field} value={field.value ? "true" : "false"}>
                                                <SelectTrigger>
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
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <FormField
                                control={form.control}
                                name="parcela_atual"
                                render={({ field }) => (
                                    <FormItem className="flex-1">
                                        <FormLabel>Parcela Atual</FormLabel>
                                        <FormControl>
                                            <Input
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

                        <div className="flex flex-col sm:flex-row gap-4">
                            <FormField
                                control={form.control}
                                name="pago"
                                render={({ field }) => (
                                    <FormItem className="text-center">
                                        <FormControl>
                                            <Checkbox
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                            />
                                        </FormControl>
                                        <FormLabel className="pl-2">Selecione se o gasto já foi pago</FormLabel>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>


                        <DialogFooter>
                            <Button type="submit">Salvar</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};

export default AdicionarSaida;
