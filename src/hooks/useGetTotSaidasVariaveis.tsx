
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/services/api";

const gastosTotVariaveis = async (periodo: string, idUser: number) => {
  if (!periodo) return null;
  if (!idUser) return null;

  const { data } = await axiosInstance.get(
    `/finance/despesasVariaveis/total/${periodo}/${idUser}`
  );
  if (data.erro) {
    throw new Error("Gastos variáveis não encontrados");
  }
  return data.totalSaidasVariaveis;
};
 
export const useGetTotGastosVariaveis = (periodo: string, idUser: number) => {
  return useQuery({
    queryKey: ["gastosTotVariaveis", periodo, idUser],
    queryFn: () => gastosTotVariaveis(periodo, idUser),
    enabled: !!periodo && !!idUser,
  });
};
