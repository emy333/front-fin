import { useGetCredores } from "@/hooks/useGetCredores";
import { useState, useEffect } from "react";
import EditarCredor from "./EditarCredores";
import { Card, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { DeleteCredor } from "./modalDelete";

interface CredoresProps {
    id_credor: number;
    descricao: string;
}

const CardsCredores: React.FC = () => {
    const id_usuario = localStorage.getItem('userId');

    const { data, isLoading, isError, refetch } = useGetCredores(Number(id_usuario));
    const [localData, setLocalData] = useState<CredoresProps[]>([]);
    const [idClicked, setIdClicked] = useState<number | null>(null);
    const [modalEditCredor, setModalEditCredor] = useState(false);
    const [modalDeleteCredor, setModalDeleteCredor] = useState(false);

    useEffect(() => {
        if (data) {
            setLocalData(data);
        }
    }, [data]);

    const handleClickEditar = (id: number) => {
        setIdClicked(id);
        setModalEditCredor(true);
    };

    const handleClickDeletar = (id: number) => {
        setIdClicked(id);
        setModalDeleteCredor(true);
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
                                    className="uppercase text-md font-bold font-notoGondi text-purple  break-words whitespace-normal block"
                                    title={credor.descricao}
                                >
                                    {credor.descricao.length > 15
                                        ? `${credor.descricao.substring(0, 15)}...`
                                        : credor.descricao}
                                </CardTitle>

                                <div className="flex gap-2">


                                    <Button
                                        className="w-9 h-9 flex items-center justify-center rounded-lg  "
                                        onClick={() => handleClickEditar(credor.id_credor)}
                                    >
                                        <Pencil size={18} />
                                    </Button>

                                    <Button
                                        className="w-9 h-9 flex items-center justify-center rounded-lg transition bg-red-800 text-white hover:bg-red-800 hover:dark:bg-red-500 dark:bg-red-600 dark:text-white"
                                        onClick={() => handleClickDeletar(credor.id_credor)}
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
                    refetch={refetch}
                />
            )}
            {modalDeleteCredor && idClicked !== null && (
                <DeleteCredor
                    open={modalDeleteCredor}
                    setOpen={() => setModalDeleteCredor(false)}
                    idClicked={idClicked}
                    refetch={refetch}
                />
            )}


        </>
    );
};

export default CardsCredores;