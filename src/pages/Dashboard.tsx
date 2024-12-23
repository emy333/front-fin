import { useState } from "react";

import MainLayout from "@/layouts/main";
import CardsResumo from "@/components/CardResumo";

import GatosFixosParcelados from "../components/GastosFixosParcelados";
import GatosVariaveis from "../components/GastosVariaveis";
import FiltroPeriodo from "@/components/FiltroPeriodo";

import ResumoDividasPorCredor from "../components/ResumoDividasPorCredor";



const Dashboard = () => {
    const [selectedMonth, setSelectedMonth] = useState<string>(() => {
        const currentMonth = (new Date().getMonth() + 1).toString().padStart(2, '0');
        return currentMonth;
    });

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
                <ResumoDividasPorCredor />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-h-[50vh] md:min-h-[50vh] ">
                <div className="flex flex-col h-full">
                    <h1 className="font-bold text-[18px] mb-2">Gastos Fixos e Parcelados</h1>
                    <GatosFixosParcelados />
                </div>
                <div className="flex flex-col h-full">
                    <h1 className="font-bold text-[18px] mb-2">Gastos Variados</h1>
                    <GatosVariaveis />
                </div>
            </div>

        </MainLayout>
    )
}

export default Dashboard;