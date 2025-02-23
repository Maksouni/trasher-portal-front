import { ReactNode } from "react";

interface StatsBlockProps {
  icon: ReactNode;
  title: string;
  value: string;
}

export default function StatsBlock({ icon, title, value }: StatsBlockProps) {
  return (
    <div className="flex flex-col items-start bg-white shadow-md rounded-md p-2 gap-1">
      {icon}
      <h2>{value}</h2>
      <p>{title}</p>
    </div>
  );
}
