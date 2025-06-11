import { useState, useMemo } from "react";
import MainLayout from "@/layouts/main";
import FiltroPeriodo from "@/components/FiltroPeriodo";
import { Button } from "@/components/ui/button";
import { MdAddCard, MdSearch } from "react-icons/md";
import AdicionarSaida from "@/components/Saidas/AdicionarSaida";
import TableGastosFixosParcelados from "@/components/Saidas/TableGastosFixosParcelados";
import TableGastosVariaveis from "@/components/Saidas/TableGastosVariaveis";
import { useGetTotGastosVariaveis } from "@/hooks/useGetTotSaidasVariaveis";
import { useGetTotFixosParcelados } from "@/hooks/useGetTotSaidasParceladasFixas";
import { formatCurrency } from "@/utils/formatCurrency";
import { Input } from "@/components/ui/input";

const Saidas = () => {
    const [openAdd, setOpenAdd] = useState(false);
    const id_usuario = localStorage.getItem("userId");

    const [selectedMonth, setSelectedMonth] = useState(() => {
        const currentMonth = (new Date().getMonth() + 1).toString().padStart(2, "0");
        return currentMonth;
    });

    const [ano, setAno] = useState(new Date().getFullYear());

    const periodo = useMemo(() => `${selectedMonth}-${ano}`, [selectedMonth, ano]);

    const { data: totalGastosVariaveis, refetch: refetchTotVariados } =
        useGetTotGastosVariaveis(periodo, Number(id_usuario));
    const { data: totalGastosFixosParc, refetch: refetchTotParcelados } =
        useGetTotFixosParcelados(periodo, Number(id_usuario));

    // Estado único para filtro
    const [filterCredor, setFilterCredor] = useState("");

    return (
        <MainLayout>
            <div className="flex justify-between items-center mb-5 ">
                <div className="flex flex-row gap-4 items-center">
                    <h1 className="text-[25px]">Saídas</h1>
                </div>
                <div className="flex flex-row gap-2 text-center items-center">
                    <Button
                        onClick={() => setOpenAdd(true)}
                        className="flex flex-row gap-2 p-4 font-medium "
                    >
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

            <div className="mb-6 max-w-md relative">
                <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <Input
                    id="credorFilter"
                    type="text"
                    placeholder="Pesquisar por credor ou descrição"
                    className="pl-10 pr-4 py-2 rounded-lg border border-gray-300 shadow-sm 
               focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent 
               placeholder-gray-400 transition w-full"
                    value={filterCredor}
                    onChange={(e) => setFilterCredor(e.target.value)}
                />
            </div>
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 md:min-h-[70vh] max-h-[70vh] ">
                <div className="flex flex-col h-full mb-5  ">
                    <div className="flex flex-row justify-between">
                        <h1 className="font-semibold text-[18px] font-notoGondi mb-2">
                            Gastos Fixos e Parcelados
                        </h1>
                        <span className="font-bold font-notoGondi text-purple text-lg">
                            {formatCurrency(totalGastosFixosParc || 0)}
                        </span>
                    </div>

                    <TableGastosFixosParcelados periodo={periodo} filtroCredor={filterCredor} />
                </div>

                <div className="flex flex-col h-full mb-5  ">
                    <div className="flex flex-row justify-between">
                        <h1 className="font-semibold text-[18px] font-notoGondi mb-2">
                            Gastos Variáveis
                        </h1>
                        <span className="font-bold font-notoGondi text-purple text-lg">
                            {formatCurrency(totalGastosVariaveis || 0)}
                        </span>
                    </div>

                    <TableGastosVariaveis periodo={periodo} filtroCredor={filterCredor} />
                </div>
            </div>

            <AdicionarSaida
                open={openAdd}
                setOpen={setOpenAdd}
                refetchTotVariados={refetchTotVariados}
                refetchTotParcelados={refetchTotParcelados}
                periodo={periodo}
            />
        </MainLayout>
    );
};

export default Saidas;
