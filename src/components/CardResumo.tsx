import { useState, useEffect } from "react";
import { getTotOrcamento } from "@/utils/totOrcamento";
import { getTotDespesas } from "@/utils/totSaidas";
import { getTotPagas } from "@/utils/totPagas";
import { getTotSaldo } from "@/utils/totSaldo";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Wallet, CheckCircle, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

interface dataProps {
    periodo: string;
}

const CardsResumo: React.FC<dataProps> = ({ periodo }) => {
    const [totOrcamento, setTotOrcamento] = useState(0);
    const [totDespesas, setTotDespesas] = useState(0);
    const [totPagas, setTotPagas] = useState(0);
    const [totSaldo, setTotSaldo] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    const id_usuario = localStorage.getItem('userId');

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const orçamento = await getTotOrcamento(periodo, Number(id_usuario));
                const despesas = await getTotDespesas(periodo, Number(id_usuario));
                const pagas = await getTotPagas(periodo, Number(id_usuario));
                const saldo = await getTotSaldo(periodo, Number(id_usuario));

                setTotOrcamento(orçamento);
                setTotDespesas(despesas);
                setTotPagas(pagas);
                setTotSaldo(saldo);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [periodo]);

    const cardInfo = [
        {
            title: "Orçamento",
            value: new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totOrcamento),
            icon: <DollarSign size={30} />
        },
        {
            title: "Total de Gastos",
            value: new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totDespesas),
            icon: <TrendingDown size={30} />
        },
        {
            title: "Total Pago",
            value: new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totPagas),
            icon: <CheckCircle size={30} />
        },
        {
            title: "Saldo Disponível",
            value: new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totSaldo),
            icon: <Wallet size={30} />,
            isNegative: totSaldo < 0
        },
    ];

    return (
        <>
            {isLoading
                ? Array.from({ length: 4 }).map((_, index) => (
                    <Card key={index}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <Skeleton className="h-6 w-1/2" />
                            <Skeleton className="h-7 w-7 rounded-full" />
                        </CardHeader>
                        <CardContent>
                            <Skeleton className="h-8 w-3/4" />
                        </CardContent>
                    </Card>
                ))
                : cardInfo.map((card, index) => (
                    <Card key={index}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-[19px] font-medium font-notoGondi">
                                {card.title}
                            </CardTitle>
                            <span className="text-[25px] text-purple">
                                {card.icon}
                            </span>
                        </CardHeader>
                        <CardContent>
                            <div
                                className={cn(
                                    "text-2xl font-bold",
                                    card.title === "Saldo Disponível" && totSaldo > 0 && "text-green-800 dark:text-green-500",
                                    card.title === "Saldo Disponível" && totSaldo < 0 && "text-red-800 dark:text-red-500"
                                )}
                            >
                                {card.value}
                            </div>
                        </CardContent>
                    </Card>
                ))}
        </>
    );
};

export default CardsResumo;
