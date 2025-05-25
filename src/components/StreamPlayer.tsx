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
      const hls = new Hls();
      hls.loadSource(src);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        video.play().catch((err) => console.error("Auto-play failed:", err));
      });
      hls.on(Hls.Events.ERROR, (_event, data) => {
        console.error("HLS error:", data);
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
      controls
      muted
      style={{ width }}
      className="rounded-2xl shadow-lg"
    />
  );
}
