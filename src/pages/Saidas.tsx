import { useState, useMemo } from "react";
import MainLayout from "@/layouts/main";
import FiltroPeriodo from "@/components/FiltroPeriodo";
import { Button } from "@/components/ui/button";
import { MdAddCard } from "react-icons/md";
import AdicionarSaida from "@/components/Saidas/AdicionarSaida";
import TableGastosFixosParcelados from "@/components/Saidas/TableGastosFixosParcelados";
import TableGastosVariaveis from "@/components/Saidas/TableGastosVariaveis";
import { useGetTotGastosVariaveis } from "@/hooks/useGetTotSaidasVariaveis";
import { useGetTotFixosParcelados } from "@/hooks/useGetTotSaidasParceladasFixas";
import { formatCurrency } from "@/utils/formatCurrency";

const Saidas = () => {
    const [openAdd, setOpenAdd] = useState(false);
    const id_usuario = localStorage.getItem('userId');

    const [selectedMonth, setSelectedMonth] = useState(() => {
        const currentMonth = (new Date().getMonth() + 1).toString().padStart(2, '0');
        return currentMonth;
    });

    const [ano, setAno] = useState(new Date().getFullYear());

    const periodo = useMemo(() => `${selectedMonth}-${ano}`, [selectedMonth, ano]);

    const { data: totalGastosVariaveis } = useGetTotGastosVariaveis(periodo, Number(id_usuario));
    const { data: totalGastosFixosParc } = useGetTotFixosParcelados(periodo, Number(id_usuario));

    return (
        <MainLayout>
            <div className="flex justify-between items-center mb-5 ">
                <div className="flex flex-row gap-4 items-center">
                    <h1 className="text-[25px]">Saídas</h1>
                </div>
                <div className="flex flex-row gap-2 text-center items-center">
                    <Button
                        onClick={() => setOpenAdd(true)}
                        variant="secondary"
                        className="flex flex-row gap-5 p-4 font-medium">

                        <MdAddCard />
                        <span className="hidden sm:inline">Adicionar Saída</span>
                    </Button>
                    <FiltroPeriodo
                        selectedMonth={selectedMonth}
                        setSelectedMonth={setSelectedMonth}
                        ano={ano}
                        setAno={setAno}
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:min-h-[70vh] max-h-[70vh] ">
                <div className="flex flex-col h-full mb-5  ">
                    <div className="flex flex-row justify-between">
                        <h1 className="font-medium text-[18px] mb-2">Gastos Fixos e Parcelados</h1>
                        <span className="font-semibold">{formatCurrency(totalGastosFixosParc)}</span>
                    </div>
                    <TableGastosFixosParcelados periodo={periodo} />

                </div>
                <div className="flex flex-col h-full mb-5 md:min-h-[70vh] max-h-[70vh]">
                    <div className="flex flex-row justify-between">
                        <h1 className="font-medium text-[18px] mb-2">Gastos Variáveis</h1>
                        <span className="font-semibold">{formatCurrency(totalGastosVariaveis)}</span>
                    </div>
                    <TableGastosVariaveis periodo={periodo} />
                </div>
            </div>

            <AdicionarSaida
                open={openAdd}
                setOpen={setOpenAdd}
            />
        </MainLayout>
    )
}

export default Saidas;
