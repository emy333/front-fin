import axiosInstance from "@/services/api";
import { CircleAlert } from 'lucide-react';
import { toast } from "sonner";
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
                toast.success("Sucesso ao excluir a saída!");
                refetch();
                refetchTotGastosFixosParcelados();
                refetchTotGastosVariados();
                setOpen(false);
            }
        } catch (e) {
            toast.error("Ocorreu um erro ao excluir a saída!");
        }
    };

    // Fechar modal ao clicar fora do conteúdo
    const handleBackgroundClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            setOpen(false);
        }
    };

    if (!open) return null;

    return (
        <div
            id="popup-modal"
            tabIndex={-1}
            className="fixed inset-0 z-50 flex justify-center items-center overflow-y-auto overflow-x-hidden bg-black bg-opacity-40"
            onClick={handleBackgroundClick}
        >
            <div className="relative p-4 w-full max-w-md max-h-full">
                <div className="relative bg-white rounded-lg shadow-sm dark:bg-gray-700">
                    <button
                        type="button"
                        className="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                        onClick={() => setOpen(false)}
                        aria-label="Close modal"
                    >
                        <svg
                            className="w-3 h-3"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 14 14"
                        >
                            <path
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                            />
                        </svg>
                    </button>
                    <div className="p-4 md:p-5 text-center">
                        <CircleAlert className="mx-auto mb-4 text-gray-400 w-12 h-12 dark:text-gray-200" />
                        <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                            Tem certeza que deseja excluir a saída?
                        </h3>
                        <div className="flex justify-center gap-3">
                            <button
                                type="button"
                                className="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center"
                                onClick={handleDelete}
                            >
                                Excluir
                            </button>
                            <button
                                type="button"
                                className="py-2.5 px-5 text-sm font-medium text-gray-900 bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:outline-none focus:ring-4 focus:ring-gray-100 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                                onClick={() => setOpen(false)}
                            >
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
