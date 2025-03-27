import { Dialog, DialogContent, DialogFooter, DialogHeader } from "../ui/dialog";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useGetDetalhesEntradas } from "@/hooks/entradas/useGetDetalhesEntradas";
import { useEffect, useState } from "react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "../ui/calendar";
import { ptBR } from "date-fns/locale";
import { format, parse } from "date-fns"
import axiosInstance from "@/services/api";
import { toast } from "sonner";
import { formatarData } from "@/utils/formatDateInput";

interface EditaEntradaProps {
    open: boolean;
    setOpen: (value: boolean) => void;
    idEntrada: number;
    refetch: () => void;
}

const EditarEntrada: React.FC<EditaEntradaProps> = ({ open, setOpen, idEntrada, refetch }) => {
    const [loading, setLoading] = useState(false);
    const id_usuario = localStorage.getItem('userId');

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
        data_referente: z.string().nullable().optional(),
    });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
    });
    const { data: entrada } = useGetDetalhesEntradas(idEntrada);


    useEffect(() => {
        if (entrada) {
            form.setValue("descricao", entrada.descricao);
            form.setValue("valor", entrada.valor);
            form.setValue("data_referente", formatarData(entrada.data_referente));
        }
    }, [entrada]);


    const deleteEntrada = async () => {
        try {
            const response = await axiosInstance.delete(`/entradas/${idEntrada}`);
            if (response.status === 200) {
                toast.success("Sucesso ao excluir a entrada!")
                setOpen(false);
                refetch();
            }
        } catch (e) {
            toast.error("Ocorreu um erro ao excluir a entrada!")
        }
    }

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        setLoading(true);
        const dados = {
            id_usuario: id_usuario,
            data_referente: values.data_referente,
            descricao: values.descricao,
            valor: values.valor,
        };

        try {
            const response = await axiosInstance.put(`/entradas/${idEntrada}`, dados);
            if (response.status === 200) {
                toast.success("Entrada atualizada com sucesso!");
                setOpen(false);
                refetch();
            }
        } catch (error) {
            console.error("Erro ao atualizar:", error);
            toast.error("Erro ao atualizar entrada");
        } finally {
            setLoading(false);
        }
    }


    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-[50%]">
                <DialogHeader>
                    <h1 className="font-bold text-lg">Visualizar Entrada</h1>
                </DialogHeader>

                <Form {...form}>
                    <form className="space-y-3" onSubmit={form.handleSubmit(onSubmit)}>
                        <div className="flex gap-2 mt-2">
                            <FormField
                                control={form.control}
                                name="descricao"
                                render={({ field }) => (
                                    <FormItem className="flex-1">
                                        <FormLabel>Descrição *</FormLabel>
                                        <FormControl>
                                            <Input placeholder="" {...field}
                                                className=" justify-start text-left font-normal border border-stone-700 rounded-lg"

                                                onChange={(e) => field.onChange(e.target.value)}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="flex gap-2 mt-2">

                            <FormField
                                control={form.control}
                                name="data_referente"
                                render={({ field }) => (
                                    <FormItem className="space-y-2 flex flex-col flex-1">
                                        <FormLabel className="mb-1">Data *</FormLabel>
                                        <FormControl>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <Button
                                                        variant="outline"
                                                        className=" justify-start text-left font-normal border border-stone-700 rounded-lg"
                                                    >
                                                        <CalendarIcon className="mr-2" />
                                                        {field.value ? field.value : <span>Data</span>}
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-0">
                                                    <Calendar
                                                        mode="single"
                                                        selected={field.value ? parse(field.value, "dd/MM/yyyy", new Date()) : undefined}
                                                        onSelect={(selectedDate) => {
                                                            if (selectedDate) {
                                                                const formattedDate = format(selectedDate, "dd/MM/yyyy");
                                                                field.onChange(formattedDate);
                                                            }
                                                        }}
                                                        locale={ptBR}
                                                        initialFocus
                                                    />
                                                </PopoverContent>
                                            </Popover>
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
                                        <FormLabel className="mb-1">Valor</FormLabel>
                                        <FormControl>
                                            <Input
                                                className=" justify-start text-left font-normal border border-stone-700 rounded-lg"

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

                        <DialogFooter>
                            <Button
                                type="button"
                                variant="destructive"
                                onClick={deleteEntrada}
                            >
                                Excluir
                            </Button>
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
                                        Alterando ...
                                    </>
                                ) : (
                                    <>
                                        Alterar
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

export default EditarEntrada; 