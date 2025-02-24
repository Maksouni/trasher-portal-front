import { ReactNode } from "react";

interface StatsBlockProps {
  icon: ReactNode;
  title: string;
  value: string;
}

export default function StatsBlock({ icon, title, value }: StatsBlockProps) {
  return (
    <div
      className="flex items-center p-4 shadow-lg rounded-2xl
     bg-white max-w-md w-full"
    >
      <div className="mr-4 text-blue-500">{icon}</div>
      <div className="flex flex-col">
        <span className="text-xl font-bold text-gray-800">{value}</span>
        <span className="text-md text-gray-500">{title}</span>
      </div>
    </div>
  );
}
