interface DateFilterProps {
  startDate: string | null;
  endDate: string | null;
  onStartDateChange: (date: string) => void;
  onEndDateChange: (date: string) => void;
}

export default function DateFilter({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
}: DateFilterProps) {
  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="flex gap-2 mt-1">
      <input
        className="border border-gray-400 rounded-md p-1.5"
        type="date"
        id="start-date"
        value={startDate || ""}
        onChange={(e) => onStartDateChange(e.target.value)}
        max={today}
      />

      <input
        className="border border-gray-400 rounded-md p-1.5"
        type="date"
        id="end-date"
        value={endDate || ""}
        onChange={(e) => onEndDateChange(e.target.value)}
        min={startDate || ""}
        max={today}
      />
    </div>
  );
}
