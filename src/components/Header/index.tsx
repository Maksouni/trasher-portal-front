import { Drawer, IconButton, Typography, useMediaQuery } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/auth/useAuth";
import DrawerListItems from "./DrawerListItems";
import TopBarItems from "./TopBarItems";
import LogoIcon from "./LogoIcon";
import ShowChartIcon from "@mui/icons-material/ShowChart";
import VideocamIcon from "@mui/icons-material/Videocam";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import { themeColors } from "../../theme";
import { useState } from "react";
import type { DrawerItem } from "../../types/drawerItem.types";
import { useScrollDirection } from "../../hooks/useScrollDirection";

export default function Header() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const isLargeScreen = useMediaQuery("(min-width:1024px)");
  const scrollDirection = useScrollDirection();

  if (location.pathname === "/login") return null;

  const DrawerItems1: DrawerItem[] = [
    {
      title: "Статистика",
      icon: <ShowChartIcon />,
      color: "black",
      onClick: () => navigate("/"),
      address: "/",
    },
    {
      title: "Поток",
      icon: <VideocamIcon />,
      color: "black",
      onClick: () => navigate("/stream"),
      address: "/stream",
    },
  ];

  const DrawerItems2: DrawerItem[] = [
    {
      title: "Управление пользователями",
      icon: <ManageAccountsIcon sx={{ color: themeColors.primary }} />,
      color: themeColors.primary,
      onClick: () => navigate("/users"),
      address: "/users",
    },
    {
      title: "Выйти",
      icon: <ExitToAppIcon sx={{ color: themeColors.secondary }} />,
      color: themeColors.secondary,
      onClick: logout,
      address: "/logout",
    },
  ];

  const addresses = [...DrawerItems1, ...DrawerItems2];

  return (
    <header
      className={`w-full flex items-center justify-center transition-transform duration-300 z-50 ${
        scrollDirection === "down" ? "-translate-y-full" : "translate-y-0"
      } fixed top-0 left-0 bg-transparent`}
    >
      {" "}
      <div className="m-2 mt-3 w-full max-w-[1024px] flex items-center bg-white shadow-md rounded-md p-2 pb-1 pt-1">
        {!isLargeScreen && (
          <>
            <IconButton
              onClick={() => setOpen(true)}
              sx={{ width: 40, height: 40 }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" sx={{ flexGrow: 1, ml: 2 }}>
              {addresses.find((a) => a.address === location.pathname)?.title ||
                (location.pathname === "/statistics/table" && "Статистика") ||
                "Ошибка"}
            </Typography>
          </>
        )}

        {isLargeScreen && <TopBarItems items={addresses} />}

        <LogoIcon />
        <Drawer open={open} onClose={() => setOpen(false)}>
          <DrawerListItems
            items1={DrawerItems1}
            items2={DrawerItems2}
            onClose={() => setOpen(false)}
          />
        </Drawer>
      </div>
    </header>
  );
}
