// import { useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { useAuth } from "../context/auth/useAuth";
// import { Backdrop, CircularProgress } from "@mui/material";

interface RequireAuthProps {
  children: JSX.Element;
}

export default function RequireAuth({ children }: RequireAuthProps) {
  // const navigate = useNavigate();
  // const { isAuthenticated, isLoading } = useAuth();
  const isAuthenticated = true;

  // useEffect(() => {
  //   if (!isLoading && !isAuthenticated) {
  //     navigate("/login");
  //   }
  // }, [isAuthenticated, isLoading, navigate]);

  // if (isLoading) {
  //   return (
  //     <div>
  //       <Backdrop
  //         sx={(theme) => ({ color: "#fff", zIndex: theme.zIndex.drawer + 1 })}
  //         open={true}
  //       >
  //         <CircularProgress color="inherit" />
  //       </Backdrop>
  //     </div>
  //   );
  // }

  return isAuthenticated ? children : null;
}
