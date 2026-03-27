import { ReactNode } from "react";
import { Paper, Stack, Box, Typography, alpha, useTheme } from "@mui/material";

interface StatsBlockProps {
  icon: ReactNode;
  title: string;
  value: string;
}

export default function StatsBlock({ icon, title, value }: StatsBlockProps) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  const activeColor = isDark ? "#bb86fc" : "#1976d2";

  return (
    <Paper
      elevation={0}
      sx={{
        flex: 1,
        p: 2,
        borderRadius: "16px",
        background: isDark ? alpha("#1d1d1d", 0.6) : alpha("#ffffff", 0.6),
        backdropFilter: "blur(12px)",
        border: "1px solid",
        borderColor: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)",
        display: "flex",
        alignItems: "center",
        width: "100%",
        boxSizing: "border-box",
        transition: "transform 0.2s ease-in-out",
        "&:hover": {
          borderColor: alpha(activeColor, 0.3),
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: 52,
          height: 52,
          borderRadius: "12px",
          bgcolor: alpha(activeColor, 0.1),
          color: activeColor,
          mr: 2,
        }}
      >
        {icon}
      </Box>
      <Stack spacing={0.5}>
        <Typography
          variant="caption"
          sx={{
            color: isDark ? "#b0b0b0" : "#555555",
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "0.5px",
            fontSize: "0.7rem",
          }}
        >
          {title}
        </Typography>
        <Typography
          variant="h5"
          sx={{
            fontWeight: 700,
            color: isDark ? "#ffffff" : "#000000",
            letterSpacing: "-0.5px",
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {value}
        </Typography>
      </Stack>
    </Paper>
  );
}
