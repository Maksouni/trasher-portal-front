import { BrowserRouter, Route, Routes } from "react-router-dom";
import LoginPage from "./pages/login/LoginPage";
import { AuthProvider } from "./context/auth/AuthProvider";
import StatisticsPage from "./pages/statistics/StatisticsPage";
import AddUser from "./pages/user-actions/AddUser";
import UserManagement from "./pages/user-actions/UserManagement";
import EditUser from "./pages/user-actions/EditUser";
import RequireAuth from "./components/RequireAuth";

function App() {
  return (
    <div className="app">
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
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
