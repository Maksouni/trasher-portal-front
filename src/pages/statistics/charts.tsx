/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import axios from "../../api/axios";
import { apiUrl } from "../../dotenv";
import qs from "qs";
import { useAlert } from "../../context/alert/useAlert";
import SidebarFilters from "../../components/filters/SidebarFilters";
import ChartView from "../../components/statistics/ChartView";
import StatsSummary from "../../components/statistics/StatsSummary";
import FractionAnalysisTable from "../../components/statistics/FractionAnalysisTable"; // <-- добавляем
import { ChartType, DailyReport } from "../../types/chart.types";
import dayjs from "dayjs";
import { FractionData } from "../../types/fraction.types";

export default function ChartsPage() {
  const [charts, setCharts] = useState<ChartType[]>([]);
  const [filteredCharts, setFilteredCharts] = useState<ChartType[]>([]);
  const [selectedFilters, setSelectedFilters] = useState<ChartType[]>([]);
  const [loading, setLoading] = useState(true);
  const [chartOption, setChartOption] = useState("table");
  const [period, setPeriod] = useState<"day" | "month">("day");

  const [startDate, setStartDate] = useState(
    dayjs().subtract(7, "day").format("YYYY-MM-DD")
  );
  const [endDate, setEndDate] = useState(dayjs().format("YYYY-MM-DD"));

  const [summaryData, setSummaryData] = useState<FractionData[]>([]);
  const [dailyData, setDailyData] = useState<DailyReport[]>([]);

  const { showAlert } = useAlert();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get("/categories");
        if (Array.isArray(res.data) && res.data.length > 0) {
          setCharts(res.data);
          setFilteredCharts(res.data);
        } else {
          showAlert("Категории не найдены.", "error", 4000);
        }
      } catch (e) {
        console.error(e);
        showAlert("Ошибка загрузки данных", "error", 4000);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchStats = async () => {
      if (!startDate || !endDate) return;

      try {
        const categoryIds = filteredCharts.map((f) => f.id);

        const [summaryRes, dailyRes] = await Promise.all([
          axios.get("/reports/summary", {
            params: {
              from: startDate,
              to: endDate,
              cat: categoryIds,
            },
            paramsSerializer: (params) =>
              qs.stringify(params, { arrayFormat: "repeat" }),
          }),
          axios.get(`/reports/${period === "day" ? "daily" : "monthly"}`, {
            params: {
              from: startDate,
              to: endDate,
              cat: categoryIds,
            },
            paramsSerializer: (params) =>
              qs.stringify(params, { arrayFormat: "repeat" }),
          }),
        ]);

        setSummaryData(summaryRes.data);
        setDailyData(dailyRes.data);
      } catch (e) {
        console.error(e);
        showAlert("Ошибка загрузки статистики", "error", 4000);
      }
    };

    fetchStats();
  }, [startDate, endDate, filteredCharts, period]);

  const handleToggleFilter = (filter: ChartType) => {
    setSelectedFilters((prev) => {
      const updated = prev.some((f) => f.id === filter.id)
        ? prev.filter((f) => f.id !== filter.id)
        : [...prev, filter];

      setFilteredCharts(
        charts.filter(
          (c) => updated.length === 0 || updated.some((f) => f.name === c.name)
        )
      );

      return updated;
    });
  };

  const downloadFile = async () => {
    try {
      const res = await axios.get(`${apiUrl}/reports`, {
        params: {
          cat: filteredCharts.map((f) => f.id),
          from: startDate,
          to: endDate,
        },
        paramsSerializer: (params) =>
          qs.stringify(params, { arrayFormat: "repeat" }),
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(
        new Blob([res.data], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        })
      );
      const link = document.createElement("a");
      link.href = url;
      link.download = "report.xlsx";
      link.click();
      window.URL.revokeObjectURL(url);
    } catch (e) {
      console.error(e);
      showAlert("Ошибка скачивания отчёта", "error", 4000);
    }
  };

  const handlePeriodChange = (val: "day" | "month") => {
    if (val === "month") {
      const start = dayjs(endDate).startOf("month").format("YYYY-MM-DD");
      const end = dayjs(endDate).endOf("month").format("YYYY-MM-DD");
      setStartDate(start);
      setEndDate(end);
    } else {
      const start = dayjs().subtract(7, "day").format("YYYY-MM-DD");
      const end = dayjs().format("YYYY-MM-DD");
      setStartDate(start);
      setEndDate(end);
    }
    setPeriod(val);
  };

  return (
    <div className="flex max-w-[1400px] min-h-screen flex-col m-2 lg:mx-auto gap-3 lg:flex-row lg:gap-6">
      <SidebarFilters
        chartOption={chartOption}
        onChartOptionChange={setChartOption}
        charts={charts}
        selectedFilters={selectedFilters}
        onToggleFilter={handleToggleFilter}
        loading={loading}
        startDate={startDate}
        endDate={endDate}
        onStartDateChange={setStartDate}
        onEndDateChange={setEndDate}
        onDownload={downloadFile}
        period={period}
        onPeriodChange={handlePeriodChange}
      />

      <div className="flex flex-col gap-3 order-last lg:order-first lg:grow-1">
        <StatsSummary loading={loading} data={summaryData} />
        <ChartView
          option={chartOption}
          loading={loading}
          summaryData={summaryData}
          dailyData={dailyData}
          period={period}
        />
        {chartOption == "table" && (
          <FractionAnalysisTable data={dailyData} period={period} />
        )}
      </div>
    </div>
  );
}
