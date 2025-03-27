import { useGetCredores } from "@/hooks/useGetCredores";
import { useState, useEffect } from "react";
import EditarCredor from "./EditarCredores";
import { Card, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Pencil, Trash2 } from "lucide-react";

interface CredoresProps {
    id_credor: number;
    descricao: string;
}

const CardsCredores: React.FC = () => {
    const id_usuario = localStorage.getItem('userId');

    const { data, isLoading, isError } = useGetCredores(Number(id_usuario));
    const [localData, setLocalData] = useState<CredoresProps[]>([]);
    const [idClicked, setIdClicked] = useState<number | null>(null);
    const [modalEditCredor, setModalEditCredor] = useState(false);

    useEffect(() => {
        if (data) {
            setLocalData(data);
        }
    }, [data]);

    const handleClickEditar = (id: number) => {
        setIdClicked(id);
        setModalEditCredor(true);
    };

    if (isLoading) return <div>Loading...</div>;
    if (isError) return <div>Error fetching data.</div>;

    return (
        <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 ">
                {localData.length > 0 ? (
                    localData.map((credor) => (

                        <Card
                            key={credor.id_credor}
                            className="p-4 shadow-lg rounded-xl cursor-pointer hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700"
                        >
                            <div className="flex items-center justify-between">
                                <CardTitle
                                    className="uppercase text-lg font-semibold text-gray-800 dark:text-white break-words whitespace-normal block"
                                    title={credor.descricao}
                                >
                                    {credor.descricao.length > 15
                                        ? `${credor.descricao.substring(0, 15)}...`
                                        : credor.descricao}
                                </CardTitle>

                                <div className="flex gap-2">
                                    <Button
                                        className="w-9 h-9 flex items-center justify-center rounded-lg transition border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
                                        variant="secondary"
                                        onClick={() => handleClickEditar(credor.id_credor)}
                                    >
                                        <Pencil size={18} />
                                    </Button>

                                    <Button
                                        className="w-9 h-9 flex items-center justify-center rounded-lg transition bg-red-600 text-white hover:bg-red-500 dark:bg-red-800 dark:text-white"
                                        onClick={() => handleClickEditar(credor.id_credor)}
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
            {modalEditCredor && idClicked !== null && (
                <EditarCredor
                    open={modalEditCredor}
                    setOpen={() => setModalEditCredor(false)}
                    idCredor={idClicked}
                />
            )}
        </>
    );
};

export default CardsCredores;