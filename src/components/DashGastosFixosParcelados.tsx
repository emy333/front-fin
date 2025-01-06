import { useGetGatosFixosParcelados } from "@/hooks/useGetGastosFixosParcelados";
import { formatCurrency } from "@/utils/formatCurrency";

interface GastosFixosParcelados {
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

interface dataProps {
  periodo: string;
}

const GatosFixosParcelados: React.FC<dataProps> = ({ periodo }) => {

  const { data, isLoading, isError } = useGetGatosFixosParcelados(periodo, 4);

  const totalValue = data?.reduce((acc: number, gasto: GastosFixosParcelados) => {
    const valor = parseFloat(gasto.valor.toString());
    return acc + valor;
  }, 0) || 0;

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error fetching data.</div>;

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full table-auto text-sm">
        <thead>
          <tr className="bg-gray-100 dark:bg-gray-800">
            <th className="px-4 py-2 text-left">Descrição</th>
            <th className="px-4 py-2 text-left">Credor</th>
            <th className="px-4 py-2 text-left">Pago?</th>
            <th className="px-4 py-2 text-left">Tipo de Pagamento</th>
            <th className="px-4 py-2 text-left">Total de Parcelas</th>
            <th className="px-4 py-2 text-left">Valor</th>
          </tr>
        </thead>
        <tbody>
          {data && data.length > 0 ? (
            data.map((gasto: GastosFixosParcelados) => (
              <tr
                key={gasto.descricao}
                className={`${gasto.pago ? "bg-green-200 dark:bg-green-700" : ""} transition duration-300`}
              >
                <td className="px-4 py-2">{gasto.descricao.toUpperCase()}</td>
                <td className="px-4 py-2">{gasto.credor_descricao.toUpperCase()}</td>
                <td className="px-4 py-2">{gasto.pago ? "SIM" : "NÃO"}</td>
                <td className="px-4 py-2">{gasto.tipo_pagamento.toUpperCase()}</td>
                <td className="px-4 py-2">
                  {parseInt(gasto.total_parcela) > 1 ? `${gasto.parcela_atual} / ${gasto.total_parcela}` : ""}
                </td>
                <td className="px-4 py-2">{formatCurrency(gasto.valor)}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={6} className="text-center px-4 py-2">
                Nenhum registro encontrado.
              </td>
            </tr>
          )}
        </tbody>
        <tfoot>
          <tr className="bg-gray-100 dark:bg-gray-800">
            <td colSpan={5} className="text-right px-4 py-2 font-semibold">Total</td>
            <td className="px-4 py-2 font-semibold">{formatCurrency(totalValue)}</td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};

export default GatosFixosParcelados;
