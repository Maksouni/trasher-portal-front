import {
  IconButton,
  Drawer,
  Box,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  SvgIcon,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import VideocamIcon from "@mui/icons-material/Videocam";
import React from "react";
import ShowChartIcon from "@mui/icons-material/ShowChart";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import { useLocation, useNavigate } from "react-router-dom";
import { themeColors } from "../theme";
import { useAuth } from "../context/auth/useAuth";

export default function Header() {
  const [open, setOpen] = React.useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  if (location.pathname === "/login") {
    return null;
  }

  const addresses = [
    {
      title: "Статистика",
      address: "/",
    },
    {
      title: "Поток",
      address: "/stream",
    },
    {
      title: "Управление пользователями",
      address: "/users",
    },
    {
      title: "Добавить пользователя",
      address: "/users/add",
    },
    {
      title: "Редактировать пользователя",
      address: "/users/edit",
    },
  ];

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };

  const DrawerItems1 = [
    {
      title: "Статистика",
      icon: <ShowChartIcon />,
      onClick: () => {
        navigate("/");
      },
    },
    {
      title: "Поток",
      icon: <VideocamIcon />,
      onClick: () => {
        navigate("/stream");
      },
    },
  ];
  const DrawerItems2 = [
    {
      title: "Управление пользователями",
      icon: <ManageAccountsIcon sx={{ color: themeColors.primary }} />,
      color: themeColors.primary,
      onClick: () => {
        navigate("/users");
      },
    },
    {
      title: "Выйти из аккаунта",
      icon: <ExitToAppIcon sx={{ color: themeColors.secondary }} />,
      color: themeColors.secondary,
      onClick: () => {
        logout();
      },
    },
  ];

  const DrawerList = (
    <Box sx={{ width: 250 }} role="presentation" onClick={toggleDrawer(false)}>
      <List>
        {DrawerItems1.map((item, index) => (
          <ListItem key={index} disablePadding>
            <ListItemButton onClick={item.onClick}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.title} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        {DrawerItems2.map((item, index) => (
          <ListItem key={index} disablePadding>
            <ListItemButton onClick={item.onClick} sx={{ color: item.color }}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.title} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );
  return (
    <header className="w-full flex items-center justify-center">
      <div className="m-2 w-full max-w-[1000px] flex items-center bg-white shadow-md rounded-md p-2 pb-1 pt-1">
        <IconButton
          sx={{
            height: "40px",
            width: "40px",
            borderRadius: "4px",
          }}
          onClick={toggleDrawer(true)}
        >
          <MenuIcon />
        </IconButton>

        <Typography variant="h6" sx={{ flexGrow: 1, marginLeft: 2 }}>
          {addresses.find((address) => address.address === location.pathname)
            ?.title || "Ошибка"}
        </Typography>

        <SvgIcon sx={{ height: "42px", width: "42px" }}>
          <svg
            width="128"
            height="128"
            viewBox="0 0 128 128"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="64" cy="64" r="64" fill="transparent" />
            <rect x="49" y="3" width="30" height="40" rx="3" fill="black" />
            <path
              d="M61.4019 34.5C62.5566 32.5 65.4434 32.5 66.5981 34.5L76.9904 52.5C78.1451 54.5 76.7017 57 74.3923 57H53.6077C51.2983 57 49.8549 54.5 51.0096 52.5L61.4019 34.5Z"
              fill="black"
            />
            <circle
              cx="31.5"
              cy="93.5"
              r="8"
              fill="white"
              stroke="#4A594A"
              strokeWidth="7"
            />
            <circle
              cx="96.5"
              cy="93.5"
              r="8"
              fill="white"
              stroke="#4A594A"
              strokeWidth="7"
            />
            <circle
              cx="64.5"
              cy="93.5"
              r="8"
              fill="white"
              stroke="#4A594A"
              strokeWidth="7"
            />
            <rect
              x="17"
              y="79"
              width="94"
              height="29"
              rx="14.5"
              stroke="#3F51B5"
              strokeWidth="6"
            />
          </svg>
        </SvgIcon>
        <Drawer open={open} onClose={toggleDrawer(false)}>
          {DrawerList}
        </Drawer>
      </div>
    </header>
  );
}
