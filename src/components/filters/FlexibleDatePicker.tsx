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
            onChange={(e) => onStartDateChange(e.target.value)}
            fullWidth
          />
          <TextField
            size="small"
            label="По"
            type="date"
            value={endDate}
            onChange={(e) => onEndDateChange(e.target.value)}
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
                const start = new Date(startDate);
                const end = new Date(endDate);
                start.setFullYear(year);
                end.setFullYear(year);
                onStartDateChange(start.toISOString().split("T")[0]);
                onEndDateChange(end.toISOString().split("T")[0]);
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
                onStartDateChange(date.toISOString().split("T")[0]);
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
                onEndDateChange(lastDay.toISOString().split("T")[0]);
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
