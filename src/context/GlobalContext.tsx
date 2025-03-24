import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useState,
} from "react";
import {getAuthData} from "@/utils/storage.ts";
import {isAuthenticated} from "@/utils/auth.ts";
import {Profil, UserData} from "@/types/types.ts";
import {getProfil} from "@/app/api/api-cbt.ts";

interface UserContextType {
    user: UserData | null;
    generalUser: UserData | null;
    setUser: (user: UserData | null) => void;
    refreshUser: () => Promise<void>;
    loading: boolean;
    school: string | null;
    setSchool: (school: string | null) => void;
    biodata: Profil | null;
    setBiodata: (biodata: Profil) => void;
}

const GlobalContext = createContext<UserContextType | undefined>(undefined);
export const GlobalProvider = ({children}: { children: React.ReactNode }) => {
    const [user, setUser] = useState<UserData | null>(null);
    const [school, setSchool] = useState<string | null>(null);
    const [generalUser, setGeneralUser] = useState<UserData | null>(null);
    const [biodata, setBiodata] = useState<Profil | null>(null);
    const [loading, setLoading] = useState(true);
    const refreshUser = useCallback(async () => {
        setLoading(true);
        const auth = await isAuthenticated();
        if (auth) {
            const storedUser = getAuthData()?.userData;
            setGeneralUser(storedUser);
            const schoolNameUser = getAuthData()?.schoolName;
            setSchool(schoolNameUser);
            if (storedUser?.user_id) {
                try {
                    const profilResponse = await getProfil(storedUser.user_id, storedUser.user_type);
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
        (async () => {
            await refreshUser();
        })();
    }, [refreshUser]);
    return (
        <GlobalContext.Provider
            value={{
                user,
                generalUser,
                school,
                setSchool,
                setUser,
                refreshUser,
                loading,
                biodata,
                setBiodata
            }}
        >
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
