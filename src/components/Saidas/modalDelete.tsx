import axiosInstance from "@/services/api";
import { CircleAlert } from 'lucide-react';
import { toast } from "sonner"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "../ui/alert-dialog";
import { useGetTotGastosVariaveis } from "@/hooks/useGetTotSaidasVariaveis";
import { useGetTotFixosParcelados } from "@/hooks/useGetTotSaidasParceladasFixas";


interface Props {
    open: boolean;
    setOpen: (open: boolean) => void;
    idClicked: number | null;
    refetch: () => void;
    periodo: string;
}

export const DeleteSaida: React.FC<Props> = ({ open, setOpen, idClicked, refetch, periodo }) => {
    const id_usuario = localStorage.getItem('userId');

    const { refetch: refetchTotGastosFixosParcelados } = useGetTotGastosVariaveis(periodo, Number(id_usuario));
    const { refetch: refetchTotGastosVariados } = useGetTotFixosParcelados(periodo, Number(id_usuario));


    const handleDelete = async () => {
        try {
            const response = await axiosInstance.delete(`/saidas/${idClicked}`);
            if (response.status === 200) {
                toast.success("Sucesso ao excluir a saída!")
                refetch();
                refetchTotGastosFixosParcelados();
                refetchTotGastosVariados();
            }
        } catch (e) {
            toast.error("Ocorreu um erro ao excluir a saída!")
        }
    };

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogContent className="max-w-md p-6 rounded-lg shadow-lg bg-white">
                <AlertDialogHeader className="flex flex-col items-center">
                    <CircleAlert className="w-12 h-12 text-red-600" />
                    <AlertDialogTitle className="text-lg font-semibold text-gray-800 dark:text-white mt-4">Tem certeza que deseja excluir a saída?<br />
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-sm text-gray-600 dark:text-gray-300 text-center">
                        Essa ação não pode ser desfeita e removerá permanentemente os dados do sistema.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="flex justify-center space-x-4 mt-4">
                    <AlertDialogCancel className="px-4 py-2 h-10 bg-gray-200 text-gray-700 dark:text-white rounded-md hover:bg-gray-300" onClick={() => setOpen(false)}>
                        Cancelar
                    </AlertDialogCancel>
                    <AlertDialogAction className="px-4 py-2 h-10 bg-red-600 text-white rounded-md hover:bg-red-700" onClick={handleDelete}>
                        Excluir
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};
