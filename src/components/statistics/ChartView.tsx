import { Stack, Skeleton, Typography } from "@mui/material";
import { DailyReport } from "../../types/chart.types";
import BarChartBlock from "./BarChartBlock";
import ChartBlock from "./ChartBlock";
import PieChartBlock from "./PieChartBlock";

interface ChartViewProps {
  option: string;
  loading: boolean;
  summaryData: {
    categoryName: string;
    totalCount: number;
    avgConfidence: number;
  }[];
  dailyData: DailyReport[];
}

export default function ChartView({
  option,
  loading,
  summaryData,
  dailyData,
}: ChartViewProps) {
  if (option === "pie") {
    return (
      <PieChartBlock
        data={summaryData.map((i) => ({
          id: i.categoryName, // если есть id, или просто name
          name: i.categoryName,
          value: i.totalCount,
        }))}
      />
    );
  }

  if (option === "bar") {
    return (
      <BarChartBlock
        data={summaryData.map((item) => ({
          name: item.categoryName,
          value: item.totalCount,
          confidence: item.avgConfidence,
        }))}
      />
    );
  }
  const grouped = dailyData.reduce((acc, item) => {
    if (!acc[item.categoryName]) acc[item.categoryName] = [];
    acc[item.categoryName].push(item);
    return acc;
  }, {} as Record<string, DailyReport[]>);

  // option === "linear"
  return (
    <div className="charts-container">
      <ul className="list-none flex flex-col gap-5 lg:gap-4">
        {loading ? (
          <Stack spacing={2}>
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton
                key={i}
                variant="rounded"
                sx={{ borderRadius: 4 }}
                width="100%"
                height={400}
              />
            ))}
          </Stack>
        ) : Object.entries(grouped).length > 0 ? (
          Object.entries(grouped).map(([categoryName, items]) => (
            <li key={categoryName}>
              <ChartBlock title={categoryName} data={items} />
            </li>
          ))
        ) : (
          <Typography color="error">Нет данных для отображения</Typography>
        )}
      </ul>
    </div>
  );
}
