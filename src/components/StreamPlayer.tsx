import { useEffect, useRef } from "react";
import Hls from "hls.js";

interface StreamPlayerProps {
  src: string;
  width?: number;
  syncGroup?: React.MutableRefObject<(HTMLVideoElement | null)[]>;
  index?: number;
}

export default function StreamPlayer({
  src,
  width = 720,
  syncGroup,
  index = 0,
}: StreamPlayerProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.playbackRate = 0.5;

    if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(src);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        video.playbackRate = 0.5;
        video.play().catch(console.error);
      });

      return () => hls.destroy();
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = src;
      video.addEventListener("loadedmetadata", () => {
        video.playbackRate = 0.5;
        video.play();
      });
    }
  }, [src]);

  useEffect(() => {
    if (!syncGroup || !videoRef.current) return;
    if (!syncGroup.current) syncGroup.current = [];
    syncGroup.current[index] = videoRef.current;
  }, [syncGroup, index]);

  useEffect(() => {
    if (!syncGroup || !syncGroup.current) return;
    const master = syncGroup.current[0];
    if (!master) return;

    const sync = () => {
      const slave = videoRef.current;
      if (!slave) return;

      if (index === 0) {
        slave.playbackRate = 0.5;
      } else {
        const diff = master.currentTime - slave.currentTime;
        if (Math.abs(diff) > 0.05) {
          slave.playbackRate = 0.5 + diff * 0.1;
        } else {
          slave.playbackRate = 0.5;
        }
      }
      requestAnimationFrame(sync);
    };

    const rafId = requestAnimationFrame(sync);
    return () => cancelAnimationFrame(rafId);
  }, [syncGroup, index]);

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
