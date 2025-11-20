import { Typography } from "@mui/material";
import { DrawerItem } from "../../types/drawerItem.types";
import { useLocation } from "react-router-dom";

interface TopBarItemsProps {
  items: DrawerItem[];
}

export default function TopBarItems({ items }: TopBarItemsProps) {
  const location = useLocation();

  return (
    <div className="flex space-x-4 w-full ml-2">
      {items.map((item, index) => (
        <div
          key={index}
          className="flex items-center cursor-pointer transition-all duration-200 ease-in-out hover:opacity-60"
          onClick={item.onClick}
          style={
            index === items.length - 1
              ? { marginLeft: "auto", marginRight: 16, color: item.color }
              : { color: item.color }
          }
        >
          {item.icon}
          <Typography
            variant="body1"
            sx={{
              transition: "ease-in-out",
              marginLeft: 1,
              textDecoration:
                location.pathname === item.address ? "underline" : "none",
            }}
          >
            {item.title}
          </Typography>
        </div>
      ))}
    </div>
  );
}
