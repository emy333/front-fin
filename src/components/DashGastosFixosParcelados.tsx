import { useGetGatosFixosParcelados } from "@/hooks/useGetGastosFixosParcelados";
import { formatCurrency } from "@/utils/formatCurrency";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { ScrollArea } from "./ui/scroll-area";
import { useGetTotFixosParcelados } from "@/hooks/useGetTotSaidasParceladasFixas";

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

interface dataProps {
  periodo: string;
}

const GatosFixosParcelados: React.FC<dataProps> = ({ periodo }) => {
  const id_usuario = localStorage.getItem("userId");
  const { data: totalGastosFixosParc } = useGetTotFixosParcelados(periodo, Number(id_usuario));

  const { data, isLoading, isError } = useGetGatosFixosParcelados(
    periodo,
    Number(id_usuario)
  );

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error fetching data.</div>;

  return (
    <Card className="col-span-3">
      <CardHeader className="h-20">
        <div className="flex flex-row justify-between items-start ">
          <CardTitle className="text-xl" >Saídas Fixas e Parceladas </CardTitle>
          <p className="text-lg text-gray-700 dark:text-white font-bold">
            {formatCurrency(totalGastosFixosParc)}
          </p>
        </div>

        <div className="flex gap-2">
          <div className="flex text-center justify-center items-center gap-1 text-sm"><div className="bg-green-600 dark:bg-green-800 h-5 w-5 rounded-sm "></div> PAGO</div>
          <div className="flex text-center justify-center items-center gap-1 text-sm"><div className="bg-slate-500 dark:bg-slate-500 h-5 w-5 rounded-sm"></div> NÃO PAGO</div>
        </div>
      </CardHeader>
      <CardContent className="p-2 rounded-md text-white">
        {data && data.length > 0 ? (
          <ScrollArea className="h-[60vh] overflow-auto p-2">
            <div className="space-y-4 p-3">
              {data.map((gasto: GastosFixosParcelados) => (
                <div
                  key={gasto.id}
                  className={`flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 rounded-lg shadow-md min-h-20 ${gasto.pago
                    ? "bg-green-600 dark:bg-green-800"
                    : "bg-slate-500 dark:bg-slate-500"
                    }`}
                >
                  <div className="flex flex-col space-y-1 w-full sm:w-2/3">
                    <div className="flex gap-2 items-center">
                      <p className="text-lg font-medium dark:text-white">
                        {gasto.descricao.toUpperCase()}
                      </p>
                      <span className="text-lg"> {parseInt(gasto.total_parcela) > 1 ? `${gasto.parcela_atual}/${gasto.total_parcela}` : ""}</span>
                    </div>


                    <div className="flex flex-row gap-1">
                      {gasto.credor_descricao && (
                        <p className="text-sm dark:text-gray-300">
                          {gasto.credor_descricao.toUpperCase()}
                        </p>
                      )}
                      <p className="text-sm text-gray-300">
                        {gasto.tipo_pagamento.toUpperCase()}
                      </p>
                    </div>
                  </div>

                  <div className="w-full sm:w-1/4 text-right font-semibold text-lg  mt-0">
                    {formatCurrency(gasto.valor)}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        ) : (
          <div className="text-center p-4 text-sm text-gray-400 mt-5">
            Nenhum registro encontrado.
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default GatosFixosParcelados;
