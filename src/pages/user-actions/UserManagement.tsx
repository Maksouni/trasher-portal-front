import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Button,
  Container,
  InputAdornment,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";

interface User {
  id: number;
  username: string;
  password: string;
  role: string;
}

const mockUsers: User[] = [
  { id: 1, username: "admin", password: "admin", role: "admin" },
  { id: 2, username: "user1", password: "admin", role: "user" },
  { id: 3, username: "user2", password: "admin", role: "user" },
];

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

type Order = "asc" | "desc";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getComparator<Key extends keyof any>(
  order: Order,
  orderBy: Key
): (
  a: { [key in Key]: number | string },
  b: { [key in Key]: number | string }
) => number {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

const UserManagement = () => {
  const users = mockUsers;
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleEdit = (userId: number) => {
    navigate(`edit/${userId}`);
  };

  return (
    <div
      className="w-full max-w-[1024px] m-2 flex items-center justify-center
          lg:mx-auto bg-white rounded-2xl shadow-lg"
    >
      <div>penis</div>
    </div>
  );
};

export default UserManagement;
