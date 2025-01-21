import { BrowserRouter, Route, Routes } from "react-router-dom";
import LoginPage from "./pages/login/Login";
import { AuthProvider } from "./context/auth/AuthProvider";
import StatisticsPage from "./pages/statistics/StatisticsPage";

function App() {
  return (
    <div className="app">
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<StatisticsPage />} />
            <Route path="login" element={<LoginPage />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </div>
  );
}

export default App;
