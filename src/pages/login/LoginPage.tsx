import React, { useState } from "react";
import { TextField, Button, Typography, Alert } from "@mui/material";
import axios from "axios";
import { useAuth } from "../../context/auth/useAuth";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loginError, setLoginError] = useState<string | null>(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null); // Очистка ошибки перед новой попыткой
    const newErrors: { [key: string]: string } = {};

    if (!username) newErrors.username = "Введите имя пользователя";
    if (!password) newErrors.password = "Введите пароль";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const url = import.meta.env.VITE_API_URL;
    try {
      const response = await axios.post(`${url}auth/login`, {
        username,
        password,
      });
      login(response.data.token);
      navigate("/");
    } catch (error) {
      console.error(error);
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          setLoginError("Неверное имя пользователя или пароль");
        } else if (error.request) {
          // Запрос был сделан, но ответ не получен (например, проблемы с сетью)
          setLoginError("Ошибка подключения к серверу. Попробуйте позже");
        } else {
          // Ошибка при настройке запроса
          setLoginError("Произошла ошибка при отправке запроса");
        }
      } else {
        // Не axios ошибка
        setLoginError("Произошла непредвиденная ошибка");
      }
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: string
  ) => {
    if (errors[field]) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [field]: "",
      }));
    }
    if (field === "username") setUsername(e.target.value);
    if (field === "password") setPassword(e.target.value);
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="flex flex-col gap-4 items-center p-6 pb-2 bg-white rounded-lg shadow-xl max-w-md max-md:m-3 w-full">
        <Typography variant="h4" component="h1" gutterBottom>
          Вход
        </Typography>

        {loginError && (
          <Alert severity="error" className="login-error">
            {loginError}
          </Alert>
        )}

        <form className="flex flex-col gap-6 w-full m-4" onSubmit={handleLogin}>
          <TextField
            label="Имя пользователя"
            variant="outlined"
            value={username}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              handleInputChange(e, "username")
            }
            error={!!errors.username}
            helperText={errors.username}
            fullWidth
            className="text-field"
          />

          <TextField
            label="Пароль"
            variant="outlined"
            type="password"
            value={password}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              handleInputChange(e, "password")
            }
            error={!!errors.password}
            helperText={errors.password}
            fullWidth
            className="text-field"
          />

          <Button
            sx={{ height: "3rem" }}
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
          >
            Войти
          </Button>
        </form>
      </div>
    </div>
  );
}
