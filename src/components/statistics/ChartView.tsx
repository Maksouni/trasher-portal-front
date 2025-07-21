import { Stack, Skeleton, Typography } from "@mui/material";
import ChartBlock from "../../components/statistics/ChartBlock";
import PieChartBlock from "../../components/statistics/PieChartBlock";
import { ChartType } from "../../types/chart.types";

interface ChartViewProps {
  option: string;
  loading: boolean;
  charts: ChartType[];
}

export default function ChartView({ option, loading, charts }: ChartViewProps) {
  if (option === "pie") {
    return <PieChartBlock data={charts} />;
  }

  return (
    <div className="charts-container">
      <ul className="list-none flex flex-col gap-3 lg:gap-4">
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
        ) : charts.length > 0 ? (
          charts.map((chart) => (
            <li key={chart.id}>
              <ChartBlock title={chart.name} />
            </li>
          ))
        ) : (
          <Typography color="error">Нет данных для отображения</Typography>
        )}
      </ul>
    </div>
  );
}
