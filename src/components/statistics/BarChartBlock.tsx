import { FRACTION_COLORS } from "../../utils/fractionColors";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

interface BarChartBlockProps {
  data: {
    name: string;
    value: number; // totalCount
    weight: number;
    confidence: number; // avgConfidence (0–1)
  }[];
}

const CustomTooltip = ({
  active,
  payload,
  label,
}: {
  active?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  payload?: any;
  label?: string;
}) => {
  if (active && payload && payload.length) {
    const { value, weight, confidence } = payload[0].payload;
    return (
      <div className="bg-white shadow-md border border-gray-200 p-2 rounded text-sm">
        <p className="font-semibold">{label}</p>
        <p>{`Количество: ${value}`}</p>
        <p>{`Объём: ${(weight / 1_000_000).toFixed(4)} т`}</p>
        <p>{`Доля: ${confidence.toFixed(2)}%`}</p>
      </div>
    );
  }

  return null;
};

export default function BarChartBlock({ data }: BarChartBlockProps) {
  return (
    <div className="flex flex-col items-center w-full bg-white rounded-2xl shadow-lg pt-4">
      <h1 className="text-xl lg:text-2xl font-semibold mb-4 text-gray-800">
        Доля фракций, %
      </h1>
      <div className="w-full pr-4">
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={data}>
            <XAxis dataKey="name" />
            <YAxis tickFormatter={(value) => `${value}%`} width={50} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="confidence">
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={FRACTION_COLORS[entry.name] || "#888"}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
