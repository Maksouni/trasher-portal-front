import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useCharts } from "../../context/charts/useChart";

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

export default function FlexibleDatePicker() {
  const {
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
  } = useCharts();

  const [dayRange, setDayRange] = useState({ startDate, endDate });
  const [monthRange, setMonthRange] = useState({ startDate, endDate });

  const getYear = (dateStr: string) => new Date(dateStr).getFullYear();
  const getMonth = (dateStr: string) => new Date(dateStr).getMonth();

  const formatDateLocal = (date: Date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  };

  const MAX_DAY_DIFF = 30;

  const clampEndDate = (start: Date, end: Date) => {
    const diff = (end.getTime() - start.getTime()) / 86400000;
    if (diff > MAX_DAY_DIFF) {
      const d = new Date(start);
      d.setDate(d.getDate() + MAX_DAY_DIFF);
      return d;
    }
    return end;
  };

  const clampStartDate = (start: Date, end: Date) => {
    const diff = (end.getTime() - start.getTime()) / 86400000;
    if (diff > MAX_DAY_DIFF) {
      const d = new Date(end);
      d.setDate(d.getDate() - MAX_DAY_DIFF);
      return d;
    }
    return start;
  };

  const handlePeriodChange = (val: typeof period) => {
    if (val === "day") {
      setMonthRange({ startDate, endDate });
      setStartDate(dayRange.startDate);
      setEndDate(dayRange.endDate);
    }

    if (val === "month") {
      setDayRange({ startDate, endDate });
      setStartDate(monthRange.startDate);
      setEndDate(monthRange.endDate);
    }

    changePeriod(val);
  };

  return (
    <Box className="flex flex-col gap-3">
      <Typography>Период</Typography>

      <ToggleButtonGroup
        value={period}
        onChange={(_, val) => val && handlePeriodChange(val)}
        exclusive
        size="small"
        fullWidth
      >
        <ToggleButton value="day">День</ToggleButton>
        <ToggleButton value="month">Месяц</ToggleButton>
        <ToggleButton value="5min">Минуты</ToggleButton>
      </ToggleButtonGroup>

      {period === "5min" ? (
        <Box className="flex gap-2 flex-wrap">
          <TextField
            size="small"
            label="Дата"
            type="date"
            value={startDateTime.slice(0, 10)}
            onChange={(e) => {
              const date = e.target.value;
              const startTime = startDateTime.slice(11) || "00:00";
              let endTime = endDateTime.slice(11) || "00:00";

              const start = new Date(`${date}T${startTime}`);
              let end = new Date(`${date}T${endTime}`);

              if (start > end) {
                end = new Date(start.getTime() + 5 * 60 * 1000);
                endTime = end.toTimeString().slice(0, 5);
              }

              setStartDateTime(`${date}T${startTime}`);
              setEndDateTime(`${date}T${endTime}`);
            }}
            fullWidth
          />

          <TextField
            size="small"
            label="С"
            type="time"
            slotProps={{ htmlInput: { step: 300 } }}
            value={startDateTime.slice(11)}
            onChange={(e) => {
              const time = e.target.value;
              const date = startDateTime.slice(0, 10);
              const start = new Date(`${date}T${time}`);
              let end = new Date(endDateTime);

              if (start > end) {
                end = new Date(start.getTime() + 5 * 60 * 1000);
              }

              setStartDateTime(`${date}T${time}`);
              setEndDateTime(`${date}T${end.toTimeString().slice(0, 5)}`);
            }}
            fullWidth
          />

          {/* Время до */}
          <TextField
            size="small"
            label="По"
            type="time"
            slotProps={{ htmlInput: { step: 300 } }}
            value={endDateTime.slice(11)}
            onChange={(e) => {
              const time = e.target.value;
              const date = startDateTime.slice(0, 10);
              const end = new Date(`${date}T${time}`);
              let start = new Date(startDateTime);

              if (end < start) {
                start = new Date(end.getTime() - 5 * 60 * 1000);
              }

              setStartDateTime(`${date}T${start.toTimeString().slice(0, 5)}`);
              setEndDateTime(`${date}T${time}`);
            }}
            fullWidth
          />
        </Box>
      ) : period === "day" ? (
        <Box className="flex gap-2 flex-wrap">
          <TextField
            size="small"
            label="С"
            type="date"
            value={startDate}
            onChange={(e) => {
              const s = new Date(e.target.value);
              let e2 = new Date(endDate);
              if (s > e2) e2 = s;
              e2 = clampEndDate(s, e2);
              setStartDate(formatDateLocal(s));
              setEndDate(formatDateLocal(e2));
            }}
            fullWidth
          />
          <TextField
            size="small"
            label="По"
            type="date"
            value={endDate}
            onChange={(e) => {
              const e2 = new Date(e.target.value);
              let s = new Date(startDate);
              if (e2 < s) s = e2;
              s = clampStartDate(s, e2);
              setStartDate(formatDateLocal(s));
              setEndDate(formatDateLocal(e2));
            }}
            fullWidth
          />
        </Box>
      ) : (
        <Box className="flex gap-2 flex-wrap">
          <FormControl size="small" fullWidth>
            <InputLabel>Год</InputLabel>
            <Select
              value={String(getYear(startDate))}
              label="Год"
              onChange={(e: SelectChangeEvent) => {
                const y = Number(e.target.value);
                const s = new Date(y, getMonth(startDate), 1);
                const e2 = new Date(y, getMonth(endDate) + 1, 0);
                const ss = formatDateLocal(s);
                const ee = formatDateLocal(e2);
                setStartDate(ss);
                setEndDate(ee);
                setMonthRange({ startDate: ss, endDate: ee });
              }}
            >
              {Array.from({ length: 5 }).map((_, i) => {
                const y = new Date().getFullYear() - i;
                return (
                  <MenuItem key={y} value={String(y)}>
                    {y}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>

          <FormControl size="small" fullWidth>
            <InputLabel>От</InputLabel>
            <Select
              value={String(getMonth(startDate))}
              label="От"
              onChange={(e: SelectChangeEvent) => {
                const m = Number(e.target.value);
                const y = getYear(startDate);
                const s = new Date(y, m, 1);
                let e2 = new Date(endDate);
                if (s > e2) e2 = new Date(y, m + 1, 0);
                const ss = formatDateLocal(s);
                const ee = formatDateLocal(e2);
                setStartDate(ss);
                setEndDate(ee);
                setMonthRange({ startDate: ss, endDate: ee });
              }}
            >
              {months.map((m, i) => (
                <MenuItem key={i} value={String(i)}>
                  {m}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl size="small" fullWidth>
            <InputLabel>До</InputLabel>
            <Select
              value={String(getMonth(endDate))}
              label="До"
              onChange={(e: SelectChangeEvent) => {
                const m = Number(e.target.value);
                const y = getYear(endDate);
                const e2 = new Date(y, m + 1, 0);
                let s = new Date(startDate);
                if (e2 < s) s = new Date(y, m, 1);
                const ss = formatDateLocal(s);
                const ee = formatDateLocal(e2);
                setStartDate(ss);
                setEndDate(ee);
                setMonthRange({ startDate: ss, endDate: ee });
              }}
            >
              {months.map((m, i) => (
                <MenuItem key={i} value={String(i)}>
                  {m}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      )}
    </Box>
  );
}
