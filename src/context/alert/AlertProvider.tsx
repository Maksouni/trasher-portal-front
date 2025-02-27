import { AlertColor, Snackbar, Alert } from "@mui/material";
import { ReactNode, useState } from "react";
import AlertContext from "./AlertContext";

export const AlertProvider = ({ children }: { children: ReactNode }) => {
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [alertSeverity, setAlertSeverity] = useState<AlertColor>("error");
  const [alertDuration, setAlertDuration] = useState<number>(4000);

  const showAlert = (
    message: string,
    severity: AlertColor,
    duration: number = 4000
  ) => {
    setAlertMessage(message);
    setAlertSeverity(severity);
    setAlertDuration(duration);
  };

  const handleClose = () => {
    setAlertMessage(null);
  };

  return (
    <AlertContext.Provider value={{ showAlert }}>
      {children}
      <Snackbar
        open={!!alertMessage}
        autoHideDuration={alertDuration}
        onClose={handleClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleClose}
          severity={alertSeverity}
          sx={{ width: "100%" }}
        >
          {alertMessage}
        </Alert>
      </Snackbar>
    </AlertContext.Provider>
  );
};
