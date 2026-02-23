import { Button, Typography, Box, alpha, useTheme } from "@mui/material";
import { useNavigate } from "react-router-dom";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";

export default function NotFoundPage() {
  const navigate = useNavigate();
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        maxWidth: "1400px",
        mx: { xs: 2, lg: "auto" },
        mt: 4,
        height: "60vh",
        minHeight: "400px",
        background: alpha(theme.palette.background.paper, 0.6),
        backdropFilter: "blur(12px)",
        borderRadius: "24px",
        border: "1px solid",
        borderColor: alpha(theme.palette.divider, 0.1),
        boxShadow: `0 8px 32px 0 ${alpha(theme.palette.common.black, 0.1)}`,
        p: 4,
        textAlign: "center",
      }}
    >
      <Typography
        variant="h1"
        sx={{
          fontSize: { xs: "6rem", md: "8rem" },
          fontWeight: 900,
          background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          lineHeight: 1,
          mb: 1,
        }}
      >
        404
      </Typography>

      <Typography
        variant="h5"
        sx={{
          fontWeight: 600,
          color: "text.primary",
          mb: 1,
        }}
      >
        Страница не найдена{" "}
      </Typography>

      <Typography
        variant="body1"
        sx={{
          color: "text.secondary",
          mb: 4,
          maxWidth: "400px",
        }}
      >
        Похоже, эта страница была переработана или никогда не существовала.
        Попробуйте вернуться на главную.
      </Typography>

      <Button
        variant="contained"
        size="large"
        startIcon={<HomeRoundedIcon />}
        onClick={() => navigate("/")}
        sx={{
          borderRadius: "12px",
          px: 4,
          py: 1.5,
          textTransform: "none",
          fontSize: "1rem",
          fontWeight: 600,
          boxShadow: `0 4px 14px 0 ${alpha(theme.palette.primary.main, 0.39)}`,
          transition: "transform 0.2s",
          "&:hover": {
            transform: "translateY(-2px)",
            boxShadow: `0 6px 20px 0 ${alpha(theme.palette.primary.main, 0.45)}`,
          },
        }}
      >
        Вернуться на главную
      </Button>
    </Box>
  );
}
