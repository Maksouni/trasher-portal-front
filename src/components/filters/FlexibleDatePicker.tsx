/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  alpha,
  useTheme,
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

const textFieldStyle = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "12px",
    transition: "all 0.2s",
    "&:hover": {
      bgcolor: (theme: any) => alpha(theme.palette.primary.main, 0.02),
    },
  },
};

export default function FlexibleDatePicker() {
  const theme = useTheme();
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
    step,
    setStep,
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

  const getCurrentToggleValue = () => {
    if (period === "5min") return step === 60 ? "hour" : "5min";
    return period;
  };

  // --- ЛОГИКА ВАЛИДАЦИИ ---

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

  const handleToggleChange = (val: string) => {
    if (!val) return;
    if (val === "5min") {
      changePeriod("5min");
      setStep(5);
    } else if (val === "hour") {
      changePeriod("5min");
      setStep(60);
    } else if (val === "day") {
      setMonthRange({ startDate, endDate });
      setStartDate(dayRange.startDate);
      setEndDate(dayRange.endDate);
      changePeriod("day");
    } else if (val === "month") {
      setDayRange({ startDate, endDate });
      setStartDate(monthRange.startDate);
      setEndDate(monthRange.endDate);
      changePeriod("month");
    }
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
      <ToggleButtonGroup
        value={getCurrentToggleValue()}
        onChange={(_, val) => handleToggleChange(val)}
        exclusive
        size="small"
        fullWidth
        sx={{
          bgcolor: alpha(theme.palette.primary.main, 0.05),
          p: 0.5,
          borderRadius: "14px",
          border: "none",
          "& .MuiToggleButton-root": {
            border: "none",
            borderRadius: "10px !important",
            fontWeight: 600,
            textTransform: "none",
            fontSize: "0.75rem",
            color: "text.secondary",
            "&.Mui-selected": {
              bgcolor: "background.paper",
              color: "primary.main",
              boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
            },
          },
        }}
      >
        <ToggleButton value="day">День</ToggleButton>
        <ToggleButton value="month">Месяц</ToggleButton>
        <ToggleButton value="5min">5 мин</ToggleButton>
        <ToggleButton value="hour">Час</ToggleButton>
      </ToggleButtonGroup>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {period === "5min" ? (
          <>
            <TextField
              size="small"
              label="Дата"
              type="date"
              value={startDateTime.slice(0, 10)}
              onChange={(e) => {
                const date = e.target.value;
                setStartDateTime(`${date}T${startDateTime.slice(11)}`);
                setEndDateTime(`${date}T${endDateTime.slice(11)}`);
              }}
              sx={textFieldStyle}
              fullWidth
            />
            <Box sx={{ display: "flex", gap: 1.5 }}>
              <TextField
                size="small"
                label="С"
                type="time"
                value={startDateTime.slice(11)}
                onChange={(e) => {
                  const newStartTime = e.target.value;
                  const date = startDateTime.slice(0, 10);
                  setStartDateTime(`${date}T${newStartTime}`);
                  // Если начало стало позже конца, двигаем конец
                  if (newStartTime > endDateTime.slice(11)) {
                    setEndDateTime(`${date}T${newStartTime}`);
                  }
                }}
                sx={textFieldStyle}
                fullWidth
              />
              <TextField
                size="small"
                label="По"
                type="time"
                value={endDateTime.slice(11)}
                onChange={(e) => {
                  const newEndTime = e.target.value;
                  const date = startDateTime.slice(0, 10);
                  setEndDateTime(`${date}T${newEndTime}`);
                  // Если конец стал раньше начала, двигаем начало
                  if (newEndTime < startDateTime.slice(11)) {
                    setStartDateTime(`${date}T${newEndTime}`);
                  }
                }}
                sx={textFieldStyle}
                fullWidth
              />
            </Box>
          </>
        ) : period === "day" ? (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
            <TextField
              size="small"
              label="От"
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
              sx={textFieldStyle}
              fullWidth
            />
            <TextField
              size="small"
              label="До"
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
              sx={textFieldStyle}
              fullWidth
            />
          </Box>
        ) : (
          <Stack spacing={2}>
            <FormControl size="small" fullWidth sx={textFieldStyle}>
              <InputLabel>Год</InputLabel>
              <Select
                value={String(getYear(startDate))}
                label="Год"
                onChange={(e: SelectChangeEvent) => {
                  const y = Number(e.target.value);
                  const s = new Date(y, getMonth(startDate), 1);
                  const e2 = new Date(y, getMonth(endDate) + 1, 0);
                  setStartDate(formatDateLocal(s));
                  setEndDate(formatDateLocal(e2));
                }}
                sx={{ borderRadius: "12px" }}
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

            <Box sx={{ display: "flex", gap: 1.5 }}>
              <FormControl size="small" fullWidth sx={textFieldStyle}>
                <InputLabel>От</InputLabel>
                <Select
                  value={String(getMonth(startDate))}
                  label="От"
                  onChange={(e: SelectChangeEvent) => {
                    const m = Number(e.target.value);
                    const y = getYear(startDate);
                    setStartDate(formatDateLocal(new Date(y, m, 1)));
                    // Если начальный месяц > конечного, двигаем конечный
                    if (m > getMonth(endDate)) {
                      setEndDate(formatDateLocal(new Date(y, m + 1, 0)));
                    }
                  }}
                  sx={{ borderRadius: "12px" }}
                >
                  {months.map((m, i) => (
                    <MenuItem key={i} value={String(i)}>
                      {m}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl size="small" fullWidth sx={textFieldStyle}>
                <InputLabel>До</InputLabel>
                <Select
                  value={String(getMonth(endDate))}
                  label="До"
                  onChange={(e: SelectChangeEvent) => {
                    const m = Number(e.target.value);
                    const y = getYear(endDate);
                    setEndDate(formatDateLocal(new Date(y, m + 1, 0)));
                    // Если конечный месяц < начального, двигаем начальный
                    if (m < getMonth(startDate)) {
                      setStartDate(formatDateLocal(new Date(y, m, 1)));
                    }
                  }}
                  sx={{ borderRadius: "12px" }}
                >
                  {months.map((m, i) => (
                    <MenuItem key={i} value={String(i)}>
                      {m}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          </Stack>
        )}
      </Box>
    </Box>
  );
}
