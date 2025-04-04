import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "./ui/chart";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "./ui/card";

interface Props {
    data: { categoria: string; total: string }[];
}

export const GraficoTotSaidasCategoria: React.FC<Props> = ({ data }) => {
    if (!data || !Array.isArray(data)) return null;

    const formattedData = data.map((item) => ({
        ...item,
        total: parseFloat(item.total) || 0,
    }));

    const chartConfig = {
        total: {
            label: "Total",
            color: "#9735cc",
        },
    } satisfies ChartConfig;
    if (data.length === 0) {
        return (
            <Card className="w-full">
                <CardHeader>
                    <CardTitle className="text-xl">Saídas por Categoria</CardTitle>
                </CardHeader>
                <CardContent className="h-[300px] w-full flex items-center justify-center">
                    <p className="text-muted-foreground">Nenhum dado disponível.</p>
                </CardContent>
            </Card>
        );
    }


    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle className="text-xl">Saídas por Categoria</CardTitle>
            </CardHeader>
            <CardContent >
                <ChartContainer config={chartConfig} className="h-[300px] w-full">
                    <BarChart
                        data={formattedData}
                        layout="vertical"
                        margin={{ left: 20, right: 20 }}
                    >
                        <CartesianGrid vertical={false} />
                        <XAxis type="number" hide />
                        <YAxis
                            type="category"
                            dataKey="categoria"
                            tickLine={false}
                            tickMargin={2}
                            axisLine={false}
                        />
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent hideLabel />}
                        />
                        <Bar dataKey="total" fill="var(--color-total)" radius={5} />
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
};
