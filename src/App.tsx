import { Route, BrowserRouter as Router, Routes, Navigate } from "react-router-dom";
import UserManagement from "./pages/user-actions/UserManagement";
import RegisterUser from "./pages/user-actions/RegisterUser";

const App = () => (
  <Router>
    <Routes>
      <Route path="/" element={<Navigate to="/users" />} />
      <Route path="/register" element={<RegisterUser />} />
      <Route path="/users" element={<UserManagement />} />
    </Routes>
  </Router>
);

export default App;