import { useMemo } from "react";
import { DataGrid, GridColDef, GridToolbarContainer } from "@mui/x-data-grid";
import { Typography } from "@mui/material";
import { FRACTION_COLORS } from "../../utils/fractionColors";
import { CustomExportButton } from "./ExportTableButton";
import { DailyReport } from "../../types/chart.types";
import dayjs from "dayjs";
import "dayjs/locale/ru";
import formatWeight from "../../utils/formatWeight";

dayjs.locale("ru");

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
    field: "categoryName",
    headerName: "Фракция",
    flex: 1,
    cellClassName: "first-column-cell",
  },
  { field: "count", headerName: "Количество (шт)", type: "number", flex: 1 },
  { field: "weight", headerName: "Объём", type: "number", flex: 1 },
  { field: "percent", headerName: "Доля (%)", type: "number", flex: 1 },
  {
    field: "avgConfidence",
    headerName: "Точность сортировки (%)",
    type: "number",
    flex: 1.5,
    cellClassName: "last-column-cell",
  },
];

interface Props {
  data: DailyReport[];
  period: "day" | "month";
}

export default function FractionAnalysisTable({ data, period }: Props) {
  const groupedByDate = useMemo(() => {
    const map: Record<string, DailyReport[]> = {};
    data.forEach((item) => {
      if (!map[item.date]) map[item.date] = [];
      map[item.date].push(item);
    });
    return map;
  }, [data]);

  return (
    <div className="flex flex-col m-2 max-w-[1400px]">
      {Object.entries(groupedByDate).map(([date, dayData]) => {
        const totalCount = dayData.reduce(
          (sum, item) => sum + (item.count ?? 0),
          0
        );
        const rowsWithPercent = dayData.map((item, index) => ({
          ...item,
          weight: formatWeight(item.weight),
          id: `${date}-${index}`,
          percent: totalCount
            ? parseFloat(((item.count / totalCount) * 100).toFixed(2))
            : 0,
        }));

        function CustomToolbar() {
          return (
            <GridToolbarContainer>
              <CustomExportButton rows={rowsWithPercent} columns={columns} />
            </GridToolbarContainer>
          );
        }

        return (
          <div key={date}>
            <Typography variant="h6" className="mb-2 pl-2">
              {dayjs(date).format(period == "day" ? "DD.MM.YYYY" : "MMMM")}
            </Typography>
            <div className="flex-1 min-w-0 bg-white rounded-2xl shadow-md overflow-hidden mb-6">
              <div className="overflow-x-auto">
                <div className="min-w-[600px]">
                  <DataGrid
                    rows={rowsWithPercent}
                    columns={columns}
                    disableRowSelectionOnClick
                    hideFooter
                    getRowId={(row) => row.id}
                    slots={{ toolbar: CustomToolbar }}
                    getRowClassName={(params) =>
                      `row-${toSafeClassName(
                        normalize(params.row.categoryName)
                      )}`
                    }
                    sx={{
                      border: "none",
                      "& .MuiDataGrid-columnHeaders": {
                        backgroundColor: "#f5f5f5",
                        fontWeight: "bold",
                      },
                      "& .first-column-cell": { paddingLeft: "16px" },
                      "& .last-column-cell": { paddingRight: "16px" },
                      ...Object.fromEntries(
                        rowsWithPercent.map((row) => {
                          const normalizedName = normalize(row.categoryName);
                          const safeName = toSafeClassName(normalizedName);
                          const className = `.MuiDataGrid-row.row-${safeName}`;
                          const color =
                            FRACTION_COLORS[normalizedName] || "#eee";
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
          </div>
        );
      })}
    </div>
  );
}
