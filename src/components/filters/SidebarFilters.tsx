import {
  Button,
  Divider,
  Paper,
  Skeleton,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import ShowChartIcon from "@mui/icons-material/ShowChart";
import PieChartIcon from "@mui/icons-material/PieChart";
import BarChartIcon from "@mui/icons-material/BarChart";
import TableChartIcon from "@mui/icons-material/TableChart";

import CheckFilters from "../../components/filters/CheckFilters";
import FlexibleDatePicker from "./FlexibleDatePicker";
import { useCharts } from "../../context/charts/useChart";

export default function SidebarFilters() {
  const {
    chartOption,
    setChartOption,
    charts,
    selectedFilters,
    toggleFilter,
    loading,
    period,
    changePeriod,
    downloadReport,
  } = useCharts();

  const handleChartOption = (
    _: React.MouseEvent<HTMLElement>,
    newOption: string | null
  ) => {
    if (!newOption) return;

    setChartOption(newOption);

    if (newOption === "linear" && period !== "day") {
      changePeriod("day");
    }
  };

  return (
    <Paper
      elevation={3}
      className="flex flex-col gap-4 lg:sticky self-start w-full lg:max-w-[300px] lg:min-w-[300px] overflow-y-auto p-4"
    >
      <Typography variant="h6">Варианты отображения</Typography>

      <ToggleButtonGroup
        orientation="vertical"
        fullWidth
        color="primary"
        value={chartOption}
        exclusive
        onChange={handleChartOption}
      >
        <ToggleButton value="table" sx={{ fontWeight: "bold" }}>
          <TableChartIcon sx={{ mb: 0.3, mr: 1 }} />
          Таблица
        </ToggleButton>

        <ToggleButton value="linear" sx={{ fontWeight: "bold" }}>
          <ShowChartIcon sx={{ mb: 0.3, mr: 1 }} />
          Линейный график
        </ToggleButton>

        <ToggleButton value="pie" sx={{ fontWeight: "bold" }}>
          <PieChartIcon sx={{ mb: 0.5, mr: 1 }} />
          Круговая диаграмма
        </ToggleButton>

        <ToggleButton value="bar" sx={{ fontWeight: "bold" }}>
          <BarChartIcon sx={{ mb: 0.5, mr: 1 }} />
          Столбчатая диаграмма
        </ToggleButton>
      </ToggleButtonGroup>

      <Divider sx={{ my: 2 }} />

      <Typography variant="h6">Промежуток времени</Typography>

      <FlexibleDatePicker />

      <Divider sx={{ my: 2 }} />

      <Typography variant="h6">Категории</Typography>

      {loading ? (
        <Stack spacing={1}>
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} variant="rounded" width="100%" height={36} />
          ))}
        </Stack>
      ) : charts.length ? (
        <CheckFilters
          filters={charts}
          selectedFilters={selectedFilters}
          onToggleFilter={toggleFilter}
        />
      ) : (
        <Typography color="error">Категории не найдены</Typography>
      )}

      <Button
        variant="contained"
        sx={{ backgroundColor: "success.main", width: "100%" }}
        onClick={downloadReport}
      >
        Скачать отчёт
      </Button>
    </Paper>
  );
}
