/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import ChartsContext from "./ChartsContext";
import axios from "../../api/axios";
import qs from "qs";
import dayjs from "dayjs";
import { ChartType, DailyReport, PeriodType } from "../../types/chart.types";
import { FractionData } from "../../types/fraction.types";
import { useAlert } from "../../context/alert/useAlert";
import { apiUrl } from "../../dotenv";

type Props = {
  children: React.ReactNode;
  onDataChange: (summary: FractionData[], daily: DailyReport[]) => void;
};

function localToUtcISO(localDateTime: string) {
  return new Date(`${localDateTime}:00`).toISOString();
}

export default function ChartsProvider({ children, onDataChange }: Props) {
  const [charts, setCharts] = useState<ChartType[]>([]);
  const [filteredCharts, setFilteredCharts] = useState<ChartType[]>([]);
  const [selectedFilters, setSelectedFilters] = useState<ChartType[]>([]);
  const [loading, setLoading] = useState(true);
  const [chartOption, setChartOption] = useState("table");
  const [period, setPeriod] = useState<PeriodType>("day");

  const [startDateTime, setStartDateTime] = useState(
    dayjs().subtract(1, "hour").format("YYYY-MM-DDTHH:mm"),
  );
  const [endDateTime, setEndDateTime] = useState(
    dayjs().format("YYYY-MM-DDTHH:mm"),
  );

  const [startDate, setStartDate] = useState(
    dayjs().subtract(7, "day").format("YYYY-MM-DD"),
  );
  const [endDate, setEndDate] = useState(dayjs().format("YYYY-MM-DD"));

  const { showAlert } = useAlert();

  useEffect(() => {
    axios
      .get("/categories")
      .then((res) => {
        setCharts(res.data);
        setFilteredCharts(res.data);
      })
      .catch(() => showAlert("Ошибка загрузки данных", "error", 4000))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const categoryIds = filteredCharts.map((f) => f.id);

    if (period === "5min") {
      const day = dayjs(startDateTime).format("YYYY-MM-DD");

      Promise.all([
        axios.get("/reports/summary", {
          params: {
            from: day,
            to: day,
            cat: categoryIds,
          },
          paramsSerializer: (p) => qs.stringify(p, { arrayFormat: "repeat" }),
        }),
        axios.get("/reports/daily-time", {
          params: {
            from: localToUtcISO(startDateTime),
            to: localToUtcISO(endDateTime),
            cat: categoryIds,
          },
          paramsSerializer: (p) => qs.stringify(p, { arrayFormat: "repeat" }),
        }),
      ])
        .then(([summary, daily]) => {
          onDataChange(summary.data, daily.data);
        })
        .catch(() => showAlert("Ошибка загрузки статистики", "error", 4000));

      return;
    }

    if (!startDate || !endDate) return;

    Promise.all([
      axios.get("/reports/summary", {
        params: { from: startDate, to: endDate, cat: categoryIds },
        paramsSerializer: (p) => qs.stringify(p, { arrayFormat: "repeat" }),
      }),
      axios.get(`/reports/${period === "day" ? "daily" : "monthly"}`, {
        params: { from: startDate, to: endDate, cat: categoryIds },
        paramsSerializer: (p) => qs.stringify(p, { arrayFormat: "repeat" }),
      }),
    ])
      .then(([summary, daily]) => {
        onDataChange(summary.data, daily.data);
      })
      .catch(() => showAlert("Ошибка загрузки статистики", "error", 4000));
  }, [startDate, endDate, startDateTime, endDateTime, filteredCharts, period]);

  const toggleFilter = (filter: ChartType) => {
    setSelectedFilters((prev) => {
      const updated = prev.some((f) => f.id === filter.id)
        ? prev.filter((f) => f.id !== filter.id)
        : [...prev, filter];

      setFilteredCharts(
        charts.filter(
          (c) => updated.length === 0 || updated.some((f) => f.name === c.name),
        ),
      );

      return updated;
    });
  };

  const downloadReport = async () => {
    try {
      const res = await axios.get(`${apiUrl}/reports`, {
        params: {
          cat: filteredCharts.map((f) => f.id),
          from: startDate,
          to: endDate,
        },
        paramsSerializer: (p) => qs.stringify(p, { arrayFormat: "repeat" }),
        responseType: "blob",
      });

      const url = URL.createObjectURL(res.data);
      const a = document.createElement("a");
      a.href = url;
      a.download = "report.xlsx";
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      showAlert("Ошибка скачивания отчёта", "error", 4000);
    }
  };

  const changePeriod = (val: PeriodType) => {
    if (val === "5min") {
      setStartDateTime(dayjs().subtract(1, "hour").format("YYYY-MM-DDTHH:mm"));
      setEndDateTime(dayjs().format("YYYY-MM-DDTHH:mm"));
      setPeriod(val);
      return;
    }

    if (val === "month") {
      setStartDate(dayjs(endDate).startOf("month").format("YYYY-MM-DD"));
      setEndDate(dayjs(endDate).endOf("month").format("YYYY-MM-DD"));
    } else {
      setStartDate(dayjs().subtract(7, "day").format("YYYY-MM-DD"));
      setEndDate(dayjs().format("YYYY-MM-DD"));
    }

    setPeriod(val);
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
        startDate,
        endDate,
        setStartDate,
        setEndDate,
        startDateTime,
        endDateTime,
        setStartDateTime,
        setEndDateTime,
        period,
        changePeriod,
        downloadReport,
      }}
    >
      {children}
    </ChartsContext.Provider>
  );
}
