import {useState, useMemo } from "react";

import MainLayout from "@/layouts/main";
import CardsResumo from "@/components/CardResumo";

import GatosFixosParcelados from "../components/DashGastosFixosParcelados";
import GatosVariaveis from "../components/DashGastosVariaveis";
import { GraficoTotSaidasCategoria } from "@/components/GraficoSaidasCategoria";

import FiltroPeriodo from "@/components/FiltroPeriodo";

import ResumoDividasPorCredor from "../components/ResumoDividasPorCredor";
import { useGetTotSaidasCategoria } from "@/hooks/getTotSaidasCategoria";
import { useGetTotSaidasAno } from "@/hooks/useGetTotSaidasAno";
import { GraficoTotSaidasAno } from "@/components/GraficoTotSaidaAno";


const Dashboard = () => {
    const id_usuario = localStorage.getItem('userId');

    const [selectedMonth, setSelectedMonth] = useState(() => {
        const currentMonth = (new Date().getMonth() + 1).toString().padStart(2, '0');
        return currentMonth;
    });

    const [ano, setAno] = useState(new Date().getFullYear());

    const periodo = useMemo(() => `${selectedMonth}-${ano}`, [selectedMonth, ano]);

    const { data: totalSidasCategoria } = useGetTotSaidasCategoria(periodo, Number(id_usuario));
    const { data: totalSaidasAno } = useGetTotSaidasAno(periodo.split('-')[1], Number(id_usuario));

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

                    <GatosFixosParcelados periodo={periodo} />
                </div>

                <div className="flex-1 flex flex-col">
                    <GatosVariaveis periodo={periodo} />
                </div>
            </div>

            <div className="flex flex-col md:flex-row gap-6 h-full mt-4">
                <div className="flex-1  ">
                    <GraficoTotSaidasCategoria data={totalSidasCategoria} />
                </div>

                <div className="flex-1 flex flex-col ">
                    <div className="flex-1">
                        <GraficoTotSaidasAno data={totalSaidasAno} />
                    </div>
                </div>

            </div>
        </MainLayout>
    )
}

export default Dashboard;