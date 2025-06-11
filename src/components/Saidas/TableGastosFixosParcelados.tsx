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
  filtroCredor?: string;
}

function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(window.innerWidth < breakpoint);

  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth < breakpoint);
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [breakpoint]);

  return isMobile;
}

const CardGasto: React.FC<{
  gasto: GastosFixosParcelados;
  onCheckboxChange: () => void;
  onEdit: () => void;
  onDelete: () => void;
}> = ({ gasto, onCheckboxChange, onEdit, onDelete }) => (
  <div
    className={`bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-4
      border ${gasto.pago
        ? "border-green-500 bg-green-100 dark:bg-green-600 dark:border-none"
        : ""
      }
      transition-colors duration-300 ease-in-out
    `}
  >
    <div className="flex items-center justify-between mb-3">
      <Checkbox checked={gasto.pago} onClick={onCheckboxChange} />
      <h3 className="flex-1 ml-3 font-semibold text-gray-800 dark:text-gray-200 uppercase text-lg truncate">
        {gasto.descricao}
      </h3>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            className="p-1 text-gray-700  dark:text-gray-100 transition"
            aria-label="Mais opções"
          >
            <Ellipsis size={20} />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="bottom" align="end" className="w-36">
          <DropdownMenuGroup>
            <DropdownMenuItem
              onClick={onEdit}
              className="flex items-center gap-2 text-sm"
            >
              <FilePenLine size={16} /> Editar
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={onDelete}
              className="flex items-center gap-2 text-sm text-red-600 hover:text-red-800"
            >
              <Trash2 size={16} /> Excluir
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
    <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm text-gray-600 dark:text-gray-50">
      <div>
        <span className="font-semibold">Credor:</span> {gasto.credor_descricao?.trim() ? gasto.credor_descricao : "-"}
      </div>

      <div>
        <span className="font-semibold">Tipo Pagamento:</span> {gasto.tipo_pagamento}
      </div>
      <div>
        <span className="font-semibold">Parcelas:</span>{" "}
        {parseInt(gasto.total_parcela) > 1
          ? `${gasto.parcela_atual}/${gasto.total_parcela}`
          : "-"}
      </div>
      <div className="font-semibold text-right text-gray-900 dark:text-gray-50">
        {formatCurrency(gasto.valor)}
      </div>
    </div>
  </div>
);


const TableGastosFixosParcelados: React.FC<DataProps> = ({
  periodo,
  filtroCredor = "",
}) => {
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

  const isMobile = useIsMobile();

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

  function removeAcentos(text: string) {
    return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }

  const filteredData = localData.filter((gasto) => {
    const filtro = removeAcentos(filtroCredor.toLowerCase().trim());
    return (
      removeAcentos(gasto.credor_descricao.toLowerCase()).includes(filtro) ||
      removeAcentos(gasto.descricao.toLowerCase()).includes(filtro)
    );
  });

  if (isLoading) return <div className="text-center py-4">Carregando...</div>;
  if (isError)
    return (
      <div className="text-center py-4 text-red-500">Erro ao buscar dados.</div>
    );

  return (
    <div className="w-full">
      {isMobile ? (
        <div>
          {filteredData.length > 0 ? (
            filteredData.map((gasto) => (
              <CardGasto
                key={gasto.id}
                gasto={gasto}
                onCheckboxChange={() => handleCheckboxChange(gasto.id, gasto.pago)}
                onEdit={() => handleDetalhesSaida(gasto.id)}
                onDelete={() => handleDeleteSaida(gasto.id)}
              />
            ))
          ) : (
            <div className="text-center p-3 text-gray-500 dark:text-gray-400">
              Nenhum registro encontrado.
            </div>
          )}
        </div>
      ) : (
        // Versão Desktop: Tabela
        <div className="overflow-x-auto">
          <table className="w-full min-w-[100%] bg-white dark:bg-gray-900 border-b border-b-gray-200 dark:border-b-gray-700">
            <thead>
              <tr className="bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                <th className="p-1 text-center text-[13px]">Pago?</th>
                <th className="p-1 text-left text-[13px]">Descrição</th>
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
              {filteredData.length > 0 ? (
                filteredData.map((gasto) => (
                  <tr
                    key={gasto.id}
                    className={`${gasto.pago
                      ? "bg-green-200 dark:bg-green-600 border-b-3"
                      : ""
                      } border-0`}
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
                    colSpan={7}
                    className="text-center p-3 text-gray-500 dark:text-gray-400"
                  >
                    Nenhum registro encontrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

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
