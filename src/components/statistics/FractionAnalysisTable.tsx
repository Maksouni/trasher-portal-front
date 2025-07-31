/* eslint-disable @typescript-eslint/no-unused-vars */
import { useMemo, useState } from "react";
import { DataGrid, GridColDef, GridToolbarContainer } from "@mui/x-data-grid";
import {
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  SelectChangeEvent,
  Typography,
} from "@mui/material";
import { FRACTION_COLORS } from "../../utils/fractionColors";
import { CustomExportButton } from "./ExportTableButton";
import FlexibleDatePicker from "../filters/FlexibleDatePicker";

function normalize(name?: string): string {
  return name
    ? name
        .replace(/\u00A0/g, " ")
        .replace(/\s+/g, " ")
        .trim()
    : "";
}

function toSafeClassName(name?: string): string {
  return name
    ? name
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[().]/g, "")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
    : "";
}

const columns: GridColDef[] = [
  {
    field: "name",
    headerName: "Фракция",
    flex: 1,
    sortable: true,
    cellClassName: "first-column-cell",
  },
  {
    field: "totalCount",
    headerName: "Количество (шт)",
    type: "number",
    flex: 1,
  },
  {
    field: "tons",
    headerName: "Объём (т)",
    type: "number",
    flex: 1,
  },
  {
    field: "percent",
    headerName: "Доля (%)",
    type: "number",
    flex: 1,
  },
  {
    field: "accuracy",
    headerName: "Точность сортировки (%)",
    type: "number",
    flex: 1.5,
    cellClassName: "last-column-cell",
  },
];

interface FractionData {
  id: number;
  name: string;
  totalCount: number;
  tons: number;
  accuracy: number;
  percent?: number;
}

interface Props {
  data: FractionData[];
  period: "day" | "month";
  startDate: string;
  endDate: string;
  onPeriodChange: (period: "day" | "month") => void;
  onStartDateChange: (date: string) => void;
  onEndDateChange: (date: string) => void;
}

export default function FractionAnalysisTable({
  data,
  period,
  endDate,
  onEndDateChange,
  onPeriodChange,
  onStartDateChange,
  startDate,
}: Props) {
  const [fractionFilter, setFractionFilter] = useState("Все");

  const tableData = useMemo(() => data, [data]);

  const filteredData =
    fractionFilter === "Все"
      ? tableData
      : tableData.filter((item) => item.name === fractionFilter);

  // сумма всех count для filteredData
  const totalCount = useMemo(() => {
    return filteredData.reduce((sum, item) => sum + (item.totalCount ?? 0), 0);
  }, [filteredData]);

  // Формируем данные для таблицы с вычислением процента по количеству
  const rowsWithPercent = useMemo(() => {
    if (totalCount === 0)
      return filteredData.map((item) => ({ ...item, percent: 0 }));

    const t = filteredData.map((item) => ({
      ...item,
      percent: ((item.totalCount / totalCount) * 100).toFixed(2),
    }));

    return t;
  }, [filteredData, totalCount]);

  const handleFractionChange = (e: SelectChangeEvent) => {
    setFractionFilter(e.target.value);
  };

  function CustomToolbar({
    rows,
    columns,
  }: {
    rows: typeof rowsWithPercent;
    columns: GridColDef[];
  }) {
    return (
      <GridToolbarContainer>
        <CustomExportButton rows={rows} columns={columns} />
      </GridToolbarContainer>
    );
  }

  return (
    <div className="flex flex-col gap-4 m-2 lg:mx-auto max-w-[1024px] lg:flex-row">
      {/* Левая колонка — таблица */}
      {/* Левая колонка — таблица */}
      <div className="flex-1 min-w-0 order-2 lg:order-1 bg-white rounded-2xl shadow-md overflow-hidden">
        {/* Обертка с горизонтальным скроллом */}
        <div className="overflow-x-auto lg:mx-0">
          {/* Внутренний контейнер с фиксированной минимальной шириной */}
          <div className="min-w-[600px]">
            <DataGrid
              rows={rowsWithPercent}
              columns={columns}
              disableRowSelectionOnClick
              hideFooter
              getRowId={(row) => row.id}
              slots={{
                toolbar: (_toolbarProps) => (
                  <CustomToolbar rows={rowsWithPercent} columns={columns} />
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
                  rowsWithPercent.map((row) => {
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
      </div>

      {/* Правая колонка — фильтры */}
      <aside className="w-full lg:w-[320px] lg:order-2 order-1  flex-shrink-0 bg-white rounded-2xl shadow-md px-4 py-4 flex flex-col gap-4">
        <Typography variant="h6" fontWeight={600}>
          Анализ фракций
        </Typography>

        <FlexibleDatePicker
          period={period}
          startDate={startDate}
          endDate={endDate}
          onPeriodChange={onPeriodChange}
          onStartDateChange={onStartDateChange}
          onEndDateChange={onEndDateChange}
        />

        <FormControl size="small" fullWidth>
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
      </aside>
    </div>
  );
}
