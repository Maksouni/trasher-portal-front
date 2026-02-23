/* eslint-disable @typescript-eslint/no-explicit-any */
import { Skeleton, Typography, Box, alpha } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { DailyReport } from "../../types/chart.types";
import BarChartBlock from "./BarChartBlock";
import ChartBlock from "./ChartBlock";
import PieChartBlock from "./PieChartBlock";
import { useCharts } from "../../context/charts/useChart";

const glassStyle = {
  background: (theme: any) => alpha(theme.palette.background.paper, 0.6),
  backdropFilter: "blur(12px)",
  borderRadius: "20px",
  border: "1px solid",
  borderColor: (theme: any) => alpha(theme.palette.divider, 0.1),
  p: { xs: 2, sm: 3 },
  height: "100%",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  boxSizing: "border-box",
};

const EmptyState = () => (
  <Box
    sx={{
      ...glassStyle,
      textAlign: "center",
      height: "80px",
      width: "100%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 500 }}>
      Нет данных для отображения за выбранный период
    </Typography>
  </Box>
);

export default function ChartView() {
  const { chartOption, isDataLoading, period, dailyData, summaryData } =
    useCharts();

  if (isDataLoading) {
    return (
      <Grid container spacing={3}>
        {Array.from({ length: 4 }).map((_, i) => (
          <Grid size={{ xs: 12, lg: 6 }} key={i}>
            <Skeleton
              variant="rounded"
              height={450}
              sx={{
                borderRadius: "20px",
                bgcolor: (theme) => alpha(theme.palette.background.paper, 0.4),
              }}
            />
          </Grid>
        ))}
      </Grid>
    );
  }

  if (chartOption === "pie") {
    if (summaryData.length === 0) return <EmptyState />;
    return (
      <Box sx={glassStyle}>
        <PieChartBlock
          data={summaryData.map((i, index) => ({ ...i, id: index + 1 }))}
        />
      </Box>
    );
  }

  if (chartOption === "bar") {
    if (summaryData.length === 0) return <EmptyState />;
    const total = summaryData.reduce((acc, item) => acc + item.totalCount, 0);
    return (
      <Box sx={{ ...glassStyle, p: 3, height: 450 }}>
        <BarChartBlock
          data={summaryData.map((item) => ({
            ...item,
            name: item.categoryName,
            value: item.totalCount,
            confidence: item.avgConfidence * 100,
            share: total > 0 ? (item.totalCount / total) * 100 : 0,
          }))}
        />
      </Box>
    );
  }

  const grouped = dailyData.reduce(
    (acc, item) => {
      if (!acc[item.categoryName]) acc[item.categoryName] = [];
      acc[item.categoryName].push(item);
      return acc;
    },
    {} as Record<string, DailyReport[]>,
  );

  const categories = Object.entries(grouped);

  if (categories.length === 0) {
    return <EmptyState />;
  }

  return (
    <Grid container spacing={2}>
      {categories.map(([categoryName, items]) => (
        <Grid size={{ xs: 12, lg: 6 }} key={categoryName}>
          <Box sx={glassStyle}>
            <ChartBlock title={categoryName} data={items} period={period} />
          </Box>
        </Grid>
      ))}
    </Grid>
  );
}
