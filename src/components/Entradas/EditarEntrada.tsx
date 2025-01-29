import { Form } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader } from "../ui/dialog";

interface EditaEntradaProps {
    open: boolean;
    setOpen: (value: boolean) => void;
    idEntrada: number;
} 

const EditarEntrada: React.FC<EditaEntradaProps> =  ({ open, setOpen, idEntrada }) => {
    
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-[50%]">
                <DialogHeader>
                    <h1 className="font-bold text-lg">Visualizar Entrada</h1>
                </DialogHeader>

                {/* <Form {...form}>
                    <form className="space-y-3">
                    </form>
                </Form> */}
            </DialogContent>
        </Dialog>

    )
}

export default EditarEntrada; 