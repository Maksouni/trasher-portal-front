import { Stack, TextField } from "@mui/material";

interface DateFilterProps {
  startDate: string;
  endDate: string;
  onStartDateChange: (date: string) => void;
  onEndDateChange: (date: string) => void;
}

function toDateInputValue(isoOrDay: string): string {
  if (!isoOrDay) return "";
  return isoOrDay.includes("T") ? isoOrDay.slice(0, 10) : isoOrDay.slice(0, 10);
}

export default function DateFilter({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
}: DateFilterProps) {
  return (
    <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
      <TextField
        label="С"
        type="date"
        value={toDateInputValue(startDate)}
        onChange={(e) => onStartDateChange(e.target.value)}
        InputLabelProps={{ shrink: true }}
        fullWidth
        size="small"
      />
      <TextField
        label="По"
        type="date"
        value={toDateInputValue(endDate)}
        onChange={(e) => onEndDateChange(e.target.value)}
        InputLabelProps={{ shrink: true }}
        fullWidth
        size="small"
      />
    </Stack>
  );
}
