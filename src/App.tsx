import { BrowserRouter, Route, Routes } from "react-router-dom";
import LoginPage from "./pages/login/Login";
import { AuthProvider } from "./context/auth/AuthProvider";
import StatisticsPage from "./pages/statistics/StatisticsPage";
import AddUser from "./pages/user-actions/AddUser";
import UserManagement from "./pages/user-actions/UserManagement";
import EditUser from "./pages/user-actions/EditUser";

function App() {
  return (
    <div className="app">
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<StatisticsPage />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="/users" element={<UserManagement />} />
            <Route path="/users/edit/:userId" element={<EditUser />} />
            <Route path="/users/add" element={<AddUser />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </div>
  );
}

export default App;
