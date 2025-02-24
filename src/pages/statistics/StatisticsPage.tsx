import {
  Accordion,
  AccordionActions,
  AccordionDetails,
  AccordionSummary,
  Alert,
  Button,
  Divider,
  Snackbar,
  Typography,
} from "@mui/material";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import BarChartRounded from "@mui/icons-material/BarChartRounded";
import StreamIcon from "@mui/icons-material/Stream";
import DateFilter from "../../components/filters/DateFilter";
import { useEffect, useState } from "react";
import axios from "../../api/axios";
import { apiUrl } from "../../dotenv";
import CheckFilters from "../../components/filters/CheckFilters";
import qs from "qs";
import StatsBlock from "../../components/statistics/StatsBlock";
import ChartBlock from "../../components/statistics/ChartBlock";

export interface ChartType {
  id: number;
  name: string;
}

export default function StatisticsPage() {
  const totalCount = 25000;
  const accuracy = 50;
  const [charts, setCharts] = useState<ChartType[]>([]);
  const [filteredCharts, setFilteredCharts] = useState<ChartType[]>(charts);

  const [selectedFilters, setSelectedFilters] = useState<ChartType[]>([]);

  const [startDate, setStartDate] = useState<string>(
    new Date(new Date().setDate(new Date().getDate() - 7))
      .toISOString()
      .split("T")[0]
  );
  const [endDate, setEndDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

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
          cat: filteredCharts.map((filter) => filter.id),
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
    <div className="flex flex-col m-2 gap-1">
      <div className="shadow-lg">
        <Accordion
          sx={{ borderRadius: 2, overflow: "hidden" }}
          defaultExpanded={window.innerWidth >= 768}
        >
          <AccordionSummary
            sx={{
              backgroundColor: "primary.main",
              color: "white",
              borderRadius: "2px 2px 0 0",
            }}
          >
            <div className="flex m-auto">
              <FilterAltIcon sx={{ marginRight: 1 }} />
              <Typography variant="button" component="span">
                Фильтры
              </Typography>
            </div>
          </AccordionSummary>

          <AccordionDetails
            sx={{
              borderRadius: "0 0 2px 2px",
            }}
          >
            <div className="flex flex-col gap-1 mt-1">
              <Typography variant="h6">Промежуток времени</Typography>
              <DateFilter
                startDate={startDate}
                endDate={endDate}
                onStartDateChange={handleStartDateChange}
                onEndDateChange={handleEndDateChange}
              />

              <Divider sx={{ marginTop: 2, marginBottom: 1 }} />

              <Typography variant="h6">Категории</Typography>
              <CheckFilters
                filters={charts}
                selectedFilters={selectedFilters}
                onToggleFilter={handleToggleFilter}
              />
            </div>
          </AccordionDetails>

          <AccordionActions>
            {/* <Button variant="contained">По умолчанию</Button> */}
          </AccordionActions>
        </Accordion>
      </div>
      <div className="shadow-lg">
        <Button
          variant="contained"
          sx={{ backgroundColor: "success.main", marginTop: 1, width: "100%" }}
          onClick={() => downloadFile()}
        >
          Скачать отчёт
        </Button>
      </div>

      {/* stats */}
      <div className="flex flex-col gap-3 mt-2 mb-2">
        {/* general blocks */}
        <StatsBlock
          icon={<BarChartRounded />}
          value={totalCount.toLocaleString("ru-RU")}
          title="Общее количество обнаружений"
        />
        <StatsBlock
          icon={<StreamIcon />}
          value={`${accuracy} %`}
          title="Общая точность"
        />
      </div>

      {/* charts */}
      <div className="charts-container">
        <ul style={{ listStyle: "none", padding: 0, marginTop: "0" }}>
          {filteredCharts.map((x) => (
            <li key={x.id} style={{ marginBottom: "2rem" }}>
              <ChartBlock title={x.name} />
            </li>
          ))}
        </ul>
      </div>

      {/* Snackbar */}
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
