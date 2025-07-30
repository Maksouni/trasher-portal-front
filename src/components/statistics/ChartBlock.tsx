import { LineChart } from "@mui/x-charts";
import { format } from "date-fns";
import { useState, useEffect } from "react";
import { FRACTION_COLORS } from "../../utils/fractionColors";

interface ChartBlockProps {
  title: string;
  data: {
    date: string;
    count: number;
    avgConfidence: number;
  }[];
}

export default function ChartBlock({ title, data }: ChartBlockProps) {
  const [chartWidth, setChartWidth] = useState(
    window.innerWidth < 768 ? 340 : 600
  );
  const [chartHeight, setChartHeight] = useState(
    window.innerWidth < 768 ? 300 : 400
  );

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setChartWidth(340);
        setChartHeight(300);
      } else {
        setChartWidth(600);
        setChartHeight(400);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Сортируем по дате
  const sortedData = [...data].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const xLabels = sortedData.map((d) => new Date(d.date).getTime());
  const countData = sortedData.map((d) => d.count);
  const confidenceData = sortedData.map((d) =>
    Math.round(d.avgConfidence * 100)
  );

  const mainColor = FRACTION_COLORS[title] || "#8E24AA";

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
            valueFormatter: (timestamp) =>
              format(new Date(timestamp), "dd.MM.yyyy"),
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
