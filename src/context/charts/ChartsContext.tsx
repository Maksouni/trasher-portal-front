import { createContext } from "react";
import { ChartType, DailyReport, PeriodType } from "../../types/chart.types";
import { FractionData } from "../../types/fraction.types";

export type ChartsContextType = {
  chartOption: string;
  setChartOption: (v: string) => void;
  summaryData: FractionData[];
  dailyData: DailyReport[];

  charts: ChartType[];
  selectedFilters: ChartType[];
  toggleFilter: (f: ChartType) => void;

  loading: boolean;
  isDataLoading: boolean;

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
  step: number;
  setStep: (val: number) => void;

  downloadReport: () => void;
};

const ChartsContext = createContext<ChartsContextType | null>(null);

export default ChartsContext;
