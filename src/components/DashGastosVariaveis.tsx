import { useGetGatosVariaveis } from "@/hooks/useGetGastosVariaveis";
import { formatCurrency } from "@/utils/formatCurrency";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { ScrollArea } from "./ui/scroll-area";
import { useGetTotGastosVariaveis } from "@/hooks/useGetTotSaidasVariaveis";

interface GastosVariaveis {
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

const GatosVariaveis: React.FC<dataProps> = ({ periodo }) => {
  const id_usuario = localStorage.getItem("userId");

  const { data, isLoading, isError } = useGetGatosVariaveis(
    periodo,
    Number(id_usuario)
  );

  const { data: totalGastosVariaveis } = useGetTotGastosVariaveis(periodo, Number(id_usuario));


  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error fetching data.</div>;

  return (
    <div className="rounded-lg shadow-lg">
      <Card className="col-span-3">
        <CardHeader className="h-20">
          <div className="flex flex-row justify-between items-start ">
            <CardTitle className="text-xl" >Saídas Variáveis </CardTitle>
            <p className="text-lg text-gray-700 dark:text-white font-bold">
              {formatCurrency(totalGastosVariaveis)}
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
                {data.map((gasto: GastosVariaveis) => (
                  <div
                    key={gasto.id}
                    className={`flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 rounded-lg shadow-md min-h-20 ${gasto.pago
                      ? "bg-green-600 dark:bg-green-800"
                      : "bg-slate-500 dark:bg-slate-500"
                      }`}
                  >
                    <div className="flex flex-col space-y-1 w-full sm:w-2/3">
                      <p className="text-lg font-medium dark:text-white">
                        {gasto.descricao.toUpperCase()}
                      </p>

                      <div className="flex flex-col sm:flex-row gap-1">
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

                    <div className="w-full sm:w-1/4 text-right font-semibold text-lg mt-2 sm:mt-0">
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
    </div>
  );
};

export default GatosVariaveis;
