import { useEffect, useState } from "react";
import axios from "../../api/axios";
import { apiUrl } from "../../dotenv";
import qs from "qs";
import { useAlert } from "../../context/alert/useAlert";
import SidebarFilters from "../../components/filters/SidebarFilters";
import ChartView from "../../components/statistics/ChartView";
import StatsSummary from "../../components/statistics/StatsSummary";
import { ChartType } from "../../types/chart.types";

export default function StatisticsPage() {
  const [charts, setCharts] = useState<ChartType[]>([]);
  const [filteredCharts, setFilteredCharts] = useState<ChartType[]>([]);
  const [selectedFilters, setSelectedFilters] = useState<ChartType[]>([]);
  const [loading, setLoading] = useState(true);
  const [chartOption, setChartOption] = useState("linear");

  const [startDate, setStartDate] = useState(
    new Date(Date.now() - 7 * 86400000).toISOString().split("T")[0]
  );
  const [endDate, setEndDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const { showAlert } = useAlert();

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
    <div className="flex max-w-[1024px] flex-col m-2 lg:mx-auto gap-3 lg:flex-row lg:gap-6">
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
