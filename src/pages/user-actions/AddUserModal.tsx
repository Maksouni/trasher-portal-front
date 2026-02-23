/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  alpha,
  useTheme,
} from "@mui/material";
import PersonAddRoundedIcon from "@mui/icons-material/PersonAddRounded";

interface Props {
  open: boolean;
  onClose: () => void;
  onAdd: (userData: any) => void;
}

export default function AddUserModal({ open, onClose, onAdd }: Props) {
  const theme = useTheme();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { [key: string]: string } = {};
    if (!username) newErrors.username = "Имя обязательно";
    if (!password) newErrors.password = "Пароль обязателен";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onAdd({ username, password, role });
    // Сброс и закрытие
    setUsername("");
    setPassword("");
    setRole("user");
    setErrors({});
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      slotProps={{
        paper: {
          sx: {
            borderRadius: "28px",
            bgcolor: alpha(theme.palette.background.paper, 0.9),
            backdropFilter: "blur(16px)",
            backgroundImage: "none",
            width: "100%",
            maxWidth: "450px",
          },
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          fontWeight: 700,
          pt: 3,
        }}
      >
        <PersonAddRoundedIcon color="primary" />
        Новый пользователь
      </DialogTitle>

      <DialogContent sx={{ mt: 1 }}>
        <Box
          component="form"
          sx={{ display: "flex", flexDirection: "column", gap: 2.5, pt: 1 }}
        >
          <TextField
            fullWidth
            label="Имя пользователя"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            error={!!errors.username}
            helperText={errors.username}
            InputProps={{ sx: { borderRadius: "14px" } }}
          />
          <TextField
            fullWidth
            label="Пароль"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={!!errors.password}
            helperText={errors.password}
            slotProps={{ input: { sx: { borderRadius: "14px" } } }}
          />
          <FormControl fullWidth>
            <InputLabel>Роль</InputLabel>
            <Select
              value={role}
              label="Роль"
              onChange={(e) => setRole(e.target.value)}
              sx={{ borderRadius: "14px" }}
            >
              <MenuItem value="user">User</MenuItem>
              <MenuItem value="admin">Admin</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 1 }}>
        <Button
          onClick={onClose}
          sx={{ color: "text.secondary", fontWeight: 600 }}
        >
          Отмена
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          sx={{ borderRadius: "12px", px: 4, fontWeight: 700 }}
        >
          Создать
        </Button>
      </DialogActions>
    </Dialog>
  );
}
