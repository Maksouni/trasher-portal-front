import { LineChart } from "@mui/x-charts";
import { useState, useEffect } from "react";
import { FRACTION_COLORS } from "../../utils/fractionColors";

interface ChartBlockProps {
  title: string;
  data: {
    date: string;
    count: number;
    avgConfidence: number | { parsedValue: number };
  }[];
  period: "day" | "month";
}

const RU_MONTHS = [
  "Январь",
  "Февраль",
  "Март",
  "Апрель",
  "Май",
  "Июнь",
  "Июль",
  "Август",
  "Сентябрь",
  "Октябрь",
  "Ноябрь",
  "Декабрь",
];

export default function ChartBlock({ title, data, period }: ChartBlockProps) {
  const [chartWidth, setChartWidth] = useState(
    window.innerWidth < 768 ? 340 : 900
  );
  const [chartHeight, setChartHeight] = useState(
    window.innerWidth < 768 ? 300 : 500
  );

  useEffect(() => {
    const handleResize = () => {
      setChartWidth(window.innerWidth < 768 ? 340 : 900);
      setChartHeight(window.innerWidth < 768 ? 300 : 500);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Сортируем данные по дате
  const sortedData = [...data].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );
  console.log("sortedData", sortedData);
  // Массивы для графика
  const xLabels = sortedData.map((d) => new Date(d.date).getTime());
  const countData = sortedData.map((d) =>
    typeof d.count === "number" ? d.count : 0
  );
  const confidenceData = sortedData.map((d) => {
    if (typeof d.avgConfidence === "number")
      return Math.round(d.avgConfidence * 100);
    if (d.avgConfidence && typeof d.avgConfidence.parsedValue === "number")
      return Math.round(d.avgConfidence.parsedValue * 100);
    return 0;
  });

  const mainColor = FRACTION_COLORS[title] || "#8E24AA";

  // Для отображения месяца только одним словом
  const monthFormatter = (timestamp: number) => {
    const date = new Date(timestamp);
    return period === "month"
      ? RU_MONTHS[date.getMonth()]
      : `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`;
  };

  return (
    <div className="flex items-center w-full bg-white rounded-2xl shadow-lg p-4">
      <LineChart
        width={chartWidth}
        height={chartHeight}
        series={[
          {
            data: confidenceData,
            label: "Точность",
            yAxisId: "rightAxisId",
            color: "#FF6F00",
            showMark: true,
          },
          {
            data: countData,
            label: title,
            yAxisId: "leftAxisId",
            color: mainColor,
            showMark: true,
          },
        ]}
        xAxis={[
          {
            scaleType: "time",
            data: xLabels,
            valueFormatter: monthFormatter,
            tickNumber: period === "month" ? sortedData.length : undefined,
          },
        ]}
        yAxis={[
          { id: "leftAxisId", label: "Количество" },
          { id: "rightAxisId", min: 0, max: 100, label: "Проценты" },
        ]}
        rightAxis="rightAxisId"
      />
    </div>
  );
}
