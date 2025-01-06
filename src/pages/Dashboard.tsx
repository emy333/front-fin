import { useEffect, useState } from "react";

import MainLayout from "@/layouts/main";
import CardsResumo from "@/components/CardResumo";

import GatosFixosParcelados from "../components/GastosFixosParcelados";
import GatosVariaveis from "../components/GastosVariaveis";
import FiltroPeriodo from "@/components/FiltroPeriodo";

import ResumoDividasPorCredor from "../components/ResumoDividasPorCredor";
import { useGetTotGastosVariaveis } from "@/hooks/useGetTotSaidasVariaveis";
import { useGetTotFixosParcelados } from "@/hooks/useGetTotSaidasParceladasFixas";
import { formatCurrency } from "@/utils/formatCurrency";

const Dashboard = () => {
    const [selectedMonth, setSelectedMonth] = useState<string>(() => {
        const currentMonth = (new Date().getMonth() + 1).toString().padStart(2, '0');
        return currentMonth;
    });

    const [totGastosVariaveis, setTotGastosVariaveis] = useState(0);
    const [totGastosFixosParc, setTotGastosFixosParc] = useState(0);

    const [ano] = useState(new Date().getFullYear());
    const periodo = `${selectedMonth}-${ano}`;

    const { data: totalGastosVariaveis } = useGetTotGastosVariaveis(periodo, 4)
    const { data: totalGastosFixosParc } = useGetTotFixosParcelados(periodo, 4)

    useEffect(() => {
        if (totalGastosVariaveis) {
            setTotGastosVariaveis(totalGastosVariaveis);
        }
        if (totalGastosFixosParc) {
            setTotGastosFixosParc(totalGastosFixosParc);
        } 
    }, [totalGastosVariaveis, totalGastosFixosParc])

    return (
        <MainLayout>
            <div className="flex justify-between items-center mb-5">
                <div>
                    <h1 className="text-[25px]">Dashboard</h1>
                </div>
                <div>
                    <FiltroPeriodo
                        selectedMonth={selectedMonth}
                        setSelectedMonth={setSelectedMonth}
                    />
                </div>
            </div>

            <div>
                <h1 className="font-bold text-[18px] mb-2">Resumo</h1>
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 w-full mb-5">
                    <CardsResumo selectedMonth={selectedMonth}
                    />
                </div>
            </div>


            <div className="w-full">
                <ResumoDividasPorCredor selectedMonth={selectedMonth} />
            </div>

            <div className="flex flex-col md:flex-row gap-6 h-full">
                <div className="flex-1 min-h-[60vh] max-h-[60vh] flex flex-col">
                    <div className="flex flex-row justify-between">
                        <h1 className="font-bold text-[18px] mb-2">Gastos Fixos e Parcelados</h1>
                        <span className="font-bold">{formatCurrency(totGastosFixosParc)}</span>
                    </div>
                    <div className="flex-1 overflow-auto">
                        <GatosFixosParcelados selectedMonth={selectedMonth} />
                    </div>
                </div>

                <div className="flex-1 min-h-[60vh] max-h-[60vh] flex flex-col">
                    <div className="flex flex-row justify-between">
                        <h1 className="font-bold text-[18px] mb-2">Gastos Variáveis</h1>
                        <span className="font-bold">{formatCurrency(totGastosVariaveis)}</span>
                    </div>
                    <div className="flex-1 overflow-auto">
                        <GatosVariaveis selectedMonth={selectedMonth} />
                    </div>
                </div>
            </div>
        </MainLayout>
    )
}

export default Dashboard;