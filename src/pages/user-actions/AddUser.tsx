import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Button,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";

const AddUser = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { [key: string]: string } = {};

    if (!username) newErrors.username = "Имя пользователя обязательно!";
    if (!password) newErrors.password = "Пароль обязателен!";
    if (!role) newErrors.role = "Выберите роль!";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setMessage("Пользователь добавлен");
    setErrors({});
  };

  return (
    <div className="max-w-[1024px] m-2 lg:mx-auto bg-white shadow-lg rounded-2xl p-8">
      <Typography variant="h4" component="h1" className="mb-4">
        Добавить пользователя
      </Typography>
      <nav className="mb-4">
        <Link to="/users" className="text-blue-500 hover:underline">
          Вернуться к списку пользователей
        </Link>
      </nav>
      <form onSubmit={handleRegister} className="flex flex-col gap-4">
        <FormControl fullWidth>
          <TextField
            label="Имя пользователя"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            error={!!errors.username}
            helperText={errors.username}
          />
        </FormControl>
        <FormControl fullWidth>
          <TextField
            label="Пароль"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={!!errors.password}
            helperText={errors.password}
          />
        </FormControl>
        <FormControl fullWidth error={!!errors.role}>
          <InputLabel>Роль</InputLabel>
          <Select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            label="Роль"
          >
            <MenuItem value="">
              <em>Выберите роль</em>
            </MenuItem>
            <MenuItem value="user">User</MenuItem>
            <MenuItem value="admin">Admin</MenuItem>
          </Select>
          {errors.role && <Typography color="error">{errors.role}</Typography>}
        </FormControl>
        <Button variant="contained" color="primary" type="submit">
          Добавить
        </Button>
      </form>
      {message && (
        <Typography variant="body1" color="success" className="mt-4">
          {message}
        </Typography>
      )}
    </div>
  );
};

export default AddUser;
