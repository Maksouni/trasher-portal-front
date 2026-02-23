import {
  Button,
  Divider,
  Paper,
  Skeleton,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  Box,
  alpha,
  Tooltip,
} from "@mui/material";
import ShowChartIcon from "@mui/icons-material/ShowChart";
import PieChartIcon from "@mui/icons-material/PieChart";
import BarChartIcon from "@mui/icons-material/BarChart";
import TableChartIcon from "@mui/icons-material/TableChart";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";

import CheckFilters from "../../components/filters/CheckFilters";
import FlexibleDatePicker from "./FlexibleDatePicker";
import { useCharts } from "../../context/charts/useChart";

const sectionTitleStyle = {
  fontSize: "0.875rem",
  fontWeight: 700,
  textTransform: "uppercase",
  color: "text.secondary",
  letterSpacing: "0.05rem",
  mb: 1.5,
};

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
    newOption: string | null,
  ) => {
    if (!newOption) return;
    setChartOption(newOption);
    if (newOption === "linear" && period !== "day") {
      changePeriod("day");
    }
  };

  return (
    <Paper
      elevation={0}
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2.5,
        position: { lg: "sticky" },
        top: { lg: "20px" },
        alignSelf: "start",
        width: "100%",
        maxWidth: { lg: "300px" },
        p: 3,
        borderRadius: "24px",
        background: (theme) => alpha(theme.palette.background.paper, 0.6),
        backdropFilter: "blur(12px)",
        border: "1px solid",
        borderColor: (theme) => alpha(theme.palette.divider, 0.1),
        boxSizing: "border-box",
      }}
    >
      <Box>
        <Typography sx={sectionTitleStyle}>Отображение</Typography>
        <ToggleButtonGroup
          orientation="horizontal"
          fullWidth
          color="primary"
          value={chartOption}
          exclusive
          onChange={handleChartOption}
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 1,
            "& .MuiToggleButton-root": {
              border: "none",
              borderRadius: "12px !important",
              p: 1.5,
              transition: "all 0.2s ease-in-out",
              aspectRatio: "1/1",
              "&.Mui-selected": {
                bgcolor: (theme) => alpha(theme.palette.primary.main, 0.12),
                color: "primary.main",
                transform: "scale(1.05)",
                boxShadow: (theme) =>
                  `0 4px 12px ${alpha(theme.palette.primary.main, 0.1)}`,
              },
              "& svg": {
                fontSize: "1.75rem",
              },
            },
          }}
        >
          <ToggleButton value="table">
            <Tooltip title="Таблица" arrow>
              <TableChartIcon />
            </Tooltip>
          </ToggleButton>

          <ToggleButton value="linear">
            <Tooltip title="Линейный график" arrow>
              <ShowChartIcon />
            </Tooltip>
          </ToggleButton>

          <ToggleButton value="pie">
            <Tooltip title="Круговая диаграмма" arrow>
              <PieChartIcon />
            </Tooltip>
          </ToggleButton>

          <ToggleButton value="bar">
            <Tooltip title="Столбчатая диаграмма" arrow>
              <BarChartIcon />
            </Tooltip>
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      <Divider sx={{ opacity: 0.6 }} />

      <Box>
        <Typography sx={sectionTitleStyle}>Период</Typography>
        <FlexibleDatePicker />
      </Box>

      <Divider sx={{ opacity: 0.6 }} />

      <Box sx={{ flexGrow: 1 }}>
        <Typography sx={sectionTitleStyle}>Категории</Typography>
        {loading ? (
          <Stack spacing={1.5}>
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton
                key={i}
                variant="rounded"
                width="100%"
                height={32}
                sx={{ borderRadius: "8px" }}
              />
            ))}
          </Stack>
        ) : charts.length ? (
          <Box
            sx={{
              maxHeight: "260px",
              overflowY: "auto",
              pr: 1,
              "&::-webkit-scrollbar": { width: "4px" },
              "&::-webkit-scrollbar-thumb": {
                bgcolor: (theme) => alpha(theme.palette.divider, 0.2),
                borderRadius: "4px",
              },
            }}
          >
            <CheckFilters
              filters={charts}
              selectedFilters={selectedFilters}
              onToggleFilter={toggleFilter}
            />
          </Box>
        ) : (
          <Typography variant="body2" color="error" sx={{ py: 1 }}>
            Категории не найдены
          </Typography>
        )}
      </Box>

      <Button
        variant="contained"
        fullWidth
        disableElevation
        startIcon={<CloudDownloadIcon />}
        onClick={downloadReport}
        sx={{
          py: 1.5,
          borderRadius: "14px",
          textTransform: "none",
          fontWeight: 700,
          bgcolor: "#2e7d32",
          "&:hover": {
            bgcolor: "#1b5e20",
          },
        }}
      >
        Скачать отчёт
      </Button>
    </Paper>
  );
}
