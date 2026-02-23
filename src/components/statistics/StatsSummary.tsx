import { Skeleton, Stack } from "@mui/material";
import StatsBlock from "../../components/statistics/StatsBlock";
import BarChartRounded from "@mui/icons-material/BarChartRounded";
import StreamIcon from "@mui/icons-material/Stream";
import { useCharts } from "../../context/charts/useChart";
import { alpha } from "@mui/material";

export default function StatsSummary() {
  const { isDataLoading, period, summaryData } = useCharts();

  const totalCount = summaryData.reduce((acc, cur) => acc + cur.totalCount, 0);
  const accuracy =
    summaryData.length > 0
      ? (summaryData.reduce((acc, cur) => acc + cur.avgConfidence, 0) /
          summaryData.length) *
        100
      : 0;

  return (
    <Stack
      direction={{ xs: "column", sm: "row" }}
      spacing={2}
      sx={{
        width: "100%",
        boxSizing: "border-box",
      }}
    >
      {isDataLoading ? (
        <>
          {[1, 2].map((i) => (
            <Skeleton
              key={i}
              variant="rounded"
              height={100}
              sx={{
                flex: 1,
                borderRadius: "16px",
                background: (theme) =>
                  alpha(theme.palette.background.paper, 0.4),
              }}
            />
          ))}
        </>
      ) : (
        <>
          <StatsBlock
            icon={<BarChartRounded sx={{ fontSize: 28 }} />}
            value={totalCount.toLocaleString("ru-RU")}
            title={
              period === "5min" ? "Обнаружения (день)" : "Всего обнаружений"
            }
          />
          <StatsBlock
            icon={<StreamIcon sx={{ fontSize: 28 }} />}
            value={`${accuracy.toFixed(2)} %`}
            title={period === "5min" ? "Точность (день)" : "Средняя точность"}
          />
        </>
      )}
    </Stack>
  );
}
