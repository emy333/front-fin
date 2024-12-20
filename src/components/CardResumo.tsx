import { MdOutlineAttachMoney } from "react-icons/md";

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

const CardsResumo = () => {
    const cardInfo = [
        {
            title: "Orçamento",
            value: "R$ 1000,00",
            icon: <MdOutlineAttachMoney />
        },
        {
            title: "Total de Gastos",
            value: "R$ 1000,00",
            icon: <MdOutlineAttachMoney />
        },
        {
            title: "Total Pago",
            value: "R$ 1000,00",
            icon: <MdOutlineAttachMoney />
        },
        {
            title: "Saldo Disponível",
            value: "R$ 1000,00",
            icon: <MdOutlineAttachMoney />
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
                        <div className="text-2xl font-bold">{card.value}</div>
                    </CardContent>
                </Card>
            ))}
        </>
    );
};

export default CardsResumo;
