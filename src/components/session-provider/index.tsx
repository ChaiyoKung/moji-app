import { use, createContext, type PropsWithChildren } from "react";
import { useStorageState } from "../../hooks/use-storage-state";

const AuthContext = createContext<{
  signIn: (userId: string, accessToken: string) => void;
  signOut: () => void;
  userId?: string | null;
  session?: string | null;
  isLoading: boolean;
}>({
  signIn: () => {},
  signOut: () => null,
  userId: null,
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
  const [[isSeesionLoading, session], setSession] = useStorageState("session");
  const [[isUserIdLoading, userId], setUserId] = useStorageState("userId");

  const signIn = (userId: string, accessToken: string) => {
    setUserId(userId);
    setSession(accessToken);
  };

  const signOut = () => {
    setUserId(null);
    setSession(null);
  };

  return (
    <AuthContext
      value={{
        signIn,
        signOut,
        userId,
        session,
        isLoading: isSeesionLoading || isUserIdLoading,
      }}
    >
      {children}
    </AuthContext>
  );
}
