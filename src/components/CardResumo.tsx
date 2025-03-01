import { useState, useEffect } from "react";
import { getTotOrcamento } from "@/utils/totOrcamento";
import { getTotDespesas } from "@/utils/totSaidas";
import { getTotPagas } from "@/utils/totPagas";
import { getTotSaldo } from "@/utils/totSaldo";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Wallet, CheckCircle, CreditCard   } from "lucide-react";


interface dataProps {
    periodo: string;
}


const CardsResumo: React.FC<dataProps> = ({ periodo }) => {
    const [totOrcamento, setTotOrcamento] = useState(0);
    const [totDespesas, setTotDespesas] = useState(0);
    const [totPagas, setTotPagas] = useState(0);
    const [totSaldo, setTotSaldo] = useState(0);
    const id_usuario = localStorage.getItem('userId');

    useEffect(() => {

        const fetchData = async () => {
            const orçamento = await getTotOrcamento(periodo, Number(id_usuario));
            const despesas = await getTotDespesas(periodo, Number(id_usuario));
            const totPagas = await getTotPagas(periodo, Number(id_usuario));
            const totSaldo = await getTotSaldo(periodo, Number(id_usuario));

            setTotOrcamento(orçamento);
            setTotDespesas(despesas);
            setTotPagas(totPagas);
            setTotSaldo(totSaldo);

        };

        fetchData();
    }, [periodo]);

    const cardInfo = [
        {
            title: "Orçamento",
            value: new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL',
            }).format(totOrcamento),
            icon: <DollarSign  />
        },
        {
            title: "Total de Gastos",
            value: new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL',
            }).format(totDespesas),
            icon: <CreditCard />
        },
        {
            title: "Total Pago",
            value: new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL',
            }).format(totPagas),
            icon: <CheckCircle />
        },
        {
            title: "Saldo Disponível",
            value: new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL',
            }).format(totSaldo),
            icon: <Wallet  />,
            isNegative: totSaldo < 0
        },
    ];

    return (
        <>
            {cardInfo.map((card, index) => (
                <Card key={index}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-[19px] font-medium">
                            {card.title}
                        </CardTitle>
                        <span className="text-[25px] text-muted-foreground">
                            {card.icon}
                        </span>
                    </CardHeader>
                    <CardContent>
                        <div className={`text-2xl font-bold ${card.isNegative ? 'text-red-800' : 'text-green-700'}`}>
                            {card.value}
                        </div>
                    </CardContent>
                </Card>
            ))}
        </>
    );
};

export default CardsResumo;
