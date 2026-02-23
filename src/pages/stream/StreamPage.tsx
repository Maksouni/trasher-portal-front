import { useEffect, useState } from "react";
import Grid from "@mui/material/Grid2";
import { Box, Typography, Container, alpha, useTheme } from "@mui/material";
import { apiUrl } from "../../dotenv";
import StreamPlayer from "../../components/StreamPlayer";
import { api } from "../../api/api";
import VideocamRoundedIcon from "@mui/icons-material/VideocamRounded";

export default function StreamPage() {
  const [streams, setStreams] = useState<string[]>([]);
  const theme = useTheme();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await api.get("/api/v1/media");
        const count = Number(data) || 0;
        const streamStrings = Array.from(
          { length: count },
          (_, i) => `stream${i + 1}`,
        );
        setStreams(streamStrings);
      } catch (error) {
        console.error("Ошибка загрузки стримов:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <Container maxWidth="xl" sx={{ py: 1 }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 4 }}>
        <VideocamRoundedIcon
          sx={{ fontSize: 32, color: theme.palette.primary.main }}
        />
        <Typography variant="h4" sx={{ fontWeight: 800 }}>
          Мониторинг камер
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {streams.map((streamKey, idx) => (
          <Grid size={{ xs: 12, md: 6 }} key={streamKey}>
            <Box
              sx={{
                p: 2,
                bgcolor: alpha(theme.palette.background.paper, 0.6),
                backdropFilter: "blur(12px)",
                borderRadius: "32px",
                border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: `0 12px 24px ${alpha(theme.palette.common.black, 0.1)}`,
                },
              }}
            >
              <Typography
                variant="subtitle1"
                sx={{ fontWeight: 700, mb: 2, ml: 1 }}
              >
                Камера №{idx + 1}
              </Typography>

              <StreamPlayer
                src={`${apiUrl}/media/${streamKey}/playlist.m3u8`}
              />
            </Box>
          </Grid>
        ))}
      </Grid>

      {streams.length === 0 && (
        <Box sx={{ textAlign: "center", mt: 10, opacity: 0.5 }}>
          <Typography variant="h6">Камеры не обнаружены</Typography>
        </Box>
      )}
    </Container>
  );
}
