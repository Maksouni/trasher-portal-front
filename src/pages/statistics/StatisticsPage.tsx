import {
  Accordion,
  AccordionActions,
  AccordionDetails,
  AccordionSummary,
  Button,
  Divider,
  Typography,
} from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import DateFilter from "../../components/filters/DateFilter";
import { useEffect, useState } from "react";
import axios from "../../api/axios";
import { apiUrl } from "../../dotenv";
import CheckFilters from "../../components/filters/CheckFilters";

export interface ChartType {
  id: number;
  name: string;
}

export default function StatisticsPage() {
  const [charts, setCharts] = useState<ChartType[]>([]);
  const [filteredCharts, setFilteredCharts] = useState<ChartType[]>(charts);

  const [selectedFilters, setSelectedFilters] = useState<ChartType[]>([]);

  const [startDate, setStartDate] = useState<string>(
    new Date(new Date().setDate(new Date().getDate() - 7))
      .toISOString()
      .split("T")[0]
  );
  const [endDate, setEndDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get(`${apiUrl}categories`);
      setCharts(response.data);
    };
    fetchData();
  }, []);

  useEffect(() => {
    setFilteredCharts(charts);
  }, [charts]);

  const handleToggleFilter = (filter: ChartType) => {
    setSelectedFilters((prev) => {
      const updatedFilters = prev.some((f) => f.id === filter.id)
        ? prev.filter((f) => f.id !== filter.id)
        : [...prev, filter];

      setFilteredCharts(
        charts.filter(
          (chart) =>
            updatedFilters.length === 0 ||
            updatedFilters.some((f) => f.name === chart.name)
        )
      );

      return updatedFilters;
    });
  };

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
    <div className="flex flex-col m-2 gap-1">
      {/* Mobile layout */}
      <Accordion sx={{ borderRadius: 2 }}>
        <AccordionSummary
          sx={{
            backgroundColor: "primary.main",
            color: "white",
            borderRadius: 2,
          }}
        >
          <div className="flex m-auto">
            <FilterListIcon sx={{ marginRight: 1 }} />
            <Typography variant="button" component="span">
              Фильтры
            </Typography>
          </div>
        </AccordionSummary>

        <AccordionDetails>
          <div className="flex flex-col gap-1 mt-1">
            <Typography variant="h6">Промежуток времени</Typography>
            <DateFilter
              startDate={startDate}
              endDate={endDate}
              onStartDateChange={handleStartDateChange}
              onEndDateChange={handleEndDateChange}
            />

            <Divider sx={{ marginTop: 2, marginBottom: 1 }} />

            <Typography variant="h6">Категории</Typography>
            <CheckFilters
              filters={charts}
              selectedFilters={selectedFilters}
              onToggleFilter={handleToggleFilter}
            />
          </div>
        </AccordionDetails>

        <AccordionActions>
          {/* <Button variant="contained">По умолчанию</Button> */}
        </AccordionActions>
      </Accordion>
      <div className="flex"></div>
    </div>
  );
}
