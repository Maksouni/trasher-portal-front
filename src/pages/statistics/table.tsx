import { useEffect, useState } from "react";
import axios from "../../api/axios";
import { useAlert } from "../../context/alert/useAlert";
import FractionAnalysisTable from "../../components/statistics/FractionAnalysisTable";
import { ChartType } from "../../types/chart.types";

export default function StatisticsTablePage() {
  const [categories, setCategories] = useState<ChartType[]>([]);
  const [loading, setLoading] = useState(true);
  const { showAlert } = useAlert();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get("/categories");
        if (Array.isArray(res.data)) {
          setCategories(res.data);
        } else {
          showAlert("Некорректный формат данных", "error", 4000);
        }
      } catch (error) {
        console.error("Ошибка получения категорий:", error);
        showAlert("Ошибка загрузки категорий", "error", 4000);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) return <div className="p-4">Загрузка...</div>;

  return (
    <>
      <FractionAnalysisTable data={categories} />
    </>
  );
}
