import React from "react";
import {isAuthenticated} from "@/utils/auth";

const LOGOUT_URL: string = import.meta.env.VITE_LOGOUT_URL;

interface PrivateRouteProps {
    children: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({children}) => {
    if (!isAuthenticated()) {
        window.location.href = LOGOUT_URL;
        return null;
    }
    return <>{children}</>;
};
export default PrivateRoute;
