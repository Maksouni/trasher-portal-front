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

interface FlexibleDatePickerProps {
  period: "day" | "month";
  startDate: string;
  endDate: string;
  onStartDateChange: (date: string) => void;
  onEndDateChange: (date: string) => void;
  onPeriodChange: (period: "day" | "month") => void;
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

export default function FlexibleDatePicker({
  period,
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  onPeriodChange,
}: FlexibleDatePickerProps) {
  const getYear = (dateStr: string) => new Date(dateStr).getFullYear();
  const getMonth = (dateStr: string) => new Date(dateStr).getMonth();

  function formatDateLocal(date: Date) {
    const y = date.getFullYear();
    const m = (date.getMonth() + 1).toString().padStart(2, "0");
    const d = date.getDate().toString().padStart(2, "0");
    return `${y}-${m}-${d}`;
  }

  const MAX_DAY_DIFF = 30;

  const clampEndDate = (start: Date, end: Date) => {
    const diff = (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);
    if (diff > MAX_DAY_DIFF) {
      const newEnd = new Date(start);
      newEnd.setDate(newEnd.getDate() + MAX_DAY_DIFF);
      return newEnd;
    }
    return end;
  };

  const clampStartDate = (start: Date, end: Date) => {
    const diff = (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);
    if (diff > MAX_DAY_DIFF) {
      const newStart = new Date(end);
      newStart.setDate(newStart.getDate() - MAX_DAY_DIFF);
      return newStart;
    }
    return start;
  };

  return (
    <Box className="flex flex-col gap-3">
      <Typography>Период</Typography>
      <ToggleButtonGroup
        value={period}
        onChange={(_, val) => {
          if (val) onPeriodChange(val);
        }}
        exclusive
        size="small"
        fullWidth
      >
        <ToggleButton value="day">День</ToggleButton>
        <ToggleButton value="month">Месяц</ToggleButton>
      </ToggleButtonGroup>

      {period === "day" ? (
        <Box className="flex gap-2 flex-wrap">
          <TextField
            size="small"
            label="С"
            type="date"
            value={startDate}
            onChange={(e) => {
              const newStart = new Date(e.target.value);
              let newEnd = new Date(endDate);

              // если новая начальная дата > конечной → сдвигаем endDate
              if (newStart > newEnd) newEnd = newStart;

              // ограничиваем максимум 30 дней
              newEnd = clampEndDate(newStart, newEnd);

              onStartDateChange(formatDateLocal(newStart));
              onEndDateChange(formatDateLocal(newEnd));
            }}
            fullWidth
          />
          <TextField
            size="small"
            label="По"
            type="date"
            value={endDate}
            onChange={(e) => {
              const newEnd = new Date(e.target.value);
              let newStart = new Date(startDate);

              // если новая конечная дата < начальной → сдвигаем startDate
              if (newEnd < newStart) newStart = newEnd;

              // ограничиваем максимум 30 дней
              newStart = clampStartDate(newStart, newEnd);

              onStartDateChange(formatDateLocal(newStart));
              onEndDateChange(formatDateLocal(newEnd));
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
                const year = Number(e.target.value);
                const start = new Date(year, getMonth(startDate), 1);
                const end = new Date(year, getMonth(endDate) + 1, 0);

                if (start > end) {
                  onStartDateChange(formatDateLocal(start));
                  onEndDateChange(formatDateLocal(start));
                } else {
                  onStartDateChange(formatDateLocal(start));
                  onEndDateChange(formatDateLocal(end));
                }
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
                const month = Number(e.target.value);
                const year = getYear(startDate);
                const date = new Date(year, month, 1);

                if (date > new Date(endDate)) {
                  const lastDay = new Date(year, month + 1, 0);
                  onEndDateChange(formatDateLocal(lastDay));
                }
                onStartDateChange(formatDateLocal(date));
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
                const month = Number(e.target.value);
                const year = getYear(endDate);
                const lastDay = new Date(year, month + 1, 0);

                if (lastDay < new Date(startDate)) {
                  const firstDay = new Date(year, month, 1);
                  onStartDateChange(formatDateLocal(firstDay));
                }
                onEndDateChange(formatDateLocal(lastDay));
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
