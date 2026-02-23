import { ReactNode } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import RequireAuth from "./components/RequireAuth";
import { AuthProvider } from "./context/auth/AuthProvider";
import { useAuth } from "./context/auth/useAuth";
import LoginPage from "./pages/login/LoginPage";
import ChartsPage from "./pages/statistics/charts";
import UserManagement from "./pages/user-actions/UserManagement";
import Header from "./components/Header";
import {
  Backdrop,
  Box,
  CircularProgress,
  CssBaseline,
  ThemeProvider,
} from "@mui/material";
import { getTheme } from "./theme";
import StreamPage from "./pages/stream/StreamPage";
import NotFoundPage from "./pages/NotFoundPage";
import { AlertProvider } from "./context/alert/AlertProvider";

function RedirectIfAuthenticated({ children }: { children: ReactNode }) {
  const { isLoading } = useAuth();
  // const location = useLocation();

  if (isLoading) {
    return (
      <Backdrop
        sx={(theme) => ({ color: "#fff", zIndex: theme.zIndex.drawer + 1 })}
        open={true}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    );
  }

  // if (isAuthenticated) {
  //   const redirectTo = location.state?.from?.pathname || "/";
  //   return <Navigate to={redirectTo} replace />;
  // }

  return children;
}

function App() {
  const theme = getTheme("light");

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      <BrowserRouter>
        <AuthProvider>
          <AlertProvider>
            <Box sx={{ p: 1 }} />
            <Header />

            <Box
              component="main"
              sx={{
                width: { xs: "calc(100% - 32px)", sm: "calc(100% - 64px)" },
                mx: "auto",
                mt: 2,
                minHeight: "80vh",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Routes>
                <Route
                  path="/login"
                  element={
                    <RedirectIfAuthenticated>
                      <LoginPage />
                    </RedirectIfAuthenticated>
                  }
                />
                <Route
                  path="/"
                  element={
                    <RequireAuth>
                      <ChartsPage />
                    </RequireAuth>
                  }
                />
                <Route
                  path="/stream"
                  element={
                    <RequireAuth>
                      <StreamPage />
                    </RequireAuth>
                  }
                />
                <Route
                  path="/users"
                  element={
                    <RequireAuth>
                      <UserManagement />
                    </RequireAuth>
                  }
                />
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </Box>
          </AlertProvider>
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
