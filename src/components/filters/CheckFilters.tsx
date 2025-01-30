interface CheckFiltersProps {
  filters: string[];
  selectedFilters: string[];
  onToggleFilter: (filter: string) => void;
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
        {filters.map((filter, index) => (
          <li key={index} className="filter-item">
            <input
              type="checkbox"
              id={`filter-${index}`}
              checked={selectedFilters.includes(filter)}
              onChange={() => onToggleFilter(filter)}
              className="filter-checkbox"
            />
            <label htmlFor={`filter-${index}`} className="filter-label">
              {filter}
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
}
