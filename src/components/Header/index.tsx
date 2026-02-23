import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  useMediaQuery,
  Drawer,
  Button,
  Stack,
  Box,
  alpha,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import SettingsIcon from "@mui/icons-material/Settings";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import ShowChartIcon from "@mui/icons-material/ShowChart";
import VideocamIcon from "@mui/icons-material/Videocam";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/auth/useAuth";
import { useState } from "react";
import DrawerListItems from "./DrawerListItems";
import LogoIcon from "./LogoIcon";

export default function Header() {
  const [open, setOpen] = useState(false);
  const { logout, user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const isLargeScreen = useMediaQuery("(min-width:1024px)");

  if (location.pathname === "/login") return null;

  const menuGroups = [
    { title: "Статистика", icon: <ShowChartIcon />, address: "/" },
    { title: "Поток", icon: <VideocamIcon />, address: "/stream" },
    { title: "Пользователи", icon: <ManageAccountsIcon />, address: "/users" },
  ];
  const currentPage =
    menuGroups.find((item) => item.address === location.pathname)?.title || "";
  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{
        transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
        width: { xs: "calc(100% - 32px)", sm: "calc(100% - 64px)" },
        mx: "auto",
        mb: 1,
        borderRadius: "16px",
        background: (theme) => alpha(theme.palette.background.paper, 0.8),
        backdropFilter: "blur(12px)",
        border: "1px solid",
        borderColor: (theme) => alpha(theme.palette.divider, 0.1),
        color: "text.primary",
        boxSizing: "border-box",
      }}
    >
      <Toolbar
        sx={{ justifyContent: "space-between", minHeight: { xs: 56, sm: 56 } }}
      >
        <Stack direction="row" alignItems="center" spacing={2}>
          {!isLargeScreen && (
            <>
              <IconButton
                onClick={() => setOpen(true)}
                sx={{ color: "primary.main" }}
              >
                <MenuIcon />
              </IconButton>
              <Typography variant="h6" sx={{ fontWeight: 500, ml: 1 }}>
                {currentPage}
              </Typography>
            </>
          )}

          {isLargeScreen && (
            <>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  cursor: "pointer",
                }}
                onClick={() => navigate("/")}
              >
                <LogoIcon />
              </Box>
              <Stack direction="row" spacing={0.5} sx={{ ml: 3 }}>
                {menuGroups.map((item) => {
                  const isActive = location.pathname === item.address;
                  return (
                    <Button
                      key={item.address}
                      onClick={() => navigate(item.address)}
                      startIcon={item.icon}
                      sx={{
                        borderRadius: "10px",
                        px: 2,
                        py: 1,
                        fontSize: "0.875rem",
                        fontWeight: 500,
                        textTransform: "none",
                        color: isActive ? "primary.main" : "text.secondary",
                        bgcolor: isActive
                          ? (theme) => alpha(theme.palette.primary.main, 0.08)
                          : "transparent",
                        transition: "all 0.2s",
                        "&:hover": {
                          bgcolor: (theme) =>
                            alpha(theme.palette.primary.main, 0.04),
                          color: "primary.main",
                        },
                        "&::after": isActive
                          ? {
                              content: '""',
                              position: "absolute",
                              bottom: 4,
                              width: "12px",
                              height: "2px",
                              borderRadius: "2px",
                              bgcolor: "primary.main",
                            }
                          : {},
                      }}
                    >
                      {item.title}
                    </Button>
                  );
                })}
              </Stack>
            </>
          )}
        </Stack>

        <Stack direction="row" alignItems="center" spacing={1}>
          {isLargeScreen && user && (
            <Box sx={{ textAlign: "right", mr: 1 }}>
              <Typography
                variant="subtitle2"
                sx={{ lineHeight: 1.2, fontWeight: 600 }}
              >
                {user.username || "Admin"}
              </Typography>
            </Box>
          )}

          <Stack
            direction="row"
            sx={{
              bgcolor: (theme) => alpha(theme.palette.divider, 0.05),
              borderRadius: "12px",
              p: 0.5,
            }}
          >
            <IconButton
              onClick={() => navigate("/profile")}
              size="small"
              sx={{
                borderRadius: "10px",
                color: "text.secondary",
                "&:hover": { color: "primary.main" },
              }}
            >
              <SettingsIcon fontSize="small" />
            </IconButton>

            <IconButton
              onClick={logout}
              size="small"
              sx={{
                borderRadius: "10px",
                color: "text.secondary",
                "&:hover": { color: "error.main" },
              }}
            >
              <ExitToAppIcon fontSize="small" />
            </IconButton>
          </Stack>
        </Stack>

        <Drawer
          open={open}
          onClose={() => setOpen(false)}
          PaperProps={{ sx: { borderRadius: "0 16px 16px 0", width: 280 } }}
        >
          <DrawerListItems
            items1={menuGroups.slice(0, 2)}
            items2={menuGroups.slice(2)}
            onClose={() => setOpen(false)}
            onLogout={logout}
          />
        </Drawer>
      </Toolbar>
    </AppBar>
  );
}
