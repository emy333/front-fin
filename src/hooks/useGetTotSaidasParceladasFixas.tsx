
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/services/api";

const gastosTotFixosParc = async (periodo: string, idUser: number) => {
  if (!periodo) return null;
  if (!idUser) return null;

  const { data } = await axiosInstance.get(
    `/finance/despesasFixasParcelas/total/${periodo}/${idUser}`
  );
  if (data.erro) {
    throw new Error("Gastos Fixos/parcelados não encontrados");
  }
  return data.totalSaidasParceladasFixas;
};
 
export const useGetTotFixosParcelados = (periodo: string, idUser: number) => {
  return useQuery({
    queryKey: ["gastosTotFixosParc", periodo, idUser],
    queryFn: () => gastosTotFixosParc(periodo, idUser),
    enabled: !!periodo && !!idUser,
  });
};
