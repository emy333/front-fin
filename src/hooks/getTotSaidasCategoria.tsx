import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/services/api";

const totSaidasCategoria = async (periodo: string, idUser: number) => {
  if (!periodo) return null;
  if (!idUser) return null;

  const { data } = await axiosInstance.get(
    `/saidas/saidasTotCategoria/${periodo}/${idUser}`
  );
  if (data.erro) {
    throw new Error("Saidas não encontradas");
  }
  return data.result;
};

export const useGetTotSaidasCategoria = (periodo: string, idUser: number) => {
  return useQuery({
    queryKey: ["totSaidasCategoria", periodo, idUser],
    queryFn: () => totSaidasCategoria(periodo, idUser),
    enabled: !!periodo && !!idUser,
  });
};
