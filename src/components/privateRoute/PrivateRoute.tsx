import React from "react";
import {isAuthenticated} from "@/utils/auth";

const LOGIN_URL: string = import.meta.env.VITE_LOGIN_URL;

interface PrivateRouteProps {
    children: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({children}) => {
    if (!isAuthenticated()) {
        window.location.href = LOGIN_URL;
        return null;
    }
    return <>{children}</>;
};
export default PrivateRoute;
