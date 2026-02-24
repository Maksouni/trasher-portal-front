/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import {
  TextField,
  Button,
  Typography,
  Alert,
  Box,
  Paper,
  Container,
  Stack,
} from "@mui/material";
import { useAuth } from "../../context/auth/useAuth";
import { useNavigate } from "react-router-dom";
import backgroundImage from "../../assets/conveyor.jpg";
import { api } from "../../api/api";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loginError, setLoginError] = useState<string | null>(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    const newErrors: { [key: string]: string } = {};

    if (!username) newErrors.username = "Введите логин";
    if (!password) newErrors.password = "Введите пароль";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const data = await api.post("/api/v1/auth/login", {
        username,
        password,
      });

      login(data.token);
      navigate("/");
    } catch (error: any) {
      console.error("Login error:", error);
      setLoginError("Неверный логин или пароль");
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    field: string,
  ) => {
    if (errors[field]) {
      setErrors((prevErrors) => ({ ...prevErrors, [field]: "" }));
    }
    if (field === "username") setUsername(e.target.value);
    if (field === "password") setPassword(e.target.value);
  };

  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        display: "flex",
        overflow: "hidden",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "blur(8px) brightness(0.5)",
          transform: "scale(1.05)",
          zIndex: -1,
        },
      }}
    >
      <Container
        maxWidth="lg"
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: "100%",
          zIndex: 1,
        }}
      >
        <Box
          sx={{
            color: "white",
            maxWidth: "500px",
            display: { xs: "none", md: "block" },
            textShadow: "0px 2px 10px rgba(0,0,0,0.5)",
          }}
        >
          <Typography
            variant="h2"
            component="h1"
            sx={{ fontWeight: 800, mb: 2, lineHeight: 1.1 }}
          >
            SortTech
          </Typography>
          <Typography
            variant="h5"
            sx={{ opacity: 0.9, fontWeight: 300, mb: 4 }}
          >
            Система контроля сортировки отходов <br /> в реальном времени
          </Typography>
        </Box>

        <Paper
          elevation={0}
          sx={{
            p: { xs: 4, sm: 6 },
            width: "100%",
            maxWidth: "420px",
            borderRadius: 8,
            backgroundColor: "rgba(255, 255, 255, 0.85)",
            backdropFilter: "blur(12px)",
            border: "1px solid rgba(255, 255, 255, 0.3)",
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
          }}
        >
          <Box sx={{ mb: 4, textAlign: "center" }}>
            <Typography
              variant="h4"
              sx={{ fontWeight: 700, color: "text.primary", mb: 1 }}
            >
              Авторизация
            </Typography>
          </Box>

          {loginError && (
            <Alert
              severity="error"
              variant="filled"
              sx={{ width: "100%", mb: 3, borderRadius: 2 }}
            >
              {loginError}
            </Alert>
          )}

          <Box component="form" onSubmit={handleLogin} noValidate>
            <Stack spacing={3}>
              <TextField
                label="Логин"
                fullWidth
                value={username}
                onChange={(e) => handleInputChange(e, "username")}
                error={!!errors.username}
                helperText={errors.username}
                variant="filled"
                slotProps={{
                  input: {
                    sx: { borderRadius: 1.5 },
                  },
                }}
              />

              <TextField
                label="Пароль"
                type="password"
                fullWidth
                value={password}
                onChange={(e) => handleInputChange(e, "password")}
                error={!!errors.password}
                helperText={errors.password}
                variant="filled"
                slotProps={{
                  input: {
                    sx: { borderRadius: 1.5 },
                  },
                }}
              />

              <Button
                type="submit"
                variant="contained"
                size="large"
                fullWidth
                sx={{
                  py: 1.8,
                  fontSize: "1rem",
                  fontWeight: "bold",
                  borderRadius: 2,
                  textTransform: "none",
                  boxShadow: "0 10px 20px -5px rgba(25, 118, 210, 0.4)",
                  "&:hover": {
                    boxShadow: "0 15px 25px -5px rgba(25, 118, 210, 0.5)",
                  },
                }}
              >
                Войти
              </Button>
            </Stack>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}
