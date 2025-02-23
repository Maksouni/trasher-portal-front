import {
  Accordion,
  AccordionActions,
  AccordionDetails,
  AccordionSummary,
  Button,
  Typography,
} from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import DateFilter from "../../components/filters/DateFilter";
import { useState } from "react";

export default function StatisticsPage() {
  const [startDate, setStartDate] = useState<string>(
    new Date(new Date().setDate(new Date().getDate() - 7))
      .toISOString()
      .split("T")[0]
  );
  const [endDate, setEndDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );

  const handleStartDateChange = (date: string) => {
    setStartDate(date);
    if (endDate && new Date(date) > new Date(endDate)) {
      setEndDate(date);
    }
  };

  const handleEndDateChange = (date: string) => {
    setEndDate(new Date(date).toISOString());
  };
  return (
    <div className="flex flex-col bg-white m-2 gap-1">
      {/* Mobile layout */}
      <Accordion>
        <AccordionSummary
          sx={{ backgroundColor: "primary.main", color: "white" }}
        >
          <div className="flex m-auto">
            <FilterListIcon sx={{ marginRight: 1 }} />
            <Typography variant="button" component="span">
              Фильтры
            </Typography>
          </div>
        </AccordionSummary>
        <AccordionDetails>
          <div className="flex flex-col gap-1">
            <Typography variant="h6">Промежуток времени</Typography>
            <DateFilter
              startDate={startDate}
              endDate={endDate}
              onStartDateChange={handleStartDateChange}
              onEndDateChange={handleEndDateChange}
            />
          </div>
        </AccordionDetails>
        <AccordionActions>
          <Button>Очистить</Button>
          <Button variant="contained">Применить</Button>
        </AccordionActions>
      </Accordion>
      <div className="flex"></div>
    </div>
  );
}
