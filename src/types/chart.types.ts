export interface ChartType {
  id: number;
  name: string;
  value: number;
}

export interface DailyReport {
  date: string;
  categoryName: string;
  count: number;
  avgConfidence: number;
}
