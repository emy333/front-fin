import { BarChart, Bar, XAxis, CartesianGrid } from "recharts";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "./ui/chart";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

interface Props {
    data?: { mes: number; total: string }[];
}

export const GraficoTotSaidasAno: React.FC<Props> = ({ data }) => {
    const chartConfig = {
        total: {
            label: "Total",
            color: "#9735cc",
        }
    } satisfies ChartConfig;

    const meses = ["JAN", "FEV", "MAR", "ABR", "MAI", "JUN", "JUL", "AGO", "SET", "OUT", "NOV", "DEZ"];

    // Se os dados ainda não chegaram, exibe um esqueleto
    if (!data) {
        return (
            <Card className="w-full">
                <CardHeader>
                    <CardTitle className="text-xl">Total de Saídas Mês a Mês</CardTitle>
                </CardHeader>
                <CardContent className="h-[300px] w-full">
                    <div className="h-full w-full animate-pulse bg-muted rounded-md" />
                </CardContent>
            </Card>
        );
    }

    // Se a lista estiver vazia
    if (data.length === 0) {
        return (
            <Card className="w-full">
                <CardHeader>
                    <CardTitle className="text-xl">Total de Saídas Mês a Mês</CardTitle>
                </CardHeader>
                <CardContent className="h-[300px] w-full flex items-center justify-center">
                    <p className="text-sm text-muted-foreground">Nenhum dado disponível.</p>
                </CardContent>
            </Card>
        );
    }

    const formattedData = data.map(item => ({
        ...item,
        total: parseFloat(item.total) || 0,
    }));

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
