import { useMemo, useState } from "react";
import {
  DataGrid,
  GridColDef,
  GridToolbarExport,
  GridToolbarContainer,
} from "@mui/x-data-grid";
import {
  MenuItem,
  ToggleButton,
  ToggleButtonGroup,
  FormControl,
  InputLabel,
  Select,
  SelectChangeEvent,
  Typography,
} from "@mui/material";
import { FRACTION_COLORS } from "../../utils/fractionColors";
import { ChartType } from "../../types/chart.types";

const periods = ["День", "Неделя", "Месяц"];

const columns: GridColDef[] = [
  {
    field: "name",
    headerName: "Фракция",
    flex: 1,
    sortable: true,
    cellClassName: "first-column-cell",
  },
  { field: "tons", headerName: "Объём (т)", type: "number", flex: 1 },
  { field: "percent", headerName: "Доля (%)", type: "number", flex: 1 },
  {
    field: "accuracy",
    headerName: "Точность сортировки (%)",
    type: "number",
    flex: 1.5,
    cellClassName: "last-column-cell",
  },
];

function CustomToolbar() {
  return (
    <GridToolbarContainer>
      <GridToolbarExport csvOptions={{ fileName: "fragments_report" }} />
    </GridToolbarContainer>
  );
}

interface Props {
  data: ChartType[];
}

export default function FractionAnalysisTable({ data }: Props) {
  const [period, setPeriod] = useState("День");
  const [fractionFilter, setFractionFilter] = useState("Все");

  const tableData = useMemo(
    () =>
      data.map((item) => ({
        id: item.id,
        name: item.name,
        tons: 50,
        percent: 20,
        accuracy: 80,
      })),
    [data]
  );

  const filteredData =
    fractionFilter === "Все"
      ? tableData
      : tableData.filter((item) => item.name === fractionFilter);

  const handlePeriodChange = (
    _: React.MouseEvent<HTMLElement>,
    newPeriod: string
  ) => {
    if (newPeriod !== null) {
      setPeriod(newPeriod);
    }
  };

  const handleFractionChange = (e: SelectChangeEvent) => {
    setFractionFilter(e.target.value);
  };

  return (
    <div className="flex flex-col gap-4 m-2 lg:mx-auto max-w-[1024px]">
      {/* Панель фильтров */}
      <div className="flex flex-wrap gap-4 items-center bg-white rounded-2xl shadow-md px-4 py-3">
        <Typography sx={{ flexGrow: 1 }} variant="h6" fontWeight={600}>
          Анализ фракций
        </Typography>

        <ToggleButtonGroup
          size="small"
          color="primary"
          value={period}
          exclusive
          onChange={handlePeriodChange}
        >
          {periods.map((p) => (
            <ToggleButton key={p} value={p}>
              {p}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>

        <FormControl size="small" sx={{ minWidth: 200 }}>
          <InputLabel>Фракция</InputLabel>
          <Select
            value={fractionFilter}
            onChange={handleFractionChange}
            label="Фракция"
          >
            <MenuItem value="Все">Все</MenuItem>
            {tableData.map((item) => (
              <MenuItem key={item.id} value={item.name}>
                {item.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>

      {/* Таблица */}
      <div className="bg-white rounded-2xl shadow-md overflow-hidden">
        <DataGrid
          rows={filteredData}
          columns={columns}
          disableRowSelectionOnClick
          hideFooter
          slots={{ toolbar: CustomToolbar }}
          getRowClassName={(params) =>
            `row-${params.row.name.replace(/\s/g, "-")}`
          }
          sx={{
            border: "none",
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: "#f5f5f5",
              fontWeight: "bold",
            },
            "& .first-column-cell": {
              paddingLeft: "16px",
            },
            "& .last-column-cell": {
              paddingRight: "16px",
            },
            ...Object.fromEntries(
              filteredData.map((row) => [
                `.row-${row.name.replace(/\s/g, "-")}`,
                {
                  backgroundColor: `${FRACTION_COLORS[row.name] || "#eee"}22`,
                  borderBottom: "1px solid #e0e0e0",
                },
              ])
            ),
          }}
        />
      </div>
    </div>
  );
}
