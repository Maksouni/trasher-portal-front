import { useEffect, useRef } from "react";
import Hls from "hls.js";

interface StreamPlayerProps {
  src: string;
  width?: number;
}

export default function StreamPlayer({ src, width = 720 }: StreamPlayerProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (Hls.isSupported()) {
      const hls = new Hls({
        // можно экспериментировать с этими опциями, если нужно:
        // enableWebVTT: false,
        // lowLatencyMode: true,
      });

      hls.loadSource(src);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        video.play().catch((err) => console.error("Auto-play failed:", err));
      });

      hls.on(Hls.Events.ERROR, (_event, data) => {
        console.error("HLS error:", data);

        if (data.fatal) {
          switch (data.type) {
            case Hls.ErrorTypes.MEDIA_ERROR:
              if (data.details === Hls.ErrorDetails.BUFFER_ADD_CODEC_ERROR) {
                console.warn("Buffer add codec error, trying to recover...");
                // Пробуем восстановиться:
                hls.destroy();
                // Можно попробовать пересоздать плеер или просто остановить
              } else {
                console.warn(
                  "Fatal media error, trying to recover media error"
                );
                hls.recoverMediaError();
              }
              break;
            case Hls.ErrorTypes.NETWORK_ERROR:
              console.warn("Network error, trying to recover...");
              hls.startLoad();
              break;
            default:
              console.error("Unrecoverable error, destroying hls instance");
              hls.destroy();
              break;
          }
        }
      });

      return () => {
        hls.destroy();
      };
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = src;
      video.addEventListener("loadedmetadata", () => video.play());
    }
  }, [src]);

  return (
    <video
      ref={videoRef}
      controls={false}
      muted
      style={{ width }}
      className="rounded-2xl shadow-lg max-h-[600px]"
    />
  );
}
