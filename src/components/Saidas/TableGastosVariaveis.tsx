import { useGetGatosVariaveis } from "@/hooks/useGetGastosVariaveis";
import { formatCurrency } from "@/utils/formatCurrency";
import { Checkbox } from "@/components/ui/checkbox";
import { useUpdateStatusSaida } from "@/hooks/usePutStatusSaida";
import { useEffect, useState } from "react";
import EditarSaida from "./EditarSaida";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Ellipsis, FilePenLine } from "lucide-react";

interface GastosVariaveis {
    id: number;
    descricao: string;
    credor_descricao: string;
    pago: boolean;
    tipo_pagamento: string;
    categoria: string;
    total_parcela: string;
    parcela_atual: string;
    data_vencimento: string;
    valor: number;
}

interface dataProps {
    periodo: string;
}

const TableGastosVariaveis: React.FC<dataProps> = ({ periodo }) => {
    const id_usuario = localStorage.getItem('userId');

    const { data, isLoading, isError } = useGetGatosVariaveis(periodo, Number(id_usuario));
    const [localData, setLocalData] = useState<GastosVariaveis[]>([]);
    const updateStatus = useUpdateStatusSaida();
    const [modalEditSaida, setModalEditSaida] = useState(false);
    const [idClicked, setIdClicked] = useState(0);

    useEffect(() => {
        if (data) {
            setLocalData(data);
        }
    }, [data]);

    const handleCheckboxChange = async (id: number, currentPago: boolean) => {
        const updatedPago = !currentPago;

        try {
            await updateStatus.mutateAsync({ id_saida: id, pago: updatedPago });
            setLocalData((prev) =>
                prev.map((gasto) =>
                    gasto.id === id ? { ...gasto, pago: updatedPago } : gasto
                )
            );

        } catch (error) {
            console.error("Erro ao atualizar status:", error);
        }
    };


    if (isLoading) return <div>Loading...</div>;
    if (isError) return <div>Error fetching data.</div>;

    // const totalValue =
    //     localData?.reduce((acc: number, gasto: GastosVariaveis) => {
    //         const valor = parseFloat(gasto.valor.toString());
    //         return acc + valor;
    //     }, 0) || 0;

    const handleDetalhesSaida = (id: number) => {
        setIdClicked(id);
        setModalEditSaida(true);
    }


    return (
        <div className="shadow-md rounded-lg">
            <table className="min-w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
                <thead>
                    <tr className="bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                        <th className="p-3 text-center">Pago?</th>
                        <th className="p-3 text-left">Descrição</th>
                        <th className="p-3 text-left">Credor</th>
                        <th className="p-3 text-left whitespace-nowrap overflow-hidden text-ellipsis max-w-[100px]">
                            Tip. Pagamento
                        </th>
                        <th className="p-3 text-left">Valor</th>
                        <th className="p-3 text-center"></th>
                    </tr>
                </thead> 

                <tbody className="">
                    {localData && localData.length > 0 ? (
                        localData.map((gasto: GastosVariaveis) => (

                            <tr
                                key={gasto.id}
                                onDoubleClick={() => handleDetalhesSaida(gasto.id)}
                                className={`border-b border-gray-200 dark:border-gray-700 ${gasto.pago ? "bg-green-100 dark:bg-green-700" : ""}`}
                            >
                                <td className="p-3 text-center">
                                    <Checkbox
                                        checked={gasto.pago}
                                        onClick={() => handleCheckboxChange(gasto.id, gasto.pago)}

                                    />
                                </td>
                                <td className="p-3 uppercase text-[13px]">{gasto.descricao.toLocaleUpperCase()}</td>
                                <td className="p-3 uppercase text-[13px]">{gasto.credor_descricao.toLocaleUpperCase()}</td>
                                <td className="p-3 uppercase text-[13px]">{gasto.tipo_pagamento.toLocaleUpperCase()}</td>
                                <td className="p-3 uppercase text-[13px]">{formatCurrency(gasto.valor)}</td>
                                <td className="p-3 text-[13px] pl-1 flex justify-end text-center">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <span className="bg-transparent cursor-auto"> <Ellipsis /></span>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent className="">
                                            <DropdownMenuItem>
                                                <FilePenLine />
                                                <span>Editar</span>
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={6} className="text-center p-5 text-gray-500 dark:text-gray-400">Nenhum registro encontrado.</td>
                        </tr>
                    )}
                </tbody>
             
            </table>

            {modalEditSaida && (
                <EditarSaida
                    open={modalEditSaida}
                    setOpen={() => setModalEditSaida(false)}
                    idSaida={idClicked}
                />
            )}
        </div>




    );
};

export default TableGastosVariaveis;
