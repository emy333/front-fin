
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/services/api";


export interface User {
    id: number;
    nome_completo: string;
    email: string;
    createdAt: string;
}

const perfil = async (idUser: number) => {
    if (!idUser) return null;
    const token = localStorage.getItem("token");

    try {
        const { data } = await axiosInstance.get(`/usuarios/${idUser}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        return data.result;
    } catch (error: any) {
        throw new Error(error.response?.data?.msg || "Erro ao buscar o usuário");
    }
};


export const useGetPerfil = (idUser: number) => {
    return useQuery({
        queryKey: ["detalhesUsuario", idUser],
        queryFn: () => perfil(idUser),
        enabled: !!idUser,
    });
};
