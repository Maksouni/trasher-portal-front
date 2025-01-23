import React, { useState } from "react";
import { TextField, Button, Typography, Alert } from "@mui/material";
import "./styles.scss";
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
      setLoginError("Неверное имя пользователя или пароль");
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
    <div className="login-page">
      <div className="container">
        <Typography variant="h4" component="h1" gutterBottom>
          Вход
        </Typography>

        {loginError && (
          <Alert severity="error" className="login-error">
            {loginError}
          </Alert>
        )}

        <form onSubmit={handleLogin}>
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

          <Button type="submit" variant="contained" color="primary" fullWidth>
            Войти
          </Button>
        </form>
      </div>
    </div>
  );
}
