/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useState } from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Typography, Select, MenuItem } from "@mui/material";
import dayjs from "dayjs";
import "dayjs/locale/ru";
import { FRACTION_COLORS } from "../../utils/fractionColors";
import formatWeight from "../../utils/formatWeight";
import { DailyReport } from "../../types/chart.types";

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

interface Props {
  data: DailyReport[];
  period: "day" | "month";
}

export default function FractionPivotTable({ data, period }: Props) {
  const [metric, setMetric] = useState<"count" | "weight" | "avgConfidence">(
    "count"
  );

  const grouped = useMemo(() => {
    const map: Record<string, DailyReport[]> = {};
    data.forEach((item) => {
      if (!map[item.date]) map[item.date] = [];
      map[item.date].push(item);
    });
    return map;
  }, [data]);

  const allCategories = useMemo(() => {
    const set = new Set<string>();
    data.forEach((d) => set.add(normalize(d.categoryName)));
    return Array.from(set);
  }, [data]);

  const columns: GridColDef[] = [
    { field: "date", headerName: "Дата", flex: 1 },
    ...allCategories.map((cat) => ({
      field: toSafeClassName(cat),
      headerName: cat,
      flex: 1,
    })),
    {
      field: "total",
      headerName: metric == "avgConfidence" ? "Среднее" : "Сумма",
      flex: 0.7,
    },
  ];

  const rows = useMemo(() => {
    return Object.entries(grouped).map(([date, arr]) => {
      const row: any = {
        id: date,
        date:
          period === "month"
            ? dayjs(date).format("MMMM")
            : dayjs(date).format("DD.MM.YYYY"),
      };
      allCategories.forEach((cat) => {
        const items = arr.filter((i) => normalize(i.categoryName) === cat);

        if (metric === "avgConfidence") {
          const avg = items.length
            ? items.reduce((s, i) => s + (i.avgConfidence ?? 0), 0) /
              items.length
            : 0;
          row[toSafeClassName(cat)] = parseFloat(avg.toFixed(2));
        } else if (metric === "count") {
          row[toSafeClassName(cat)] = new Intl.NumberFormat("ru-RU").format(
            items.reduce((s, i) => s + (i.count ?? 0), 0)
          );
        } else if (metric === "weight") {
          const w = items.reduce((s, i) => s + (i.weight ?? 0), 0);
          row[`raw_${toSafeClassName(cat)}`] = w;
          row[toSafeClassName(cat)] = formatWeight(w);
        }
      });

      if (metric === "avgConfidence") {
        const values = allCategories.map((cat) => row[toSafeClassName(cat)]);
        const avg = values.reduce((s, v) => s + v, 0) / (values.length || 1);
        row.total = parseFloat(avg.toFixed(2));
      } else {
        if (metric === "weight") {
          const sum = allCategories.reduce(
            (s, cat) => s + (row[`raw_${toSafeClassName(cat)}`] ?? 0),
            0
          );
          row.total = formatWeight(sum);
        } else {
          const sum = allCategories.reduce(
            (s, cat) =>
              s + (Number(row[toSafeClassName(cat)].replace(/\s/g, "")) || 0),
            0
          );

          row.total = new Intl.NumberFormat("ru-RU").format(sum);
        }
      }

      return row;
    });
  }, [grouped, period, allCategories, metric]);

  return (
    <div className="flex flex-col m-2 max-w-[1500px]">
      <div className="mb-2 flex gap-4 items-center">
        <Typography variant="h6" className="pl-2">
          {period === "day" ? "Отчёт по дням" : "Отчёт по месяцам"}
        </Typography>
        <Select
          value={metric}
          onChange={(e) => setMetric(e.target.value as any)}
          size="small"
          // sx={{ backgroundColor: "white" }}
        >
          <MenuItem value="count">Количество</MenuItem>
          <MenuItem value="weight">Объём</MenuItem>
          <MenuItem value="avgConfidence">Точность сортировки</MenuItem>
        </Select>
      </div>

      <div className="flex-1 bg-white rounded-2xl shadow-md overflow-hidden mt-2 mb-6">
        <div className="overflow-x-auto">
          <div className="min-w-[600px]">
            <DataGrid
              rows={rows}
              columns={columns}
              hideFooter
              disableRowSelectionOnClick
              sx={{
                border: "none",
                "& .MuiDataGrid-columnHeaders": {
                  backgroundColor: "#f5f5f5",
                  fontWeight: "bold",
                },

                ...Object.fromEntries(
                  allCategories.map((cat) => {
                    const color = FRACTION_COLORS[cat] || "#eee";
                    const field = toSafeClassName(cat);

                    return [
                      `.MuiDataGrid-columnHeader[data-field="${field}"]`,
                      { backgroundColor: `${color}55` },
                    ];
                  })
                ),

                ...Object.fromEntries(
                  allCategories.map((cat) => {
                    const color = FRACTION_COLORS[cat] || "#eee";
                    const field = toSafeClassName(cat);

                    return [
                      `.MuiDataGrid-cell[data-field="${field}"]`,
                      { backgroundColor: `${color}30` },
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
}
