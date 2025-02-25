import { Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center max-w-[1024px] m-2 lg:mx-auto h-[512px] bg-white rounded-2xl shadow-2xl p-4">
      <Typography variant="h1" component="h1">
        404
      </Typography>
      <Typography variant="h6" component="h6">
        Страница не найдена
      </Typography>
      <Button variant="text" color="primary" onClick={() => navigate("/")}>
        Вернуться на главную
      </Button>
    </div>
  );
}
