
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/services/api";

const detalhesSaidas = async (idSaida: number ) => {
    if (!idSaida) return null;

    const { data } = await axiosInstance.get(
        `/saidas/detalhes/${idSaida}`
    );
    if (data.erro) {
        throw new Error("Saida não encontrada");
    }
    return data.result[0];
};

export const useGetDetalhesSaida = (idSaida: number) => {
    return useQuery({
        queryKey: ["detalhesSaidas", idSaida],
        queryFn: () => detalhesSaidas(idSaida),
        enabled: !!idSaida,
    });
};
