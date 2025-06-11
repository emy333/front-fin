import { formatCurrency } from "@/utils/formatCurrency";
import { useGetEntradas } from "@/hooks/entradas/useGetEntradas";
import { useState, useEffect } from "react";
import EditarEntrada from "./EditarEntrada";
import { Loading } from "@/loading";
import {
    Card,
    CardDescription,
    CardTitle,
} from "@/components/ui/card"
import { Button } from "../ui/button";
import { Pencil, Trash2 } from 'lucide-react';
import { DeleteEntrada } from "./modalDelete";

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
    const [modalDeleteEntrada, setModalDeleteEntrada] = useState(false);

    const handleClickEditar = (id: number) => {
        setIdClicked(id);
        setModalEditEntrada(true);
    };

    const handleClickDeletar = (id: number) => {
        setIdClicked(id);
        setModalDeleteEntrada(true);
    };

    useEffect(() => {
        if (data) {
            setLocalData(data);
        }
    }, [data]);

    if (isLoading) return (
        <div className="flex items-center justify-center h-screen  text-center">
            <Loading w={80} h={80} />
        </div>
    )
    if (isError) return <div>Error fetching data.</div>;

    return (
        <>
            <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 ">
                {localData.length > 0 ? (
                    localData.map((entradas: EntradasProps) => (
                        <Card
                            key={entradas.id}
                            className=" p-4 shadow-lg rounded-lg cursor-pointer hover:shadow-xl transition-all duration-300 border "
                        >
                            <div className="flex flex-col">
                                <CardTitle className="uppercase font-semibold font-serifs" >
                                    {entradas.descricao}
                                </CardTitle>

                                <CardDescription className=" mt-1 text-xl font-bold flex items-center justify-between">
                                    <span className="text-purple font-bold text-xl">
                                        {formatCurrency(entradas.valor)}
                                    </span>
                                </CardDescription>

                                <div className="flex justify-end gap-1 mt-1">
                                    <Button
                                        className="w-9 h-9 flex items-center justify-center rounded-lg  "
                                        onClick={() => handleClickEditar(entradas.id)}
                                    >
                                        <Pencil size={18} />
                                    </Button>

                                    <Button
                                        className="w-9 h-9 flex items-center justify-center rounded-lg transition bg-red-800 text-white hover:bg-red-800 hover:dark:bg-red-500 dark:bg-red-600 dark:text-white"
                                        onClick={() => handleClickDeletar(entradas.id)}
                                    >
                                        <Trash2 size={18} />
                                    </Button>
                                </div>
                            </div>
                        </Card>

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

            {modalDeleteEntrada && (
                <DeleteEntrada
                    open={modalDeleteEntrada}
                    setOpen={() => setModalDeleteEntrada(false)}
                    idClicked={idClicked}
                    refetch={refetch}

                />
            )}

        </>
    )
}
export default TableEntradas;