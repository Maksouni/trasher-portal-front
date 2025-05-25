import { apiUrl } from "../../dotenv";
import StreamPlayer from "../../components/StreamPlayer";

export default function StreamPage() {
  return (
    <div className="flex flex-col items-center m-4 gap-6">
      {["stream1", "stream2"].map((streamKey, idx) => (
        <div key={idx} className="max-w-[1024px] w-full">
          <h2 className="text-2xl font-bold mb-2 ml-2">Камера №{idx + 1}</h2>
          <StreamPlayer
            src={`${apiUrl}/media/${streamKey}/playlist.m3u8`}
            width={1024}
          />
        </div>
      ))}
    </div>
  );
}
