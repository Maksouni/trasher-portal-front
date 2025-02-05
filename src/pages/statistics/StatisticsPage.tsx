import StatsBlock from "../../components/statistics/StatsBlock";
import ChartBlock from "../../components/statistics/ChartBlock";
import "./styles.scss";
import { BarChartRounded, Download, PercentRounded } from "@mui/icons-material";
import { useState } from "react";
import DateFilter from "../../components/filters/DateFilter";
import CheckFilters from "../../components/filters/CheckFilters";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/auth/useAuth";
import { Alert, Button, Snackbar } from "@mui/material";
import axios from "../../api/axios";
import { apiUrl } from "../../dotenv";

interface DataType {
  id: number;
  title: string;
}

export default function StatisticsPage() {
  const totalCount = 25000;
  const accuracy = 50;
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

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

  const [filteredCharts, setFilteredCharts] = useState<DataType[]>(data);
  const [startDate, setStartDate] = useState<string>(new Date().toISOString());
  const [endDate, setEndDate] = useState<string>(new Date().toISOString());
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const { logout } = useAuth();

  const filters = [
    "ПЭТ бутылки",
    "Алюминиевые банки",
    "Стеклянные бутылки",
    "ПЭТ пакет",
  ];

  const handleToggleFilter = (filter: string) => {
    setSelectedFilters((prev) => {
      const updatedFilters = prev.includes(filter)
        ? prev.filter((f) => f !== filter)
        : [...prev, filter];

      setFilteredCharts(
        data.filter(
          (item) =>
            updatedFilters.length === 0 || updatedFilters.includes(item.title)
        )
      );

      return updatedFilters;
    });
  };

  const handleStartDateChange = (date: string) => {
    setStartDate(new Date(date).toISOString());
    if (endDate && new Date(date) > new Date(endDate)) {
      setEndDate(new Date(date).toISOString());
    }
  };

  const handleEndDateChange = (date: string) => {
    setEndDate(new Date(date).toISOString());
  };

  const downloadFile = async () => {
    const date1 = startDate;
    const date2 = endDate;

    try {
      const response = await axios.get(
        `${apiUrl}reports?category=Plastic&from=${date1}&to=${date2}`,
        {
          responseType: "blob",
        }
      );

      const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // MIME-тип Excel
      });

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "report.xlsx"; // Имя файла
      document.body.appendChild(link);
      link.click();

      // Очистка
      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);
    } catch (error) {
      console.error("Ошибка скачивания:", error);
      setErrorMessage("Не удалось скачать отчёт. Попробуйте позже.");
    }
  };

  return (
    <div className="statistics-page">
      {/* удалить потом */}
      <nav>
        <Link
          style={{
            position: "absolute",
            top: 2,
            left: 8,
          }}
          to="/users"
        >
          Управление пользователями
        </Link>
        <button
          style={{
            position: "absolute",
            top: 2,
            right: 8,
            color: "red",
            background: "none",
            padding: 0,
          }}
          onClick={() => logout()}
        >
          Выйти из аккаунта
        </button>
      </nav>
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
        <Button
          type="button"
          variant="contained"
          color="success"
          startIcon={<Download />}
          sx={{ marginRight: "auto", marginTop: "1rem" }}
          onClick={downloadFile}
        >
          Скачать отчёт
        </Button>
      </div>
      <Snackbar
        open={!!errorMessage}
        autoHideDuration={4000}
        onClose={() => setErrorMessage(null)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={() => setErrorMessage(null)}
          severity="error"
          sx={{ width: "100%" }}
        >
          {errorMessage}
        </Alert>
      </Snackbar>
    </div>
  );
}
