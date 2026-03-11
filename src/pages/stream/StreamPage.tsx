import { useEffect, useState } from "react";
import Grid from "@mui/material/Grid2";
import {
  Box,
  Typography,
  Container,
  alpha,
  useTheme,
  Slider,
} from "@mui/material";
import VideocamRoundedIcon from "@mui/icons-material/VideocamRounded";
import SlowMotionVideoIcon from "@mui/icons-material/SlowMotionVideo";
import { apiUrl } from "../../dotenv";
import StreamPlayer from "../../components/StreamPlayer";
import { api } from "../../api/api";

export default function StreamPage() {
  const [streams, setStreams] = useState<string[]>([]);
  const [playbackRate, setPlaybackRate] = useState<number>(1);
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

  const handleSpeedChange = (_event: Event, newValue: number | number[]) => {
    setPlaybackRate(newValue as number);
  };

  return (
    <Container maxWidth="xl" sx={{ py: 1 }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 2,
          mb: 4,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <VideocamRoundedIcon
            sx={{ fontSize: 32, color: theme.palette.primary.main }}
          />
          <Typography variant="h5" sx={{ fontWeight: 800 }}>
            Мониторинг камер
          </Typography>
        </Box>

        <Box
          sx={{ display: "flex", alignItems: "center", gap: 2, minWidth: 250 }}
        >
          <SlowMotionVideoIcon color="action" />
          <Typography
            variant="body2"
            sx={{ whiteSpace: "nowrap", fontWeight: 600 }}
          >
            Скорость: {playbackRate}x
          </Typography>
          <Slider
            value={playbackRate}
            onChange={handleSpeedChange}
            min={0.1}
            max={2.0}
            step={0.1}
            aria-label="Playback speed"
            valueLabelDisplay="auto"
          />
        </Box>
      </Box>

      <Box sx={{ flexGrow: 1, overflowY: "auto", pr: 0 }}>
        <Grid container spacing={2}>
          {streams.map((streamKey, idx) => (
            <Grid size={{ xs: 12 }} key={streamKey}>
              <Box
                sx={{
                  p: 1.5,
                  bgcolor: alpha(theme.palette.background.paper, 0.6),
                  backdropFilter: "blur(12px)",
                  borderRadius: "24px",
                  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                  maxWidth: "1200px",
                  margin: "0 auto",
                }}
              >
                <Typography
                  variant="subtitle2"
                  sx={{ fontWeight: 700, mb: 1, ml: 1 }}
                >
                  Камера №{idx + 1}
                </Typography>

                <StreamPlayer
                  src={`${apiUrl}/api/v1/media/${streamKey}/playlist.m3u8`}
                  playbackRate={playbackRate}
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
      </Box>
    </Container>
  );
}
