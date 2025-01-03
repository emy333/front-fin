
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/services/api";

const gastosFixosVariaveis = async (periodo: string, idUser: number) => {
  if (!periodo) return null;
  if (!idUser) return null;

  const { data } = await axiosInstance.get(
    `/saidas/saidasVariaveis/${periodo}/${idUser}`
  );
  if (data.erro) {
    throw new Error("Gastos variáveis não encontrados");
  }
  return data.result;
};

export const useGetGatosVariaveis = (periodo: string, idUser: number) => {
  return useQuery({
    queryKey: ["gastosFixosVariaveis", periodo, idUser],
    queryFn: () => gastosFixosVariaveis(periodo, idUser),
    enabled: !!periodo && !!idUser,
  });
};
