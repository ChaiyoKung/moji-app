import { use, createContext, type PropsWithChildren } from "react";
import { useStorageState } from "../../hooks/use-storage-state";

const AuthContext = createContext<{
  signIn: (sessionValue: string) => void;
  signOut: () => void;
  session?: string | null;
  isLoading: boolean;
}>({
  signIn: () => {},
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

  const signIn = (sessionValue: string) => {
    setSession(sessionValue);
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
