
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/services/api";

const credores = async (idUser: number) => {
    if (!idUser) return null;

    const { data } = await axiosInstance.get(
        `/credores/${idUser}`
    );
    if (data.erro) {
        throw new Error("Credores não encontrados");
    }
    return data.result;
};

export const useGetCredores = (idUser: number) => {
    return useQuery({
        queryKey: ["credores", idUser],
        queryFn: () => credores(idUser),
        enabled: !!idUser,
    });
};
