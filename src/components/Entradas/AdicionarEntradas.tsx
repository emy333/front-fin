import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Dialog, DialogContent, DialogFooter } from "../ui/dialog";
import { DialogHeader } from "../ui/dialog";
import { useState } from "react";
import { z } from "zod";
import { Input } from "../ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "../ui/button";
import axiosInstance from "@/services/api";
import { useGetEntradas } from "@/hooks/entradas/useGetEntradas";
import { toast } from "sonner";
import { format, parseISO } from "date-fns";

interface AddEntradaProps {
    open: boolean;
    setOpen: (value: boolean) => void;
    periodo: string;
}

const AdicionarEntradas: React.FC<AddEntradaProps> = ({ open, setOpen, periodo }) => {
    const [loading, setLoading] = useState(false);
    const id_usuario = localStorage.getItem('userId');
    const { refetch } = useGetEntradas(periodo, Number(id_usuario))

    const formSchema = z.object({
        descricao: z.string().min(1, { message: "Informe a descrição" }),
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

        data_referente: z.string().nonempty("A data é obrigatória."),

    });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            descricao: "",
            valor: undefined,
            data_referente: "",
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {

        if (values.data_referente) {
            const dataISO = parseISO(values.data_referente);
            values.data_referente = format(dataISO, "yyyy-MM-dd");
        }

        const data = {
            id_usuario: id_usuario,
            data_referente: values.data_referente,
            descricao: values.descricao,
            valor: values.valor,
        }

        setLoading(true);
        try {
            const response = await axiosInstance.post("/entradas", data);
            if (response.status === 201) {
                toast.success("Sucesso ao adicionar a entrada!")
                setOpen(false);
                refetch();
                form.reset();
            }

        } catch (e) {
            toast.error("Ocorreu um erro ao adicionar a entrada!")
        } finally {
            setLoading(false);
            refetch();
        }

    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-[50%]">
                <DialogHeader>
                    <h1 className="font-bold text-lg">Adicionar Entrada</h1>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
                        <div className="flex gap-2 mt-2">
                            <FormField
                                control={form.control}
                                name="descricao"
                                render={({ field }) => (
                                    <FormItem className="flex-1">
                                        <FormLabel>Descrição *</FormLabel>
                                        <FormControl>
                                            <Input placeholder="" {...field}
                                                className="justify-start text-left font-normal border border-stone-700 rounded-lg"

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
                                name="data_referente"
                                render={({ field }) => (
                                    <FormItem className="space-y-2 flex flex-col flex-1">
                                        <FormLabel className="mb-1">Data *</FormLabel>
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
                                name="valor"
                                render={({ field }) => (
                                    <FormItem className="space-y-2 flex flex-col flex-1">
                                        <FormLabel className="mb-1">Valor *</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                placeholder="Informe o valor"
                                                className="justify-start text-left font-normal border border-stone-700 rounded-lg"
                                                {...field}
                                            />
                                        </FormControl>
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
                                            className="w-5 h-5 text-gray-200 animate-spin fill-blue-600"
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
            </DialogContent>
        </Dialog>
    )
}

export default AdicionarEntradas;