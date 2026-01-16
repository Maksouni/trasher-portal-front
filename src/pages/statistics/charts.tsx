import { useState } from "react";
import SidebarFilters from "../../components/filters/SidebarFilters";
import ChartView from "../../components/statistics/ChartView";
import FractionAnalysisTable from "../../components/statistics/FractionAnalysisTable";
import StatsSummary from "../../components/statistics/StatsSummary";
import ChartsProvider from "../../context/charts/ChartsProvider";
import { DailyReport } from "../../types/chart.types";
import { FractionData } from "../../types/fraction.types";

export default function ChartsPage() {
  const [summaryData, setSummaryData] = useState<FractionData[]>([]);
  const [dailyData, setDailyData] = useState<DailyReport[]>([]);

  return (
    <ChartsProvider
      onDataChange={(summary, daily) => {
        setSummaryData(summary);
        setDailyData(daily);
      }}
    >
      <div className="flex max-w-[1400px] min-h-screen flex-col m-2 lg:mx-auto gap-3 lg:flex-row lg:gap-6">
        <SidebarFilters />

        <div className="flex flex-col gap-3 order-last lg:order-first lg:grow-1">
          <StatsSummary data={summaryData} />
          <ChartView summaryData={summaryData} dailyData={dailyData} />
          <FractionAnalysisTable data={dailyData} />
        </div>
      </div>
    </ChartsProvider>
  );
}
