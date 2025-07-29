import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { Button } from "@mui/material";
import type { GridColDef, GridRowModel } from "@mui/x-data-grid";

function exportToExcel(rows: GridRowModel[], columns: GridColDef[]) {
  // Формируем данные в виде массива массивов
  const header = columns.map((col) => col.headerName ?? col.field);
  const data = rows.map((row) =>
    columns.map((col) => {
      const value = row[col.field];
      // Если value — объект, преобразуем в строку, иначе оставляем как есть
      if (value && typeof value === "object") return JSON.stringify(value);
      return value ?? "";
    })
  );
  const worksheetData = [header, ...data];

  // Создаём worksheet
  const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

  // Создаём workbook и добавляем worksheet
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Фракции");

  // Генерируем файл Excel в бинарном формате
  const wbout = XLSX.write(workbook, { bookType: "xlsx", type: "array" });

  // Сохраняем файл с помощью file-saver
  const blob = new Blob([wbout], { type: "application/octet-stream" });
  saveAs(blob, "fragments_report.xlsx");
}

interface CustomExportButtonProps {
  rows: GridRowModel[];
  columns: GridColDef[];
}

export function CustomExportButton({ rows, columns }: CustomExportButtonProps) {
  return (
    <Button
      variant="outlined"
      size="small"
      onClick={() => exportToExcel(rows, columns)}
      sx={{ margin: 0.5 }}
    >
      Экспорт в Excel
    </Button>
  );
}
