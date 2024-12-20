import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
} from "@/components/ui/dialog"

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

interface AddSaidaProps {
    open: boolean;
    setOpen: (value: boolean) => void;
}

const AdicionarSaida: React.FC<AddSaidaProps> = ({ open, setOpen }) => {

    const tiposPagamento = [
        {value: "C", descricao: "Crédito"},
        {value: "D", descricao: "Débito"},
        {value: "PIX", descricao: "PIX"},
        {value: "PRAZO", descricao: "A prazo"},
        {value: "OUTROS", descricao: "Outros"},
    ]


    const formSchema = z.object({
        descricao: z.string().min(1, {
            message: "Informe a descrição",
        }),
        tipo_pagamento: z.string().min(1, {
            message: "Selecione um tipo de pagamento",
        }),
    })

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            descricao: "",
            tipo_pagamento: "",
        },
    })

    function onSubmit(values: z.infer<typeof formSchema>) {
        console.log(values)
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-[50%]">
                <DialogHeader>
                    <h1 className="font-bold text-lg">Adicionar Saída</h1>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

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
                                            <Select>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Selecione o tipo de pagamento" />
                                                </SelectTrigger>
                                                <SelectContent  {...field}>
                                                    {tiposPagamento.map((tipo) => (
                                                        <SelectItem key={tipo.value} value={tipo.value}>
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



                        <DialogFooter>
                            <Button type="submit">Salvar</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}

export default AdicionarSaida;
