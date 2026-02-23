import { useState } from "react";
import { DataGrid, GridColDef, GridRowSelectionModel } from "@mui/x-data-grid";
import SearchIcon from "@mui/icons-material/Search";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import {
  Button,
  FormControl,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Box,
  Typography,
  alpha,
  useTheme,
  IconButton,
  Tooltip,
} from "@mui/material";
import AddUserModal from "./AddUserModal";
import EditUserModal from "./EditUserModal";

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

export default function UserManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState(mockUsers);
  const [selectionModel, setSelectionModel] = useState<GridRowSelectionModel>(
    [],
  );
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [open, setOpen] = useState(false);
  const theme = useTheme();

  const glassStyle = {
    bgcolor: alpha(theme.palette.background.paper, 0.6),
    backdropFilter: "blur(12px)",
    borderRadius: "24px",
    border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
    boxShadow: "0 8px 32px 0 rgba(0,0,0,0.05)",
    overflow: "hidden",
  };

  const handleEditClick = (user: User) => {
    setSelectedUser(user);
    setEditModalOpen(true);
  };

  const handleDelete = () => {
    setUsers(users.filter((user) => !selectionModel.includes(user.id)));
    setSelectionModel([]);
    setOpen(false);
  };

  const filteredUsers = users.filter((user) =>
    user.username.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 80 },
    {
      field: "username",
      headerName: "Имя пользователя",
      flex: 1,
      renderCell: (params) => (
        <Typography variant="body2" sx={{ fontWeight: 600 }}>
          {params.value}
        </Typography>
      ),
    },
    {
      field: "role",
      headerName: "Роль",
      width: 150,
      renderCell: (params) => (
        <Box
          sx={{
            px: 1.5,
            py: 0.5,
            borderRadius: "8px",
            bgcolor:
              params.value === "admin"
                ? alpha(theme.palette.primary.main, 0.1)
                : alpha(theme.palette.success.main, 0.1),
            color:
              params.value === "admin"
                ? theme.palette.primary.main
                : theme.palette.success.main,
            fontWeight: 700,
            fontSize: "0.75rem",
            textTransform: "uppercase",
          }}
        >
          {params.value}
        </Box>
      ),
    },
    {
      field: "actions",
      headerName: "Действие",
      width: 120,
      sortable: false,
      renderCell: (params) => (
        <Tooltip title="Изменить">
          <IconButton
            color="primary"
            onClick={() => handleEditClick(params.row.id)}
            sx={{ bgcolor: alpha(theme.palette.primary.main, 0.05) }}
          >
            <EditRoundedIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      ),
    },
  ];

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 3,
        m: 2,
        mx: "auto",
        width: "100%",
      }}
    >
      <Box
        sx={{
          ...glassStyle,
          p: 2,
          display: "flex",
          gap: 2,
          alignItems: "center",
        }}
      >
        <FormControl variant="outlined" fullWidth size="small">
          <InputLabel>Поиск</InputLabel>
          <OutlinedInput
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            startAdornment={
              <InputAdornment position="start">
                <SearchIcon sx={{ color: "text.secondary" }} />
              </InputAdornment>
            }
            label="Поиск"
            sx={{ borderRadius: "12px" }}
          />
        </FormControl>

        <Button
          variant="contained"
          startIcon={<AddRoundedIcon />}
          onClick={() => setAddModalOpen(true)}
          sx={{
            borderRadius: "12px",
            px: 3,
            height: "40px",
            whiteSpace: "nowrap",
          }}
        >
          Добавить
        </Button>
      </Box>

      <Box sx={glassStyle}>
        <Box
          sx={{
            p: 2,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Пользователи
          </Typography>
          {selectionModel.length > 0 && (
            <Button
              variant="contained"
              color="error"
              size="small"
              startIcon={<DeleteRoundedIcon />}
              onClick={() => setOpen(true)}
              sx={{ borderRadius: "10px" }}
            >
              Удалить ({selectionModel.length})
            </Button>
          )}
        </Box>

        <DataGrid
          rows={filteredUsers}
          columns={columns}
          checkboxSelection
          disableRowSelectionOnClick
          rowSelectionModel={selectionModel}
          onRowSelectionModelChange={(newModel) => setSelectionModel(newModel)}
          initialState={{
            pagination: { paginationModel: { pageSize: 10 } },
          }}
          pageSizeOptions={[5, 10, 25]}
          disableColumnResize
          sx={{
            border: "none",
            "& .MuiDataGrid-columnHeaders": {
              bgcolor: alpha(theme.palette.divider, 0.02),
              borderBottom: `1px solid ${theme.palette.divider}`,
            },
            "& .MuiDataGrid-cell": {
              display: "flex",
              alignItems: "center",
              borderBottom: `1px solid ${alpha(theme.palette.divider, 0.05)}`,
            },
            "& .MuiDataGrid-footerContainer": {
              borderTop: `1px solid ${theme.palette.divider}`,
            },
            "& .MuiDataGrid-cell:focus": {
              outline: "none",
            },
          }}
        />
      </Box>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        slotProps={{ paper: { sx: { borderRadius: "20px", p: 1 } } }}
      >
        <DialogTitle sx={{ fontWeight: 700 }}>
          Удаление пользователей
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Выбрано пользователей: <b>{selectionModel.length}</b>. Это действие
            нельзя будет отменить. Продолжить?
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={() => setOpen(false)}
            sx={{ color: "text.secondary" }}
          >
            Отмена
          </Button>
          <Button
            onClick={handleDelete}
            variant="contained"
            color="error"
            sx={{ borderRadius: "10px" }}
          >
            Удалить навсегда
          </Button>
        </DialogActions>
      </Dialog>
      <AddUserModal
        open={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onAdd={(data) => console.log("Add logic", data)}
      />
      <EditUserModal
        open={editModalOpen}
        user={selectedUser}
        onClose={() => setEditModalOpen(false)}
        onUpdate={(data) => console.log("Update logic", data)}
      />
    </Box>
  );
}
