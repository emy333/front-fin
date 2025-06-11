import { useGetGatosVariaveis } from "@/hooks/useGetGastosVariaveis";
import { useGetTotGastosVariaveis } from "@/hooks/useGetTotSaidasVariaveis";
import { formatCurrency } from "@/utils/formatCurrency";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { ScrollArea } from "./ui/scroll-area";
import { Skeleton } from "./ui/skeleton";

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

const GastosVariaveis: React.FC<dataProps> = ({ periodo }) => {
  const id_usuario = localStorage.getItem("userId");

  const { data, isLoading, isError } = useGetGatosVariaveis(periodo, Number(id_usuario));
  const { data: totalGastosVariaveis, isLoading: isLoadingTot } = useGetTotGastosVariaveis(
    periodo,
    Number(id_usuario)
  );

  if (isError) return <div>Error fetching data.</div>;

  return (
    <Card className="col-span-3">
      <CardHeader className="h-20">
        <div className="flex justify-between mb-1">
          <CardTitle className="text-xl text-foreground">Saídas Variáveis</CardTitle>
          <p className="text-lg text-foreground font-bold">
            {isLoadingTot ? <Skeleton className="h-6 w-24" /> : formatCurrency(totalGastosVariaveis)}
          </p>
        </div>

        <div className="flex gap-2">
          <div className="flex items-center gap-1 text-sm">
            <div className="bg-green-800 dark:bg-green-600 h-5 w-5 rounded-sm"></div> PAGO
          </div>
          <div className="flex items-center gap-1 text-sm">
            <div className="bg-slate-800 dark:bg-slate-600 h-5 w-5 rounded-sm"></div> NÃO PAGO
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-2 rounded-md">
        {isLoading ? (
          <ScrollArea className="h-[60vh] overflow-auto p-2">
            <div className="space-y-4 p-3">
              {Array.from({ length: 6 }).map((_, idx) => (
                <div
                  key={idx}
                  className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 rounded-lg shadow-md bg-muted dark:bg-muted/30 min-h-20"
                >
                  <div className="flex flex-col space-y-2 w-full sm:w-2/3">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                  <div className="w-full sm:w-1/4 text-right mt-2 sm:mt-0">
                    <Skeleton className="h-4 w-20 ml-auto" />
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        ) : data && data.length > 0 ? (
          <ScrollArea className="h-[60vh] overflow-auto p-2">
            <div className="space-y-4 p-3">
              {data.map((gasto: GastosVariaveis) => (
                <div
                  key={gasto.id}
                  className={`flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 rounded-lg shadow-md min-h-20 ${
                    gasto.pago ? "bg-green-800 dark:bg-green-600" : "bg-slate-800 dark:bg-slate-600"
                  }`}
                >
                  <div className="flex flex-col space-y-1 w-full sm:w-2/3">
                    <p className="text-lg font-medium truncate">
                      {gasto.descricao.toUpperCase()}
                    </p>

                    <div className="flex flex-row gap-1">
                      {gasto.credor_descricao && (
                        <p className="text-sm font-semibold">{gasto.credor_descricao.toUpperCase()} -</p>
                      )}
                      <p className="text-sm">{gasto.tipo_pagamento.toUpperCase()}</p>
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
  );
};

export default GastosVariaveis;
