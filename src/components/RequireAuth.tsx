import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/auth/useAuth";

interface RequireAuthProps {
  children: JSX.Element;
}

export default function RequireAuth({ children }: RequireAuthProps) {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, isLoading, navigate]);

  if (isLoading) {
    return <div>Loading...</div>; // Индикатор загрузки (опционально)
  }

  return isAuthenticated ? children : null;
}
