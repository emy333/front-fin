import MainLayout from "@/layouts/main";
import CardsResumo from "@/components/CardResumo";

import GatosFixosParcelados from "../components/GastosFixosParcelados";
import GatosVariaveis from "../components/GastosVariaveis";

const Dashboard = () => {

    return (
        <MainLayout>
            <h1 className="text-[25px]">Dashboard</h1>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 w-full mb-5">
                <CardsResumo />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 min-h-[50vh]">
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