import {
  Accordion,
  AccordionActions,
  AccordionDetails,
  AccordionSummary,
  Button,
  Divider,
  Skeleton,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import ShowChartIcon from "@mui/icons-material/ShowChart";
import PieChartIcon from "@mui/icons-material/PieChart";
import BarChartIcon from "@mui/icons-material/BarChart";
import DateFilter from "../../components/filters/DateFilter";
import CheckFilters from "../../components/filters/CheckFilters";
import { ChartType } from "../../types/chart.types";
import { useScrollDirection } from "../../hooks/useScrollDirection";

interface SidebarFiltersProps {
  chartOption: string;
  onChartOptionChange: (value: string) => void;
  charts: ChartType[];
  selectedFilters: ChartType[];
  onToggleFilter: (filter: ChartType) => void;
  loading: boolean;
  startDate: string;
  endDate: string;
  onStartDateChange: (date: string) => void;
  onEndDateChange: (date: string) => void;
  onDownload: () => void;
}

export default function SidebarFilters({
  chartOption,
  onChartOptionChange,
  charts,
  selectedFilters,
  onToggleFilter,
  loading,
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  onDownload,
}: SidebarFiltersProps) {
  const handleChartOption = (
    _: React.MouseEvent<HTMLElement>,
    newOption: string | null
  ) => {
    if (newOption) onChartOptionChange(newOption);
  };
  const scrollDirection = useScrollDirection();
  const headerHeight = 78;
  const dynamicTop = scrollDirection === "down" ? 16 : headerHeight;

  return (
    <div
      className="flex flex-col gap-4 lg:sticky self-start w-full lg:w-fit"
      style={{
        top: dynamicTop,
        transition: "top 0.3s ease",
      }}
    >
      <div className="shadow-lg">
        <Accordion
          sx={{ borderRadius: 2, overflow: "hidden" }}
          defaultExpanded={window.innerWidth >= 768}
        >
          <AccordionSummary
            sx={{
              backgroundColor: "primary.main",
              color: "white",
              borderRadius: "2px 2px 0 0",
            }}
          >
            <div className="flex m-auto">
              <SettingsIcon sx={{ mr: 1 }} />
              <Typography variant="button">ОПЦИИ</Typography>
            </div>
          </AccordionSummary>

          <AccordionDetails>
            <div className="flex flex-col gap-2 mt-1 font-">
              <Typography variant="h6">Варианты графиков</Typography>
              <ToggleButtonGroup
                orientation="vertical"
                fullWidth
                color="primary"
                value={chartOption}
                exclusive
                onChange={handleChartOption}
              >
                <ToggleButton value="linear" sx={{ fontWeight: "bold" }}>
                  <ShowChartIcon sx={{ mb: 0.3, mr: 1 }} /> Линейный график
                </ToggleButton>
                <ToggleButton value="pie" sx={{ fontWeight: "bold" }}>
                  <PieChartIcon sx={{ mb: 0.5, mr: 1 }} /> Круговая диаграмма
                </ToggleButton>
                <ToggleButton value="bar" sx={{ fontWeight: "bold" }}>
                  <BarChartIcon sx={{ mb: 0.5, mr: 1 }} /> Столбчатая диаграмма
                </ToggleButton>
              </ToggleButtonGroup>

              <Divider sx={{ my: 2 }} />

              <Typography variant="h6">Промежуток времени</Typography>
              <DateFilter
                startDate={startDate}
                endDate={endDate}
                onStartDateChange={onStartDateChange}
                onEndDateChange={onEndDateChange}
              />

              <Divider sx={{ my: 2 }} />

              <Typography variant="h6">Категории</Typography>
              {loading ? (
                <Stack spacing={1}>
                  {Array.from({ length: 4 }).map((_, i) => (
                    <Skeleton
                      key={i}
                      variant="rounded"
                      width="100%"
                      height={36}
                    />
                  ))}
                </Stack>
              ) : charts.length ? (
                <CheckFilters
                  filters={charts}
                  selectedFilters={selectedFilters}
                  onToggleFilter={onToggleFilter}
                />
              ) : (
                <Typography color="error">Категории не найдены</Typography>
              )}
            </div>
          </AccordionDetails>

          <AccordionActions />
        </Accordion>
      </div>
      <div className="shadow-lg">
        <Button
          variant="contained"
          sx={{ backgroundColor: "success.main", width: "100%" }}
          onClick={onDownload}
        >
          Скачать отчёт
        </Button>
      </div>
    </div>
  );
}
