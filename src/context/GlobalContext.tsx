import {createContext, useCallback, useContext, useEffect, useState} from "react";
import {getAuthData} from "@/utils/storage.ts";
import {isAuthenticated} from "@/utils/auth.ts";
import {UserData} from "@/types/types.ts";
import {getProfil,} from "@/app/api/api-cbt.ts";

interface UserContextType {
    user: UserData | null;
    generalUser: UserData | null;
    setUser: (user: UserData | null) => void;
    refreshUser: () => Promise<void>;
    loading: boolean;
}

const GlobalContext = createContext<UserContextType | undefined>(undefined);
export const GlobalProvider = ({children}: { children: React.ReactNode }) => {
    const [user, setUser] = useState<UserData | null>(null);
    const [generalUser, setGeneralUser] = useState<UserData | null>(null);
    const [loading, setLoading] = useState(true);
    const refreshUser = useCallback(async () => {
        setLoading(true);
        const auth = await isAuthenticated();
        if (auth) {
            const storedUser = getAuthData()?.userData;
            setGeneralUser(storedUser);
            if (storedUser?.user_id) {
                try {
                    const profilResponse = await getProfil(storedUser.user_id);
                    setUser(profilResponse.user);
                } catch (error) {
                    console.error("Failed to fetch user data:", error);
                    setUser(storedUser);
                }
            } else {
                setUser(storedUser);
            }
        } else {
            setUser(null);
            setGeneralUser(null);
        }
        setLoading(false);
    }, []);
    useEffect(() => {
        refreshUser();
    }, [refreshUser]);
    console.log(user)
    return (
        <GlobalContext.Provider value={{user, generalUser, setUser, refreshUser, loading}}>
            {children}
        </GlobalContext.Provider>
    );
};
export const useGlobal = () => {
    const context = useContext(GlobalContext);
    if (!context) {
        throw new Error("useGlobal harus digunakan dalam UserProvider");
    }
    return context;
};
