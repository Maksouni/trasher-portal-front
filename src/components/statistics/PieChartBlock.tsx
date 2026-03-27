import { PieChart } from "@mui/x-charts";
import { useMediaQuery, useTheme } from "@mui/material";
import { getFractionColor } from "../../utils/fractionColors";

const DEMO_VALUES = [105, 157, 212, 76];

export type PieChartDatum = {
  id: number | string;
  name?: string;
  categoryName?: string;
  totalCount?: number;
  value?: number;
};

interface PieChartProps {
  data: PieChartDatum[];
}

export default function PieChartBlock({ data }: PieChartProps) {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const pieParams = isSmallScreen
    ? {
        margin: { left: 100 },
        height: 600,
      }
    : {
        margin: { right: 225 },
        height: 300,
      };

  return (
    <div className="flex items-center w-full bg-white rounded-2xl shadow-lg p-1 lg:p-8">
      <div className="flex w-full">
        <PieChart
          series={[
            {
              data: data.map((chart, index) => {
                const label = chart.categoryName ?? chart.name ?? "—";
                const raw =
                  chart.totalCount ?? chart.value ?? DEMO_VALUES[index % DEMO_VALUES.length];
                const value = typeof raw === "number" ? raw : Number(raw) || 0;
                return {
                  id: chart.id,
                  value,
                  label,
                  color: getFractionColor(label, theme.palette.primary.main),
                };
              }),
              highlightScope: { fade: "global", highlight: "item" },
              faded: {
                innerRadius: 30,
                additionalRadius: -30,
                color: "gray",
              },
            },
          ]}
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
