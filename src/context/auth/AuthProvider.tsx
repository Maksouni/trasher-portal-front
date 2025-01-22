import { ReactNode, useState, useEffect } from "react";
import { AuthContext } from "./AuthContext";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { User } from "../../types";

interface AuthProviderProps {
  children: ReactNode;
}

interface DecodedToken {
  iat: number;
  exp: number;
  sub: string;
  scope: string;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User>({
    username: "",
    role: "",
  });

  useEffect(() => {
    const token = Cookies.get("jwt_token");
    if (token) {
      try {
        const decodedToken = jwtDecode<DecodedToken>(token);
        setUser({
          username: decodedToken.sub,
          role: decodedToken.scope,
        });
        setIsAuthenticated(true);
      } catch {
        setIsAuthenticated(false);
        setUser({
          username: "",
          role: "",
        });
      }
    } else {
      setIsAuthenticated(false);
      setUser({
        username: "",
        role: "",
      });
    }
  }, []);

  const login = (token: string) => {
    Cookies.set("jwt_token", token, {
      expires: 1, // жизнь токена
      secure: false, // true - только через HTTPS
      sameSite: "Strict", // куки отправляются только на тот же домен
    });
    const decodedToken = jwtDecode<DecodedToken>(token);
    setUser({
      username: decodedToken.sub,
      role: decodedToken.scope,
    });
    setIsAuthenticated(true);
  };

  const logout = () => {
    Cookies.remove("jwt_token");
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, user }}>
      {children}
    </AuthContext.Provider>
  );
};
