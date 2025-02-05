import "./styles.scss";
import { ChartType } from "../../pages/statistics/StatisticsPage";

interface CheckFiltersProps {
  filters: ChartType[];
  selectedFilters: ChartType[];
  onToggleFilter: (filter: ChartType) => void;
}

export default function CheckFilters({
  filters,
  selectedFilters,
  onToggleFilter,
}: CheckFiltersProps) {
  return (
    <div className="check-filters">
      <h2 className="check-filters-heading">Категории</h2>
      <ul className="filters-list">
        {filters.map((filter) => (
          <li key={filter.id} className="filter-item">
            <input
              type="checkbox"
              id={`filter-${filter.id}`}
              checked={selectedFilters.includes(filter)}
              onChange={() => onToggleFilter(filter)}
              className="filter-checkbox"
            />
            <label htmlFor={`filter-${filter.id}`} className="filter-label">
              {filter.name}
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
}
