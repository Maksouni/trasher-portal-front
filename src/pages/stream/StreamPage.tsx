// import { useRef, useEffect } from "react";
// import Hls from "hls.js";
// import Cookies from "js-cookie";
// import { apiUrl } from "../../dotenv";

import { Button } from "@mui/material";
import StreamLogs from "../../components/StreamLogs";
import { useRef, useState } from "react";

export default function StreamPage() {
  // const videoRef = useRef<HTMLVideoElement>(null);
  // const authToken = Cookies.get("jwt_token");

  // useEffect(() => {
  //   if (Hls.isSupported()) {
  //     const hls = new Hls({
  //       xhrSetup: (xhr) => {
  //         if (authToken) {
  //           xhr.setRequestHeader("Authorization", `Bearer ${authToken}`);
  //         }
  //       },
  //     });

  //     // Добавляем обработчик ошибок для диагностики
  //     hls.on(Hls.Events.ERROR, (event, data) => {
  //       console.error("HLS error:", event, data);
  //     });

  //     // Загружаем источник (ожидается m3u8 манифест)
  //     hls.loadSource(`${apiUrl}media/stream`);

  //     if (videoRef.current) {
  //       hls.attachMedia(videoRef.current);
  //       hls.on(Hls.Events.MANIFEST_PARSED, () => {
  //         console.log("Manifest parsed, starting playback");
  //         videoRef.current
  //           ?.play()
  //           .catch((err) =>
  //             console.error("Ошибка воспроизведения видео:", err)
  //           );
  //       });
  //     }

  //     return () => {
  //       hls.destroy();
  //     };
  //   } else if (
  //     videoRef.current &&
  //     videoRef.current.canPlayType("application/vnd.apple.mpegurl")
  //   ) {
  //     // Fallback для браузеров с нативной поддержкой HLS (например, Safari)
  //     videoRef.current.src = `${apiUrl}media/stream`;
  //     videoRef.current.addEventListener("loadedmetadata", () => {
  //       videoRef.current
  //         ?.play()
  //         .catch((err) => console.error("Ошибка воспроизведения видео:", err));
  //     });
  //   }
  // }, [authToken]);

  const videoRefs = [
    useRef<HTMLVideoElement>(null),
    useRef<HTMLVideoElement>(null),
    useRef<HTMLVideoElement>(null),
  ];
  const [isPaused, setIsPaused] = useState(false);

  const togglePlayPause = () => {
    videoRefs.forEach((videoRef) => {
      if (videoRef.current) {
        if (videoRef.current.paused) {
          videoRef.current.play();
        } else {
          videoRef.current.pause();
        }
      }
    });
    setIsPaused((prev) => !prev);
  };

  return (
    <div className="flex m-2 mb-4 flex-col items-center">
      {/* Кнопка паузы */}
      <div className="max-w-[1024px] w-full flex justify-center">
        <Button variant="contained" color="primary" onClick={togglePlayPause}>
          {isPaused ? "▶ Возобновить" : "⏸ Пауза"}
        </Button>
      </div>

      {/* Камеры */}
      <ul className="gap-4">
        {["left.mp4", "center.mp4", "right.mp4"].map((src, index) => (
          <li
            key={index}
            className="flex flex-col max-w-[1024px] w-full gap-2 mb-4"
          >
            <h2 className="text-2xl font-semibold ml-2">Камера №{index + 1}</h2>
            <div className="w-full bg-gray-600 rounded-2xl shadow-lg overflow-hidden">
              <div className="w-full h-fit flex items-center justify-center">
                <video
                  ref={videoRefs[index]}
                  autoPlay
                  muted
                  className="w-full h-full"
                >
                  <source src={`video/${src}`} type="video/mp4" />
                </video>
              </div>
            </div>
          </li>
        ))}
      </ul>

      {/* Журнал обнаружений */}
      <div className="max-w-[1024px] w-full">
        <h2 className="text-2xl font-semibold m-2">Журнал обнаружений</h2>
        <StreamLogs />
      </div>
    </div>
  );
}
