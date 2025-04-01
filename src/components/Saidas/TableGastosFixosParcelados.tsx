import { useGetGatosFixosParcelados } from "@/hooks/useGetGastosFixosParcelados";
import { formatCurrency } from "@/utils/formatCurrency";
import { Checkbox } from "@/components/ui/checkbox";
import { useUpdateStatusSaida } from "@/hooks/usePutStatusSaida";
import { useState, useEffect } from "react";
import EditarSaida from "./EditarSaida";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Ellipsis, FilePenLine } from "lucide-react";

interface GastosFixosParcelados {
  id: number;
  descricao: string;
  credor_descricao: string;
  pago: boolean;
  tipo_pagamento: string;
  categoria: string;
  total_parcela: string;
  parcela_atual: string;
  data_vencimento: string;
  valor: number;
}

interface DataProps {
  periodo: string;
}

const TableGastosFixosParcelados: React.FC<DataProps> = ({ periodo }) => {
  const id_usuario = localStorage.getItem("userId");
  const { data, isLoading, isError } = useGetGatosFixosParcelados(periodo, Number(id_usuario));
  const [localData, setLocalData] = useState<GastosFixosParcelados[]>([]);
  const updateStatus = useUpdateStatusSaida();
  const [modalEditSaida, setModalEditSaida] = useState(false);
  const [idClicked, setIdClicked] = useState(0);

  useEffect(() => {
    if (data) setLocalData(data);
  }, [data]);

  const handleCheckboxChange = async (id: number, currentPago: boolean) => {
    try {
      await updateStatus.mutateAsync({ id_saida: id, pago: !currentPago });
      setLocalData(prev => prev.map(gasto => gasto.id === id ? { ...gasto, pago: !currentPago } : gasto));
    } catch (error) {
      console.error("Erro ao atualizar status:", error);
    }
  };

  if (isLoading) return <div className="text-center py-4">Carregando...</div>;
  if (isError) return <div className="text-center py-4 text-red-500">Erro ao buscar dados.</div>;

  return (
    <div className="shadow-md rounded-lg">
      <table className="min-w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
        <thead>
          <tr className="bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
            <th className="p-3 text-center">Pago?</th>
            <th className="p-3 text-left">Descrição</th>
            <th className="p-3 text-left">Credor</th>
            <th className="p-3 text-left whitespace-nowrap overflow-hidden text-ellipsis max-w-[100px]">
              Tip. Pagamento
            </th>
            <th className="p-3 text-left">Parcelas</th>
            <th className="p-3 text-left">Valor</th>
            <th className="p-3 text-center"></th>
          </tr>
        </thead>
        <tbody>
          {localData.length > 0 ? (
            localData.map((gasto) => (
              <tr
                key={gasto.id}
                onDoubleClick={() => { setIdClicked(gasto.id); setModalEditSaida(true); }}
                className={`border-b border-gray-200 dark:border-gray-700 ${gasto.pago ? "bg-green-200 dark:bg-green-600" : ""}`}
              >
                <td className="p-3 text-center">
                  <Checkbox checked={gasto.pago} onClick={() => handleCheckboxChange(gasto.id, gasto.pago)} />
                </td>
                <td className="p-3 uppercase text-[13px]">{gasto.descricao.toUpperCase()}</td>
                <td className="p-3 uppercase text-[13px]">{gasto.credor_descricao.toUpperCase()}</td>
                <td className="p-3 uppercase text-[13px]">{gasto.tipo_pagamento.toUpperCase()}</td>
                <td className="p-3 uppercase text-center text-[13px]">
                  {parseInt(gasto.total_parcela) > 1 ? `${gasto.parcela_atual}/${gasto.total_parcela}` : "-"}
                </td>
                <td className="p-3 font-semibold">{formatCurrency(gasto.valor)}</td>
                <td className="p-3 pl-1 flex justify-end text-center">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <span className="bg-transparent cursor-auto"> <Ellipsis /></span>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="">
                      <DropdownMenuItem>
                        <FilePenLine />
                        <span>Editar</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>

              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={6} className="text-center p-5 text-gray-500 dark:text-gray-400">Nenhum registro encontrado.</td>
            </tr>
          )}
        </tbody>
     
      </table>

      {modalEditSaida && (
        <EditarSaida open={modalEditSaida} setOpen={() => setModalEditSaida(false)} idSaida={idClicked} />
      )}
    </div>
  );
};

export default TableGastosFixosParcelados;