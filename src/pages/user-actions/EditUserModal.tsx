/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
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
import EditRoundedIcon from "@mui/icons-material/EditRounded";

interface User {
  id: number;
  username: string;
  role: string;
}

interface Props {
  open: boolean;
  user: User | null;
  onClose: () => void;
  onUpdate: (userData: any) => void;
}

export default function EditUserModal({
  open,
  user,
  onClose,
  onUpdate,
}: Props) {
  const theme = useTheme();
  const [username, setUsername] = useState("");
  const [role, setRole] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (user) {
      setUsername(user.username);
      setRole(user.role);
      setPassword("");
    }
  }, [user, open]);

  const handleSave = () => {
    onUpdate({ id: user?.id, username, role, password });
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
        <EditRoundedIcon color="primary" />
        Редактирование профиля
      </DialogTitle>

      <DialogContent sx={{ mt: 1 }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5, pt: 1 }}>
          <TextField
            fullWidth
            label="Имя пользователя"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            InputProps={{ sx: { borderRadius: "14px" } }}
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
          <TextField
            fullWidth
            label="Новый пароль"
            type="password"
            placeholder="Оставьте пустым, если не меняете"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            slotProps={{ input: { sx: { borderRadius: "14px" } } }}
          />
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 1 }}>
        <Button onClick={onClose} sx={{ color: "text.secondary" }}>
          Отмена
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          sx={{ borderRadius: "12px", px: 4, fontWeight: 700 }}
        >
          Сохранить
        </Button>
      </DialogActions>
    </Dialog>
  );
}
