import StatsBlock from "../../components/statistics/StatsBlock";
import ChartBlock from "../../components/statistics/ChartBlock";
import "./styles.scss";
import { BarChartRounded, PercentRounded } from "@mui/icons-material";
import { useState } from "react";
import DateFilter from "../../components/filters/DateFilter";

export default function StatisticsPage() {
  const totalCount = 25000;
  const accuracy = 50;
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);

  const handleStartDateChange = (date: string) => {
    setStartDate(date);
    if (endDate && date > endDate) {
      setEndDate(date);
    }
  };

  const handleEndDateChange = (date: string) => {
    setEndDate(date);
  };

  return (
    <div className="statistics-page">
      <div className="stats-container">
        <div className="stats-blocks-list">
          <StatsBlock
            icon={<BarChartRounded className="icon bar-chart" />}
            value={totalCount.toLocaleString("ru-RU")}
            title="Общее количество обнаружений"
          />
          <StatsBlock
            icon={<PercentRounded className="icon percent" />}
            value={`${accuracy}%`}
            title="Общая точность"
          />
        </div>
        <div className="charts-container">
          <ChartBlock title="ПЭТ бутылки" />
          <ChartBlock title="Алюминиевые банки" />
          <ChartBlock title="Стеклянные бутылки" />
        </div>
      </div>
      <div className="filters-container">
        <h2>Фильтры</h2>
        <DateFilter
          label="Выберите промежуток времени"
          startDate={startDate}
          endDate={endDate}
          onStartDateChange={handleStartDateChange}
          onEndDateChange={handleEndDateChange}
        />
      </div>
    </div>
  );
}
