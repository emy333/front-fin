import { useMutation } from "@tanstack/react-query";
import axiosInstance from "@/services/api";

const putStatusSaida = async (id_saida: number, pago: boolean) => {
    if (!id_saida) return null;

    const { data } = await axiosInstance.put(`/saidas/editaStatus/${id_saida}`, {
        pago,
    });
 
    return data;
};

export const useUpdateStatusSaida = () => {
    return useMutation({
        mutationFn: (params: { id_saida: number, pago: boolean }) =>
            putStatusSaida(params.id_saida, params.pago),
    });
};
