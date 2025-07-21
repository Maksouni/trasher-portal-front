import { Skeleton } from "@mui/material";
import StatsBlock from "../../components/statistics/StatsBlock";
import BarChartRounded from "@mui/icons-material/BarChartRounded";
import StreamIcon from "@mui/icons-material/Stream";

interface StatsSummaryProps {
  loading: boolean;
}

export default function StatsSummary({ loading }: StatsSummaryProps) {
  const totalCount = 25000;
  const accuracy = 50;

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
            title="Количество обнаружений"
          />
          <StatsBlock
            icon={<StreamIcon />}
            value={`${accuracy} %`}
            title="Общая точность"
          />
        </>
      )}
    </div>
  );
}
