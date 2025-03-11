// import {useCallback, useState} from "react";
// import {useNavigate} from "react-router-dom";
//
// export default function useAuth() {
//     const [userAuth, setUserAuth] = useState<string | null>(
//         localStorage.getItem("userAuth")
//     );
//     const navigate = useNavigate();
//     const onLoginSuccess = useCallback((auth: string) => {
//         localStorage.setItem("userAuth", JSON.stringify(auth));
//         setUserAuth(auth);
//     }, []);
//     const onLogoutSuccess = useCallback(() => {
//         localStorage.removeItem("userAuth");
//         setUserAuth("");
//         navigate("/login");
//     }, [navigate]);
//     return {userAuth, onLoginSuccess, onLogoutSuccess};
// }
