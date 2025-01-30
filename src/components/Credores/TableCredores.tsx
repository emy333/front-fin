import { formatCurrency } from "@/utils/formatCurrency";
import { useGetCredores } from "@/hooks/useGetCredores";
import { useState, useEffect } from "react";

interface CredoresProps {
    id_credor: number;
    descricao: string;
}

interface dataProps {
    periodo: string;
}

const TableCredores: React.FC<dataProps> = ({ periodo }) => {
    const { data, isLoading, isError } = useGetCredores(4);
    const [localData, setLocalData] = useState<CredoresProps[]>([]);
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



    if (isLoading) return <div>Loading...</div>;
    if (isError) return <div>Error fetching data.</div>;

    return (
        <>
            <div className="overflow-x-auto ">
                <table className="min-w-full table-auto text-sm w-full">
                    <thead>
                        <tr className="bg-gray-100 dark:bg-gray-800">
                            <th className="px-4 py-2 text-left">Descrição</th>            
                        </tr>
                    </thead>
                    <tbody>
                        {localData && localData.length > 0 ? (localData.map((credor: CredoresProps) => (
                            <tr key={credor.id_credor} onDoubleClick={() => handleClickEditar(credor.id_credor)}>
                                <td className="px-4 py-2 text-left">{credor.descricao}</td>
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
                </table>
            </div>
        </>
    )
}
export default TableCredores;