import { LineChart } from "@mui/x-charts";
import { format } from "date-fns";
import { useState, useEffect } from "react";

interface ChartBlockProps {
  title: string;
}

export default function ChartBlock({ title }: ChartBlockProps) {
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

  const uData = [42, 35, 133, 232, 12, 60, 92];
  const pData = [24, 13, 98, 39, 48, 38, 43]; // Пример данных для точности (в процентах)
  const xLabels = [
    "2025-02-17",
    "2025-02-18",
    "2025-02-19",
    "2025-02-20",
    "2025-02-21",
    "2025-02-22",
    "2025-02-23",
  ];

  const formattedXLabels = xLabels.map((date) => new Date(date).getTime());

  return (
    <div className="flex items-center w-full bg-white rounded-2xl shadow-md ">
      <LineChart
        width={chartWidth}
        height={chartHeight}
        series={[
          {
            data: pData,
            label: "Точность",
            yAxisId: "rightAxisId",
          },
          {
            data: uData,
            label: title,
            yAxisId: "leftAxisId",
          },
        ]}
        xAxis={[
          {
            scaleType: "time",
            data: formattedXLabels,
            valueFormatter: (timestamp) =>
              format(new Date(timestamp), "dd.MM.yyyy"),
          },
        ]}
        yAxis={[
          { id: "leftAxisId" },
          { id: "rightAxisId", min: 0, max: 100, label: "Проценты" },
        ]}
        rightAxis="rightAxisId"
      />
    </div>
  );
}
