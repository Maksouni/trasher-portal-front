import { PieChart } from "@mui/x-charts";
import { useMediaQuery, useTheme } from "@mui/material";
import { FRACTION_COLORS } from "../../utils/fractionColors";
import { FractionData } from "../../types/fraction.types";

interface PieChartBlockProps {
  data: FractionData[];
}

export default function PieChartBlock({ data }: PieChartBlockProps) {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const pieParams = isSmallScreen
    ? { margin: { left: 100 }, height: 600 }
    : { margin: { right: 225 }, height: 300 };

  return (
    <div className="flex items-center w-full bg-white rounded-2xl shadow-lg p-1 lg:p-8">
      <div className="flex w-full">
        <PieChart
          series={[
            {
              data: data.map((item) => ({
                id: item.id,
                label: item.categoryName,
                value: item.totalCount, // для размера сектора
                weight: item.weight,
                confidence: item.avgConfidence,
                color: FRACTION_COLORS[item.categoryName] || "#CCCCCC",
              })),
              // кастомный вывод в тултипе
              valueFormatter: (_val, context) => {
                const idx = context.dataIndex!;
                const item = data[idx];
                return `Количество: ${item.totalCount},
                  Объём: ${(item.weight / 1_000_000).toFixed(2)} т,
                  Средняя точность: ${(item.avgConfidence * 100).toFixed(1)}%`;
              },
              highlightScope: { fade: "global", highlight: "item" },
              faded: {
                innerRadius: 30,
                additionalRadius: -30,
                color: "gray",
              },
            },
          ]}
          tooltip={{ trigger: "item" }}
          {...pieParams}
          slotProps={{
            legend: isSmallScreen
              ? {
                  padding: { bottom: 50 },
                  direction: "row",
                  position: { horizontal: "middle", vertical: "bottom" },
                }
              : {},
          }}
        />
      </div>
    </div>
  );
}
