import { use, createContext, type PropsWithChildren } from "react";
import { useStorageState } from "../../hooks/use-storage-state";

const AuthContext = createContext<{
  signIn: (username: string, password: string) => Promise<void>;
  signOut: () => void;
  session?: string | null;
  isLoading: boolean;
}>({
  signIn: async () => {},
  signOut: () => null,
  session: null,
  isLoading: false,
});

// This hook can be used to access the user info.
export function useSession() {
  const value = use(AuthContext);
  if (!value) {
    throw new Error("useSession must be wrapped in a <SessionProvider />");
  }

  return value;
}

export function SessionProvider({ children }: PropsWithChildren) {
  const [[isLoading, session], setSession] = useStorageState("session");

  const signIn = async (username: string, password: string) => {
    try {
      const response = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });
      if (!response.ok) {
        throw await response.json();
      }
      const data = await response.json();
      setSession(data.accessToken);
    } catch (error) {
      console.error("An error occurred during sign-in:", error);
      // Handle the error appropriately, e.g., show a notification to the user
    }
  };

  const signOut = () => {
    setSession(null);
  };

  return (
    <AuthContext
      value={{
        signIn,
        signOut,
        session,
        isLoading,
      }}
    >
      {children}
    </AuthContext>
  );
}
