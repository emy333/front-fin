import { useGetGatosFixosParcelados } from "@/hooks/useGetGastosFixosParcelados";
import { formatCurrency } from "@/utils/formatCurrency";
import { Checkbox } from "@/components/ui/checkbox";
import { useUpdateStatusSaida } from "@/hooks/usePutStatusSaida";
import { useState, useEffect } from "react";
import EditarSaida from "./EditarSaida";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Ellipsis, FilePenLine, Trash2 } from "lucide-react";
import { DeleteSaida } from "./modalDelete";

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
  const { data, isLoading, isError, refetch } = useGetGatosFixosParcelados(
    periodo,
    Number(id_usuario)
  );
  const [localData, setLocalData] = useState<GastosFixosParcelados[]>([]);
  const updateStatus = useUpdateStatusSaida();
  const [modalEditSaida, setModalEditSaida] = useState(false);
  const [modalDeleteSaida, setModalDeleteSaida] = useState(false);
  const [idClicked, setIdClicked] = useState(0);
  const [openDropdown, setOpenDropdown] = useState<number | null>(null);

  useEffect(() => {
    if (data) setLocalData(data);
  }, [data]);

  const handleCheckboxChange = async (id: number, currentPago: boolean) => {
    try {
      await updateStatus.mutateAsync({ id_saida: id, pago: !currentPago });
      setLocalData((prev) =>
        prev.map((gasto) =>
          gasto.id === id ? { ...gasto, pago: !currentPago } : gasto
        )
      );
    } catch (error) {
      console.error("Erro ao atualizar status:", error);
    }
  };

  const handleDetalhesSaida = (id: number) => {
    setOpenDropdown(null);
    setIdClicked(id);
    setModalEditSaida(true);
  };

  const handleDeleteSaida = (id: number) => {
    setOpenDropdown(null);
    setIdClicked(id);
    setModalDeleteSaida(true);
  };

  if (isLoading) return <div className="text-center py-4">Carregando...</div>;
  if (isError)
    return (
      <div className="text-center py-4 text-red-500">Erro ao buscar dados.</div>
    );

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full min-w-[100%] bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
        <thead>
          <tr className="bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
            <th className="p-1 text-center  text-[13px]">Pago?</th>
            <th className="p-1 text-left text-[13px]" >Descrição</th>
            <th className="p-1 text-left text-[13px]">Credor</th>
            <th className="p-1 text-[13px] text-left whitespace-nowrap overflow-hidden text-ellipsis max-w-[100px]">
              Tip. Pagamento
            </th>
            <th className="p-1 text-[13px] text-left">Parcelas</th>
            <th className="p-1 text-[13px] text-left">Valor</th>
            <th className="p-1 text-[13px] text-center"></th>
          </tr>
        </thead>
        <tbody>
          {localData.length > 0 ? (
            localData.map((gasto) => (
              <tr
                key={gasto.id}
                className={`border-b border-gray-200 dark:border-gray-700 ${
                  gasto.pago ? "bg-green-200 dark:bg-green-600" : ""
                }`}
              >
                <td className="p-1 text-center">
                  <Checkbox
                    checked={gasto.pago}
                    onClick={() => handleCheckboxChange(gasto.id, gasto.pago)}
                  />
                </td>
                <td className="p-1 uppercase text-[11px]">
                  {gasto.descricao.toUpperCase()}
                </td>
                <td className="p-1 uppercase text-[11px]">
                  {gasto.credor_descricao.toUpperCase()}
                </td>
                <td className="p-1 uppercase text-[11px]">
                  {gasto.tipo_pagamento.toUpperCase()}
                </td>
                <td className="p-1 uppercase text-center text-[11px]">
                  {parseInt(gasto.total_parcela) > 1
                    ? `${gasto.parcela_atual}/${gasto.total_parcela}`
                    : "-"}
                </td>
                <td className="p-1 text-[11px] font-semibold">
                  {formatCurrency(gasto.valor)}
                </td>
                <td className="p-1 text-[13px] pl-1 pr-1 flex justify-end text-center">
                  <DropdownMenu
                    open={openDropdown === gasto.id}
                    onOpenChange={(isOpen) =>
                      setOpenDropdown(isOpen ? gasto.id : null)
                    }
                  >
                    <DropdownMenuTrigger asChild>
                      <button
                        className="bg-transparent rounded-md text-[10px]"
                        onClick={() => setOpenDropdown(gasto.id)}
                      >
                        <Ellipsis />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuGroup>
                        <DropdownMenuItem
                          onClick={() => handleDetalhesSaida(gasto.id)}
                        >
                          <FilePenLine />
                          <span>Editar</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDeleteSaida(gasto.id)}
                        >
                          <Trash2 />
                          <span>Excluir</span>
                        </DropdownMenuItem>
                      </DropdownMenuGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={6}
                className="text-center p-3 text-gray-500 dark:text-gray-400"
              >
                Nenhum registro encontrado.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {modalEditSaida && (
        <EditarSaida
          open={modalEditSaida}
          setOpen={() => setModalEditSaida(false)}
          idSaida={idClicked}
          refetch={refetch}
          periodo={periodo}
        />
      )}

      {modalDeleteSaida && (
        <DeleteSaida
          open={modalDeleteSaida}
          setOpen={() => setModalDeleteSaida(false)}
          idClicked={idClicked}
          refetch={refetch}
          periodo={periodo}
        />
      )}
    </div>
  );
};

export default TableGastosFixosParcelados;
