/* eslint-disable @typescript-eslint/no-explicit-any */
import { PieChart } from "@mui/x-charts";
import { useMediaQuery, useTheme, Box } from "@mui/material";
import { FRACTION_COLORS } from "../../utils/fractionColors";
import { FractionData } from "../../types/fraction.types";
import formatWeight from "../../utils/formatWeight";

interface PieChartBlockProps {
  data: FractionData[];
}

export default function PieChartBlock({ data }: PieChartBlockProps) {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const chartHeight = isSmallScreen ? 500 : 400;
  const margin = isSmallScreen
    ? { top: 20, bottom: 150, left: 20, right: 20 }
    : { top: 40, bottom: 40, left: 40, right: 200 };

  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <PieChart
        height={chartHeight}
        margin={margin}
        series={[
          {
            data: data.map((item) => ({
              id: item.id,
              label: item.categoryName,
              value: item.totalCount,
              weight: item.weight,
              confidence: item.avgConfidence,
              color:
                FRACTION_COLORS[item.categoryName] || theme.palette.grey[400],
            })),
            innerRadius: isSmallScreen ? 40 : 60,
            outerRadius: isSmallScreen ? 100 : 140,
            paddingAngle: 3,
            cornerRadius: 8,
            highlightScope: { fade: "global", highlight: "item" },
            faded: { innerRadius: 30, additionalRadius: -30, color: "gray" },

            valueFormatter: (item: any) => {
              return `Кол-во: ${item.value} шт.\nВес: ${formatWeight(item.weight)}\nТочность: ${(item.confidence * 100).toFixed(1)}%`;
            },
          },
        ]}
        slotProps={{
          legend: {
            direction: isSmallScreen ? "row" : "column",
            position: {
              vertical: isSmallScreen ? "bottom" : "middle",
              horizontal: isSmallScreen ? "middle" : "right",
            },
            padding: isSmallScreen ? 10 : 20,
            labelStyle: {
              fontSize: 14,
              fontWeight: 500,
              fill: theme.palette.text.primary,
            },
            itemMarkWidth: 12,
            itemMarkHeight: 12,
            markGap: 10,
            itemGap: 15,
          },
        }}
      />
    </Box>
  );
}
