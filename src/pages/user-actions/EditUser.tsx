import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
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

interface User {
  id: number;
  username: string;
  role: string;
}

const mockUsers: User[] = [
  { id: 1, username: "admin", role: "admin" },
  { id: 2, username: "user1", role: "user" },
  { id: 3, username: "user2", role: "user" },
];

const EditUser = () => {
  const { userId } = useParams<{ userId: string }>();
  // const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const userToEdit = mockUsers.find((u) => u.id === parseInt(userId || ""));
    if (userToEdit) {
      setUser(userToEdit);
      setUsername(userToEdit.username);
      setRole(userToEdit.role);
    }
  }, [userId]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { [key: string]: string } = {};

    if (!username) newErrors.username = "Имя пользователя обязательно!";
    if (!role) newErrors.role = "Роль обязательна!";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Обновление пользователя (в реальном приложении здесь будет запрос к серверу)
    setMessage("Пользователь обновлен");
    setErrors({});
  };

  return (
    <Container
      maxWidth="sm"
      className="mt-8 bg-white shadow-lg rounded-2xl p-8"
    >
      <Typography variant="h4" component="h1">
        Редактировать пользователя
      </Typography>
      <nav className="mb-6 mt-2">
        <Link to="/users" className="text-blue-500 hover:underline">
          Вернуться к списку пользователей
        </Link>
      </nav>
      {user ? (
        <form onSubmit={handleUpdate} className="flex flex-col gap-4">
          <FormControl fullWidth>
            <TextField
              label="Имя пользователя"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              error={!!errors.username}
              helperText={errors.username}
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
            {errors.role && (
              <Typography color="error">{errors.role}</Typography>
            )}
          </FormControl>
          <FormControl fullWidth>
            <TextField
              label="Изменить пароль"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={!!errors.password}
              helperText={errors.password}
            />
          </FormControl>
          <Button variant="contained" color="primary" type="submit">
            Обновить
          </Button>
        </form>
      ) : (
        <Typography variant="body1" color="error">
          Пользователь не найден
        </Typography>
      )}
      {message && (
        <Typography variant="body1" color="success" sx={{ marginTop: 2 }}>
          {message}
        </Typography>
      )}
    </Container>
  );
};

export default EditUser;
