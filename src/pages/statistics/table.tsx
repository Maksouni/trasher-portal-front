/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import axios from "../../api/axios";
import qs from "qs";
import { useAlert } from "../../context/alert/useAlert";
import FractionAnalysisTable from "../../components/statistics/FractionAnalysisTable";
import { ChartType } from "../../types/chart.types";
import dayjs from "dayjs";
import { FractionData } from "../../types/fraction.types";

export default function StatisticsTablePage() {
  const [categories, setCategories] = useState<ChartType[]>([]);
  const [summaryData, setSummaryData] = useState<FractionData[]>([]);
  const [loading, setLoading] = useState(true);

  const [period, setPeriod] = useState<"day" | "month">("day");
  const [startDate, setStartDate] = useState(
    dayjs().subtract(7, "day").format("YYYY-MM-DD")
  );
  const [endDate, setEndDate] = useState(dayjs().format("YYYY-MM-DD"));

  const { showAlert } = useAlert();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get("/categories");
        if (Array.isArray(res.data)) {
          setCategories(res.data);
        } else {
          showAlert("Некорректный формат данных", "error", 4000);
        }
      } catch (error) {
        console.error("Ошибка получения категорий:", error);
        showAlert("Ошибка загрузки категорий", "error", 4000);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const categoryIds = categories.map((c) => c.id);
        const res = await axios.get("/reports/summary", {
          params: {
            from: startDate,
            to: endDate,
            cat: categoryIds,
          },
          paramsSerializer: (params) =>
            qs.stringify(params, { arrayFormat: "repeat" }),
        });

        if (Array.isArray(res.data)) {
          setSummaryData(
            res.data.map((item, i) => ({
              id: i + 1,
              ...item,

              weight: item.weight / 1000000,
              avgConfidence: (item.avgConfidence * 100).toFixed(2),
            }))
          );
        } else {
          showAlert("Некорректный ответ от сервера", "error", 4000);
        }
      } catch (error) {
        console.error("Ошибка получения данных summary:", error);
        showAlert("Ошибка загрузки данных", "error", 4000);
      } finally {
        setLoading(false);
      }
    };

    if (categories.length > 0) {
      fetchSummary();
    }
  }, [startDate, endDate, categories, period]);

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

  if (loading) return <div className="p-4">Загрузка...</div>;

  return (
    <FractionAnalysisTable
      data={summaryData}
      period={period}
      startDate={startDate}
      endDate={endDate}
      onPeriodChange={handlePeriodChange}
      onStartDateChange={setStartDate}
      onEndDateChange={setEndDate}
    />
  );
}
