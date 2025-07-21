import {
  Box,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { DrawerItem } from "../../types/drawerItem.types";

interface DrawerListItemsProps {
  items1: DrawerItem[];
  items2: DrawerItem[];
  onClose: () => void;
}

export default function DrawerListItems({
  items1,
  items2,
  onClose,
}: DrawerListItemsProps) {
  return (
    <Box sx={{ width: 250 }} role="presentation" onClick={onClose}>
      <List>
        {items1.map((item, index) => (
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
        {items2.map((item, index) => (
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
}
