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
  Button,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import FilterListIcon from "@mui/icons-material/FilterList";
import React from "react";
import ShowChartIcon from "@mui/icons-material/ShowChart";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import { useLocation } from "react-router-dom";
import { themeColors } from "../theme";

export default function Header() {
  const [open, setOpen] = React.useState(false);
  const location = useLocation();

  if (location.pathname === "/login") {
    return null;
  }

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };

  const DrawerItems1 = [
    {
      title: "Графики",
      icon: <ShowChartIcon />,
    },
  ];
  const DrawerItems2 = [
    {
      title: "Управление пользователями",
      icon: <ManageAccountsIcon sx={{ color: themeColors.primary }} />,
      color: themeColors.primary,
    },
    {
      title: "Выйти из аккаунта",
      icon: <ExitToAppIcon sx={{ color: themeColors.secondary }} />,
      color: themeColors.secondary,
    },
  ];

  const DrawerList = (
    <Box sx={{ width: 250 }} role="presentation" onClick={toggleDrawer(false)}>
      <List>
        {DrawerItems1.map((item, index) => (
          <ListItem key={index} disablePadding>
            <ListItemButton>
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
            <ListItemButton sx={{ color: item.color }}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.title} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );
  return (
    <div className="m-2 flex items-center">
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
      <Button
        variant="contained"
        startIcon={<FilterListIcon />}
        color="primary"
        sx={{
          flexGrow: 1,
          height: "40px",
          marginLeft: "8px",
        }}
      >
        Фильтры
      </Button>
      <Drawer open={open} onClose={toggleDrawer(false)}>
        {DrawerList}
      </Drawer>
    </div>
  );
}
