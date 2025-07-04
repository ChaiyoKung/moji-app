import { use, createContext, type PropsWithChildren } from "react";
import { useStorageState } from "../../hooks/use-storage-state";

const AuthContext = createContext<{
  signIn: (userId: string, accessToken: string, refreshToken: string) => void;
  signOut: () => void;
  userId?: string | null;
  accessToken?: string | null;
  refreshToken?: string | null;
  isLoading: boolean;
}>({
  signIn: () => {},
  signOut: () => null,
  userId: null,
  accessToken: null,
  refreshToken: null,
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
  const [[isAccessTokenLoading, accessToken], setAccessToken] =
    useStorageState("accessToken");
  const [[isRefreshTokenLoading, refreshToken], setRefreshToken] =
    useStorageState("refreshToken");
  const [[isUserIdLoading, userId], setUserId] = useStorageState("userId");

  const signIn = (
    userId: string,
    accessToken: string,
    refreshToken: string
  ) => {
    setUserId(userId);
    setAccessToken(accessToken);
    setRefreshToken(refreshToken);
  };

  const signOut = () => {
    setUserId(null);
    setAccessToken(null);
    setRefreshToken(null);
  };

  return (
    <AuthContext
      value={{
        signIn,
        signOut,
        userId,
        accessToken,
        refreshToken,
        isLoading:
          isAccessTokenLoading || isRefreshTokenLoading || isUserIdLoading,
      }}
    >
      {children}
    </AuthContext>
  );
}
