import { Form } from "../ui/form";
import { Dialog, DialogContent } from "../ui/dialog";
import { DialogHeader } from "../ui/dialog";

interface AddEntradaProps {
    open: boolean;
    setOpen: (value: boolean) => void;
}

const AdicionarEntradas: React.FC<AddEntradaProps> = ({ open, setOpen }) => {
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-[50%]">
                <DialogHeader>
                    <h1 className="font-bold text-lg">Adicionar Entrada</h1>
                </DialogHeader>
             
            </DialogContent>
        </Dialog>
    )
}

export default AdicionarEntradas;