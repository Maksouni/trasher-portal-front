import { Box, Stack } from "@mui/material";
import SidebarFilters from "../../components/filters/SidebarFilters";
import ChartView from "../../components/statistics/ChartView";
import FractionAnalysisTable from "../../components/statistics/FractionAnalysisTable";
import StatsSummary from "../../components/statistics/StatsSummary";
import ChartsProvider from "../../context/charts/ChartsProvider";
import { useCharts } from "../../context/charts/useChart";

function ChartsContent() {
  const { chartOption } = useCharts();

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", lg: "row" },
        gap: { xs: 2, lg: 3 },
        width: "100%",
      }}
    >
      <Box
        sx={{
          order: { xs: 1, lg: 2 },
          width: { xs: "100%", lg: "300px" },
          flexShrink: 0,
        }}
      >
        <SidebarFilters />
      </Box>

      <Stack
        spacing={2}
        sx={{
          flexGrow: 1,
          order: { xs: 2, lg: 1 },
          minWidth: 0,
        }}
      >
        <StatsSummary />

        {chartOption === "table" ? <FractionAnalysisTable /> : <ChartView />}
      </Stack>
    </Box>
  );
}

export default function ChartsPage() {
  return (
    <ChartsProvider>
      <ChartsContent />
    </ChartsProvider>
  );
}
