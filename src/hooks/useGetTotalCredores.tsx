import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/services/api";

const totCredores = async (periodo: string, idUser: number) => {
  if (!periodo) return null;
  if (!idUser) return null;

  const { data } = await axiosInstance.get(
    `/saidas/totalPorCredores/${periodo}/${idUser}`
  );
  if (data.erro) {
    throw new Error("Credores não encontrados");
  }
  return data.result;
};

export const useGetTotCredores = (periodo: string, idUser: number) => {
  return useQuery({
    queryKey: ["totCredores", periodo, idUser],
    queryFn: () => totCredores(periodo, idUser),
    enabled: !!periodo && !!idUser,
  });
};
