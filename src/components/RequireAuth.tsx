import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/auth/useAuth";

interface RequireAuthProps {
  children: JSX.Element;
}

function RequireAuth({ children }: RequireAuthProps) {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  // useEffect(() => {
  //   if (!isAuthenticated) {
  //     navigate("/login");
  //   }
  // }, [isAuthenticated, navigate]);

  // return isAuthenticated ? children : null;
  return children;
}

export default RequireAuth;
