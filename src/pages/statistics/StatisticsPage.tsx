import { Button } from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";

export default function StatisticsPage() {
  return (
    <div className="flex flex-col bg-white m-2">
      <Button
        variant="contained"
        startIcon={<FilterListIcon />}
        color="primary"
        sx={{
          flexGrow: 1,
          height: "40px",
        }}
      >
        Фильтры
      </Button>
      <div className="flex"></div>
    </div>
  );
}
