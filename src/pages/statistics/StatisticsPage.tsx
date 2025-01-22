import StatsBlock from "../../components/statistics/StatsBlock";
import ChartBlock from "../../components/statistics/ChartBlock";
import "./styles.scss";
import { BarChartRounded, PercentRounded } from "@mui/icons-material";
import { useState } from "react";
import DateFilter from "../../components/filters/DateFilter";
import CheckFilters from "../../components/filters/CheckFilters";

interface DataType{
  id: number,
  title: string
}

export default function StatisticsPage() {
  const totalCount = 25000;
  const accuracy = 50;

  
  const data = [
    {
      id: 1,
      title: "ПЭТ бутылки",
    },
    {
      id: 2,
      title: "Алюминиевые банки",
    },
    {
      id: 3,
      title: "Стеклянные бутылки",
    },
  ];

  const [filteredCharts, setFilteredCharts] = useState<DataType[]>(data)
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);

  const filters = ["ПЭТ бутылки", "Алюминиевые банки", "Стеклянные бутылки"];

  const handleToggleFilter = (filter: string) => {
    setSelectedFilters((prev) => {
      const updatedFilters = prev.includes(filter)
        ? prev.filter((f) => f !== filter)
        : [...prev, filter];

      setFilteredCharts(
        data.filter((item) =>
          updatedFilters.length === 0 || updatedFilters.includes(item.title)
        )
      );

      return updatedFilters;
    });
  };

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
          {filteredCharts.map((x) => (
            <ChartBlock title={x.title} />
          ))}
        </div>
      </div>
      <div className="filters-container">
        <h2 className="filters-heading">Фильтры</h2>
        <DateFilter
          label="Выберите промежуток времени"
          startDate={startDate}
          endDate={endDate}
          onStartDateChange={handleStartDateChange}
          onEndDateChange={handleEndDateChange}
        />
        <CheckFilters
          filters={filters}
          selectedFilters={selectedFilters}
          onToggleFilter={handleToggleFilter}
        />
      </div>
    </div>
  );
}
