/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Box,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import { useLocation, useNavigate } from "react-router-dom";

export default function DrawerListItems({
  items1,
  items2,
  onClose,
  onLogout,
}: any) {
  const navigate = useNavigate();
  const location = useLocation();

  const renderList = (items: any[]) =>
    items.map((item: any) => {
      const isActive = location.pathname === item.address;
      return (
        <ListItem key={item.address} disablePadding>
          <ListItemButton
            onClick={() => {
              navigate(item.address);
              onClose();
            }}
            selected={isActive}
          >
            <ListItemIcon sx={{ color: isActive ? "primary.main" : "inherit" }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText
              primary={item.title}
              slotProps={{
                primary: {
                  sx: {
                    fontWeight: isActive ? "bold" : "normal",
                  },
                },
              }}
            />
          </ListItemButton>
        </ListItem>
      );
    });

  return (
    <Box sx={{ width: 280 }} role="presentation">
      <Box sx={{ p: 2, bgcolor: "primary.main", color: "white" }}>
        <Typography variant="h6">Меню</Typography>
      </Box>
      <List>{renderList(items1)}</List>
      <Divider />
      <List>{renderList(items2)}</List>
      <Divider />
      <List>
        <ListItem disablePadding>
          <ListItemButton onClick={onLogout} sx={{ color: "error.main" }}>
            <ListItemIcon sx={{ color: "error.main" }}>
              <ExitToAppIcon />
            </ListItemIcon>
            <ListItemText primary="Выйти" />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );
}
