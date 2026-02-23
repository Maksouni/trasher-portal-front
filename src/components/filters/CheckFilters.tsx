import {
  Checkbox,
  FormControlLabel,
  FormGroup,
  Box,
  alpha,
} from "@mui/material";
import { ChartType } from "../../types/chart.types";

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
    <FormGroup sx={{ gap: 0.5 }}>
      {filters.map((filter) => {
        const isSelected = selectedFilters.some((f) => f.id === filter.id);

        return (
          <Box
            key={filter.id}
            sx={{
              borderRadius: "10px",
              transition: "all 0.2s",
              px: 1,
              "&:hover": {
                bgcolor: (theme) => alpha(theme.palette.primary.main, 0.05),
              },
            }}
          >
            <FormControlLabel
              sx={{
                width: "100%",
                mr: 0,
                "& .MuiFormControlLabel-label": {
                  fontSize: "0.9rem",
                  fontWeight: isSelected ? 600 : 400,
                  color: isSelected ? "primary.main" : "text.primary",
                  transition: "color 0.2s",
                  width: "100%",
                },
              }}
              control={
                <Checkbox
                  size="small"
                  checked={isSelected}
                  onChange={() => onToggleFilter(filter)}
                  sx={{
                    color: (theme) => alpha(theme.palette.divider, 0.5),
                    "&.Mui-checked": {
                      color: "primary.main",
                    },
                  }}
                />
              }
              label={filter.name}
            />
          </Box>
        );
      })}
    </FormGroup>
  );
}
