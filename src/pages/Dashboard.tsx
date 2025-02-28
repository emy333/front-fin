import { useEffect, useState, useMemo } from "react";

import MainLayout from "@/layouts/main";
import CardsResumo from "@/components/CardResumo";

import GatosFixosParcelados from "../components/DashGastosFixosParcelados";
import GatosVariaveis from "../components/DashGastosVariaveis";
import FiltroPeriodo from "@/components/FiltroPeriodo";

import ResumoDividasPorCredor from "../components/ResumoDividasPorCredor";
import { useGetTotGastosVariaveis } from "@/hooks/useGetTotSaidasVariaveis";
import { useGetTotFixosParcelados } from "@/hooks/useGetTotSaidasParceladasFixas";
import { formatCurrency } from "@/utils/formatCurrency";

const Dashboard = () => {
    const [selectedMonth, setSelectedMonth] = useState(() => {
        const currentMonth = (new Date().getMonth() + 1).toString().padStart(2, '0');
        return currentMonth;
    });

    const [ano, setAno] = useState(new Date().getFullYear());

    const periodo = useMemo(() => `${selectedMonth}-${ano}`, [selectedMonth, ano]);

    const [totGastosVariaveis, setTotGastosVariaveis] = useState(0);
    const [totGastosFixosParc, setTotGastosFixosParc] = useState(0);

    const { data: totalGastosVariaveis } = useGetTotGastosVariaveis(periodo, 4);
    const { data: totalGastosFixosParc } = useGetTotFixosParcelados(periodo, 4);

    useEffect(() => {
        if (totalGastosVariaveis !== undefined) {
            setTotGastosVariaveis(totalGastosVariaveis);
        }
        if (totalGastosFixosParc !== undefined) {
            setTotGastosFixosParc(totalGastosFixosParc);
        }
    }, [totalGastosVariaveis, totalGastosFixosParc]);

    return (
        <MainLayout >
            <div className="flex justify-between items-center mb-5">
                <div>
                    <h1 className="text-[25px]">Dashboard</h1>
                </div>
                <div>
                    <FiltroPeriodo
                        selectedMonth={selectedMonth}
                        setSelectedMonth={setSelectedMonth}
                        ano={ano}
                        setAno={setAno}
                    />
                </div>
            </div>

            <div>
                <h1 className="font-bold text-[18px] mb-2">Visão Geral</h1>
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 w-full mb-5">
                    <CardsResumo periodo={periodo} />
                </div>
            </div>

            <div className="w-full">
                <ResumoDividasPorCredor periodo={periodo} />
            </div>

            <div className="flex flex-col md:flex-row gap-6 h-full mb-5">
                <div className="flex-1 min-h-[60vh] max-h-[60vh] flex flex-col">
                    <div className="flex flex-row justify-between">
                        <h1 className="font-medium text-[18px] mb-2">Gastos Fixos e Parcelados</h1>
                        <span className="font-semibold">{formatCurrency(totGastosFixosParc)}</span>
                    </div>
                    <div className="flex-1">
                        <GatosFixosParcelados periodo={periodo} />
                    </div>
                </div>

                <div className="flex-1 min-h-[60vh] max-h-[60vh] flex flex-col">
                    <div className="flex flex-row justify-between">
                        <h1 className="font-medium text-[18px] mb-2">Gastos Variáveis</h1>
                        <span className="font-semibold">{formatCurrency(totGastosVariaveis)}</span>
                    </div>
                    <div className="flex-1">
                        <GatosVariaveis periodo={periodo} />
                    </div>
                </div>
            </div>
        </MainLayout>
    )
}

export default Dashboard;