import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { getAuthData } from "@/utils/storage.ts";
import { isAuthenticated } from "@/utils/auth.ts";
import { UserData } from "@/types/types.ts";
import { getUserById } from "@/app/api/api-cbt.ts";

interface UserContextType {
  user: UserData | null;
  generalUser: UserData | null;
  setUser: (user: UserData | null) => void;
  refreshUser: () => Promise<void>; // Fungsi baru untuk memperbarui user
  loading: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UserData | null>(null);
  const [generalUser, setGeneralUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  // Fungsi untuk memperbarui user setelah login
  const refreshUser = useCallback(async () => {
    setLoading(true);
    const auth = await isAuthenticated();

    if (auth) {
      const storedUser = getAuthData()?.userData;
      setGeneralUser(storedUser);

      if (storedUser?.user_id) {
        try {
          const freshUser = await getUserById(storedUser.user_id);
          setUser(freshUser);
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

  // Ambil data user saat pertama kali component dipasang
  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  return (
    <UserContext.Provider value={{ user, generalUser, setUser, refreshUser, loading }}>
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
