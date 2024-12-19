
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
        { invoice: "INV003", paymentStatus: "Unpaid", totalAmount: "$350.00", paymentMethod: "Bank Transfer" },
        { invoice: "INV003", paymentStatus: "Unpaid", totalAmount: "$350.00", paymentMethod: "Bank Transfer" },
        { invoice: "INV003", paymentStatus: "Unpaid", totalAmount: "$350.00", paymentMethod: "Bank Transfer" },

    ];

    const columns = [
        { label: "Invoice", field: "invoice" },
        { label: "Status", field: "paymentStatus" },
        { label: "Method", field: "paymentMethod" },
        { label: "Amount", field: "totalAmount" },
    ];

    return (
        <div className="max-h-[50vh] overflow-hidden border rounded-lg flex flex-col">
            <div className="relative overflow-x-auto flex-1">
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
                    <tbody className="overflow-auto">
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
                    <tfoot>
                        <tr className="sticky ">
                            <td className="px-6 py-1 font-semibold">
                                Total:
                            </td>
                            <td colSpan={2} className="px-2 py-3 font-semibold text-right">
                            </td>
                            <td className="px-6 py-1  font-semibold">
                                R$ 100,00
                            </td>
                        </tr>
                    </tfoot>
                </table>
            </div>
        </div>

    );
};

export default GatosVariaveis;
