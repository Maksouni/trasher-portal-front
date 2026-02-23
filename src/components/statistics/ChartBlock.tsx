/* eslint-disable @typescript-eslint/no-explicit-any */
import { LineChart } from "@mui/x-charts";
import { Box, Typography, useTheme, useMediaQuery } from "@mui/material";
import { FRACTION_COLORS } from "../../utils/fractionColors";
import { DailyReport, PeriodType } from "../../types/chart.types";

interface ChartBlockProps {
  title: string;
  data: DailyReport[];
  period: PeriodType;
}

const RU_MONTHS = [
  "Январь",
  "Февраль",
  "Март",
  "Апрель",
  "Май",
  "Июнь",
  "Июль",
  "Август",
  "Сенябрь",
  "Октябрь",
  "Ноябрь",
  "Декабрь",
];

export default function ChartBlock({ title, data, period }: ChartBlockProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const sortedData = [...data].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
  );

  const xLabels = sortedData.map((d) =>
    new Date(period === "5min" ? (d.ts ?? d.date) : d.date).getTime(),
  );

  const countData = sortedData.map((d) => Number(d.count || 0));
  const confidenceData = sortedData.map((d) =>
    Math.round(Number(d.avgConfidence || 0) * 100),
  );

  const mainColor = FRACTION_COLORS[title] || theme.palette.primary.main;

  const xFormatter = (timestamp: any) => {
    const date = new Date(timestamp);
    if (period === "5min") {
      return date.toLocaleTimeString("ru-RU", {
        hour: "2-digit",
        minute: "2-digit",
      });
    }
    if (period === "month") {
      return RU_MONTHS[date.getMonth()];
    }
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    return `${day}.${month}`;
  };

  return (
    <Box
      sx={{ width: "100%", height: isMobile ? 380 : 420, position: "relative" }}
    >
      <Typography variant="h6" sx={{ fontWeight: 700, color: "text.primary" }}>
        {title}
      </Typography>

      <Box sx={{ position: "absolute", top: 60, left: 5, zIndex: 1 }}>
        <Typography
          variant="caption"
          sx={{ fontWeight: 600, color: "text.secondary" }}
        >
          Обнаружено, шт.
        </Typography>
      </Box>
      <Box
        sx={{
          position: "absolute",
          top: 60,
          right: 10,
          zIndex: 1,
          textAlign: "right",
        }}
      >
        <Typography
          variant="caption"
          sx={{ fontWeight: 600, color: "text.secondary" }}
        >
          Точность, %
        </Typography>
      </Box>

      <LineChart
        height={isMobile ? 300 : 350}
        series={[
          {
            data: countData,
            label: "Обнаружено, шт.",
            yAxisId: "leftAxisId",
            color: mainColor,
            showMark: true,
          },
          {
            data: confidenceData,
            label: "Точность, %",
            yAxisId: "rightAxisId",
            color: "#FF6F00",
            showMark: true,
          },
        ]}
        xAxis={[
          {
            scaleType: "time",
            data: xLabels,
            valueFormatter: xFormatter,
            tickInterval: xLabels,
          },
        ]}
        yAxis={[{ id: "leftAxisId" }, { id: "rightAxisId", min: 0, max: 100 }]}
        leftAxis="leftAxisId"
        rightAxis="rightAxisId"
        slotProps={{
          legend: {
            direction: "row",
            position: { vertical: "bottom", horizontal: "middle" },
            padding: 0,
          },
        }}
        margin={{ top: 85, right: 70, bottom: 60, left: 60 }}
        sx={{
          "& .MuiChartsAxis-bottom .MuiChartsAxis-tickLabel": {
            fontSize: isMobile ? "0.65rem" : "0.75rem",
          },
        }}
      />
    </Box>
  );
}
