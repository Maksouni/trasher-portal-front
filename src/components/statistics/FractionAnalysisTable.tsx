/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useState } from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import {
  Typography,
  Select,
  MenuItem,
  alpha,
  Box,
  Paper,
  Stack,
  useTheme,
  Skeleton,
} from "@mui/material";
import dayjs from "dayjs";
import "dayjs/locale/ru";
import { getFractionColor, normalizeCategoryKey } from "../../utils/fractionColors";
import formatWeight from "../../utils/formatWeight";
import { DailyReport } from "../../types/chart.types";
import { useCharts } from "../../context/charts/useChart";

dayjs.locale("ru");

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

export default function FractionPivotTable() {
  const { period, dailyData, isDataLoading } = useCharts();
  const [metric, setMetric] = useState<"count" | "weight">("count");
  const theme = useTheme();

  const grouped = useMemo(() => {
    const map: Record<string, DailyReport[]> = {};
    dailyData.forEach((item) => {
      const key = period === "5min" ? (item.ts ?? item.date) : item.date;
      if (!map[key]) map[key] = [];
      map[key].push(item);
    });
    return map;
  }, [dailyData, period]);

  const allCategories = useMemo(() => {
    const set = new Set<string>();
    dailyData.forEach((d) => set.add(normalizeCategoryKey(d.categoryName)));
    return Array.from(set);
  }, [dailyData]);

  const columns: GridColDef[] = useMemo(
    () => [
      {
        field: "date",
        headerName: "Период",
        minWidth: 140,
        flex: 1.2,
      },
      ...allCategories.map((cat) => ({
        field: toSafeClassName(cat),
        headerName: cat,
        flex: 1,
        minWidth: 110,
        align: "right" as const,
        headerAlign: "right" as const,
        valueFormatter: (value: any) => {
          if (value === null || value === undefined) return "—";
          if (metric === "weight") return formatWeight(value);
          return new Intl.NumberFormat("ru-RU").format(value);
        },
      })),
      {
        field: "total",
        headerName: "Итого",
        flex: 1,
        minWidth: 110,
        align: "right" as const,
        headerAlign: "right" as const,
        sx: { fontWeight: 700 },
        valueFormatter: (value: any) => {
          if (value === null || value === undefined) return "—";
          if (metric === "weight") return formatWeight(value);
          return new Intl.NumberFormat("ru-RU").format(value);
        },
      },
    ],
    [allCategories, metric],
  );

  const rows = useMemo(() => {
    if (dailyData.length === 0) return [];

    const rowData = Object.entries(grouped).map(([date, arr]) => {
      const row: any = {
        id: date,
        date:
          period === "5min"
            ? dayjs(date).format("HH:mm")
            : period === "month"
              ? dayjs(date).format("MMMM")
              : dayjs(date).format("DD.MM.YYYY"),
      };

      allCategories.forEach((cat) => {
        const field = toSafeClassName(cat);
        const items = arr.filter(
          (i) => normalizeCategoryKey(i.categoryName) === cat,
        );

        if (metric === "count") {
          row[field] = items.reduce((s, i) => s + (i.count ?? 0), 0);
        } else {
          row[field] = items.reduce((s, i) => s + (i.weight ?? 0), 0);
        }
      });

      const categoryFields = allCategories.map((cat) => toSafeClassName(cat));
      row.total = categoryFields.reduce((sum, f) => sum + (row[f] || 0), 0);

      return row;
    });

    const totalRow: any = { id: "total", date: "ИТОГО" };
    allCategories.forEach((cat) => {
      const field = toSafeClassName(cat);
      totalRow[field] = rowData.reduce((s, r) => s + (r[field] || 0), 0);
    });

    totalRow.total = allCategories.reduce(
      (s, cat) => s + (totalRow[toSafeClassName(cat)] || 0),
      0,
    );

    return [...rowData, totalRow];
  }, [grouped, period, allCategories, metric, dailyData]);

  if (isDataLoading && dailyData.length === 0) {
    return (
      <Paper sx={{ p: 3, borderRadius: "20px", mt: 2 }}>
        <Skeleton variant="text" width="200px" height={40} sx={{ mb: 2 }} />
        <Skeleton variant="rounded" height={400} />
      </Paper>
    );
  }

  const periodLabel =
    period === "day"
      ? "Отчёт по дням"
      : period === "month"
        ? "Отчёт по месяцам"
        : "Отчёт по минутам";

  return (
    <Box sx={{ pb: 4 }}>
      <Paper
        elevation={0}
        sx={{
          p: 3,
          borderRadius: "20px",
          background: alpha(theme.palette.background.paper, 0.6),
          backdropFilter: "blur(12px)",
          border: "1px solid",
          borderColor: alpha(theme.palette.divider, 0.1),
        }}
      >
        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems="center"
          spacing={2}
          sx={{ mb: 3 }}
        >
          <Typography
            variant="h6"
            sx={{ fontWeight: 700, color: "text.primary" }}
          >
            {periodLabel}
          </Typography>

          <Select
            value={metric}
            onChange={(e) =>
              setMetric(e.target.value as "count" | "weight")
            }
            size="small"
            sx={{
              borderRadius: "10px",
              minWidth: 220,
              bgcolor: alpha(theme.palette.background.paper, 0.8),
            }}
          >
            <MenuItem value="count">Количество (шт)</MenuItem>
            <MenuItem value="weight">Объём (кг/т)</MenuItem>
          </Select>
        </Stack>

        <Box sx={{ width: "100%", height: 600 }}>
          <DataGrid
            rows={rows}
            columns={columns}
            loading={isDataLoading}
            disableRowSelectionOnClick
            disableColumnMenu
            disableColumnResize
            density="comfortable"
            sx={{
              border: "none",
              "& .MuiDataGrid-columnHeaders": {
                bgcolor: alpha(theme.palette.divider, 0.05),
                borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
              },
              "& .MuiDataGrid-columnHeaderTitle": {
                fontWeight: 600,
                color: "text.secondary",
              },
              ...Object.fromEntries(
                allCategories.map((cat) => {
                  const color = getFractionColor(cat, "#999");
                  const field = toSafeClassName(cat);
                  return [
                    `& .MuiDataGrid-cell[data-field="${field}"]`,
                    {
                      bgcolor: alpha(color, 0.2),
                    },
                  ];
                }),
              ),
              '& .MuiDataGrid-row[data-id="total"]': {
                bgcolor: alpha(theme.palette.primary.main, 0.1),
                fontWeight: 800,
                "&:hover": { bgcolor: alpha(theme.palette.primary.main, 0.2) },
              },
            }}
          />
        </Box>
      </Paper>
    </Box>
  );
}
