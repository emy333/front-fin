import { formatCurrency } from "@/utils/formatCurrency";
import { useGetEntradas } from "@/hooks/entradas/useGetEntradas";
import { useState, useEffect } from "react";
import EditarEntrada from "./EditarEntrada";

interface EntradasProps {
    id: number;
    descricao: string;
    data_referente: string;
    valor: number;
}

interface dataProps {
    periodo: string;
}

const TableEntradas: React.FC<dataProps> = ({ periodo }) => {
    const { data, isLoading, isError } = useGetEntradas(periodo, 4);
    const [localData, setLocalData] = useState<EntradasProps[]>([]);
    const [idClicked, setIdClicked] = useState(0);
    const [modalEditEntrada, setModalEditEntrada] = useState(false);

    const handleClickEditar = (id: number) => {
        setIdClicked(id);
        setModalEditEntrada(true);
    };

    useEffect(() => {
        if (data) {
            setLocalData(data);
            console.log(localData);
        }
    }, [data]);


    const totalValue =
        localData?.reduce((acc: number, gasto: EntradasProps) => {
            const valor = parseFloat(gasto.valor.toString());
            return acc + valor;
        }, 0) || 0;

    if (isLoading) return <div>Loading...</div>;
    if (isError) return <div>Error fetching data.</div>;

    return (
        <>
            <div className="overflow-x-auto ">
                <table className="min-w-full table-auto text-sm w-full">
                    <thead>
                        <tr className="bg-gray-100 dark:bg-gray-800">
                            <th className="px-4 py-2 text-left">Descrição</th>
                            <th className="px-4 py-2 text-left">Data</th>
                            <th className="px-4 py-2 text-left">Valor</th>
                        </tr>
                    </thead>
                    <tbody>
                        {localData && localData.length > 0 ? (localData.map((entradas: EntradasProps) => (
                            <tr key={entradas.id} onDoubleClick={() => handleClickEditar(entradas.id)}>
                                <td className="px-4 py-2 text-left">{entradas.descricao}</td>
                                <td className="px-4 py-2 text-left">
                                    {new Date(entradas.data_referente).toLocaleDateString("pt-BR")}
                                </td>
                                <td className="px-4 py-2 text-left">{formatCurrency(entradas.valor)}</td>
                            </tr>
                        ))
                        ) : (
                            <tr>
                                <td colSpan={6} className="text-center px-4 py-2">
                                    Nenhum registro encontrado.
                                </td>
                            </tr>
                        )}

                    </tbody>
                    <tfoot>
                        <tr className="bg-gray-100 dark:bg-gray-800">
                            <td colSpan={2} className="text-left px-4 py-2 font-semibold">Total</td>
                            <td className="px-4 py-2 font-semibold">{formatCurrency(totalValue)}</td>
                        </tr>
                    </tfoot>
                </table>
            </div>

            {modalEditEntrada && (
                <EditarEntrada
                    open={modalEditEntrada}
                    setOpen={() => setModalEditEntrada(false)}
                    idEntrada={idClicked}
                />
            )}
        </>
    )
}
export default TableEntradas;