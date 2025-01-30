
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/services/api";

const detalhesEntradas = async (idEntrada: number ) => {
    if (!idEntrada) return null;

    const { data } = await axiosInstance.get(
        `/entradas/detalhes/${idEntrada}`
    );
    if (data.erro) {
        throw new Error("Entrada não encontrada");
    }
    return data.result[0];
};

export const useGetDetalhesEntradas = (idEntrada: number) => {
    return useQuery({
        queryKey: ["detalhesEntradas", idEntrada],
        queryFn: () => detalhesEntradas(idEntrada),
        enabled: !!idEntrada,
    });
};
