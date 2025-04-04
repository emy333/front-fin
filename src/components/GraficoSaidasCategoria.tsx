import { BarChart, Bar, XAxis, CartesianGrid } from "recharts";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "./ui/chart";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

interface Props {
    data: { categoria: string; total: string }[]; 
  }
  

export const GraficoTotSaidasCategoria: React.FC<Props> = ({ data }) => {
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
    } satisfies ChartConfig

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-xl">Saídas por Categoria</CardTitle>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full"
                >
                    <BarChart
                        accessibilityLayer
                        data={formattedData}
                        margin={{
                            left: 12,
                            right: 12,

                        }}
                    >
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="categoria"
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
                            tickFormatter={(value) => value.slice(0, 5)}
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
