export interface ChartType {
  id: number;
  name: string;
  /** Опционально: для круговых диаграмм и т.п. */
  value?: number;
}

export interface DailyReport {
  date: string;
  ts?: string;
  categoryName: string;
  count: number;
  avgConfidence: number;
  weight: number;
}

export type PeriodType = "day" | "month" | "5min";
