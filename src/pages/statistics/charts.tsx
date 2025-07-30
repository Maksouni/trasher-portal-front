import { useEffect, useMemo, useState } from "react";
import axios from "../../api/axios";
import { apiUrl } from "../../dotenv";
import qs from "qs";
import { useAlert } from "../../context/alert/useAlert";
import SidebarFilters from "../../components/filters/SidebarFilters";
import ChartView from "../../components/statistics/ChartView";
import StatsSummary from "../../components/statistics/StatsSummary";
import { ChartType } from "../../types/chart.types";

function formatDate(y: number, m: number, d: number): string {
  return new Date(y, m, d).toISOString().split("T")[0];
}

function getStartEndDates(
  period: "day" | "month",
  year: number,
  month: number,
  range: [number, number]
): [string, string] {
  if (period === "day") {
    return [
      formatDate(year, month, range[0] - 1),
      formatDate(year, month, range[1] - 1),
    ];
  } else {
    return [formatDate(year, range[0] - 1, 1), formatDate(year, range[1], 0)];
  }
}

export default function ChartsPage() {
  const [charts, setCharts] = useState<ChartType[]>([]);
  const [filteredCharts, setFilteredCharts] = useState<ChartType[]>([]);
  const [selectedFilters, setSelectedFilters] = useState<ChartType[]>([]);
  const [loading, setLoading] = useState(true);
  const [chartOption, setChartOption] = useState("linear");
  const [period, setPeriod] = useState<"day" | "month">("day");

  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth());
  const [range, setRange] = useState<[number, number]>([1, 7]);

  const { showAlert } = useAlert();

  const [startDate, endDate] = useMemo(
    () => getStartEndDates(period, year, month, range),
    [period, year, month, range]
  );

  useEffect(() => {
    if (period === "day") {
      setRange([1, 7]);
    } else if (period === "month") {
      setRange([1, 1]);
    }
  }, [period]);

  useEffect(() => {
    const fetchData = async () => {
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
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  return (
    <div className="flex max-w-[1024px] min-h-screen flex-col m-2 lg:mx-auto gap-3 lg:flex-row lg:gap-6">
      <SidebarFilters
        chartOption={chartOption}
        onChartOptionChange={setChartOption}
        charts={charts}
        selectedFilters={selectedFilters}
        onToggleFilter={handleToggleFilter}
        loading={loading}
        onDownload={downloadFile}
        period={period}
        onPeriodChange={setPeriod}
        year={year}
        onYearChange={setYear}
        month={month}
        onMonthChange={setMonth}
        range={range}
        onRangeChange={setRange}
      />

      <div className="flex flex-col gap-3 order-last lg:order-first lg:grow-1">
        <StatsSummary loading={loading} />
        <ChartView
          option={chartOption}
          loading={loading}
          charts={filteredCharts}
        />
      </div>
    </div>
  );
}
