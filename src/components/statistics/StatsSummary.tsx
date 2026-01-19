import { Skeleton } from "@mui/material";
import StatsBlock from "../../components/statistics/StatsBlock";
import BarChartRounded from "@mui/icons-material/BarChartRounded";
import StreamIcon from "@mui/icons-material/Stream";
import { useCharts } from "../../context/charts/useChart";

interface StatsSummaryProps {
  data: {
    categoryName: string;
    totalCount: number;
    avgConfidence: number;
  }[];
}

export default function StatsSummary({ data }: StatsSummaryProps) {
  const { loading, period } = useCharts();
  // Например, суммируем количество и среднюю точность по всем категориям
  const totalCount = data.reduce((acc, cur) => acc + cur.totalCount, 0);
  const accuracy =
    data.length > 0
      ? (data.reduce((acc, cur) => acc + cur.avgConfidence, 0) / data.length) *
        100
      : 0;

  return (
    <div className="flex flex-col items-center justify-center sm:flex-row gap-3">
      {loading ? (
        <>
          <Skeleton
            variant="rounded"
            sx={{ borderRadius: 4 }}
            width={303}
            height={84}
          />
          <Skeleton
            variant="rounded"
            sx={{ borderRadius: 4 }}
            width={303}
            height={84}
          />
        </>
      ) : (
        <>
          <StatsBlock
            icon={<BarChartRounded />}
            value={totalCount.toLocaleString("ru-RU")}
            title={
              period == "5min"
                ? "Количество обнаружений (за день)"
                : "Количество обнаружений"
            }
          />
          <StatsBlock
            icon={<StreamIcon />}
            value={`${accuracy.toFixed(2)} %`}
            title={
              period == "5min" ? "Общая точность (за день)" : "Общая точность"
            }
          />
        </>
      )}
    </div>
  );
}
