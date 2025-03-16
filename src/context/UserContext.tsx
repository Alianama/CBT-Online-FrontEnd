import { createContext, useContext, useState, useEffect } from "react";
import { getAuthData } from "@/utils/storage.ts";
import { isAuthenticated } from "@/utils/auth.ts";
import { UserData } from "@/types/types.ts";

interface UserContextType {
  user: UserData | null;
  setUser: (user: UserData | null) => void;
  loading: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const auth = await isAuthenticated();
      if (auth) {
        setUser(getAuthData()?.userData);
      }
      setLoading(false);
    })();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, loading }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser harus digunakan dalam UserProvider");
  }
  return context;
};
