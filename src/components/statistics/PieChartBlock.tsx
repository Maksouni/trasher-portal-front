import { PieChart } from "@mui/x-charts";
import { ChartType } from "../../pages/statistics/StatisticsPage";
import { useMediaQuery, useTheme } from "@mui/material";

interface PieChartProps {
  data: ChartType[];
}

export default function PieChartBlock({ data }: PieChartProps) {
  const hardcodedValues = [105, 157, 212, 76];
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
              data: data.map((chart, index) => ({
                id: chart.id,
                value: hardcodedValues[index % hardcodedValues.length],
                label: chart.name,
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
