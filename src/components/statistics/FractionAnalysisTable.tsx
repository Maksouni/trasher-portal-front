/* eslint-disable @typescript-eslint/no-unused-vars */
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
import { CustomExportButton } from "./ExportTableButton";

function toSafeClassName(name: string): string {
  return name
    .toLowerCase()
    .replace(/\s+/g, "-") // пробелы в дефис
    .replace(/[().]/g, "") // убираем скобки и точки
    .normalize("NFD") // убрать акценты
    .replace(/[\u0300-\u036f]/g, "");
}

function normalize(name: string): string {
  // Просто убираем неразрывные пробелы и меняем множественные пробелы на один,
  // но не трогаем точки, скобки и регистр
  return name
    .replace(/\u00A0/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

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

  function CustomToolbar({
    rows,
    columns,
  }: {
    rows: typeof filteredData;
    columns: GridColDef[];
  }) {
    return (
      <GridToolbarContainer>
        <CustomExportButton rows={rows} columns={columns} />
      </GridToolbarContainer>
    );
  }

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
          slots={{
            toolbar: (_toolbarProps) => (
              <CustomToolbar rows={filteredData} columns={columns} />
            ),
          }}
          getRowClassName={(params) =>
            `row-${toSafeClassName(normalize(params.row.name))}`
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
              filteredData.map((row) => {
                const normalizedName = normalize(row.name);
                const safeName = toSafeClassName(normalizedName);
                const className = `.MuiDataGrid-row.row-${safeName}`;
                const color = FRACTION_COLORS[normalizedName] || "#eee";
                return [
                  className,
                  {
                    backgroundColor: `${color}33`,
                    borderBottom: "1px solid #e0e0e0",
                  },
                ];
              })
            ),
          }}
        />
      </div>
    </div>
  );
}
