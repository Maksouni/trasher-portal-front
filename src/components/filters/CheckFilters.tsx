import { Checkbox, FormControlLabel, FormGroup } from "@mui/material";
import { ChartType } from "../../pages/statistics/StatisticsPage";

interface CheckFiltersProps {
  filters: ChartType[];
  selectedFilters: ChartType[];
  onToggleFilter: (filter: ChartType) => void;
}

export default function CheckFilters({
  filters,
  selectedFilters,
  onToggleFilter,
}: CheckFiltersProps) {
  return (
    <FormGroup>
      {filters.map((filter) => (
        <FormControlLabel
          key={filter.id}
          control={
            <Checkbox
              id={`filter-${filter.id}`}
              checked={selectedFilters.includes(filter)}
              onChange={() => onToggleFilter(filter)}
            />
          }
          label={filter.name}
        />
      ))}
    </FormGroup>
  );
}
