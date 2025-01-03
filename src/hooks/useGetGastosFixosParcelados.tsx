
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/services/api";

const gastosFixosParcelados = async (periodo: string, idUser: number) => {
  if (!periodo) return null;
  if (!idUser) return null;

  const { data } = await axiosInstance.get(
    `/saidas/saidasFixas/${periodo}/${idUser}`
  );
  if (data.erro) {
    throw new Error("Gastos não encontrados");
  }
  return data.result;
};

export const useGetGatosFixosParcelados = (periodo: string, idUser: number) => {
  return useQuery({
    queryKey: ["gastosFixosParcelados", periodo, idUser],
    queryFn: () => gastosFixosParcelados(periodo, idUser),
    enabled: !!periodo && !!idUser,
  });
};
