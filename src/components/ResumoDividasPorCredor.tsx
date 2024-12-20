
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

const ResumoDividasPorCredor = () => {

    const credores = [
        {
            nome: "Nubank",
            valor: "R$ 1000,00",
        },
        {
            nome: "Itaú",
            valor: "R$ 1000,00",
        },
        {
            nome: "Bradesco",
            valor: "R$ 1000,00",
        }
    ]

    return (
        <>
            <Accordion type="single" collapsible defaultValue="item-1">
                <AccordionItem value="item-1">
                    <AccordionTrigger className="cursor-pointer no-underline">
                        <h1 className="font-bold text-[18px] mb-2 no-underline">Dívidas por Credor</h1>
                    </AccordionTrigger>
                    <AccordionContent>
                        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 w-full mb-5">
                            {credores.map((card, index) => (
                                <Card key={index}>
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-[19px] font-medium">
                                            {card.nome}
                                        </CardTitle>
                             
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">{card.valor}</div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </>
    );
};

export default ResumoDividasPorCredor;
