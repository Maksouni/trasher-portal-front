/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import ChartsContext from "./ChartsContext";
import dayjs from "dayjs";
import { ChartType, DailyReport, PeriodType } from "../../types/chart.types";
import { FractionData } from "../../types/fraction.types";
import { useAlert } from "../../context/alert/useAlert";
import { api, toQueryString } from "../../api/api";
import isBetween from "dayjs/plugin/isBetween";
dayjs.extend(isBetween);

type Props = {
  children: React.ReactNode;
};

const getStorageItem = (key: string, defaultValue: any) => {
  const saved = localStorage.getItem(key);
  if (!saved) return defaultValue;
  try {
    return JSON.parse(saved);
  } catch {
    return saved;
  }
};

const ensureArray = (data: any) => (Array.isArray(data) ? data : []);

function localToUtcISO(localDateTime: string) {
  try {
    return new Date(`${localDateTime}:00`).toISOString();
  } catch {
    return new Date().toISOString();
  }
}

export default function ChartsProvider({ children }: Props) {
  const [charts, setCharts] = useState<ChartType[]>([]);

  const [selectedFilters, setSelectedFilters] = useState<ChartType[]>(() =>
    getStorageItem("selectedFilters", []),
  );
  const [chartOption, setChartOption] = useState(() =>
    getStorageItem("chartOption", "table"),
  );
  const [period, setPeriod] = useState<PeriodType>(() =>
    getStorageItem("period", "day"),
  );
  const [step, setStep] = useState<number>(() => getStorageItem("step", 5));

  const [startDate, setStartDate] = useState(() => {
    const currentPeriod = getStorageItem("period", "day");
    if (currentPeriod === "month")
      return getStorageItem(
        "month_startDate",
        dayjs().startOf("year").format("YYYY-MM-DD"),
      );
    return getStorageItem(
      "day_startDate",
      dayjs().subtract(7, "day").format("YYYY-MM-DD"),
    );
  });

  const [endDate, setEndDate] = useState(() => {
    const currentPeriod = getStorageItem("period", "day");
    if (currentPeriod === "month")
      return getStorageItem("month_endDate", dayjs().format("YYYY-MM-DD"));
    return getStorageItem("day_endDate", dayjs().format("YYYY-MM-DD"));
  });

  const [startDateTime, setStartDateTime] = useState(() =>
    getStorageItem(
      "startDateTime",
      dayjs().subtract(1, "hour").format("YYYY-MM-DDTHH:mm"),
    ),
  );
  const [endDateTime, setEndDateTime] = useState(() =>
    getStorageItem("endDateTime", dayjs().format("YYYY-MM-DDTHH:mm")),
  );

  const [loading, setLoading] = useState(true);
  const [isDataLoading, setIsDataLoading] = useState(false);
  const [summaryData, setSummaryData] = useState<FractionData[]>([]);
  const [dailyData, setDailyData] = useState<DailyReport[]>([]);

  const { showAlert } = useAlert();

  // 3. Сохраняем всё отдельно
  useEffect(() => {
    localStorage.setItem("selectedFilters", JSON.stringify(selectedFilters));
    localStorage.setItem("chartOption", JSON.stringify(chartOption));
    localStorage.setItem("period", JSON.stringify(period));
    localStorage.setItem("step", JSON.stringify(step));
    localStorage.setItem("startDateTime", JSON.stringify(startDateTime));
    localStorage.setItem("endDateTime", JSON.stringify(endDateTime));

    // Сохраняем даты в зависимости от текущего режима, чтобы не перезатереть "другой" режим
    if (period === "month") {
      localStorage.setItem("month_startDate", JSON.stringify(startDate));
      localStorage.setItem("month_endDate", JSON.stringify(endDate));
    } else if (period === "day") {
      localStorage.setItem("day_startDate", JSON.stringify(startDate));
      localStorage.setItem("day_endDate", JSON.stringify(endDate));
    }
  }, [
    selectedFilters,
    chartOption,
    period,
    step,
    startDate,
    endDate,
    startDateTime,
    endDateTime,
  ]);

  // Остальной код (загрузка категорий и fetchData) остается без изменений...
  useEffect(() => {
    setLoading(true);
    api
      .get("/api/v1/categories")
      .then((data) => setCharts(ensureArray(data)))
      .catch(() => showAlert("Ошибка загрузки категорий", "error", 4000))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (loading) return;
    const sourceCharts = selectedFilters.length > 0 ? selectedFilters : charts;
    const categoryIds = sourceCharts.map((f) => f?.id).filter(Boolean);

    const fetchData = async () => {
      setIsDataLoading(true);
      try {
        let sRes, dRes;
        const commonParams = { cat: categoryIds };
        const isMinMode = period === "5min";
        const startBound = isMinMode
          ? dayjs(startDateTime)
          : dayjs(startDate).startOf("day");
        const endBound = isMinMode
          ? dayjs(endDateTime)
          : dayjs(endDate).endOf("day");

        if (isMinMode) {
          const day = dayjs(startDateTime).format("YYYY-MM-DD");
          const qSum = toQueryString({ ...commonParams, from: day, to: day });
          const qDaily = toQueryString({
            from: localToUtcISO(startDateTime),
            to: localToUtcISO(endDateTime),
            step,
            ...commonParams,
          });
          [sRes, dRes] = await Promise.all([
            api.get(`/api/v1/reports/summary${qSum}`),
            api.get(`/api/v1/reports/daily-time${qDaily}`),
          ]);
        } else {
          const q = toQueryString({
            ...commonParams,
            from: startDate,
            to: endDate,
          });
          const endpoint = period === "day" ? "daily" : "monthly";
          [sRes, dRes] = await Promise.all([
            api.get(`/api/v1/reports/summary${q}`),
            api.get(`/api/v1/reports/${endpoint}${q}`),
          ]);
        }

        const processedSummary: FractionData[] = ensureArray(sRes).map(
          (item) => ({
            id: item.id || Math.random(),
            categoryName: item.categoryName,
            totalCount: Number(item.totalCount || 0),
            weight:
              typeof item.weight === "object"
                ? item.weight?.parsedValue || 0
                : Number(item.weight || 0),
            avgConfidence:
              typeof item.avgConfidence === "object"
                ? item.avgConfidence?.parsedValue || 0
                : Number(item.avgConfidence || 0),
          }),
        );

        const processedDaily: DailyReport[] = ensureArray(dRes)
          .map((item) => ({
            date: item.date,
            ts: item.ts,
            categoryName: item.categoryName,
            count: Number(item.count || 0),
            weight:
              typeof item.weight === "object"
                ? item.weight?.parsedValue || 0
                : Number(item.weight || 0),
            avgConfidence:
              typeof item.avgConfidence === "object"
                ? item.avgConfidence?.parsedValue || 0
                : Number(item.avgConfidence || 0),
          }))
          .filter((item) => {
            const itemDate = dayjs(isMinMode ? item.ts : item.date);
            return itemDate.isBetween(startBound, endBound, null, "[]");
          });

        setSummaryData(processedSummary);
        setDailyData(processedDaily);
      } catch (e) {
        console.error("FETCH ERROR:", e);
        setSummaryData([]);
        setDailyData([]);
      } finally {
        setIsDataLoading(false);
      }
    };
    fetchData();
  }, [
    startDate,
    endDate,
    startDateTime,
    endDateTime,
    charts,
    selectedFilters,
    period,
    step,
  ]);

  const toggleFilter = (filter: ChartType) => {
    setSelectedFilters((prev) =>
      prev.some((f) => f.id === filter.id)
        ? prev.filter((f) => f.id !== filter.id)
        : [...prev, filter],
    );
  };

  // 4. Логика переключения: сначала ищем в памяти, если нет — ставим дефолт
  const changePeriod = (val: PeriodType) => {
    setPeriod(val);
    if (val === "5min") {
      setStartDateTime(
        getStorageItem(
          "startDateTime",
          dayjs().subtract(1, "hour").format("YYYY-MM-DDTHH:mm"),
        ),
      );
      setEndDateTime(
        getStorageItem("endDateTime", dayjs().format("YYYY-MM-DDTHH:mm")),
      );
    } else if (val === "month") {
      setStartDate(
        getStorageItem(
          "month_startDate",
          dayjs().startOf("year").format("YYYY-MM-DD"),
        ),
      );
      setEndDate(getStorageItem("month_endDate", dayjs().format("YYYY-MM-DD")));
    } else {
      setStartDate(
        getStorageItem(
          "day_startDate",
          dayjs().subtract(7, "day").format("YYYY-MM-DD"),
        ),
      );
      setEndDate(getStorageItem("day_endDate", dayjs().format("YYYY-MM-DD")));
    }
  };

  const downloadReport = async () => {
    try {
      const sourceCharts =
        selectedFilters.length > 0 ? selectedFilters : charts;
      const ids = sourceCharts.map((f) => f.id).filter(Boolean);
      const query = toQueryString({ cat: ids, from: startDate, to: endDate });
      const blob = await api.get(`/api/v1/reports${query}`);
      if (!(blob instanceof Blob)) throw new Error("Неверный формат данных");
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `report_${dayjs().format("YYYY-MM-DD")}.xlsx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch {
      showAlert("Ошибка скачивания отчёта", "error", 4000);
    }
  };

  return (
    <ChartsContext.Provider
      value={{
        chartOption,
        setChartOption,
        charts,
        selectedFilters,
        toggleFilter,
        loading,
        isDataLoading,
        period,
        changePeriod,
        startDate,
        endDate,
        setStartDate,
        setEndDate,
        startDateTime,
        endDateTime,
        setStartDateTime,
        setEndDateTime,
        step,
        setStep,
        summaryData,
        dailyData,
        downloadReport,
      }}
    >
      {children}
    </ChartsContext.Provider>
  );
}
