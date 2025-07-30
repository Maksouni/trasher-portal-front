import { PieChart } from "@mui/x-charts";
import { useMediaQuery, useTheme } from "@mui/material";
import { FRACTION_COLORS } from "../../utils/fractionColors";

interface PieChartProps {
  data: {
    id: number | string;
    name: string;
    value: number;
  }[];
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
              data: data.map((chart) => ({
                id: chart.id,
                value: chart.value,
                label: chart.name,
                color: FRACTION_COLORS[chart.name] || "#CCCCCC",
              })),
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
