
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/services/api";

const detalhesCredores = async (idCredor: number ) => {
    if (!idCredor) return null;

    const { data } = await axiosInstance.get(
        `/credores/detalhes/${idCredor}`
    );
    if (data.erro) {
        throw new Error("Entrada não encontrada");
    }
    return data.result[0];
};

export const useGetDetalhesCredores = (idCredor: number) => {
    return useQuery({
        queryKey: ["detalhesCredores", idCredor],
        queryFn: () => detalhesCredores(idCredor),
        enabled: !!idCredor,
    });
};
