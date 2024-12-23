
import {
    Table,
    TableBody,
    TableFooter,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"


interface Invoice {
    invoice: string;
    paymentStatus: string;
    totalAmount: string;
    paymentMethod: string;
}

const GatosVariaveis = () => {
    const gastos: Invoice[] = [
        { invoice: "INV001", paymentStatus: "Paid", totalAmount: "$250.00", paymentMethod: "Credit Card" },
        { invoice: "INV002", paymentStatus: "Pending", totalAmount: "$150.00", paymentMethod: "PayPal" },
        { invoice: "INV003", paymentStatus: "Unpaid", totalAmount: "$350.00", paymentMethod: "Bank Transfer" },
        { invoice: "INV004", paymentStatus: "Unpaid", totalAmount: "$350.00", paymentMethod: "Bank Transfer" },
        { invoice: "INV005", paymentStatus: "Unpaid", totalAmount: "$350.00", paymentMethod: "Bank Transfer" },
        { invoice: "INV006", paymentStatus: "Unpaid", totalAmount: "$350.00", paymentMethod: "Bank Transfer" },

    ];

    const columns = [
        { label: "Invoice", field: "invoice" },
        { label: "Status", field: "paymentStatus" },
        { label: "Method", field: "paymentMethod" },
        { label: "Amount", field: "totalAmount" },
    ];


    
    return (

        <div className="flex flex-col h-full border rounded-lg">
            <div className="flex-1 overflow-auto">
                <Table className="table-fixed w-full">
                    <TableHeader className="sticky top-0 z-10 bg-background border-b-2 border-gray-200">
                        <TableRow>
                            {columns.map((col) => (
                                <TableHead key={col.label} className="px-4 py-2 text-left">
                                    {col.label}
                                </TableHead>
                            ))} 
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {gastos.map((gasto) => (
                            <TableRow key={gasto.invoice} className="border-b">
                                <TableCell className="px-4 py-2">{gasto.invoice}</TableCell>
                                <TableCell className="px-4 py-2">{gasto.paymentStatus}</TableCell>
                                <TableCell className="px-4 py-2">{gasto.paymentMethod}</TableCell>
                                <TableCell className="px-4 py-2">{gasto.totalAmount}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            <Table className="table-fixed w-full">
                <TableFooter className="bg-background border-t">
                    <TableRow>
                        <TableCell colSpan={3} className="px-4 py-2"></TableCell>
                        <TableCell className="text-left px-4 py-2">$3,500.00</TableCell>
                    </TableRow>
                </TableFooter>
            </Table>
        </div>

    );
};

export default GatosVariaveis;
