import { MdOutlineAttachMoney } from "react-icons/md";
import { useState, useEffect } from "react";
import { getTotOrcamento } from "@/utils/totOrcamento";
import { getTotDespesas } from "@/utils/totSaidas";
import { getTotPagas } from "@/utils/totPagas";
import { getTotSaldo } from "@/utils/totSaldo";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface dataProps {
    selectedMonth: string;
}

const CardsResumo: React.FC<dataProps> = ({ selectedMonth }) => {
    const [totOrcamento, setTotOrcamento] = useState(0);
    const [totDespesas, setTotDespesas] = useState(0);
    const [totPagas, setTotPagas] = useState(0);
    const [totSaldo, setTotSaldo] = useState(0);

    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();

    useEffect(() => {

        const date = `${currentYear}-${selectedMonth}`;
        const userId = 4;

        const fetchData = async () => {
            const orçamento = await getTotOrcamento(date, userId);
            const despesas = await getTotDespesas(date, userId);
            const totPagas = await getTotPagas(date, userId);
            const totSaldo = await getTotSaldo(date, userId);

            setTotOrcamento(orçamento);
            setTotDespesas(despesas);
            setTotPagas(totPagas);
            setTotSaldo(totSaldo);

        };

        fetchData();
    }, [currentYear, selectedMonth]);

    const cardInfo = [
        {
            title: "Orçamento",
            value: new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL',
            }).format(totOrcamento),
            icon: <MdOutlineAttachMoney />
        },
        {
            title: "Total de Gastos",
            value: new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL',
            }).format(totDespesas),
            icon: <MdOutlineAttachMoney />
        },
        {
            title: "Total Pago",
            value: new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL',
            }).format(totPagas),
            icon: <MdOutlineAttachMoney />
        },
        {
            title: "Saldo Disponível",
            value: new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL',
            }).format(totSaldo),
            icon: <MdOutlineAttachMoney />
        },
    ];

    return (
        <>
            {(cardInfo.map((card, index) => (
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
                        <div className="text-2xl font-bold">{card.value}</div>
                    </CardContent>
                </Card>
            ))
            )}
        </>
    );
};

export default CardsResumo;
