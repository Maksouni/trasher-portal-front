import './styles.scss';

interface DateFilterProps {
  label: string;
  startDate: string | null;
  endDate: string | null;
  onStartDateChange: (date: string) => void;
  onEndDateChange: (date: string) => void;
}

const formatDate = (dateString: string | null): string => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
};

export default function DateFilter({
  label,
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
}: DateFilterProps) {
  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="date-filter">
      <label>{label}</label>
      <div className="input-group">
        <div>
          <label htmlFor="start-date">Дата начала</label>
          <input
            type="date"
            id="start-date"
            value={startDate || ""}
            onChange={(e) => onStartDateChange(e.target.value)}
            max={today}
          />
        </div>
        <div>
          <label htmlFor="end-date">Дата конца</label>
          <input
            type="date"
            id="end-date"
            value={endDate || ""}
            onChange={(e) => onEndDateChange(e.target.value)}
            min={startDate || ""}
            max={today}
          />
        </div>
      </div>
      <div className="date-display">
        <p>Дата начала: {formatDate(startDate)}</p>
        <p>Дата конца: {formatDate(endDate)}</p>
      </div>
    </div>
  );
}
