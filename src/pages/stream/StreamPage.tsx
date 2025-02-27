// import { useRef, useEffect } from "react";
// import Hls from "hls.js";
// import Cookies from "js-cookie";
// import { apiUrl } from "../../dotenv";

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

  return (
    <div className="m-2 lg:mx-auto max-w-[1024px] bg-gray-600 rounded-2xl shadow-lg overflow-hidden">
      <div className="w-full h-fit flex items-center justify-center">
        <video controls autoPlay muted className="w-full h-full">
          <source src="video/trash.mp4" type="video/mp4" />
        </video>
      </div>
    </div>
  );
}
