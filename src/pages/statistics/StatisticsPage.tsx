import {
  Accordion,
  AccordionActions,
  AccordionDetails,
  AccordionSummary,
  Button,
  Divider,
  Typography,
  Skeleton,
  ToggleButtonGroup,
  ToggleButton,
  Stack,
} from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import ShowChartIcon from "@mui/icons-material/ShowChart";
import PieChartIcon from "@mui/icons-material/PieChart";
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
import { useAlert } from "../../context/alert/useAlert";

import PieChartBlock from "../../components/statistics/PieChartBlock";

export interface ChartType {
  id: number;
  name: string;
}

export default function StatisticsPage() {
  const totalCount = 25000;
  const accuracy = 50;
  const [charts, setCharts] = useState<ChartType[]>([]);
  const [filteredCharts, setFilteredCharts] = useState<ChartType[]>([]);
  const [loading, setLoading] = useState(true);

  const [chartOption, setChartOption] = useState<string>("linear");

  const [selectedFilters, setSelectedFilters] = useState<ChartType[]>([]);

  const [startDate, setStartDate] = useState<string>(
    new Date(new Date().setDate(new Date().getDate() - 7))
      .toISOString()
      .split("T")[0]
  );
  const [endDate, setEndDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );

  const { showAlert } = useAlert();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${apiUrl}/categories`);
        if (
          response.data &&
          Array.isArray(response.data) &&
          response.data.length > 0
        ) {
          setCharts(response.data);
          setFilteredCharts(response.data);
        } else {
          showAlert("Категории не найдены. Попробуйте позже.", "error", 4000);
        }
      } catch (error) {
        console.error("Ошибка загрузки данных:", error);
        showAlert(
          "Не удалось загрузить данные. Попробуйте позже.",
          "error",
          4000
        );
      } finally {
        setLoading(false);
      }
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChartOption = (
    _event: React.MouseEvent<HTMLElement>,
    newChartOption: string | null
  ) => {
    if (newChartOption !== null) {
      setChartOption(newChartOption);
    }
  };

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
      const response = await axios.get(`${apiUrl}/reports`, {
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
      showAlert("Не удалось скачать отчёт. Попробуйте позже.", "error", 4000);
    }
  };

  return (
    <div className="flex justify-between max-w-[1024px] flex-col m-2 lg:mx-auto gap-3 lg:flex-row lg:gap-6">
      <div className="flex flex-col gap-3 lg:sticky lg:top-0">
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
                <SettingsIcon sx={{ marginRight: 1 }} />
                <Typography variant="button" component="span">
                  ОПЦИИ
                </Typography>
              </div>
            </AccordionSummary>

            <AccordionDetails
              sx={{
                borderRadius: "0 0 2px 2px",
              }}
            >
              <div className="flex flex-col gap-1 mt-1">
                <Typography variant="h6">
                  Варианты отображения графиков
                </Typography>
                <ToggleButtonGroup
                  color="primary"
                  value={chartOption}
                  exclusive
                  onChange={handleChartOption}
                  aria-label="chart options"
                >
                  <ToggleButton value="linear" aria-label="chart option">
                    <ShowChartIcon sx={{ mb: 0.3 }} /> Линейные
                  </ToggleButton>
                  <ToggleButton value="pie" aria-label="chart option">
                    <PieChartIcon sx={{ mb: 0.5, mr: 0.5 }} /> Круговая
                    диаграмма
                  </ToggleButton>
                </ToggleButtonGroup>

                <Divider sx={{ marginTop: 2, marginBottom: 1 }} />

                <Typography variant="h6">Промежуток времени</Typography>
                <DateFilter
                  startDate={startDate}
                  endDate={endDate}
                  onStartDateChange={handleStartDateChange}
                  onEndDateChange={handleEndDateChange}
                />

                <Divider sx={{ marginTop: 2, marginBottom: 1 }} />

                <Typography variant="h6">Категории</Typography>
                {loading ? (
                  <Stack spacing={1}>
                    <Skeleton variant="rounded" width="100%" height={36} />
                    <Skeleton variant="rounded" width="100%" height={36} />
                    <Skeleton variant="rounded" width="100%" height={36} />
                    <Skeleton variant="rounded" width="100%" height={36} />
                  </Stack>
                ) : charts.length > 0 ? (
                  <CheckFilters
                    filters={charts}
                    selectedFilters={selectedFilters}
                    onToggleFilter={handleToggleFilter}
                  />
                ) : (
                  <Typography color="error">Категории не найдены</Typography>
                )}
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
            sx={{
              backgroundColor: "success.main",
              width: "100%",
            }}
            onClick={() => downloadFile()}
          >
            Скачать отчёт
          </Button>
        </div>
      </div>

      {/* stats */}

      <div className="flex flex-col gap-3 order-last lg:order-first lg:grow-1">
        <div className="flex flex-col items-center justify-center sm:flex-row gap-3">
          {/* general blocks */}
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

        {/* charts */}
        {chartOption === "linear" && (
          <div className="charts-container">
            <ul className="list-none flex flex-col gap-3 lg:gap-4">
              {loading ? (
                <Stack spacing={2}>
                  <Skeleton
                    variant="rounded"
                    sx={{ borderRadius: 4 }}
                    width="100%"
                    height={400}
                  />
                  <Skeleton
                    variant="rounded"
                    sx={{ borderRadius: 4 }}
                    width="100%"
                    height={400}
                  />
                  <Skeleton
                    variant="rounded"
                    sx={{ borderRadius: 4 }}
                    width="100%"
                    height={400}
                  />
                  <Skeleton
                    variant="rounded"
                    sx={{ borderRadius: 4 }}
                    width="100%"
                    height={400}
                  />
                </Stack>
              ) : filteredCharts.length > 0 ? (
                filteredCharts.map((x) => (
                  <li key={x.id}>
                    <ChartBlock title={x.name} />
                  </li>
                ))
              ) : (
                <Typography color="error">
                  Нет данных для отображения
                </Typography>
              )}
            </ul>
          </div>
        )}

        {chartOption === "pie" && <PieChartBlock data={filteredCharts} />}
      </div>
    </div>
  );
}
