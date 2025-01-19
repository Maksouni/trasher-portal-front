import StatsBlock from "../../components/statistics/StatsBlock";
import ChartBlock from "./ChartBlock";
import "./styles.scss";
import { BarChartRounded, PercentRounded } from "@mui/icons-material";

export default function StatisticsPage() {
  const totalCount = 25000;
  const accuracy = 50;

  return (
    <div className="statistics-page">
      <div className="stats-container">
        <div className="stats-blocks-list">
          <StatsBlock
            icon={<BarChartRounded className="icon bar-chart" />}
            label={`Количество обнаружений: ${totalCount}`}
          />
          <StatsBlock
            icon={<PercentRounded className="icon percent" />}
            label={`Общая точность: ${accuracy}%`}
          />
        </div>
        <div className="charts-container">
          <ChartBlock title="Бутылки"/>
        </div>
      </div>
      <div className="filters-container"></div>
    </div>
  );
}
