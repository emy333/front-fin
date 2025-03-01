import { useGetCredores } from "@/hooks/useGetCredores";
import { useState, useEffect } from "react";
import EditarCredor from "./EditarCredores";

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
                        <div
                            key={credor.id_credor}
                            className="bg-white dark:bg-gray-800 p-4 shadow rounded-lg cursor-pointer hover:shadow-md transition"
                            onClick={() => handleClickEditar(credor.id_credor)}
                        >
                            <p className="text-lg font-semibold text-gray-900 dark:text-white uppercase">{credor.descricao}</p>
                        </div>
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