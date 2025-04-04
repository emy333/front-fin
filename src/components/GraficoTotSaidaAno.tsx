import { BarChart, Bar, XAxis, CartesianGrid } from "recharts";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "./ui/chart";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

interface Props {
    data: { mes: number; total: string }[];
}

export const GraficoTotSaidasAno: React.FC<Props> = ({ data }) => {
    if (!data || !Array.isArray(data)) {
        return null;
    }

    const formattedData = data.map(item => ({
        ...item,
        total: parseFloat(item.total) || 0,
    }));

    const chartConfig = {
        total: {
            label: "Total",
            color: "#9735cc",
        }
    } satisfies ChartConfig;

    const meses = ["JAN", "FEV", "MAR", "ABR", "MAI", "JUN", "JUL", "AGO", "SET", "OUT", "NOV", "DEZ"];

    if (data.length === 0) {
        return (
            <Card className=" w-full">
                <CardHeader>
                    <CardTitle className="text-xl">Saídas por Categoria</CardTitle>
                </CardHeader>
                <CardContent className="h-[300px] w-full">
                    <p>Nenhum dado disponível.</p>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle className="text-xl">Total de Saídas Mês a Mês</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px] w-full">
                <ChartContainer config={chartConfig} className="h-full w-full">
                    <BarChart
                        accessibilityLayer
                        data={formattedData}
                        margin={{ left: 12, right: 12 }}
                    >
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="mes"
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
                            tickFormatter={(value: number) => meses[value - 1] || ""}
                        />
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent indicator="dashed" />}
                        />
                        <Bar dataKey="total" fill="var(--color-total)" radius={4} />
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>

    );
};
