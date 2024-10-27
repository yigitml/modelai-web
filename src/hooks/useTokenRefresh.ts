import { useEffect } from "react";
import { useAppContext } from "@/contexts/AppContext";

export const useTokenRefresh = () => {
  const { jwtToken, setJwtToken } = useAppContext();

  useEffect(() => {
    if (!jwtToken) return;

    const refreshToken = async () => {
      try {
        const response = await fetch("/api/auth/refresh", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        });
        if (response.ok) {
          const { token } = await response.json();
          setJwtToken(token);
        }
      } catch (error) {
        console.error("Failed to refresh token:", error);
      }
    };

    const tokenExpiry = getTokenExpiry(jwtToken);
    const timeUntilRefresh = tokenExpiry - Date.now() - 60000; // Refresh 1 minute before expiry
    const refreshTimer = setTimeout(refreshToken, timeUntilRefresh);

    return () => clearTimeout(refreshTimer);
  }, [jwtToken, setJwtToken]);
};

function getTokenExpiry(token: string): number {
  const payload = JSON.parse(atob(token.split(".")[1]));
  return payload.exp * 1000; // Convert to milliseconds
}
