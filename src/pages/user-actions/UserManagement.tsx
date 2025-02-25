import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DataGrid, GridColDef, GridRowSelectionModel } from "@mui/x-data-grid";
import SearchIcon from "@mui/icons-material/Search";
import EditIcon from "@mui/icons-material/Edit";
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

export default function UserManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState(mockUsers);
  const [selectionModel, setSelectionModel] = useState<GridRowSelectionModel>(
    []
  );
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleEdit = (userId: number) => {
    navigate(`edit/${userId}`);
  };

  const handleAdd = () => {
    navigate(`add`);
  };

  const handleDelete = () => {
    const newUsers = users.filter((user) => !selectionModel.includes(user.id));
    setUsers(newUsers);
    setSelectionModel([]);
    setOpen(false);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const filteredUsers = users.filter((user) =>
    user.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 90 },
    {
      field: "username",
      headerName: "Имя пользователя",
      width: 150,
      editable: false,
    },
    {
      field: "role",
      headerName: "Роль",
      width: 150,
      editable: false,
    },
    {
      field: "actions",
      headerName: "Действие",
      width: 150,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <Button
          variant="contained"
          color="success"
          startIcon={<EditIcon />}
          onClick={() => handleEdit(params.row.id)}
        >
          Изменить
        </Button>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-2 m-2 lg:mx-auto max-w-[1024px]">
      {/* search */}
      <div className="flex gap-4 bg-white rounded-2xl shadow-lg overflow-hidden p-4">
        <FormControl variant="outlined" fullWidth size="small">
          <InputLabel>Поиск</InputLabel>
          <OutlinedInput
            value={searchQuery}
            placeholder="Найти пользователя"
            onChange={(e) => setSearchQuery(e.target.value)}
            startAdornment={
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            }
            label="Поиск" // Нужно передать label сюда!
          />
        </FormControl>
        <Button variant="contained" onClick={handleAdd}>
          Добавить
        </Button>
      </div>

      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <DataGrid
          rows={filteredUsers}
          columns={columns}
          checkboxSelection
          disableRowSelectionOnClick
          rowSelectionModel={selectionModel}
          onRowSelectionModelChange={(newSelectionModel) => {
            setSelectionModel(newSelectionModel);
          }}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 5,
              },
            },
          }}
          pageSizeOptions={[5]}
          sx={{ border: "none" }}
        />
        <Button
          variant="contained"
          color="secondary"
          sx={{ marginLeft: 2, marginBottom: 2 }}
          onClick={handleClickOpen}
          disabled={selectionModel.length === 0}
        >
          Удалить выбранных
        </Button>
      </div>

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Подтверждение удаления"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Вы уверены, что хотите удалить выбранных пользователей?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Отмена
          </Button>
          <Button onClick={handleDelete} color="secondary" autoFocus>
            Удалить
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
