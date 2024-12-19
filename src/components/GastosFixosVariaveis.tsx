
interface Invoice {
    invoice: string;
    paymentStatus: string;
    totalAmount: string;
    paymentMethod: string;
}

const GatosFixosVariaveis = () => {
    const gastos: Invoice[] = [
        { invoice: "INV001", paymentStatus: "Paid", totalAmount: "$250.00", paymentMethod: "Credit Card" },
        { invoice: "INV002", paymentStatus: "Pending", totalAmount: "$150.00", paymentMethod: "PayPal" },
        { invoice: "INV003", paymentStatus: "Unpaid", totalAmount: "$350.00", paymentMethod: "Bank Transfer" },
    ];

    const columns = [
        { label: "Invoice", field: "invoice" },
        { label: "Status", field: "paymentStatus" },
        { label: "Method", field: "paymentMethod" },
        { label: "Amount", field: "totalAmount" },
    ];

    return (
        <div className="max-h-[50vh] overflow-auto border rounded-lg">
            <div className="relative overflow-x-auto">
                <table className="w-full text-sm text-left rtl:text-right">
                    <thead className="text-xs uppercase">
                        <tr className="border-b-2 border-gray-300">
                            {columns.map((col) => (
                                <th key={col.label} scope="col" className="px-6 py-3">
                                    {col.label}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {gastos.map((gasto) => (
                            <tr key={gasto.invoice} className="border-b">
                                {columns.map((col) => (
                                    <td key={col.field} className="px-6 py-4">
                                        {gasto[col.field as keyof Invoice]} 
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default GatosFixosVariaveis;
