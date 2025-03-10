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
    const id_usuario = localStorage.getItem('userId');

    const { data, isLoading, isError, refetch } = useGetEntradas(periodo, Number(id_usuario));
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


  

    if (isLoading) return <div>Loading...</div>;
    if (isError) return <div>Error fetching data.</div>;

    return (
        <>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 ">
                {localData.length > 0 ? (
                    localData.map((entradas: EntradasProps) => (
                        <div
                            key={entradas.id}
                            className="bg-white dark:bg-gray-800 p-4 shadow rounded-lg cursor-pointer hover:shadow-md transition"
                            onClick={() => handleClickEditar(entradas.id)}
                        >
                            <p className="text-lg font-semibold text-gray-900 dark:text-white uppercase">{entradas.descricao}</p>
                            <p className="text-lg font-medium text-gray-900 dark:text-white uppercase">{formatCurrency(entradas.valor)}</p>

                        </div>
                    ))
                ) : (
                    <div className="col-span-full text-center text-gray-500">Nenhum registro encontrado.</div>
                )}
            </div>

            {modalEditEntrada && ( 
                <EditarEntrada
                    open={modalEditEntrada}
                    setOpen={() => setModalEditEntrada(false)}
                    idEntrada={idClicked}
                    refetch={refetch}
                />
            )}
        </>
    )
}
export default TableEntradas;