import { useContext } from "react";
import ChartsContext from "./ChartsContext";

export const useCharts = () => {
  const ctx = useContext(ChartsContext);
  if (!ctx) {
    throw new Error("useCharts must be used within ChartsProvider");
  }
  return ctx;
};
