import { createContext } from "react";
import { ChartType, PeriodType } from "../../types/chart.types";

export type ChartsContextType = {
  chartOption: string;
  setChartOption: (v: string) => void;

  charts: ChartType[];
  selectedFilters: ChartType[];
  toggleFilter: (f: ChartType) => void;

  loading: boolean;

  startDate: string;
  endDate: string;
  setStartDate: (v: string) => void;
  setEndDate: (v: string) => void;

  startDateTime: string;
  endDateTime: string;
  setStartDateTime: (v: string) => void;
  setEndDateTime: (v: string) => void;

  period: PeriodType;
  changePeriod: (v: PeriodType) => void;

  downloadReport: () => void;
};

const ChartsContext = createContext<ChartsContextType | null>(null);

export default ChartsContext;
