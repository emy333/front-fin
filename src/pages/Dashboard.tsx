import { useEffect, useState, useMemo } from "react";

import MainLayout from "@/layouts/main";
import CardsResumo from "@/components/CardResumo";

import GatosFixosParcelados from "../components/DashGastosFixosParcelados";
import GatosVariaveis from "../components/DashGastosVariaveis";
import { GraficoTotSaidasCategoria } from "@/components/GraficoSaidasCategoria";

import FiltroPeriodo from "@/components/FiltroPeriodo";

import ResumoDividasPorCredor from "../components/ResumoDividasPorCredor";
import { useGetTotGastosVariaveis } from "@/hooks/useGetTotSaidasVariaveis";
import { useGetTotFixosParcelados } from "@/hooks/useGetTotSaidasParceladasFixas";
import { formatCurrency } from "@/utils/formatCurrency";
import { useGetTotSaidasCategoria } from "@/hooks/getTotSaidasCategoria";
import { useGetTotSaidasAno } from "@/hooks/useGetTotSaidasAno";

const Dashboard = () => {
    const id_usuario = localStorage.getItem('userId');

    const [selectedMonth, setSelectedMonth] = useState(() => {
        const currentMonth = (new Date().getMonth() + 1).toString().padStart(2, '0');
        return currentMonth;
    });

    const [ano, setAno] = useState(new Date().getFullYear());

    const periodo = useMemo(() => `${selectedMonth}-${ano}`, [selectedMonth, ano]);

    const [totGastosVariaveis, setTotGastosVariaveis] = useState(0);
    const [totGastosFixosParc, setTotGastosFixosParc] = useState(0);

    const { data: totalGastosVariaveis } = useGetTotGastosVariaveis(periodo, Number(id_usuario));
    const { data: totalGastosFixosParc } = useGetTotFixosParcelados(periodo, Number(id_usuario));
    const { data: totalSidasCategoria } = useGetTotSaidasCategoria(periodo, Number(id_usuario));
    const { data: totalSaidasAno } = useGetTotSaidasAno(periodo.split('-')[1], Number(id_usuario));

    console.log("tot saidas", totalSaidasAno);

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

            <div className="flex flex-col md:flex-row gap-6 h-full">
                <div className="flex-1 flex flex-col ">
                    <div className="flex flex-row justify-between">
                        <h1 className="font-medium text-[18px] mb-2">Gastos Fixos e Parcelados</h1>
                        <span className="font-semibold">{formatCurrency(totGastosFixosParc)}</span>
                    </div>
                    <div className="flex-1">
                        <GatosFixosParcelados periodo={periodo} />
                    </div>
                </div>

                <div className="flex-1 flex flex-col">
                    <div className="flex flex-row justify-between">
                        <h1 className="font-medium text-[18px] mb-2">Gastos Variáveis</h1>
                        <span className="font-semibold">{formatCurrency(totGastosVariaveis)}</span>
                    </div>
                    <div className="flex-1">
                        <GatosVariaveis periodo={periodo} />
                    </div>
                </div>
            </div>

            <div className="flex flex-col md:flex-row gap-6 h-full">
                <div className="flex-1 flex flex-col ">
                    <div className="flex flex-row justify-between">
                        <h1 className="font-medium text-[18px] mb-2">Saidas por Categoria</h1>
                    </div>
                    <div className="flex justify-center items-center h-full">
                        <GraficoTotSaidasCategoria data={totalSidasCategoria} />
                    </div>
                </div>

                <div className="flex-1 flex flex-col ">
                    <div className="flex flex-row justify-between">
                        <h1 className="font-medium text-[18px] mb-2">Total de Saidas por mês</h1>
                    </div>
                    <div className="flex-1">

                    </div>
                </div>

            </div>
        </MainLayout>
    )
}

export default Dashboard;