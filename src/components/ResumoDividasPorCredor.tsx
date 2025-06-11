import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetTotCredores } from "@/hooks/useGetTotalCredores";
import { formatCurrency } from "@/utils/formatCurrency";

interface dataProps {
    periodo: string;
}

const ResumoDividasPorCredor: React.FC<dataProps> = ({ periodo }) => {
    const id_usuario = localStorage.getItem('userId');
    const { data: credores, isLoading, isError } = useGetTotCredores(periodo, Number(id_usuario));

    return (
        <Accordion type="single" collapsible defaultValue="item-1">
            <AccordionItem value="item-1">
                <AccordionTrigger className="cursor-pointer no-underline">
                    <h1 className="font-bold text-[18px] mb-2 no-underline">Dívidas por Credor</h1>
                </AccordionTrigger>
                <AccordionContent>
                    <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 w-full mb-5">
                        {isLoading ? (
                            Array.from({ length: 4 }).map((_, index) => (
                                <Card key={index}>
                                    <CardHeader className="pb-1">
                                        <Skeleton className="h-5 w-3/4" />
                                    </CardHeader>
                                    <CardContent>
                                        <Skeleton className="h-6 w-1/2" />
                                    </CardContent>
                                </Card>
                            ))
                        ) : isError ? (
                            <div className="col-span-full text-center text-red-500">
                                Erro ao carregar credores.
                            </div>
                        ) : credores && credores.length > 0 ? (
                            credores.map((credor: any) => (
                                <Card key={credor.id_credor}>
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1">
                                        <CardTitle className="text-lg uppercase font-bold text-purple">
                                            {credor.nome_credor}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-xl font-bold">
                                            {formatCurrency(credor.total_valor)}
                                        </div>
                                    </CardContent>
                                </Card>
                            ))
                        ) : (
                            <div className="col-span-full text-center">
                                Nenhum credor encontrado.
                            </div>
                        )}
                    </div>
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    );
};

export default ResumoDividasPorCredor;
