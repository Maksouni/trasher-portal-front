import StatsBlock from "../../components/statistics/StatsBlock";
import "./styles.scss";
import { BarChartRounded } from "@mui/icons-material";

export default function StatisticsPage() {
  return (
    <div className="statistics-page">
      <StatsBlock
        icon={<BarChartRounded className="icon bar-chart" />}
        label="azaza"
      />
    </div>
  );
}
