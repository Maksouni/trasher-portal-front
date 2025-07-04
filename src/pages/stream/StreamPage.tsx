import { apiUrl } from "../../dotenv";
import StreamPlayer from "../../components/StreamPlayer";
import { useEffect, useState } from "react";
import axios from "axios";

export default function StreamPage() {
  const [streams, setStreams] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await axios.get(`${apiUrl}/media`);
      const streamStrings = [];
      for (let i = 1; i <= res.data; i++) {
        streamStrings.push(`stream${i}`);
      }

      setStreams(streamStrings);
    };
    fetchData();
  }, []);
  return (
    <div className="flex flex-col items-center m-4 gap-6">
      {streams.map((streamKey, idx) => (
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
