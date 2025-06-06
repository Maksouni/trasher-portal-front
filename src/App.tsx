import { ReactNode } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import RequireAuth from "./components/RequireAuth";
import { AuthProvider } from "./context/auth/AuthProvider";
import { useAuth } from "./context/auth/useAuth";
import LoginPage from "./pages/login/LoginPage";
import StatisticsPage from "./pages/statistics/StatisticsPage";
import AddUser from "./pages/user-actions/AddUser";
import EditUser from "./pages/user-actions/EditUser";
import UserManagement from "./pages/user-actions/UserManagement";
import Header from "./components/Header";
import { Backdrop, CircularProgress, ThemeProvider } from "@mui/material";
import { getTheme } from "./theme";
import StreamPage from "./pages/stream/StreamPage";
import NotFoundPage from "./pages/NotFoundPage";
import { AlertProvider } from "./context/alert/AlertProvider";

function RedirectIfAuthenticated({ children }: { children: ReactNode }) {
  const { isLoading } = useAuth();
  // const location = useLocation();

  if (isLoading) {
    return (
      <div>
        <Backdrop
          sx={(theme) => ({ color: "#fff", zIndex: theme.zIndex.drawer + 1 })}
          open={true}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      </div>
    );
  }

  // if (isAuthenticated) {
  //   const redirectTo = location.state?.from?.pathname || "/";
  //   return <Navigate to={redirectTo} replace />;
  // }

  return children;
}

function App() {
  return (
    //TODO: потом сделать тёмную тему
    <ThemeProvider theme={getTheme("light")}>
      <div className="app">
        <BrowserRouter>
          <AuthProvider>
            <AlertProvider>
              <Header />

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
                      <StatisticsPage />
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
                <Route
                  path="/users/edit/:userId"
                  element={
                    <RequireAuth>
                      <EditUser />
                    </RequireAuth>
                  }
                />
                <Route
                  path="/users/add"
                  element={
                    <RequireAuth>
                      <AddUser />
                    </RequireAuth>
                  }
                />
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </AlertProvider>
          </AuthProvider>
        </BrowserRouter>
      </div>
    </ThemeProvider>
  );
}

export default App;
