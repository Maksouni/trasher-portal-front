import { useState } from "react";
import { Download } from "@mui/icons-material";
import { Button, Snackbar, Alert } from "@mui/material";
import axios from "../../api/axios";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { apiUrl } from "../../dotenv";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface ChartBlockProps {
  title: string;
}

export default function ChartBlock({ title }: ChartBlockProps) {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom" as const,
      },
    },
  };

  const labels = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
  ];

  const data = {
    labels,
    datasets: [
      {
        label: "Обнаружения",
        data: [65, 59, 80, 81, 56, 55, 40],
        borderColor: "rgb(75, 192, 192)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
      },
      {
        label: "Точность",
        data: [45, 39, 60, 91, 76, 85, 60],
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.2)",
      },
    ],
  };

  const downloadFile = async () => {
    const date1 = new Date(2025, 0, 1).toISOString().split("T")[0];
    const date2 = new Date(2025, 0, 15).toISOString().split("T")[0];

    try {
      const response = await axios.get(
        `${apiUrl}reports?category=Plastic&from=${date1}&to=${date2}`,
        {
          responseType: "blob",
        }
      );

      const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // MIME-тип Excel
      });

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "report.xlsx"; // Имя файла
      document.body.appendChild(link);
      link.click();

      // Очистка
      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);
    } catch (error) {
      console.error("Ошибка скачивания:", error);
      setErrorMessage("Не удалось скачать отчёт. Попробуйте позже.");
    }
  };

  return (
    <div className="chart-block">
      <h2>{title}</h2>
      <Line options={options} data={data} />
      <Button
        type="button"
        variant="contained"
        color="success"
        startIcon={<Download />}
        sx={{ marginLeft: "auto", marginTop: "1rem" }}
        onClick={downloadFile}
      >
        Скачать отчёт
      </Button>

      {/* Уведомление об ошибке */}
      <Snackbar
        open={!!errorMessage}
        autoHideDuration={4000}
        onClose={() => setErrorMessage(null)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={() => setErrorMessage(null)}
          severity="error"
          sx={{ width: "100%" }}
        >
          {errorMessage}
        </Alert>
      </Snackbar>
    </div>
  );
}
