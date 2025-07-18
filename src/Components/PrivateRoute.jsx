import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const isAuth = sessionStorage.getItem("auth") === "true";
  return isAuth ? children : <Navigate to="/" />;
};

export default PrivateRoute;
