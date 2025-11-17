import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
} from "@mui/material";
import { FRACTION_COLORS } from "../../utils/fractionColors";

interface ChartTableProps {
  title: string;
  data: {
    date: string;
    count: number;
    avgConfidence: number | { parsedValue: number };
  }[];
  period: "day" | "month";
}

const RU_MONTHS = [
  "Январь",
  "Февраль",
  "Март",
  "Апрель",
  "Май",
  "Июнь",
  "Июль",
  "Август",
  "Сентябрь",
  "Октябрь",
  "Ноябрь",
  "Декабрь",
];

export default function ChartTable({ title, data, period }: ChartTableProps) {
  // Сортировка данных по дате
  const sortedData = [...data].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const mainColor = FRACTION_COLORS[title] || "#8E24AA";

  // Формат даты
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return period === "month"
      ? RU_MONTHS[date.getMonth()]
      : `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`;
  };

  return (
    <TableContainer component={Paper} className="shadow-lg rounded-2xl">
      <Typography variant="h6" sx={{ p: 2 }}>
        {title}
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Дата</TableCell>
            <TableCell align="right">Количество</TableCell>
            <TableCell align="right">Точность (%)</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sortedData.map((d, idx) => {
            let confidenceValue = 0;
            if (typeof d.avgConfidence === "number")
              confidenceValue = d.avgConfidence;
            else if (
              d.avgConfidence &&
              typeof d.avgConfidence.parsedValue === "number"
            )
              confidenceValue = d.avgConfidence.parsedValue;

            confidenceValue = Math.round(confidenceValue * 100);

            return (
              <TableRow key={idx} hover>
                <TableCell>{formatDate(d.date)}</TableCell>
                <TableCell
                  align="right"
                  sx={{ color: mainColor, fontWeight: "bold" }}
                >
                  {d.count}
                </TableCell>
                <TableCell
                  align="right"
                  sx={{ color: "#FF6F00", fontWeight: "bold" }}
                >
                  {confidenceValue}%
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
