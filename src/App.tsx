import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import LoginPage from "./pages/login/LoginPage";
import { AuthProvider } from "./context/auth/AuthProvider";
import StatisticsPage from "./pages/statistics/StatisticsPage";
import AddUser from "./pages/user-actions/AddUser";
import UserManagement from "./pages/user-actions/UserManagement";
import EditUser from "./pages/user-actions/EditUser";
import RequireAuth from "./components/RequireAuth";
import { useAuth } from "./context/auth/useAuth";
import { ReactNode } from "react";

function RedirectIfAuthenticated({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <div>Loading...</div>; // Индикатор загрузки (опционально)
  }

  if (isAuthenticated) {
    const redirectTo = location.state?.from?.pathname || "/";
    return <Navigate to={redirectTo} replace />;
  }

  return children;
}

function App() {
  return (
    <div className="app">
      <BrowserRouter>
        <AuthProvider>
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
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
