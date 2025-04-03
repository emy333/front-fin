import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/services/api";

const totSaidasAno = async (periodo: string, idUser: number) => {
  if (!periodo) return null;
  if (!idUser) return null;

  const { data } = await axiosInstance.get(
    `/saidas/totSaidasAno/${periodo}/${idUser}`
  );
  if (data.erro) {
    throw new Error("Saidas não encontradas");
  }
  return data.result;
};

export const useGetTotSaidasAno = (periodo: string, idUser: number) => {
  return useQuery({
    queryKey: ["totSaidasAno", periodo, idUser],
    queryFn: () => totSaidasAno(periodo, idUser),
    enabled: !!periodo && !!idUser,
  });
};
