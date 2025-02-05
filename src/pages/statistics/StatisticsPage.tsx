import StatsBlock from "../../components/statistics/StatsBlock";
import ChartBlock from "../../components/statistics/ChartBlock";
import "./styles.scss";
import { BarChartRounded, Download, PercentRounded } from "@mui/icons-material";
import { useEffect, useState } from "react";
import DateFilter from "../../components/filters/DateFilter";
import CheckFilters from "../../components/filters/CheckFilters";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/auth/useAuth";
import { Alert, Button, Snackbar } from "@mui/material";
import axios from "../../api/axios";
import qs from "qs";
import { apiUrl } from "../../dotenv";

export interface ChartType {
  id: number;
  name: string;
}

export default function StatisticsPage() {
  const totalCount = 25000;
  const accuracy = 50;
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [charts, setCharts] = useState<ChartType[]>([]);
  const [filteredCharts, setFilteredCharts] = useState<ChartType[]>(charts);
  const [startDate, setStartDate] = useState<string>(
    new Date(new Date().setDate(new Date().getDate() - 7))
      .toISOString()
      .split("T")[0]
  );
  const [endDate, setEndDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [selectedFilters, setSelectedFilters] = useState<ChartType[]>([]);
  const { logout } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get(`${apiUrl}categories`);
      setCharts(response.data);
    };
    fetchData();
  }, []);

  useEffect(() => {
    setFilteredCharts(charts);
  }, [charts]);

  const handleToggleFilter = (filter: ChartType) => {
    setSelectedFilters((prev) => {
      const updatedFilters = prev.some((f) => f.id === filter.id)
        ? prev.filter((f) => f.id !== filter.id)
        : [...prev, filter];

      setFilteredCharts(
        charts.filter(
          (chart) =>
            updatedFilters.length === 0 ||
            updatedFilters.some((f) => f.name === chart.name)
        )
      );

      return updatedFilters;
    });
  };

  const handleStartDateChange = (date: string) => {
    setStartDate(date);
    if (endDate && new Date(date) > new Date(endDate)) {
      setEndDate(date);
    }
  };

  const handleEndDateChange = (date: string) => {
    setEndDate(new Date(date).toISOString());
  };

  const downloadFile = async () => {
    const date1 = startDate;
    const date2 = endDate;

    try {
      const response = await axios.get(`${apiUrl}reports`, {
        params: {
          category: filteredCharts.map((filter) => filter.id),
          from: date1,
          to: date2,
        },
        paramsSerializer: (params) =>
          qs.stringify(params, { arrayFormat: "repeat" }),
        responseType: "blob",
      });

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
          <ul style={{ listStyle: "none", padding: 0, marginTop: "0" }}>
            {filteredCharts.map((x) => (
              <li key={x.id} style={{ marginBottom: "2rem" }}>
                <ChartBlock title={x.name} />
              </li>
            ))}
          </ul>
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
          filters={charts}
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
