
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/services/api";

const entradas = async (periodo: string, idUser: number) => {
    if (!periodo) return null;
    if (!idUser) return null;

    const { data } = await axiosInstance.get(
        `/entradas/${periodo}/${idUser}`
    );
    if (data.erro) {
        throw new Error("Entradas não encontradas");
    }
    return data.result;
};

export const useGetEntradas = (periodo: string, idUser: number) => {
    return useQuery({
        queryKey: ["entradas", periodo, idUser],
        queryFn: () => entradas(periodo, idUser),
        enabled: !!periodo && !!idUser,
    });
};
