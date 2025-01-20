import { useMutation } from "@tanstack/react-query";
import axiosInstance from "@/services/api";
import { format } from "date-fns"; // Certifique-se de importar corretamente

const putSaida = async (id_saida: number, dados: any) => {
    if (!id_saida) return null;
    console.log(dados)
    

    const { data } = await axiosInstance.put(`/saidas/${id_saida}`, {
        dados,
    });

    return data.saidas;
};

export const useUpdateSaida = () => {
    return useMutation({
        mutationFn: (params: { id_saida: number, dados: any }) =>
            putSaida(params.id_saida, params.dados),
    });
};