import MainLayout from "@/layouts/main";
import { MdAddCard } from "react-icons/md";
import { Button } from "@/components/ui/button";
import FiltroPeriodo from "@/components/FiltroPeriodo";
import { useState, useMemo } from "react";
import TableEntradas from "@/components/Entradas/TableEntradas";
import AdicionarEntradas from "@/components/Entradas/AdicionarEntradas";

const Entradas = () => {
    const [openAdd, setOpenAdd] = useState(false);

    const [selectedMonth, setSelectedMonth] = useState(() => {
        const currentMonth = (new Date().getMonth() + 1).toString().padStart(2, '0');
        return currentMonth;
    });

    const [ano, setAno] = useState(new Date().getFullYear());

    const periodo = useMemo(() => `${selectedMonth}-${ano}`, [selectedMonth, ano]);

    return (
        <MainLayout>
            <div className="flex justify-between items-center mb-5 ">
                <div className="flex flex-row gap-4 items-center">
                    <h1 className="text-[25px]">Entradas</h1>
                </div>
                <div className="flex flex-row gap-2 text-center items-center">
                    <Button
                        variant="secondary"
                        onClick={() => setOpenAdd(true)}
                        className="flex flex-row gap-5 p-4 font-medium">
                        <MdAddCard />
                        <span className="hidden sm:inline">Adicionar Entrada</span>
                    </Button>
                    <FiltroPeriodo
                        selectedMonth={selectedMonth}
                        setSelectedMonth={setSelectedMonth}
                        ano={ano}
                        setAno={setAno}
                    />
                </div>
            </div>

            <div className=" gap-6 md:min-h-[70vh] max-h-[70vh] ">
                <div className="flex flex-col h-full mb-5 ">
                    <TableEntradas periodo={periodo} />
                </div>
            </div>

            <AdicionarEntradas
                open={openAdd}
                setOpen={setOpenAdd}
            />
        </MainLayout>
    )
}

export default Entradas;