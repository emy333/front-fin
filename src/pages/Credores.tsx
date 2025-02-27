import MainLayout from "@/layouts/main";
import { MdAddCard } from "react-icons/md";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import TableCredores from "@/components/Credores/TableCredores";
import AdicionarCredores from "@/components/Credores/AdicionarCredores";

const Credores = () => {
    const [openAdd, setOpenAdd] = useState(false);

    return (
        <MainLayout>
            <div className="flex justify-between items-center mb-5 ">
                <div className="flex flex-row gap-4 items-center">
                    <h1 className="text-[25px]">Credores</h1>
                </div>
                <div className="flex flex-row gap-2 text-center items-center">
                    <Button
                        variant="secondary"
                        onClick={() => setOpenAdd(true)}
                        className="flex flex-row gap-5 p-4 font-medium">
                        <MdAddCard />
                        <span className="hidden sm:inline">Adicionar Credor</span>
                    </Button>

                </div>
            </div>

            <div className=" gap-6 md:min-h-[70vh] max-h-[70vh] ">
                <div className="flex flex-col h-full mb-5 ">
                    <TableCredores />
                </div>

            </div>

            <AdicionarCredores
                open={openAdd}
                setOpen={setOpenAdd}
            />

        </MainLayout>
    )
}

export default Credores;