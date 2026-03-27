import { LineChart } from "@mui/x-charts";
import { Box } from "@mui/material";
import dayjs from "dayjs";
import "dayjs/locale/ru";
import { useMemo, useEffect, useLayoutEffect, useState, useRef } from "react";
import { DailyReport, PeriodType } from "../../types/chart.types";
import { getFractionColor } from "../../utils/fractionColors";

dayjs.locale("ru");

const Y_AXIS_ID = "main-y";

interface ChartBlockProps {
  title: string;
  data?: DailyReport[];
  period?: PeriodType;
}

function fallbackDemo() {
  const xLabels = [
    "2025-02-17",
    "2025-02-18",
    "2025-02-19",
    "2025-02-20",
    "2025-02-21",
    "2025-02-22",
    "2025-02-23",
  ];
  const xData = xLabels.map((d) => new Date(d).getTime());
  const yData = [42, 35, 133, 232, 12, 60, 92];
  return { xData, yData };
}

export default function ChartBlock({
  title,
  data,
  period = "day",
}: ChartBlockProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [plotWidth, setPlotWidth] = useState(600);
  const [plotHeight, setPlotHeight] = useState(400);

  useLayoutEffect(() => {
    const w = containerRef.current?.clientWidth;
    if (w && w > 0) {
      const cw = Math.floor(w);
      setPlotWidth(Math.max(260, cw));
      setPlotHeight(window.innerWidth < 768 ? 300 : Math.min(400, Math.floor(cw * 0.55)));
    }
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      const cr = entries[0]?.contentRect;
      if (!cr?.width) return;
      const w = Math.floor(cr.width);
      setPlotWidth(Math.max(260, w));
      setPlotHeight(window.innerWidth < 768 ? 300 : Math.min(400, Math.floor(w * 0.55)));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const { xData, yData, formatX } = useMemo(() => {
    if (!data?.length) {
      const demo = fallbackDemo();
      return {
        ...demo,
        formatX: (ts: number) => dayjs(ts).format("DD.MM.YYYY"),
      };
    }

    const sorted = [...data].sort((a, b) => {
      const ka = a.ts ?? a.date;
      const kb = b.ts ?? b.date;
      return dayjs(ka).valueOf() - dayjs(kb).valueOf();
    });

    const xData = sorted.map((d) => dayjs(d.ts ?? d.date).valueOf());
    const yData = sorted.map((d) => d.count);

    const formatX =
      period === "5min"
        ? (ts: number) => dayjs(ts).format("HH:mm")
        : period === "month"
          ? (ts: number) => dayjs(ts).format("MMMM YYYY")
          : (ts: number) => dayjs(ts).format("DD.MM.YYYY");

    return { xData, yData, formatX };
  }, [data, period]);

  const yMax = useMemo(() => {
    const maxCount = yData.length ? Math.max(...yData) : 0;
    const padded = Math.ceil(maxCount * 1.12);
    return Math.max(padded, 1);
  }, [yData]);

  return (
    <Box
      ref={containerRef}
      sx={{
        width: "100%",
        maxWidth: "100%",
        overflow: "hidden",
      }}
    >
      <LineChart
        width={plotWidth}
        height={plotHeight}
        margin={{ left: 56, right: 20, top: 16, bottom: 36 }}
        xAxis={[
          {
            scaleType: "time",
            data: xData,
            valueFormatter: (timestamp) =>
              formatX(
                typeof timestamp === "number"
                  ? timestamp
                  : new Date(timestamp).getTime(),
              ),
          },
        ]}
        yAxis={[
          {
            id: Y_AXIS_ID,
            min: 0,
            max: yMax,
          },
        ]}
        series={[
          {
            data: yData,
            label: title,
            yAxisId: Y_AXIS_ID,
            showMark: true,
            color: getFractionColor(title),
          },
        ]}
      />
    </Box>
  );
}
