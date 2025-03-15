// import React from "react";
// import {isAuthenticated} from "@/utils/auth";
//
// const LOGOUT_URL: string = import.meta.env.VITE_LOGOUT_URL;
//
// interface PrivateRouteProps {
//     children: React.ReactNode;
// }
//
// const PrivateRoute: React.FC<PrivateRouteProps> = ({children}) => {
//     if (!isAuthenticated()) {
//         window.location.href = LOGOUT_URL;
//         return null;
//     }
//     return <>{children}</>;
// };
// export default PrivateRoute;

import React, { useEffect, useState } from "react";
import { isAuthenticated } from "@/utils/auth";
import {Loader2} from "lucide-react";

const LOGOUT_URL: string = import.meta.env.VITE_LOGOUT_URL;

interface PrivateRouteProps {
    children: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
    const [authChecked, setAuthChecked] = useState(false);
    const [isAuth, setIsAuth] = useState<boolean | null>(null);

    useEffect(() => {
        (async () => {
            const valid = await isAuthenticated();
            setIsAuth(valid);
            setAuthChecked(true);
        })()
    }, []);

    if (!authChecked) {
        return (
          <div className="flex items-center justify-center h-screen w-full py-6">
              < Loader2 className={`animate-spin text-primary`} size={24} />
          </div>
        )
    }

    if (!isAuth) {
        window.location.href = LOGOUT_URL;
        return null;
    }

    return <>{children}</>;
};

export default PrivateRoute;
