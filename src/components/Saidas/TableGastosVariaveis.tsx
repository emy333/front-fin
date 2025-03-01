import { useGetGatosVariaveis } from "@/hooks/useGetGastosVariaveis";
import { formatCurrency } from "@/utils/formatCurrency";
import { Checkbox } from "@/components/ui/checkbox";
import { useUpdateStatusSaida } from "@/hooks/usePutStatusSaida";
import { useEffect, useState } from "react";
import EditarSaida from "./EditarSaida";

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

    const totalValue =
        localData?.reduce((acc: number, gasto: GastosVariaveis) => {
            const valor = parseFloat(gasto.valor.toString());
            return acc + valor;
        }, 0) || 0;

    const handleDetalhesSaida = (id: number) => {
        setIdClicked(id);
        setModalEditSaida(true);
    }
    

    return (
        <>
            <div className="overflow-x-auto">
                <table className="min-w-full table-auto text-sm">
                    <thead>
                        <tr className="bg-gray-100 dark:bg-gray-800">
                            <th className="text-center">Pago?</th>
                            <th className="px-4 py-2 text-left">Descrição</th>
                            <th className="px-4 py-2 text-left">Credor</th>
                            <th className="px-4 py-2 text-left">Tipo de Pagamento</th>
                            <th className="px-4 py-2 text-left">Valor</th>
                        </tr>
                    </thead> 
                    <tbody>
                        {localData && localData.length > 0 ? (
                            localData.map((gasto: GastosVariaveis) => (
                                <tr
                                    key={gasto.id}
                                    onDoubleClick={() => handleDetalhesSaida(gasto.id)}
                                    className={`${gasto.pago ? "bg-green-200 dark:bg-green-700" : ""
                                        } transition duration-300`}
                                >
                                    <td className="text-center">
                                        <Checkbox
                                            checked={gasto.pago}
                                            onClick={() => handleCheckboxChange(gasto.id, gasto.pago)}

                                        />
                                    </td>
                                    <td className="px-4 py-2">{gasto.descricao.toLocaleUpperCase()}</td>
                                    <td className="px-4 py-2">{gasto.credor_descricao.toLocaleUpperCase()}</td>
                                    <td className="px-4 py-2">{gasto.tipo_pagamento.toLocaleUpperCase()}</td>
                                    <td className="px-4 py-2">{formatCurrency(gasto.valor)}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={5} className="text-center px-4 py-2">
                                    Nenhum registro encontrado.
                                </td>
                            </tr>
                        )}
                    </tbody>
                    <tfoot>
                        <tr className="bg-gray-100 dark:bg-gray-800">
                            <td colSpan={4} className="text-right px-4 py-2 font-semibold">Total</td>
                            <td className="px-4 py-2 font-semibold">{formatCurrency(totalValue)}</td>
                        </tr>
                    </tfoot>
                </table>
            </div>

            {modalEditSaida && (
                <EditarSaida
                    open={modalEditSaida}
                    setOpen={() => setModalEditSaida(false)}
                    idSaida={idClicked}
                />
            )}

        </>


    );
};

export default TableGastosVariaveis;
