import { useGetGatosFixosParcelados } from "@/hooks/useGetGastosFixosParcelados";
import { formatCurrency } from "@/utils/formatCurrency";
import { Card, CardContent } from "./ui/card";
import { ScrollArea } from "./ui/scroll-area";

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


  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error fetching data.</div>;

  return (

    <div className="rounded-lg shadow-lg">
      <Card className="col-span-3 bg-gray-900 text-white">
        <CardContent className="p-2 rounded-md border">
          <ScrollArea className="h-[60vh] p-2">
            <div className="space-y-4 p-3">
              {data && data.length > 0 ? (
                data.map((gasto: GastosFixosParcelados) => (
                  <div
                    key={gasto.descricao}
                    className={`flex justify-between items-center p-4 rounded-lg shadow-md  min-h-20 ${gasto.pago ? "bg-green-600 dark:bg-green-800" : "bg-slate-300 dark:bg-slate-600"
                      } `}
                  >
                    <div className="flex flex-col space-y-1 w-1/3">
                      <p className="text-lg font-medium text-white">{gasto.descricao.toUpperCase()}</p>
                      <p className="text-sm text-gray-300">{gasto.credor_descricao.toUpperCase()}</p>
                    </div>

                    <div className="w-1/6 text-center">
                      <p className={`text-sm font-medium ${gasto.pago ? "text-green-200" : "text-slate-50"}`}>
                        {gasto.pago ? "Pago" : "Não Pago"}
                      </p>
                    </div>

                    <div className="w-1/3 flex flex-col space-y-1 text-center">
                      <p className="text-sm text-gray-300">{gasto.tipo_pagamento.toUpperCase()}</p>
                      {parseInt(gasto.total_parcela) > 1 && (
                        <p className="text-sm text-gray-400">
                          {gasto.parcela_atual} / {gasto.total_parcela}
                        </p>
                      )}
                    </div>

                    <div className="w-1/6 text-right font-semibold text-lg">
                      {formatCurrency(gasto.valor)}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center p-4 text-sm text-gray-400">
                  Nenhum registro encontrado.
                </div>
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>



  );
};

export default GatosFixosParcelados;
