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
import InboxIcon from "@mui/icons-material/Inbox";
import MailIcon from "@mui/icons-material/Mail";
import FilterListIcon from "@mui/icons-material/FilterList";
import React from "react";

export default function Header() {
  const [open, setOpen] = React.useState(false);

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };

  const DrawerList = (
    <Box sx={{ width: 250 }} role="presentation" onClick={toggleDrawer(false)}>
      <List>
        {["Inbox", "Starred", "Send email", "Drafts"].map((text, index) => (
          <ListItem key={text} disablePadding>
            <ListItemButton>
              <ListItemIcon>
                {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        {["All mail", "Trash", "Spam"].map((text, index) => (
          <ListItem key={text} disablePadding>
            <ListItemButton>
              <ListItemIcon>
                {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );
  return (
    <div className="m-2" style={{ display: "flex", alignItems: "center" }}>
      <IconButton
        sx={{
          height: "40px",
          width: "40px",
          backgroundColor: "primary.main",
          color: "#fff",
          borderRadius: "4px",
        }}
        onClick={toggleDrawer(true)}
      >
        <MenuIcon />
      </IconButton>
      <Button
        variant="contained"
        startIcon={<FilterListIcon />}
        sx={{
          flexGrow: 1,
          height: "40px",
          marginLeft: "8px",
          backgroundColor: "#3f51b5",
          color: "#fff",
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
