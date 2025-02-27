import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/services/api";

const getCredores = async (idUser: number) => {
    if (!idUser) return null;

    const { data } = await axiosInstance.get(
        `/credores/credoresUsu/${idUser}`
    );
    if (data.erro) {
        throw new Error("Credores não encontrados");
    }
    return data.result;
};

export const useGetCredores = (idUser: number) => {
    return useQuery({
        queryKey: ["getCredores", idUser],
        queryFn: () => getCredores(idUser),
        enabled: !!idUser,
    });
};
