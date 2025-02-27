import { createContext } from "react";
import { AlertColor } from "@mui/material";

interface AlertContextType {
  showAlert: (message: string, severity: AlertColor, duration?: number) => void;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export default AlertContext;
