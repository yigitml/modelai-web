import {
  useSession,
  signIn as nextAuthSignIn,
  signOut as nextAuthSignOut,
} from "next-auth/react";

const useAuth = () => {
  const { data: session, status } = useSession();
  const isAuthenticated = status === "authenticated";
  const isLoading = status === "loading";

  const signIn = () => nextAuthSignIn("google");
  const signOut = () => nextAuthSignOut({ callbackUrl: "/" });

  return {
    session,
    isAuthenticated,
    isLoading,
    signIn,
    signOut,
  };
};

export default useAuth;
