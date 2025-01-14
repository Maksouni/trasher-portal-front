import { ReactNode, useState, useEffect } from "react";
import { AuthContext } from "./AuthContext";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

interface AuthProviderProps {
  children: ReactNode;
}

interface DecodedToken {
  email: string;
  iat: number;
  exp: number;
  userId: number;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userId, setUserId] = useState(-1);

  useEffect(() => {
    const token = Cookies.get("jwt_token");
    if (token) {
      setIsAuthenticated(true);
      const decodedToken = jwtDecode<DecodedToken>(token);
      setUserId(decodedToken.userId);
    } else {
      setIsAuthenticated(false);
      setUserId(-1);
    }
  }, []);

  const login = (token: string) => {
    Cookies.set("jwt_token", token, {
      expires: 1, // токен будет жить 7 дней
      secure: false, // true - только через HTTPS
      sameSite: "Strict", // куки отправляются только на тот же домен
    });
    const decodedToken = jwtDecode<DecodedToken>(token);
    setUserId(decodedToken.userId);
    setIsAuthenticated(true);
  };

  const logout = () => {
    Cookies.remove("jwt_token");
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, userId }}>
      {children}
    </AuthContext.Provider>
  );
};
