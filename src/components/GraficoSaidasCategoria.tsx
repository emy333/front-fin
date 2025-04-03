import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { ChartContainer } from "./ui/chart";

interface Props {
    data: { categoria: string; total: string }[];
}

export const GraficoTotSaidasCategoria: React.FC<Props> = ({ data }) => {
    console.log("Dados recebidos:", data);

    return (
        <div className="flex justify-center items-center w-full h-[300px]">
            <ChartContainer config={{}} className="w-full h-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data}>
                        <XAxis dataKey="categoria" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="total" fill={"#c6a9db"} />
                    </BarChart>
                </ResponsiveContainer>
            </ChartContainer>
        </div>
    );
};
