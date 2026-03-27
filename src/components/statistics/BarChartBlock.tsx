/* eslint-disable @typescript-eslint/no-explicit-any */
import formatWeight from "../../utils/formatWeight";
import { getFractionColor } from "../../utils/fractionColors";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  CartesianGrid,
} from "recharts";
import { Box, Typography, alpha, useTheme } from "@mui/material";

interface BarChartBlockProps {
  data: {
    name: string;
    value: number;
    weight: number;
    share: number;
  }[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  const theme = useTheme();
  if (active && payload && payload.length) {
    const { share, value, weight } = payload[0].payload;
    const color = getFractionColor(label, theme.palette.primary.main);

    return (
      <Box
        sx={{
          bgcolor: alpha(theme.palette.background.paper, 0.9),
          backdropFilter: "blur(8px)",
          border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          p: 2,
          borderRadius: "12px",
          boxShadow: theme.shadows[4],
          zIndex: 100,
        }}
      >
        <Typography
          variant="subtitle2"
          sx={{ fontWeight: 700, color: color, mb: 1 }}
        >
          {label}
        </Typography>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
          <Typography variant="caption" display="block">
            Доля: <b>{Math.round(share)}%</b>
          </Typography>
          <Typography variant="caption" display="block">
            Количество: <b>{value} шт.</b>
          </Typography>
          <Typography variant="caption" display="block">
            Объём: <b>{formatWeight(weight)}</b>
          </Typography>
        </Box>
      </Box>
    );
  }
  return null;
};

export default function BarChartBlock({ data }: BarChartBlockProps) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Typography
        variant="h6"
        sx={{
          fontWeight: 700,
          mb: 3,
          color: "text.primary",
          textAlign: "center",
        }}
      >
        Доля фракций, %
      </Typography>

      <Box sx={{ width: "100%", flexGrow: 1, minHeight: 350 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 10, right: 10, left: -20, bottom: 20 }}
            barSize={80}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke={alpha(theme.palette.divider, 0.1)}
            />
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{
                fill: theme.palette.text.secondary,
                fontSize: 12,
                fontWeight: 500,
              }}
              dy={10}
            />
            <YAxis
              domain={[0, 100]}
              axisLine={false}
              tickLine={false}
              tickFormatter={(val) => `${val}%`}
              tick={{ fill: theme.palette.text.secondary, fontSize: 12 }}
            />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ fill: alpha(theme.palette.divider, 0.05), radius: 10 }}
              wrapperStyle={{ outline: "none" }}
            />
            <Bar dataKey="share" radius={[8, 8, 0, 0]} animationDuration={1000}>
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={
                    getFractionColor(entry.name, theme.palette.primary.main)
                  }
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Box>
    </Box>
  );
}
