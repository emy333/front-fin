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
    data?: { categoria: string; total: string }[];
}

export const GraficoTotSaidasCategoria: React.FC<Props> = ({ data }) => {
    const chartConfig = {
        total: {
            label: "Total",
            color: "#9735cc",
        },
    } satisfies ChartConfig;

    // Skeleton de carregamento enquanto os dados não foram carregados
    if (!data) {
        return (
            <Card className="w-full">
                <CardHeader>
                    <CardTitle className="text-xl">Saídas por Categoria</CardTitle>
                </CardHeader>
                <CardContent className="h-[300px] w-full">
                    <div className="h-full w-full animate-pulse bg-muted rounded-md" />
                </CardContent>
            </Card>
        );
    }

    // Estado de lista vazia
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

    // Formatação dos dados
    const formattedData = data.map((item) => ({
        ...item,
        total: parseFloat(item.total) || 0,
    }));

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle className="text-xl">Saídas por Categoria</CardTitle>
            </CardHeader>
            <CardContent className="w-full">
                <ChartContainer config={chartConfig} className="h-full w-full">
                    <BarChart
                        data={formattedData}
                        layout="vertical"
                        margin={{ left: 12, right: 12 }}
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
