import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { getAuthData } from "@/utils/storage.ts";
import { isAuthenticated } from "@/utils/auth.ts";
import { Profil, UserData } from "@/types/types.ts";
import { getProfil } from "@/app/api/api-cbt.ts";

interface UserContextType {
  user: UserData | null;
  generalUser: UserData | null;
  setUser: (user: UserData | null) => void;
  refreshUser: () => Promise<void>;
  fetchUserProfile: () => Promise<void>;
  loading: boolean;
  school: string | null;
  setSchool: (school: string | null) => void;
  userPicture: string | undefined;
  setUserPicture: (userPicture: string) => void;
  wsToken: string;
  setWsToken: (wsToken: string) => void;
  biodata: Profil | null;
  setBiodata: (biodata: (prev: Profil | null) => Profil) => void;
}

const GlobalContext = createContext<UserContextType | undefined>(undefined);

export const GlobalProvider = ({ children }: { children: React.ReactNode }) => {
  const [wsToken, setWsToken] = useState<string>("");
  const [user, setUser] = useState<UserData | null>(null);
  const [userPicture, setUserPicture] = useState<string>();
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
      setUser(storedUser);
      const schoolNameUser = getAuthData()?.schoolName;
      setSchool(schoolNameUser);
    } else {
      setUser(null);
      setGeneralUser(null);
    }
    setLoading(false);
    setUserPicture(user?.picture);
  }, [user?.picture]);

  const fetchUserProfile = useCallback(async () => {
    setLoading(true);
    try {
      const storedUser = getAuthData()?.userData;
      const userId =
        user?.user_id || generalUser?.user_id || storedUser?.user_id;

      if (userId) {
        const profilResponse = await getProfil();
        setUser(profilResponse.user);
        setBiodata(profilResponse.biodata);
        setUserPicture(profilResponse.user?.picture);
      }
    } catch (error) {
      console.error("Failed to fetch user profile:", error);
    } finally {
      setLoading(false);
    }
  }, [user?.user_id, generalUser?.user_id]);

  useEffect(() => {
    if (wsToken) {
      localStorage.setItem("wsToken", wsToken);
    }
  }, [wsToken]);

  useEffect(() => {
    const lastUnload = localStorage.getItem("lastUnload");
    if (lastUnload) {
      const lastTime = parseInt(lastUnload, 10);
      const now = Date.now();
      const elapsed = now - lastTime;

      if (elapsed > 180000) {
        localStorage.removeItem("wsToken");
        setWsToken("");
      } else {
        const savedToken = localStorage.getItem("wsToken");
        if (savedToken) {
          setWsToken(savedToken);
        }
      }
    }

    const handleBeforeUnload = () => {
      localStorage.setItem("lastUnload", Date.now().toString());
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
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
        fetchUserProfile,
        loading,
        biodata,
        setBiodata,
        userPicture,
        setUserPicture,
        wsToken,
        setWsToken,
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
