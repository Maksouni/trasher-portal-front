import formatWeight from "../../utils/formatWeight";
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
    share: number;
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
    const { share, value, weight, confidence } = payload[0].payload;

    return (
      <div className="bg-white shadow-md border border-gray-200 p-2 rounded text-sm">
        <p className="font-semibold">{label}</p>
        <p>{`Доля: ${share.toFixed(2)}%`}</p>
        <p>{`Количество: ${value}`}</p>
        <p>{`Объём: ${formatWeight(weight)}`}</p>{" "}
        <p>{`Средняя точность: ${confidence.toFixed(2)}%`}</p>
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
            <YAxis
              domain={[0, 100]}
              tickFormatter={(value) => `${value}%`}
              width={50}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="share">
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
