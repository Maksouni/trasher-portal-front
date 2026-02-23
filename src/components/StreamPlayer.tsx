import { useEffect, useRef, useState } from "react";
import Hls from "hls.js";
import { Box, alpha, useTheme, CircularProgress } from "@mui/material";

interface StreamPlayerProps {
  src: string;
  width?: string | number;
}

export default function StreamPlayer({
  src,
  width = "100%",
}: StreamPlayerProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const theme = useTheme();

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let hls: Hls;

    if (Hls.isSupported()) {
      hls = new Hls({
        lowLatencyMode: true,
        backBufferLength: 0,
      });

      hls.loadSource(src);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        setIsLoading(false);
        video.playbackRate = 0.16;
        video.play().catch((err) => console.error("Auto-play failed:", err));
      });

      hls.on(Hls.Events.ERROR, (_event, data) => {
        if (data.fatal) {
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              hls.startLoad();
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              hls.recoverMediaError();
              break;
            default:
              hls.destroy();
              break;
          }
        }
      });
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = src;
      video.addEventListener("loadedmetadata", () => {
        setIsLoading(false);
        video.playbackRate = 0.16;
        video.play();
      });
    }

    return () => {
      if (hls) hls.destroy();
    };
  }, [src]);

  return (
    <Box
      sx={{
        position: "relative",
        width: width,
        borderRadius: "24px",
        overflow: "hidden",
        bgcolor: "#000",
        lineHeight: 0,
        boxShadow: `0 8px 32px 0 ${alpha(theme.palette.common.black, 0.2)}`,
        border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
      }}
    >
      {isLoading && (
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1,
            bgcolor: alpha(theme.palette.common.black, 0.5),
          }}
        >
          <CircularProgress color="primary" />
        </Box>
      )}

      <video
        ref={videoRef}
        controls={false}
        muted
        playsInline
        style={{
          width: "100%",
          height: "auto",
          aspectRatio: "16/9",
          objectFit: "cover",
        }}
      />
    </Box>
  );
}
