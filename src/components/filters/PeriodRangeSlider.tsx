import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Slider,
  Typography,
} from "@mui/material";
import { useMemo } from "react";

interface PeriodRangeSliderProps {
  period: "day" | "month";
  year: number;
  month?: number;
  range: [number, number];
  onYearChange: (year: number) => void;
  onMonthChange?: (month: number) => void;
  onRangeChange: (range: [number, number]) => void;
  minDistance?: number;
}

const months = [
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

export default function PeriodRangeSlider({
  period,
  year,
  month,
  range,
  onYearChange,
  onMonthChange,
  onRangeChange,
  minDistance,
}: PeriodRangeSliderProps) {
  const daysInMonth = useMemo(() => {
    if (period === "day" && month !== undefined) {
      return new Date(year, month + 1, 0).getDate();
    }
    return 30;
  }, [year, month, period]);

  const max = period === "day" ? daysInMonth : 12;
  const marks = useMemo(() => {
    if (period === "day") {
      return [1, 5, 10, 15, 20, 25]
        .filter((d) => d <= max)
        .concat(max) // всегда добавляем последний день
        .map((value) => ({ value, label: String(value) }));
    }
  }, [period, max]);

  return (
    <Box className="flex flex-col gap-3">
      <Box className="flex gap-3">
        <FormControl size="small" fullWidth>
          <InputLabel>Год</InputLabel>
          <Select
            value={String(year)}
            onChange={(e: SelectChangeEvent) => onYearChange(+e.target.value)}
            label="Год"
          >
            {Array.from({ length: 5 }).map((_, i) => {
              const y = new Date().getFullYear() - i;
              return (
                <MenuItem value={String(y)} key={y}>
                  {y}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>

        {period === "day" && (
          <FormControl size="small" fullWidth>
            <InputLabel>Месяц</InputLabel>
            <Select
              value={String(month ?? 0)}
              onChange={(e: SelectChangeEvent) =>
                onMonthChange?.(+e.target.value)
              }
              label="Месяц"
            >
              {months.map((m, i) => (
                <MenuItem key={i} value={String(i)}>
                  {m}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
      </Box>

      <Box>
        <Typography gutterBottom>
          {period === "day" ? "Диапазон дней" : "Диапазон месяцев"}
        </Typography>
        <Slider
          value={range}
          onChange={(_, val) => {
            if (Array.isArray(val)) {
              const [start, end] = val;
              if (minDistance && end - start < minDistance) {
                const adjustedEnd = Math.min(start + minDistance, max);
                onRangeChange([start, adjustedEnd]);
              } else {
                onRangeChange([start, end]);
              }
            }
          }}
          min={1}
          max={max}
          marks={marks}
          valueLabelDisplay="on"
        />
      </Box>
    </Box>
  );
}
